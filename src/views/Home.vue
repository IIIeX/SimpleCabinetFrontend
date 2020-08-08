<template>
  <div class="home">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">
      <b-form-group
        id="input-group-1"
        label="Username:"
        label-for="input-1"
      >
        <b-form-input
          id="input-1"
          v-model="form.username"
          required
          placeholder="Enter username"
        ></b-form-input>
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

      <b-button type="submit" variant="primary">Login</b-button>
    </b-form>
    <b-card class="mt-3" header="Form Data Result">
      <pre class="m-0">{{ form }}</pre>
    </b-card>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  components: {
    HelloWorld
  },
  data() {
      return {
        form: {
          username: '',
          password: ''
        },
        foods: [{ text: 'Select One', value: null }, 'Carrots', 'Beans', 'Tomatoes', 'Corn'],
        show: true
      }
    },
    methods: {
      async onSubmit(evt) {
        evt.preventDefault()
        //alert(JSON.stringify(this.form))
        var res = await this.$root.api.request('auth', { // Авторизация
            login: this.form.username,
            password: {
                password: this.form.password,
                type: "plain"
            },
            auth_id: "std",
            getSession: true,
            authType: "API",
            initProxy: false
        });
            console.log(res);
            localStorage.setItem("authdata", JSON.stringify(res));
            this.$store.commit('onAuth', res);
          var extInfo = await this.$root.api.request('lkExtendedInfo', {});
            console.log(extInfo);
            this.$store.commit('onExtInfo', extInfo);
            this.$router.push("/currentuser");

      },
      onReset(evt) {
        evt.preventDefault()
        // Reset our form values
        this.form.email = ''
        this.form.name = ''
        this.form.food = null
        this.form.checked = []
        // Trick to reset/clear native browser form validation state
        this.show = false
        this.$nextTick(() => {
          this.show = true
        })
      }
    }
}
</script>
