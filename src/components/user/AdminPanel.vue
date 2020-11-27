<template>
  <b-dropdown variant="light" menu-class="w-100">
    <template #button-content>
      <b-icon icon="gear-fill" aria-hidden="true"></b-icon> администрирование
    </template>
    <b-dropdown-item
      variant="danger"
      @click="modalAdminChangePassword.show = !modalAdminChangePassword.show"
      >Сменить пароль</b-dropdown-item
    >
    <b-dropdown-item
      variant="danger"
      @click="modalAdminChangeUsername.show = !modalAdminChangeUsername.show"
      >Сменить имя пользователя</b-dropdown-item
    >
    <b-dropdown-item
      v-if="user.ext.privateUserZone.enabled2FA"
      variant="danger"
      @click="adminDisable2FA()"
      >Отключить 2FA</b-dropdown-item
    >
    <b-dropdown-item
      variant="danger"
      @click="adminExitUser()"
      >Завершить все сессии</b-dropdown-item
    >
    <b-dropdown-item
      variant="danger"
      @click="modalBanUser.show = !modalBanUser.show"
      >Заблокировать</b-dropdown-item
    >

    <HardwareInfo :user="user" />

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
    <b-modal
      hide-header
      centered
      size="md"
      v-model="modalBanUser.show"
      id="modal-admin-changeusername"
      @ok="adminBanUser"
    >
      <h2>Вы хотите забанить <span><b>{{ user.username }}</b></span>?</h2>
      <p v-if="(user.permissions & 1) != 0"><span style="color: #f00;">Пользователь является администратором</span></p>
      <p v-if="user.username == this.$store.state.user.username"><span style="color: #f00;">ЭТОТ ПОЛЬЗОВАТЕЛЬ - ВЫ</span></p>
      <p>{{ user.ext.gender == "FEMALE" ? "Она" : user.ext.gender == "MALE" ? "Он" : "Этот пользователь" }} не сможет войти в лаунчер и личный кабинет, а все активные сессии будут завершены немедленно</p>
      <b-input-group class="mb-2">
        <b-form-checkbox v-model="modalBanUser.hardware"
          >Забанить по железу</b-form-checkbox
        >
      </b-input-group>
      <p v-if="modalBanUser.hardware">Блокировка по железу затронет все аккаунты, которые разделяют один HardwareInfo с {{ user.ext.gender == "FEMALE" ? "ней" : user.ext.gender == "MALE" ? "ним" : "этим пользователем" }}</p>
    </b-modal>
  </b-dropdown>
</template>
<script>
import HardwareInfo from "@/components/user/HardwareInfo";
export default {
  props: ["user"],
  components: { HardwareInfo },
  data: function () {
    return {
      modalAdminChangeUsername: {
        show: false,
        newUsername: null,
      },
      modalAdminChangePassword: {
        show: false,
        newPassword: null,
      },
      modalBanUser: {
        show: false,
        hardware: false
      },
    };
  },
  methods: {
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
    adminBanUser: async function (evt) {
      evt.preventDefault();
      var res = await this.$store.dispatch("request", {
        type: "lkBanUser",
        userUsername: this.user.username,
      });
      console.log(res);
      this.modalBanUser.show = false;
    },
    adminExitUser: async function () {
      var res = await this.$store.dispatch("request", {
        type: "exit",
        exitAll: true,
        username: this.user.username,
      });
      console.log(res);
    }
  },
};
</script>