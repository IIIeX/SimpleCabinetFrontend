import Vue from 'vue'
import Vuex from 'vuex'
import GravitApi from "gravit-api"

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {
      username: "Player",
      uuid: undefined,
      permissions: 0,
      flags: 0,
      skin: undefined,
      cloak: undefined,
      ext: {
        gender: undefined,
        status: undefined,
        email: undefined,
        economyMoney: 0,
        donateMoney: 0,
        extendedMoney: 0,
        isBanned: false
      }
    },
    api: new GravitApi()
  },
  mutations: {
    onAuth(state, event) {
      state.user.username = event.playerProfile.username;
      state.user.uuid = event.playerProfile.uuid;
      state.user.skin = event.playerProfile.skin == undefined ? undefined : event.playerProfile.skin.url;
      state.user.cloak = event.playerProfile.cloak == undefined ? undefined : event.playerProfile.cloak.url;
      state.user.permissions = event.permissions.permissions;
      state.user.flags = event.permissions.flags;
    },
    onExtInfo(state, event) {
      state.user.ext.gender = event.gender;
      state.user.ext.status = event.status;
      state.user.ext.email = event.email;
      state.user.ext.economyMoney = event.economyMoney;
      state.user.ext.donateMoney = event.donateMoney;
      state.user.ext.extendedMoney = event.extendedMoney;
      state.user.ext.isBanned = event.isBanned;
    },
    exit(state) {
      state.user = {
        ext: {}
      };
    }
  },
  actions: {
    requestExtInfo: async function (context) {
      var res = await context.dispatch('request',{type:'lkExtendedInfo'});
      context.commit('onExtInfo', res);
    },
    requestAuth: async function (context, {login, password, authId}) {
      var res = await context.dispatch('request', { // Авторизация
        type: 'auth',
        login: login,
        password: {
          password: password,
          type: "plain"
        },
        auth_id: authId,
        getSession: true,
        authType: "API",
        initProxy: false
      });
      localStorage.setItem("authdata", JSON.stringify(res));
      context.commit('onAuth', res);
    },
    requestExit: async function (context, exitAll) {
      var res = await context.state.api.request('exit', { exitAll });
      context.commit('exit', res);
    },
    request: async function (context, data) {
      await context.state.api.onopen_promise;
      console.log(data);
      return new Promise(function(resolve, reject) {
          context.state.api.sendRequest(data.type, data, resolve, reject);
      });
    }
  },
  modules: {
  }
})
