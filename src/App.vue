<template>
  <div id="app">
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-brand to="/">GravitLauncher Wiki</b-navbar-brand>
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown text="Разделы" right>
            <b-dropdown-item to="/">Главная</b-dropdown-item>
            <b-dropdown-item to="/authprovider">AuthProvider</b-dropdown-item>
            <b-dropdown-item to="/authhandler">AuthHandler</b-dropdown-item>
            <b-dropdown-item to="/protection">Защита</b-dropdown-item>
            <b-dropdown-item to="/clientbuild">Сборка клиента</b-dropdown-item>
            <b-dropdown-item to="/serverbuild">Сборка сервера</b-dropdown-item>
          </b-nav-item-dropdown>
          <b-nav-item-dropdown text="Разработчикам" right>
            <b-dropdown-item to="/developerapi">Написание модулей</b-dropdown-item>
            <b-dropdown-item to="/runtimeapi">Редактирование runtime</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <router-view/>
  </div>
</template>
<script>
export default {
  
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
