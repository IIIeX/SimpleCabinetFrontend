<template>
  <div class="about">
    <b-container class="bv-example-row">
      <b-row>
        <b-col>
          <p>
            <SkinViewer :skinUrl="user.skin" :cloakUrl="user.cloak"></SkinViewer>
          </p>
          <b-button v-if="owner" variant="primary" @click="uploadSkin()">Загрузить скин</b-button> <b-button v-if="owner" variant="primary" @click="uploadCloak()">Загрузить плащ</b-button>
          <b-dropdown v-if="owner" text="Действия" class="m-md-2">
            <b-dropdown-item @click="modalChangePassword.show = !modalChangePassword.show">Сменить пароль</b-dropdown-item>
            <b-dropdown-item @click="twoFactorGenerate(); modal2FAEnable.show = !modal2FAEnable.show">Включить 2FA</b-dropdown-item>
          </b-dropdown>
          <b-dropdown v-if="admin" text="Администрирование" variant="danger" class="m-md-2">
            <b-dropdown-item
              variant="danger"
              @click="modalAdminChangePassword.show = !modalAdminChangePassword.show"
            >Сменить пароль</b-dropdown-item>
          <b-dropdown-item
              variant="danger"
              @click="modalAdminChangeUsername.show = !modalAdminChangeUsername.show"
            >Сменить имя пользователя</b-dropdown-item>
          </b-dropdown>
        </b-col>
        <b-col cols="8">
          <table class="table">
            <tbody>
              <tr>
                <td>
                  <b>Имя пользователя</b>
                </td>
                <td>
                  <b>{{ user.username }}</b>
                </td>
              </tr>
              <tr v-if="user.uuid">
                <td>UUID</td>
                <td>{{ user.uuid }}</td>
              </tr>
              <tr v-if="user.ext.status || editProfileForm.show">
                <td>Статус</td>
                <td v-if="!editProfileForm.show">{{ user.ext.status }}</td>
                <td v-if="editProfileForm.show">
                  <b-form-input v-model="editProfileForm.status" type="text" placeholder="Ваш статус"></b-form-input>
                </td>
              </tr>
              <tr>
                <td>Пол</td>
                <td v-if="!editProfileForm.show">{{ !user.ext.gender ? "Не указан" : user.ext.gender == "FEMALE" ? "Женский" : "Мужской" }}</td>
                <td v-if="editProfileForm.show">
                  <b-form-select v-model="editProfileForm.gender" :options="editProfileForm.genderOptions"></b-form-select>
                </td>
              </tr>
              <tr v-if="user.ext.email">
                <td>Email</td>
                <td>{{ user.ext.email }}</td>
              </tr>
              <tr v-if="user.ext.economyMoney > 0">
                <td>Счет</td>
                <td>{{ user.ext.economyMoney }}</td>
              </tr>
              <tr v-if="user.ext.donateMoney > 0">
                <td>Донатный счет</td>
                <td>{{ user.ext.donateMoney }}</td>
              </tr>
            </tbody>
          </table>
          <b-button v-if="!editProfileForm.show && (admin || owner)" @click="editProfileForm.show = !editProfileForm.show" variant="outline-primary">Редактировать</b-button>
          <b-button v-if="editProfileForm.show" @click="editProfile" variant="primary">Применить</b-button>
        </b-col>
      </b-row>
    </b-container>
    <b-modal v-model="modalChangePassword.show" id="modal-changepassword" @ok="userChangePassword">
      <b-form-input v-model="modalChangePassword.oldPassword" type="password" placeholder="Старый пароль"></b-form-input>
      <b-form-input v-model="modalChangePassword.newPassword" type="password" placeholder="Новый пароль"></b-form-input>
      <b-form-input
        v-model="modalChangePassword.newPasswordRetry"
        type="password"
        placeholder="Повторите пароль"
      ></b-form-input>
      <b-form-invalid-feedback :state="modalChangePassword.validation">Пароли не совпадают</b-form-invalid-feedback>
      <b-form-invalid-feedback :state="modalChangePassword.serverErrorShow">{{ modalChangePassword.serverError }}</b-form-invalid-feedback>
    </b-modal>
    <b-modal
      v-model="modalAdminChangePassword.show"
      id="modal-admin-changepassword"
      @ok="adminChangePassword"
    >
      <b-form-input v-model="modalAdminChangePassword.newPassword" type="password" placeholder="Новый пароль"></b-form-input>
    </b-modal>
    <b-modal
      v-model="modalAdminChangeUsername.show"
      id="modal-admin-changeusername"
      @ok="adminChangeUsername"
    >
      <b-form-input v-model="modalAdminChangeUsername.newUsername" type="text" placeholder="Новое имя пользователя"></b-form-input>
    </b-modal>
    <b-modal
      v-model="modal2FAEnable.show"
      id="modal-2fa-enable"
      @ok="twoFactorEnable"
    >
      <vue-qrcode :value="modal2FAEnableurl" />
      <p><b>Код для ручного ввода</b>: {{ modal2FAEnablesecretKey }}</p>
      <b-form-input v-model="modal2FAEnable.code" type="text" placeholder="Код из приложения"></b-form-input>
    </b-modal>
  </div>
