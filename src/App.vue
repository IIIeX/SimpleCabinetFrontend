<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand to="/">SimpleCabinet</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item v-if="!this.$store.state.user.uuid" to="/login">Войти</b-nav-item>
          <b-nav-item v-if="!this.$store.state.user.uuid" to="/register">Регистрация</b-nav-item>
          <b-nav-item v-if="this.$store.state.user.uuid" to="/currentuser">Личный кабинет</b-nav-item>
          <b-nav-item v-if="this.$store.state.user.uuid" @click="exitAccount">Выход</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-container>
    <router-view/>
    </b-container>
  </div>
</template>
<script>
export default {
  methods: {
    exitAccount: async function() {
      var res = await this.$store.dispatch('request', {
        type: 'exit'
      });
      console.log(res);
      this.$store.commit('exit');
      this.$router.push("/");
    }
  }
}
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
