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
          </b-dropdown>
          <b-dropdown v-if="admin" text="Администрирование" variant="danger" class="m-md-2">
            <b-dropdown-item
              variant="danger"
              @click="modalAdminChangePassword.show = !modalAdminChangePassword.show"
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
          <b-button v-if="!editProfileForm.show" @click="editProfileForm.show = !editProfileForm.show" variant="outline-primary">Редактировать</b-button>
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
    </b-modal>
    <b-modal
      v-model="modalAdminChangePassword.show"
      id="modal-admin-changepassword"
      @ok="adminChangePassword"
    >
      <b-form-input v-model="modalAdminChangePassword.newPassword" type="password" placeholder="Новый пароль"></b-form-input>
    </b-modal>
  </div>
</template>
<script>
//import { mapState } from 'vuex';
import SkinViewer from "@/components/SkinViewer"
export default {
  props: ["user", "owner", "admin"],
  components: { SkinViewer },
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
        newPasswordRetry: null
      },
      modalAdminChangePassword: {
        show: false,
        newPassword: null
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
  methods: {
    userChangePassword: async function (evt) {
      evt.preventDefault();
      if (this.modalChangePassword.newPassword != this.modalChangePassword.newPasswordRetry) {
        //TODO
        this.modalChangePassword.validation = false;
        this.modalChangePassword.show = true;
      } else {
        var res = await this.$store.dispatch('request', {
          type: 'lkChangePassword',
          oldPassword: this.modalChangePassword.oldPassword,
          newPassword: this.modalChangePassword.newPassword,
        });
        console.log(res);
        this.modalChangePassword.show = false;
        this.modalChangePassword.validation = true;
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
        newPassword: this.adminChangeNewPassword,
      });
      console.log(res);
    },
    uploadSkin: async function () {
      const data = await this.readFileToBase64();
      var result = await this.$store.dispatch('request', {
        type: 'lkUploadSkin',
        skinType: "SKIN",
        data: data.split("+").join("-").split("/").join("_"),
      });
      console.log(result);
    },
    uploadCloak: async function () {
      const data = await this.readFileToBase64();
      var result = await this.$store.dispatch('request', {
        type: 'lkUploadSkin',
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