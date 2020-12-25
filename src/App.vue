<template>
  <div id="app" class="d-flex flex-column h-100">
    <b-navbar toggleable="lg" type="dark" style="background-color: rgba(0,0,0,0.75);">
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
          <b-nav-item to="/shop">Магазин</b-nav-item>
          <b-nav-item v-if="!this.$store.state.user.uuid" to="/login">Войти</b-nav-item>
          <b-nav-item v-if="!this.$store.state.user.uuid" to="/register">Регистрация</b-nav-item>
          <b-nav-item to="/users">Пользователи</b-nav-item>
          <b-nav-item v-if="this.$store.state.user.uuid" to="/user">Личный кабинет</b-nav-item>
          <b-nav-item v-if="this.$store.state.user.uuid" @click="exitAccount">Выход</b-nav-item>
          <b-nav-item to="/devtools" v-if="this.$store.state.config.devtools">DEV</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <router-view></router-view>
    <template>
        <footer class="footer mt-auto py-1" style="background-color: rgba(0,0,0,0.75);">
          <b-row class="d-flex mx-0 text-light">
            <b-col col md class="text-center">
            </b-col>
            <b-col col md class="text-center">
              <b-form-text>Created by Gravit'a @SimpleCabinet</b-form-text>
            </b-col>
            <b-col col md class="text-center">
            </b-col>
          </b-row>
        </footer>
    </template>
  </div>
</template>
<script>
export default {
  methods: {
    exitAccount: async function () {
      await this.$store.dispatch("request", {
        type: "exit",
      });
      this.$store.commit("exit");
      this.$router.push("/");
    },
  },
  mounted: function () {
    console.log("SimpleCabinet by Gravit'a 1.0.0");
    console.log("License MIT, docs and source code: https://github.com/SimpleCabinet/SimpleCabinetPublicDocs");
    var instance = this;
    this.$store.state.api.callbacks.onclose = function (error) {
      if (error.wasClean) return;
      console.log(error);
      instance.serverconnect.code = error.code;
      instance.serverconnect.connected = false;
    };
    this.$store.state.api.callbacks.onerror = this.$store.state.api.callbacks.onclose;
    this.serverconnect.handler = function(event) {
      console.log(event);
      if(event.type == "notification") {
        instance.$bvToast.toast(event.message, {
          title: event.head,
          variant: "primary",
          autoHideDelay: 15000,
        });
      }
      else if(event.type == "userInfo") {
        instance.$store.commit("onUserInfo", event.userInfo);
      }
      else if(event.type == "exit") {
        if(event.reason != "NO_EXIT") {
          instance.$store.commit("exit");
        }
      }
      else if(event.type == "lkOrderStatusChanged") {
        var header = "Изменен статус заказа #"+event.orderId;
        var variant = event.newStatus == "FAILED" ? "danger" : event.newStatus == "FINISHED" ? "success" : "primary";
        var message;
        if(event.newStatus == "FAILED") {
          message = "Произошла ошибка при обработке заказа. Обратитесь к администратору";
        }
        else if(event.newStatus == "FINISHED") {
          message = "Заказ успешно завершен";
        }
        else if(event.newStatus == "DELIVERY") {
          message = "Заказ ожидает вас";
        }
        else {
          message = "Статус заказа: "+event.newStatus;
        }
        instance.$bvToast.toast(message, {
          title: header,
          variant: variant,
          autoHideDelay: 60000,
        });
      }
    };
    this.$store.state.api.handlers.add(this.serverconnect.handler);
  },
  beforeDestroy: function() {
    this.$store.state.api.handlers.delete(this.serverconnect.handler);
  },
  data: function () {
    return {
      serverconnect: {
        connected: true,
        code: -1,
        handler: null
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
  color: #2c3e50;
}
</style>
