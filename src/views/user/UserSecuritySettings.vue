<template>
  <b-container class="h-100">
    <b-row class="d-flex justify-content-center py-3">
      <b-col xl class="pb-3">
        <b-card bg-variant="light" header-tag="header" class="mb-2 shadow">
          <template v-slot:header>
            <h4 class="mb-0">Смена пароля</h4>
          </template>
          <b-form v-if="formChangePassword.show" @submit="userChangePassword">
            <b-input-group
              id="input-group-1"
              label-for="oldPassword"
              class="mb-2">
              <b-input-group-prepend is-text>
                <b-icon icon="lock-fill" variant="primary"></b-icon>
              </b-input-group-prepend>
              <b-form-input
                id="oldPassword"
                v-model="formChangePassword.oldPassword"
                type="password"
                required
                placeholder="Введите текущий пароль"
                aria-describedby="password-help-block">
              </b-form-input>
            </b-input-group>
            <b-input-group
              id="input-group-2"
              label-for="newPassword"
              class="mb-2">
              <b-input-group-prepend is-text>
                <b-icon icon="lock-fill" variant="danger"></b-icon>
              </b-input-group-prepend>
              <b-form-input
                id="newPassword"
                v-model="formChangePassword.newPassword"
                type="password"
                required
                placeholder="Новый пароль"></b-form-input>
            </b-input-group>
            <b-input-group
              id="input-group-3"
              label-for="newPasswordRetry"
              class="mb-2">
              <b-input-group-prepend is-text>
                <b-icon icon="lock-fill" variant="danger"></b-icon>
              </b-input-group-prepend>
              <b-form-input
                id="newPasswordRetry"
                v-model="formChangePassword.newPasswordRetry"
                type="password"
                required
                placeholder="Повторить новый пароль">
              </b-form-input>
            </b-input-group>
            <b-form-invalid-feedback :state="formChangePasswordvalidation">Пароли не совпадают</b-form-invalid-feedback>
            <b-form-invalid-feedback
              :state="formChangePassword.serverErrorShow">{{ formChangePassword.serverError }}</b-form-invalid-feedback>
            <b-form-row class="justify-content-md-center">
              <b-button type="submit" variant="outline-danger">Сменить пароль</b-button>
            </b-form-row>
          </b-form>
        </b-card>
      </b-col>
      <b-col xl class="pb-3">
        <b-card
          bg-variant="light"
          header-tag="header"
          sub-title="Управление двухфакторной аутентификацией"
          class="mb-2 shadow">
          <template v-slot:header>
            <h4 class="mb-0">2FA</h4>
          </template>
          <b-card-text>
            2FA помогает защитить ваш аккаунт от взлома если злоумышленику
            известен пароль
          </b-card-text>
          <b-row class="justify-content-md-center">
            <b-button
              id="2fa-button"
              variant="outline-success"
              v-if="!user.ext.privateUserZone.enabled2FA"
              @click="
                twoFactorGenerate();
                modal2FAEnable.show = !modal2FAEnable.show;">
              Включить 2FA</b-button>
            <b-button
              id="2fa-button"
              variant="danger"
              v-if="user.ext.privateUserZone.enabled2FA"
              @click="modal2FADisable.show = !modal2FADisable.show">
              Выключить 2FA</b-button>
          </b-row>
        </b-card>
      </b-col>
    </b-row>
    <b-modal
      centered
      hide-header
      v-model="modal2FAEnable.show"
      id="modal-2fa-enable"
      @ok="twoFactorEnable">
      <h6>1. Отсканируйте код приложением <b>Google Authenticator</b></h6>
      <div class="d-block text-center">
        <vue-qrcode :value="modal2FAEnableurl" />
      </div>
      <b-form-text class="mb-2">
        Код для ручного ввода:
        <b>{{ modal2FAEnablesecretKey }}</b>
      </b-form-text>
      <h6>2. После успешного добавления введите 6 значный код</h6>
      <b-input-group class="mb-2">
        <b-input-group-prepend is-text>
          <b-icon icon="shield-lock-fill" variant="primary"></b-icon>
        </b-input-group-prepend>
        <b-form-input
          v-model="modal2FAEnable.code"
          type="number"
          placeholder="123456"
          autofocus
          v-on:keydown.enter.prevent='twoFactorEnable'></b-form-input>
      </b-input-group>
      <b-form-invalid-feedback :state="modal2FAEnable.validation">Неверный код</b-form-invalid-feedback>
    </b-modal>
    <b-modal
      centered
      hide-header
      v-model="modal2FADisable.show"
      id="modal-2fa-disable"
      @ok="twoFactorDisable">
      <h6>Для отключения 2FA нужно ввести код из приложения:</h6>
      <b-form-input
        v-model="modal2FADisable.code"
        type="number"
        maxlength="6"
        placeholder="123456"></b-form-input>
      <b-form-invalid-feedback :state="modal2FADisable.validation">Неверный код</b-form-invalid-feedback>
    </b-modal>
  </b-container>
