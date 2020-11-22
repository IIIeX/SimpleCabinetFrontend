<template>
  <b-row class="d-flex justify-content-center">
    <b-col col lg="4">
      <b-card
      bg-variant="light"
      class="my-4"
      footer-tag="footer">
        <b-form @submit="onSubmit" @reset="onReset" v-if="show">
          <b-input-group id="input-group-1" label-for="input-1" class="mb-2">
            <b-input-group-prepend is-text>
              <b-icon icon="person-fill" variant="primary"></b-icon>
            </b-input-group-prepend>
            <b-form-input id="input-1" v-model="form.username" autofocus required placeholder="Имя пользователя"></b-form-input>
          </b-input-group>
          <b-input-group id="input-group-2" label-for="input-2" class="mb-2">
            <b-input-group-prepend is-text>
              <b-icon icon="lock-fill" variant="primary"></b-icon>
            </b-input-group-prepend>
            <b-form-input
            id="input-2"
            v-model="form.password"
            type="password"
            required
            placeholder="Пароль"
            ></b-form-input>
          </b-input-group>
          <b-form-invalid-feedback :state="form.serverErrorShow">{{ form.serverError }}</b-form-invalid-feedback>
          <b-form-text align="center">
            <b-button type="submit" variant="primary" class="btn-block">Вход</b-button>
          </b-form-text>
        </b-form>
        <template v-slot:footer>
          <b-form-text align="right">
            <em><b-link @click="modalFogotPassword.show =  !modalFogotPassword.show">Забыли пароль</b-link></em>
          </b-form-text>
        </template>
      </b-card>
    </b-col>
    <b-modal centered v-model="modalRequest2FA.show" id="modal-request2fa" @ok="send2FA" title="2FA Google Authenticator">
      <b-input-group size="lg" class="mb-2">
        <b-input-group-prepend is-text>
          <b-icon icon="shield-lock-fill" variant="primary"></b-icon>
        </b-input-group-prepend>
        <b-form-input v-model="modalRequest2FA.totp" type="text" maxlength="6" placeholder="123456" v-on:keydown.enter.prevent='send2FA' autofocus></b-form-input>
        <b-form-invalid-feedback
        :state="modalRequest2FA.serverErrorShow"
        >{{ modalRequest2FA.serverError }}</b-form-invalid-feedback>
      </b-input-group>
    </b-modal>
    <b-modal hide-header centered v-model="modalFogotPassword.show" id="modal-fogotpassword" @ok="sendFogotPassword">
      <h6>Для восстановления доступа укажите ваш email</h6>
      <b-input-group size="lg" class="mb-2">
        <b-input-group-prepend is-text>
          <b-icon icon="envelope-fill" variant="primary"></b-icon>
        </b-input-group-prepend>
        <b-form-input v-model="modalFogotPassword.email" type="email" placeholder="email@address.ru" v-on:keydown.enter.prevent='sendFogotPassword' autofocus></b-form-input>
      </b-input-group>
    </b-modal>
  </b-row>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  data() {
    return {
      form: {
        username: "",
        password: "",
        serverError: null,
        serverErrorShow: true,
      },
      modalRequest2FA: {
        totp: null,
        show: false,
        serverError: null,
        serverErrorShow: true,
      },
      modalFogotPassword: {
        email: null,
        show: false
      },
      show: true,
    };
  },
  methods: {
    async onSubmit(evt) {
      evt.preventDefault();
      this.form.serverErrorShow = true;
      //alert(JSON.stringify(this.form))
      try {
        await this.$store.dispatch("requestAuth", {
          login: this.form.username,
          password: this.form.password,
          authId: "std",
        });
        await this.$store.dispatch("requestExtInfo", {});
      } catch (e) {
        if (e.error == "auth.require2fa") {
          this.modalRequest2FA.show = true;
          this.$nextTick(function() { this.$refs.modal2FAinput.focus(); });
          return;
        }
        console.log(e);
        this.form.serverError = e.error;
        this.form.serverErrorShow = false;
        return;
      }
      this.$router.push("/user");
    },
    async send2FA(evt) {
      evt.preventDefault();
      try {
        await this.$store.dispatch("requestAuthWith2FA", {
          login: this.form.username,
          password: this.form.password,
          totp: this.modalRequest2FA.totp,
          authId: "std",
        });
        await this.$store.dispatch("requestExtInfo", {});
      } catch (e) {
        this.modalRequest2FA.serverError = e.error;
        this.modalRequest2FA.serverErrorShow = false;
        return;
      }
      this.$router.push("/user");
    },
    async sendFogotPassword(evt) {
      evt.preventDefault();
      try {
        let result = await this.$store.dispatch("request", {
          type: "lkPasswordReset",
          email: this.modalFogotPassword.email,
        });
        console.log(result);
      } catch (e) {
        console.log(e);
        return;
      }
    },
    onReset(evt) {
      evt.preventDefault();
      // Reset our form values
      this.form.email = "";
      this.form.name = "";
      this.form.food = null;
      this.form.checked = [];
      // Trick to reset/clear native browser form validation state
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
  },
};
</script>