<template>
  <b-dropdown variant="light" menu-class="w-100">
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
    <b-dropdown-item
      variant="danger"
      @click="adminExitUser()"
      >Завершить все сессии</b-dropdown-item>
    <b-dropdown-item
      variant="danger"
      @click="modalBanUser.show = !modalBanUser.show"
      >Заблокировать</b-dropdown-item>
    <HardwareInfo :user="user" />
    <b-modal
      centered
      size="md"
      ok-variant="danger"
      v-model="modalAdminChangePassword.show"
      id="modal-admin-changepassword"
      @ok="adminChangePassword">
      <template #modal-title>
        Сменить пароль <strong>{{ user.username }}</strong>?
      </template>
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
      centered
      size="md"
      ok-variant="danger"
      v-model="modalAdminChangeUsername.show"
      id="modal-admin-changeusername"
      @ok="adminChangeUsername">
      <template #modal-title>
        Сменить имя <strong>{{ user.username }}</strong>?
      </template>
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
      size="md"
      ok-variant="danger"
      v-model="modalBanUser.show"
      @ok="adminBanUser">
      <template #modal-title>
        Вы хотите забанить <strong>{{ user.username }}</strong>?
      </template>
      <b-alert v-if="(user.permissions & 1) != 0" variant="danger" align="center" show>
        <strong>Пользователь является администратором</strong>
      </b-alert>
      <b-alert v-if="user.username == this.$store.state.user.username" variant="danger" align="center" show>
        <strong>ЭТОТ ПОЛЬЗОВАТЕЛЬ - ВЫ</strong>
      </b-alert>
      <b-alert v-if="user.username == this.$store.state.user.username" variant="warning" show>
        {{ user.ext.gender == "FEMALE" ? "Она" : user.ext.gender == "MALE" ? "Он" : "Этот пользователь" }} не сможет войти в лаунчер и личный кабинет, а все активные сессии будут завершены немедленно.
      </b-alert>
      <b-input-group class="mb-2">
        <b-form-checkbox v-model="modalBanUser.hardware">Забанить по железу</b-form-checkbox>
      </b-input-group>
      <b-alert v-if="modalBanUser.hardware" variant="danger" show>
        Блокировка по железу затронет все аккаунты, которые разделяют один <strong>HardwareInfo</strong> с {{ user.ext.gender == "FEMALE" ? "ней" : user.ext.gender == "MALE" ? "ним" : "этим пользователем" }}
      </b-alert>
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