</template>
<script>
import VueQrcode from "vue-qrcode";
import * as base32 from "hi-base32";
import { Base64 } from "js-base64";
import GetRandomValues from "get-random-values";

export default {
  components: { VueQrcode },
  computed: {
    user: function () {
      return this.$store.state.user;
    },
    uuid: function () {
      return this.$store.state.user.uuid;
    },
    formChangePasswordvalidation: function () {
      return (
        this.formChangePassword.newPassword ==
        this.formChangePassword.newPasswordRetry
      );
    },
    modal2FAEnableurl: function () {
      return (
        "otpauth://totp/" +
        encodeURIComponent(
          this.$store.state.config.projectName + " " + this.user.username
        ) +
        "?secret=" +
        this.modal2FAEnablesecretKey
      );
    },
    modal2FAEnablesecretKey: function () {
      if (this.modal2FAEnable.encodedSecretKey == null) return null;
      let data = base32
        .encode(this.modal2FAEnable.encodedSecretKey)
        .split("=")
        .join("");
      return data;
    },
  },
  data: function () {
    return {
      formChangePassword: {
        oldPassword: "",
        newPassword: "",
        newPasswordRetry: "",
        serverErrorShow: true,
        show: true,
        serverError: "Unknown error",
      },
      modal2FAEnable: {
        show: false,
        url: null,
        encodedSecretKey: null,
        code: null,
        secretKey: null,
        validation: true,
      },
      modal2FADisable: {
        show: false,
        code: null,
        validation: true,
      },
    };
  },
  watch: {
    uuid: function (newUuid, oldUuid) {
      if (!newUuid && oldUuid) {
        this.$router.push("/login");
      }
    },
  },
  created: async function () {
    try {
      await this.$store.state.api.promises.auth;
    } catch (error) {
      this.$router.push("/login");
    }
  },
  methods: {
    userChangePassword: async function (evt) {
      evt.preventDefault();
      this.formChangePassword.serverErrorShow = false;
      if (
        this.formChangePassword.newPassword !=
        this.formChangePassword.newPasswordRetry
      ) {
        //TODO
        this.formChangePassword.validation = false;
      } else {
        this.formChangePassword.validation = true;
        try {
          await this.$store.dispatch("request", {
            type: "lkChangePassword",
            oldPassword: this.formChangePassword.oldPassword,
            newPassword: this.formChangePassword.newPassword,
          });
          this.formChangePassword.oldPassword = "";
          this.formChangePassword.newPassword = "";
          this.formChangePassword.newPasswordRetry = "";
          this.formChangePassword.serverErrorShow = true;
          this.formChangePassword.successfull = true;
          this.formChangePassword.show = false;
          this.$nextTick(() => {
            this.formChangePassword.show = true;
          });
          this.$bvToast.toast("Пароль успешно изменен", {
            title: "Смена пароля",
            variant: "success",
            autoHideDelay: 5000,
          });
        } catch (e) {
          this.formChangePassword.serverError = e.error;
          this.formChangePassword.serverErrorShow = false;
          return;
        }
      }
    },
    twoFactorGenerate: function () {
      var array = new Uint8Array(16);
      GetRandomValues(array);
      this.modal2FAEnable.encodedSecretKey = array;
    },
    twoFactorEnable: async function (evt) {
      evt.preventDefault();
      try {
        await this.$store.dispatch("request", {
          type: "lkTwoFactorEnable",
          data: Base64.fromUint8Array(
            this.modal2FAEnable.encodedSecretKey,
            true
          ),
          code: this.modal2FAEnable.code,
        });
        this.$bvToast.toast("Двухфакторная аудентификация успешно включена", {
          title: "Безопасность",
          variant: "success",
          autoHideDelay: 5000,
        });
        this.$store.commit("enable2FA");
      } catch (error) {
        console.log(error);
        this.modal2FAEnable.validation = false;
        return;
      }
      this.modal2FAEnable.show = false;
      this.modal2FAEnable.encodedSecretKey = null;
    },
    twoFactorDisable: async function (evt) {
      evt.preventDefault();
      try {
        await this.$store.dispatch("request", {
          type: "lkTwoFactorEnable",
          code: this.modal2FADisable.code,
        });
        this.$bvToast.toast("Двухфакторная аудентификация успешно отключена", {
          title: "Безопасность",
          variant: "success",
          autoHideDelay: 5000,
        });
        this.$store.commit("disable2FA");
      } catch (error) {
        console.log(error);
        this.modal2FADisable.validation = false;
        return;
      }
      this.modal2FADisable.show = false;
    },
  },
};
</script>