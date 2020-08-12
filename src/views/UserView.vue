<template>
  <div class="about">
    <b-container class="bv-example-row">
      <b-row>
        <b-col>
          <p>
            <SkinViewer :skinUrl="user.skin" :cloakUrl="user.cloak"></SkinViewer>
          </p>
          <b-button v-if="owner" variant="primary" @click="uploadSkin()">Загрузить скин</b-button>
          <b-button v-if="owner" variant="primary" @click="uploadCloak()">Загрузить плащ</b-button>
          <b-dropdown v-if="owner" text="Действия" class="m-md-2">
            <b-dropdown-item @click="modalChangePassword = !modalChangePassword">Сменить пароль</b-dropdown-item>
            <b-dropdown-item>Сменить статус</b-dropdown-item>
          </b-dropdown>
          <b-dropdown v-if="admin" text="Администрирование" variant="danger" class="m-md-2">
            <b-dropdown-item
              variant="danger"
              @click="modalAdminChangePassword = !modalAdminChangePassword"
            >Сменить пароль</b-dropdown-item>
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
              <tr v-if="user.ext.status">
                <td>Статус</td>
                <td>{{ user.ext.status }}</td>
              </tr>
              <tr>
                <td>Пол</td>
                <td>{{ user.ext.gender == undefined ? "Не указан" : user.ext.gender == "FEMALE" ? "Женский" : "Мужской" }}</td>
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
        </b-col>
      </b-row>
    </b-container>
    <b-modal v-model="modalChangePassword" id="modal-changepassword" @ok="userChangePassword">
      <b-form-input v-model="userChangeOldPassword" type="password" placeholder="Старый пароль"></b-form-input>
      <b-form-input v-model="userChangeNewPassword" type="password" placeholder="Новый пароль"></b-form-input>
      <b-form-input
        v-model="userChangeNewPasswordRetry"
        type="password"
        placeholder="Повторите пароль"
      ></b-form-input>
      <b-form-invalid-feedback :state="userChangePasswordValidationMatch">Пароли не совпадают</b-form-invalid-feedback>
    </b-modal>
    <b-modal
      v-model="modalAdminChangePassword"
      id="modal-admin-changepassword"
      @ok="adminChangePassword"
    >
      <b-form-input v-model="adminChangeNewPassword" type="password" placeholder="Новый пароль"></b-form-input>
    </b-modal>
  </div>
</template>
<script>
//import { mapState } from 'vuex';
import SkinViewer from "../components/SkinViewer"
export default {
  props: ["user", "owner", "admin"],
  components: { SkinViewer },
  //computed: mapState({
  //  user: state => state.user
  //})
  data: () => {
    return {
      items: [{ a: 1 }, { a: 1 }, { a: 1 }],
      modalChangePassword: false,
      modalAdminChangePassword: false,
      userChangePasswordValidationMatch: true,
      userChangeOldPassword: null,
      userChangeNewPassword: null,
      userChangeNewPasswordRetry: null,
      adminChangeNewPassword: null,
    };
  },
  methods: {
    userChangePassword: async function (evt) {
      evt.preventDefault();
      if (this.userChangeNewPassword != this.userChangeNewPasswordRetry) {
        //TODO
        this.userChangePasswordValidationMatch = false;
        this.modalChangePassword = true;
      } else {
        var res = await this.$root.api.request("lkChangePassword", {
          oldPassword: this.userChangeOldPassword,
          newPassword: this.userChangeNewPassword,
        });
        console.log(res);
        this.modalChangePassword = false;
        this.userChangePasswordValidationMatch = true;
      }
    },
    adminChangePassword: async function (evt) {
      evt.preventDefault();
      var res = await this.$root.api.request("lkChangePassword", {
        userUsername: this.user.username,
        newPassword: this.adminChangeNewPassword,
      });
      console.log(res);
    },
    uploadSkin: async function () {
      const data = await this.readFileToBase64();
      var result = await this.$root.api.request("lkUploadSkin", {
        skinType: "SKIN",
        data: data.split("+").join("-").split("/").join("_"),
      });
      console.log(result);
    },
    uploadCloak: async function () {
      const data = await this.readFileToBase64();
      var result = await this.$root.api.request("lkUploadSkin", {
        skinType: "CLOAK",
        data: data.split("+").join("-").split("/").join("_"),
      });
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