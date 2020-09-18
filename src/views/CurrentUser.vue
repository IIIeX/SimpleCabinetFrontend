<template>
  <b-tabs pills card vertical end>
    <b-tab title="Профиль" active>
  <UserView :user="user" :owner="true" :admin="(user.permissions & 1) != 0" />
    </b-tab>
    <b-tab title="Безопасность">
      <b-form v-if="formChangePassword.show" @submit="userChangePassword">
      <b-form-group
        id="input-group-1"
        label="Старый пароль:"
        label-for="input-1"
        description="Старый пароль нужен для подтверждения владения аккаунтом"
      >
        <b-form-input
          id="input-1"
          v-model="formChangePassword.oldPassword"
          type="password"
          required
          placeholder="Введите текущий пароль"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Введите новый пароль:" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="formChangePassword.newPassword"
          type="password"
          required
          placeholder="Новый пароль"
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-3" label="Повторите новый пароль:" label-for="input-3">
        <b-form-input
          id="input-3"
          v-model="formChangePassword.newPasswordRetry"
          type="password"
          required
          placeholder="Новый пароль"
        ></b-form-input>
      </b-form-group>

      <b-form-invalid-feedback :state="formChangePasswordvalidation">Пароли не совпадают</b-form-invalid-feedback>
      <b-form-invalid-feedback :state="formChangePassword.serverErrorShow">{{ formChangePassword.serverError }}</b-form-invalid-feedback>
      <b-button type="submit" variant="primary">Сменить пароль</b-button>
    </b-form>
    <b-button @click="twoFactorGenerate(); modal2FAEnable.show = !modal2FAEnable.show">Включить 2FA</b-button>
    <b-modal
      v-model="modal2FAEnable.show"
      id="modal-2fa-enable"
      @ok="twoFactorEnable"
    >
      <vue-qrcode :value="modal2FAEnableurl" />
      <p><b>Код для ручного ввода</b>: {{ modal2FAEnablesecretKey }}</p>
      <b-form-input v-model="modal2FAEnable.code" type="text" placeholder="Код из приложения"></b-form-input>
    </b-modal>
    </b-tab>
  </b-tabs>
</template>
<script>
import UserView from "@/components/UserView.vue";

import VueQrcode from 'vue-qrcode'
import * as base32 from 'hi-base32';
import {Base64} from 'js-base64';
import GetRandomValues from 'get-random-values'
export default {
  components: { UserView, VueQrcode },
  computed: {
    user: function() {
      return this.$store.state.user;
    },
    uuid: function() {
      return this.$store.state.user.uuid;
    },
    'formChangePasswordvalidation': function() {
      return this.formChangePassword.newPassword == this.formChangePassword.newPasswordRetry;
    },
    'modal2FAEnableurl': function() {
      return "otpauth://totp/"+encodeURIComponent("Minecraft "+this.user.username)+"?secret="+this.modal2FAEnablesecretKey;
    },
    'modal2FAEnablesecretKey': function() {
      if(this.modal2FAEnable.encodedSecretKey == null) return null;
      let data = base32.encode(this.modal2FAEnable.encodedSecretKey).split('=').join('');
      console.log(data);
      return data;
    },
  },
  data: function() {
    return {
      formChangePassword: {
        oldPassword: '',
        newPassword: '',
        newPasswordRetry: '',
        serverErrorShow: true,
        show: true,
        serverError: 'Unknown error'
      },
      modal2FAEnable: {
        show: false,
        url: null,
        encodedSecretKey: null,
        code: null,
        secretKey: null
      },
    };
  },
  watch: {
    uuid: function(newUuid, oldUuid) {
      console.log("Changed uuid", newUuid, oldUuid);
      if(!newUuid && oldUuid)
      {
        this.$router.push('/login');
      }
    },
  },
  methods: {
    userChangePassword: async function (evt) {
      evt.preventDefault();
      this.formChangePassword.serverErrorShow = false;
      if (this.formChangePassword.newPassword != this.formChangePassword.newPasswordRetry) {
        //TODO
        this.formChangePassword.validation = false;
      } else {
        this.formChangePassword.validation = true;
        try {
        var res = await this.$store.dispatch('request', {
          type: 'lkChangePassword',
          oldPassword: this.formChangePassword.oldPassword,
          newPassword: this.formChangePassword.newPassword,
        });
        this.formChangePassword.oldPassword = '';
        this.formChangePassword.newPassword = '';
        this.formChangePassword.newPasswordRetry = '';
        this.formChangePassword.serverErrorShow = true;
        this.formChangePassword.successfull = true;
        this.formChangePassword.show = false;
        this.$nextTick(() => {
          this.formChangePassword.show = true;
        });
        this.$bvToast.toast("Пароль успешно изменен", {
          title: 'Смена пароля',
          variant: 'success',
          autoHideDelay: 5000
        });
        } catch(e) {
            console.log(e);
            this.formChangePassword.serverError = e.error;
            this.formChangePassword.serverErrorShow = false;
            return;
        }
        console.log(res);
      }
    },
    twoFactorGenerate: function() {
      var array = new Uint8Array(16);
      GetRandomValues(array);
      console.log(array.length);
      this.modal2FAEnable.encodedSecretKey = array;
    },
    twoFactorEnable: async function(evt) {
      evt.preventDefault();
      console.log(window.btoa(this.modal2FAEnable.encodedSecretKey));
      var res = await this.$store.dispatch('request', {
          type: 'lkTwoFactorEnable',
          data: Base64.fromUint8Array(this.modal2FAEnable.encodedSecretKey, true),
          code: this.modal2FAEnable.code,
        });
      console.log(res);
      this.modal2FAEnable.show = false;
      this.modal2FAEnable.encodedSecretKey = null;
    },
  }
};
</script>