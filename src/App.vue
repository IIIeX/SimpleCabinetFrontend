<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand to="/">SimpleCabinet</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item v-if="!this.serverconnect.connected">
            <b-icon id="iconserverconnectfail" variant="danger" icon="bar-chart-fill"></b-icon>
            <b-tooltip
              target="iconserverconnectfail"
              triggers="hover"
            >Ошибка при попытке соедениться с сервером (Код: {{ serverconnect.code }})</b-tooltip>
          </b-nav-item>
          <b-nav-item v-if="!this.$store.state.user.uuid" to="/login">Войти</b-nav-item>
          <b-nav-item v-if="!this.$store.state.user.uuid" to="/register">Регистрация</b-nav-item>
          <b-nav-item v-if="this.$store.state.user.uuid" to="/currentuser">Личный кабинет</b-nav-item>
          <b-nav-item v-if="this.$store.state.user.uuid" @click="exitAccount">Выход</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <b-container>
      <router-view />
    </b-container>
  </div>
</template>
<script>
export default {
  methods: {
    exitAccount: async function () {
      var res = await this.$store.dispatch("request", {
        type: "exit",
      });
      console.log(res);
      this.$store.commit("exit");
      this.$router.push("/");
    },
  },
  mounted: function () {
    var instance = this;
    this.$store.state.api.callbacks.onclose = function (error) {
      if (error.wasClean) return;
      console.log(error);
      instance.serverconnect.code = error.code;
      instance.serverconnect.connected = false;
    };
    this.$store.state.api.callbacks.onerror = this.$store.state.api.callbacks.onclose;
  },
  data: function () {
    return {
      serverconnect: {
        connected: true,
        code: -1,
      },
    };
  },
};
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
