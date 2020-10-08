<template>
  <div>
    <b-row class="d-flex justify-content-center">
      <b-col col lg="4">
        <b-card
        bg-variant="light"
        class="my-4">
          <b-form @submit="onSubmit" v-if="show">
            <b-form-group id="input-group-1" label-for="input-1">
              <b-form-input id="input-1" v-model="form.username" required placeholder="Имя пользователя"></b-form-input>
              <b-form-text>логин</b-form-text>
            </b-form-group>
            <b-form-group id="input-group-2" label-for="input-2">
              <b-form-input
                id="input-2"
                v-model="form.password"
                type="password"
                required
                placeholder="Пароль"
              ></b-form-input>
              <b-form-text>рекомендуется минимум 8 символов</b-form-text>
            </b-form-group>
            <b-form-group id="input-group-3" label-for="input-2">
              <b-form-input
                id="input-3"
                v-model="form.email"
                type="email"
                required
                placeholder="email@example.ru"
              ></b-form-input>
              <b-form-text>электронная почта</b-form-text>
            </b-form-group>
            <b-form-invalid-feedback :state="form.serverErrorShow">{{ form.serverError }}</b-form-invalid-feedback>
            <b-button type="submit" variant="primary" class="btn-block">Регистрация</b-button>
          </b-form>
        </b-card>
      </b-col>
    </b-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
        email: "",
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
      try {
        var res = await this.$store.dispatch("request", {
          type: "lkRegister",
          username: this.form.username,
          email: this.form.email,
          password: this.form.password,
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