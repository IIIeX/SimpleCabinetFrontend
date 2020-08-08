import Vue from 'vue'
import Vuex from 'vuex'

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
    }
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
    }
  },
  actions: {
  },
  modules: {
  }
})
