<template>
  <b-container>
    <ShopPaymentInitButton />
    <b-button
      variant="danger"
      @click="$store.commit('onPermissions', { permissions: 1, flags: 0 })"
      >GiveFakeAdmin</b-button
    >
    <b-form-input v-model="username"></b-form-input>
    <b-button variant="danger" @click="fakeAuth()">FakeAuth</b-button>
  </b-container>
</template>
<script>
import ShopPaymentInitButton from "../components/shop/ShopPaymentInitButton.vue";
export default {
  components: { ShopPaymentInitButton },
  data: function () {
    return {
      username: "Username",
    };
  },
  methods: {
    fakeAuth: function () {
      this.$store.commit("onUserInfo", {
        permissions: {
          permissions: 0,
          flags: 0,
        },
        playerProfile: {
            username: this.username,
            uuid: "00000000-0000-0000-0000-000000000000",
        }
      });
      var store = this.$store;
      this.$store.state.api.promises.auth = new Promise(function (
        resolve,
        reject
      ) {
        store.state.api.promises.auth_resolve = resolve;
        store.state.api.promises.auth_reject = reject;
      });
      this.$store.state.api.promises.auth_resolve();
    },
  },
};
</script>