<template>
  <div class="home">
    <b-row class="d-flex justify-content-center" align-v="center">
      <b-col col lg="4">
        <b-card
          bg-variant="light"
          title="Имя"
          class="my-2">
          <b-form @submit="onSubmit" @reset="onReset" v-if="show">
            <b-form-group id="input-group-1" label="Username:" label-for="input-1">
              <b-form-input id="input-1" v-model="form.username" required placeholder="Enter username"></b-form-input>
            </b-form-group>
            <b-form-group id="input-group-2" label="Password:" label-for="input-2">
              <b-form-input
                id="input-2"
                v-model="form.password"
                type="password"
                required
                placeholder="Enter password"
              ></b-form-input>
            </b-form-group>
            <b-form-invalid-feedback :state="form.serverErrorShow">{{ form.serverError }}</b-form-invalid-feedback>
            <b-form-text align="center">
              <b-button type="submit" variant="primary">Вход</b-button>
            </b-form-text>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
    <b-modal v-model="modalRequest2FA.show" id="modal-request2fa" @ok="send2FA">
      <b-form-input v-model="modalRequest2FA.totp" type="text" placeholder="Ключ из приложения"></b-form-input>
      <b-form-invalid-feedback
        :state="modalRequest2FA.serverErrorShow"
      >{{ modalRequest2FA.serverError }}</b-form-invalid-feedback>
    </b-modal>
  </div>
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
          return;
        }
        console.log(e);
        this.form.serverError = e.error;
        this.form.serverErrorShow = false;
        return;
      }
      this.$router.push("/currentuser");
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
      this.$router.push("/currentuser");
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
