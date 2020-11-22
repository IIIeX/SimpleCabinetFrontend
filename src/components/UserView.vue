<template>
  <div class="about">
    <b-row class="d-flex justify-content-center">
      <b-col col lg="4">
        <b-card bg-variant="light" no-body>
          <b-card-header>
            {{ user.username }}
          </b-card-header>
          <h2 style="text-align: center;"></h2>
          <SkinViewer ref="skinviewer" :skinUrl="user.skin" :cloakUrl="user.cloak"></SkinViewer>
          <b-card-body>
            <b-button-group v-if="owner" class="btn-block">
              <b-button squared variant="secondary" @click="uploadSkin()">Загрузить скин</b-button>
            </b-button-group>
            <b-button-group v-if="owner" class="btn-block">
              <b-button squared variant="secondary" @click="uploadCloak()">Загрузить плащ</b-button>
            </b-button-group>
            <b-button-group v-if="owner" class="btn-block">
              <b-button squared variant="primary" to="/user/security">Настройки безопасности</b-button>
            </b-button-group>
            <b-dropdown v-if="admin" text="Администрирование" variant="danger" class="btn-block rounded-0">
              <b-dropdown-item
                variant="danger"
                @click="modalAdminChangePassword.show = !modalAdminChangePassword.show"
                >Сменить пароль</b-dropdown-item>
             <b-dropdown-item
                variant="danger"
                @click="modalAdminChangeUsername.show = !modalAdminChangeUsername.show"
                >Сменить имя пользователя</b-dropdown-item>
              <b-dropdown-item
                v-if="user.ext.privateUserZone.enabled2FA"
                variant="danger"
                @click="adminDisable2FA()"
                >Отключить 2FA</b-dropdown-item>
            </b-dropdown>
          </b-card-body>
        </b-card>
      </b-col>
      <b-col col lg>
        <b-card
          v-if="user.uuid"
          bg-variant="light"
          title="UUID"
          class="mb-2">
          <b-card-sub-title>{{ user.uuid }}</b-card-sub-title>
        </b-card>
        <b-card
          v-if="user.ext.status || editProfileForm.show"
          bg-variant="light"
          title="Статус"
          class="mb-2">
          <b-card-sub-title v-if="!editProfileForm.show">{{ user.ext.status }}</b-card-sub-title>
          <b-card-sub-title v-if="editProfileForm.show">
            <b-form-input
              v-model="editProfileForm.status"
              type="text"
              placeholder="Ваш статус"
            ></b-form-input>
          </b-card-sub-title>
        </b-card>
        <b-row cols-md="2">
          <b-col col md="6" v-if="user.ext.email">
            <b-card
              bg-variant="light"
              title="Email"
              class="mb-2">
              <b-card-sub-title>{{ user.ext.email }}</b-card-sub-title>
            </b-card>
          </b-col>
          <b-col col md="6">
            <b-card
              bg-variant="light"
              title="Пол"
              class="mb-2">
              <b-card-sub-title v-if="!editProfileForm.show">{{ !user.ext.gender ? "Не указан" : user.ext.gender == "FEMALE" ? "Женский" : "Мужской" }}</b-card-sub-title>
              <b-card-sub-title v-if="editProfileForm.show">
                <b-form-select
                  v-model="editProfileForm.gender"
                  :options="editProfileForm.genderOptions"
                ></b-form-select>
              </b-card-sub-title>
            </b-card>
          </b-col>
          <b-col col md="6" v-if="user.ext.economyMoney">
            <b-card
              bg-variant="light"
              title="Счет"
              class="mb-2">
              <b-card-sub-title>{{ user.ext.economyMoney }}</b-card-sub-title>
            </b-card>
          </b-col>
          <b-col col md="6" v-if="user.ext.donateMoney">
            <b-card
              bg-variant="light"
              title="Донатный счет"
              class="mb-2">
              <b-card-sub-title>{{ user.ext.donateMoney }}</b-card-sub-title>
            </b-card>
          </b-col>
        </b-row>
        <b-row align-h="center">
          <b-button
            v-if="!editProfileForm.show && (admin || owner)"
            @click="editProfileForm.show = !editProfileForm.show"
            variant="outline-primary"
            >Редактировать</b-button>
          <b-button v-if="editProfileForm.show" @click="editProfile" variant="primary">Применить</b-button>
        </b-row>
      </b-col>
    </b-row>
    <b-modal
      hide-header
      centered
      size="md"
      v-model="modalAdminChangePassword.show"
      id="modal-admin-changepassword"
      @ok="adminChangePassword"
    >
      <b-input-group class="mb-2">
        <b-input-group-prepend is-text>
          <b-icon icon="lock-fill" variant="primary"></b-icon>
        </b-input-group-prepend>
        <b-form-input
        v-model="modalAdminChangePassword.newPassword"
        type="password"
        placeholder="Новый пароль"
        ></b-form-input>
      </b-input-group>
    </b-modal>
    <b-modal
      hide-header
      centered
      size="md"
      v-model="modalAdminChangeUsername.show"
      id="modal-admin-changeusername"
      @ok="adminChangeUsername"
    >
      <b-input-group class="mb-2">
        <b-input-group-prepend is-text>
          <b-icon icon="person-fill" variant="primary"></b-icon>
        </b-input-group-prepend>
        <b-form-input
        v-model="modalAdminChangeUsername.newUsername"
        type="text"
        placeholder="Новое имя пользователя"
        ></b-form-input>
      </b-input-group>
    </b-modal>
  </div>
