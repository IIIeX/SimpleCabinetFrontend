<template>
  <div>
    <b-row class="d-flex justify-content-center">
      <b-col col lg="4">
        <b-card bg-variant="light" class="my-4" footer-tag="footer">
          <b-form @submit="onSubmit" v-if="form.show">
            <b-form-group id="input-group-1" label-for="input-1">
              <b-form-input
                id="input-1"
                v-model="form.password"
                type="password"
                required
                placeholder="Пароль"
              ></b-form-input>
            </b-form-group>
            <b-form-group id="input-group-2" label-for="input-2">
              <b-form-input
                id="input-2"
                v-model="form.passwordRetry"
                type="password"
                required
                placeholder="Повторите пароль"
              ></b-form-input>
              <b-form-invalid-feedback :state="passwordRetryValidation"
                >Пароли не совпадают</b-form-invalid-feedback
              >
              <b-form-invalid-feedback :state="form.serverErrorShow">{{
                form.serverError
              }}</b-form-invalid-feedback>
            </b-form-group>
            <b-form-text align="center">
              <b-button type="submit" variant="primary" class="btn-block"
                >Сброс пароля</b-button
              >
            </b-form-text>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>
<script>
export default {
  props: ["id", "uuid"],
  data: function () {
    return {
      form: {
        password: "",
        passwordRetry: "",
        validate: true,
        serverError: "",
        serverErrorShow: false,
        show: true,
      },
    };
  },
  computed: {
    passwordRetryValidation: function () {
      return this.form.password == this.form.passwordRetry;
    },
  },
  methods: {
    async onSubmit(evt) {
      evt.preventDefault();
      this.form.serverErrorShow = true;
      try {
        var res = await this.$store.dispatch("request", {
          type: "lkPasswordResetApply",
          id: this.id,
          uuid: this.uuid,
          newPassword: this.form.password,
        });
      } catch (e) {
        console.log(e);
        this.form.serverError = e.error;
        this.form.serverErrorShow = false;
        return;
      }
      this.$router.push("/login");
      console.log(res);
    },
  },
};
</script>