</template>
<script>
//import { mapState } from 'vuex';
import SkinViewer from "@/components/SkinViewer"
import VueQrcode from 'vue-qrcode'
import * as base32 from 'hi-base32';
import {Base64} from 'js-base64';
import GetRandomValues from 'get-random-values'
//import func from '../../vue-temp/vue-editor-bridge';
export default {
  props: ["user", "owner", "admin"],
  components: { SkinViewer, VueQrcode },
  //computed: mapState({
  //  user: state => state.user
  //})
  data: function() {
    return {
      items: [{ a: 1 }, { a: 1 }, { a: 1 }],
      modalChangePassword: {
        show: false,
        validation: true,
        oldPassword: null,
        newPassword: null,
        newPasswordRetry: null,
        serverErrorShow: true,
        serverError: null
      },
      modalAdminChangeUsername: {
        show: false,
        newUsername: null
      },
      modalAdminChangePassword: {
        show: false,
        newPassword: null
      },
      modal2FAEnable: {
        show: false,
        url: null,
        encodedSecretKey: null,
        code: null,
        secretKey: null
      },
      editProfileForm: {
        show: false,
        status: this.user.ext.status,
        gender: this.user.ext.gender == undefined ? null : this.user.ext.gender,
        genderOptions: [
          { value: null, text: "Не указано" },
          { value: "FEMALE", text: "Женский" },
          { value: "MALE", text: "Мужской" }
        ]
      }
    };
  },
  watch: {
      'user.ext.status': function(newStatus) {
        this.editProfileForm.status = newStatus;
      },
      'user.ext.gender': function(newGender) {
        this.editProfileForm.gender = newGender;
      }
  },
  computed: {
    'modal2FAEnableurl': function() {
      return "otpauth://totp/"+encodeURIComponent("Minecraft "+this.user.username)+"?secret="+this.modal2FAEnablesecretKey;
    },
    'modal2FAEnablesecretKey': function() {
      if(this.modal2FAEnable.encodedSecretKey == null) return null;
      let data = base32.encode(this.modal2FAEnable.encodedSecretKey).split('=').join('');
      console.log(data);
      return data;
    }
  },
  methods: {
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
    userChangePassword: async function (evt) {
      evt.preventDefault();
      this.modalChangePassword.serverErrorShow = false;
      if (this.modalChangePassword.newPassword != this.modalChangePassword.newPasswordRetry) {
        //TODO
        this.modalChangePassword.validation = false;
        this.modalChangePassword.show = true;
      } else {
        this.modalChangePassword.validation = true;
        try {
        var res = await this.$store.dispatch('request', {
          type: 'lkChangePassword',
          oldPassword: this.modalChangePassword.oldPassword,
          newPassword: this.modalChangePassword.newPassword,
        });
        } catch(e) {
            console.log(e);
            this.modalChangePassword.serverError = e.error;
            this.modalChangePassword.serverErrorShow = false;
            return;
        }
        console.log(res);
        this.modalChangePassword.show = false;
      }
    },
    editProfile: async function () {
        var res = await this.$store.dispatch('request', {
          type: 'lkUpdateExtendedInfo',
          username: ( this.admin && !this.owner ) ? this.user.username : undefined,
          status: this.editProfileForm.status,
          gender: this.editProfileForm.gender
        });
        this.user.ext.status = this.editProfileForm.status;
        this.user.ext.gender = this.editProfileForm.gender;
        this.editProfileForm.show = false;
        console.log(res);
    },
    adminChangePassword: async function (evt) {
      evt.preventDefault();
      var res = await this.$store.dispatch('request', {
        type: 'lkChangePassword',
        userUsername: this.user.username,
        newPassword: this.modalAdminChangePassword.newPassword,
      });
      console.log(res);
      this.modalAdminChangePassword.show = false;
    },
    adminChangeUsername: async function (evt) {
      evt.preventDefault();
      var res = await this.$store.dispatch('request', {
        type: 'lkChangeUsername',
        userUsername: this.user.username,
        newUsername: this.modalAdminChangeUsername.newUsername,
      });
      console.log(res);
      this.modalAdminChangeUsername.show = false;
    },
    uploadSkin: async function () {
      const data = await this.readFileToBase64();
      try {
      var result = await this.$store.dispatch('request', {
        type: 'lkUploadSkin',
        skinType: "SKIN",
        data: data.split("+").join("-").split("/").join("_"),
      });
      } catch(e) {
        this.$bvToast.toast(e.error, {
          title: 'Ошибка при загрузке скина',
          autoHideDelay: 5000
        });
        return;
      }
      console.log(result);
    },
    uploadCloak: async function () {
      const data = await this.readFileToBase64();
      try {
      var result = await this.$store.dispatch('request', {
        type: 'lkUploadSkin',
        skinType: "CLOAK",
        data: data.split("+").join("-").split("/").join("_"),
      });
      } catch(e) {
        this.$bvToast.toast(e.error, {
          title: 'Ошибка при загрузке плаща',
          autoHideDelay: 5000
        });
        return;
      }
      console.log(result);
    },
    readFileToBase64: async function () {
      return new Promise((resolve, reject) => {
        var input = document.createElement("input");
        input.type = "file";
        input.accept = "image/png";
        input.click();
        input.onchange = function (e) {
          // getting a hold of the file reference
          var file = e.target.files[0];

          // setting up the reader
          var reader = new FileReader();
          reader.readAsArrayBuffer(file);

          // here we tell the reader what to do when it's done reading...
          reader.onload = (readerEvent) => {
            var content = readerEvent.target.result; // this is the content!
            let base64String = btoa(
              String.fromCharCode(...new Uint8Array(content))
            );
            resolve(base64String);
          };
          reader.onerror = (error) => {
            reject(error);
          };
        };
      });
    },
  },
};
</script>