</template>
<script>
//import { mapState } from 'vuex';
import SkinViewer from "@/components/SkinViewer";
//import func from '../../vue-temp/vue-editor-bridge';
export default {
  props: ["user", "owner", "admin"],
  components: { SkinViewer },
  //computed: mapState({
  //  user: state => state.user
  //})
  data: function () {
    return {
      items: [{ a: 1 }, { a: 1 }, { a: 1 }],
      modalChangePassword: {
        show: false,
        validation: true,
        oldPassword: null,
        newPassword: null,
        newPasswordRetry: null,
        serverErrorShow: true,
        serverError: null,
      },
      modalAdminChangeUsername: {
        show: false,
        newUsername: null,
      },
      modalAdminChangePassword: {
        show: false,
        newPassword: null,
      },
      editProfileForm: {
        show: false,
        status: this.user.ext.status,
        gender: this.user.ext.gender == undefined ? null : this.user.ext.gender,
        genderOptions: [
          { value: null, text: "Не указано" },
          { value: "FEMALE", text: "Женский" },
          { value: "MALE", text: "Мужской" },
        ],
      },
    };
  },
  watch: {
    "user.ext.status": function (newStatus) {
      this.editProfileForm.status = newStatus;
    },
    "user.ext.gender": function (newGender) {
      this.editProfileForm.gender = newGender;
    },
  },
  computed: {},
  methods: {
    editProfile: async function () {
      var res = await this.$store.dispatch("request", {
        type: "lkUpdateExtendedInfo",
        username: this.admin && !this.owner ? this.user.username : undefined,
        status: this.editProfileForm.status,
        gender: this.editProfileForm.gender,
      });
      this.user.ext.status = this.editProfileForm.status;
      this.user.ext.gender = this.editProfileForm.gender;
      this.editProfileForm.show = false;
      console.log(res);
    },
    adminDisable2FA: async function () {
      var res = await this.$store.dispatch("request", {
        type: "lkTwoFactorEnable",
        userUsername: this.user.username,
      });
      console.log(res);
    },
    adminChangePassword: async function (evt) {
      evt.preventDefault();
      var res = await this.$store.dispatch("request", {
        type: "lkChangePassword",
        userUsername: this.user.username,
        newPassword: this.modalAdminChangePassword.newPassword,
      });
      console.log(res);
      this.modalAdminChangePassword.show = false;
    },
    adminChangeUsername: async function (evt) {
      evt.preventDefault();
      var res = await this.$store.dispatch("request", {
        type: "lkChangeUsername",
        userUsername: this.user.username,
        newUsername: this.modalAdminChangeUsername.newUsername,
      });
      console.log(res);
      this.modalAdminChangeUsername.show = false;
    },
    uploadSkin: async function () {
      const data = await this.readFileToBase64();
      try {
        var result = await this.$store.dispatch("request", {
          type: "lkUploadSkin",
          skinType: "SKIN",
          data: data.split("+").join("-").split("/").join("_"),
        });
        this.$refs.skinviewer.updateSkin();
      } catch (e) {
        this.$bvToast.toast(e.error, {
          title: "Ошибка при загрузке скина",
          variant: "danger",
          autoHideDelay: 5000,
        });
        return;
      }
      console.log(result);
    },
    uploadCloak: async function () {
      const data = await this.readFileToBase64();
      try {
        var result = await this.$store.dispatch("request", {
          type: "lkUploadSkin",
          skinType: "CLOAK",
          data: data.split("+").join("-").split("/").join("_"),
        });
        this.$refs.skinviewer.updateCloak();
      } catch (e) {
        this.$bvToast.toast(e.error, {
          title: "Ошибка при загрузке плаща",
          autoHideDelay: 5000,
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