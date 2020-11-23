<template>
  <b-container>
    <b-row class="d-flex justify-content-center py-3">
      <b-col col xl="3" class="pb-3">
        <b-card bg-variant="light" no-body class="shadow">
          <b-card-header class="d-flex align-items-center">
            <h4 class="mb-0">{{ user.username }}</h4>
          </b-card-header>
          <SkinViewer ref="skinviewer" :skinUrl="user.skin" :cloakUrl="user.cloak"></SkinViewer>
          <b-button-group v-if="owner" vertical class="btn-block">
            <b-button-group>
              <b-button squared variant="light" @click="uploadSkin()"><b-icon icon="file-earmark-image" aria-hidden="true"></b-icon> скин</b-button>
              <b-button squared variant="light" @click="uploadCloak()"><b-icon icon="file-earmark-image" aria-hidden="true"></b-icon> плащ</b-button>
            </b-button-group>
            <b-button variant="light" @click="modalInitPayment.show = !modalInitPayment.show">
              <b-icon icon="credit-card" aria-hidden="true"></b-icon> пополнить
            </b-button>
            <b-button variant="light" to="/user/security"><b-icon icon="lock-fill" aria-hidden="true"></b-icon> безопасность</b-button>
            <b-dropdown v-if="admin" variant="light" dropright>
              <template #button-content>
                <b-icon icon="gear-fill" aria-hidden="true"></b-icon> администрирование
              </template>
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
          </b-button-group>
        </b-card>
      </b-col>
			<b-col col xl="6" class="pb-3">
			  <b-card no-body class="shadow">
			    <b-card-header class="d-flex align-items-center">
			      <h4 class="mb-0">Информация</h4>
			    </b-card-header>
			    <b-list-group flush>
			      <b-list-group-item v-if="user.uuid" class="py-1">
			        <h6 class="d-flex justify-content-between align-items-center mb-0">
			          UUID
			          <b-alert show class="mb-0">{{ user.uuid }}</b-alert>
			        </h6>
			      </b-list-group-item>
			      <b-list-group-item v-if="user.ext.status || editProfileForm.show" class="py-1">
			        <h6 class="d-flex justify-content-between align-items-center mb-0">
			          Статус
			          <b-alert show class="mb-0" v-if="!editProfileForm.show">{{ user.ext.status }}</b-alert>
			          <span v-if="editProfileForm.show">
			            <b-form-input
			              v-model="editProfileForm.status"
			              type="text"
			              placeholder="Ваш статус"></b-form-input>
			          </span>
			        </h6>
			      </b-list-group-item>
			      <b-list-group-item v-if="user.ext.email" class="py-1">
			        <h6 class="d-flex justify-content-between align-items-center mb-0">
			          Email
			          <b-alert show class="mb-0">{{ user.ext.email }}</b-alert>
			        </h6>
			      </b-list-group-item>
			      <b-list-group-item class="py-1">
			        <h6 class="d-flex justify-content-between align-items-center mb-0">
			          Пол
			          <b-alert show class="mb-0" v-if="!editProfileForm.show">{{ !user.ext.gender ? "Не указан" : user.ext.gender == "FEMALE" ? "Женский" : "Мужской" }}</b-alert>
			          <span v-if="editProfileForm.show">
			            <b-form-select
			              v-model="editProfileForm.gender"
			              :options="editProfileForm.genderOptions">
			            </b-form-select>
			          </span>
			        </h6>
			      </b-list-group-item>
			      <b-list-group-item v-if="user.ext.economyMoney" class="py-1">
			        <h6 class="d-flex justify-content-between align-items-center mb-0">
			          Счет
			          <b-alert show class="mb-0">{{ user.ext.economyMoney }}</b-alert>
			        </h6>
			      </b-list-group-item>
			      <b-list-group-item v-if="user.ext.donateMoney" class="py-1">
			        <h6 class="d-flex justify-content-between align-items-center mb-0">
			          Донатный счет
			          <b-alert show class="mb-0">{{ user.ext.donateMoney }}</b-alert>
			        </h6>
			      </b-list-group-item>
			    </b-list-group>
			    <b-card-footer class="d-flex flex-row-reverse">
			      <b-button
			        v-if="!editProfileForm.show && (admin || owner)"
			        @click="editProfileForm.show = !editProfileForm.show"
			        variant="outline-info">Редактировать</b-button>
			      <b-button v-if="editProfileForm.show" @click="editProfile" variant="success">Применить</b-button>
			    </b-card-footer>
			  </b-card>
			</b-col>
    </b-row>
    <b-modal
      hide-header
      centered
      size="md"
      v-model="modalAdminChangePassword.show"
      id="modal-admin-changepassword"
      @ok="adminChangePassword">
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
      @ok="adminChangeUsername">
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
    <b-modal
      centered
      hide-header
      v-model="modalInitPayment.show"
      id="modal-Refill"
      @ok="initPayment">
      <b-input-group class="mb-2">
        <b-form-select
          v-model="modalInitPayment.paymentId"
          :options="modalInitPayment.payments">
        </b-form-select>
        <b-form-input
          v-model="modalInitPayment.summ"
          type="number"
          placeholder="Сумма">
        </b-form-input>
        <b-form-invalid-feedback :state="modalInitPaymentValidation">Сумма должна быть в диапазоне от 10 до 60.000р</b-form-invalid-feedback>
      </b-input-group>
    </b-modal>
  </b-container>
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
      modalInitPayment: {
        show: false,
        payments: ["UNITPAY", "ROBOKASSA"],
        paymentId: "UNITPAY",
        summ: 100.0,
        serverErrorShow: true,
        serverError: "Unknown error",
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
  computed: {
    modalInitPaymentValidation: function () {
      if (
        this.modalInitPayment.summ >= 10.0 &&
        this.modalInitPayment.summ <= 60000.0
      ) {
        return true;
      }
      return false;
    },
  },
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
    initPayment: async function (evt) {
      evt.preventDefault();
      this.modalInitPayment.serverErrorShow = true;
      try {
        var res = await this.$store.dispatch("request", {
          type: "lkInitPayment",
          sum: this.modalInitPayment.summ,
          variant: this.modalInitPayment.paymentId,
        });
        var body = "";
        var isFirst = true;
        for (var k in res.params) {
          if (!isFirst) body += "&";
          else isFirst = false;
          body += k + "=" + encodeURIComponent(res.params[k]);
        }
        console.log(res.redirectUri);
        console.log(body);
        window.location = res.redirectUri + "?" + body;
      } catch (e) {
        console.log(e);
        this.modalInitPayment.serverError = e.error;
        this.modalInitPayment.serverErrorShow = false;
      }
    },
  },
};
</script>