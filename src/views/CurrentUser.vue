<template>
  <UserView :user="user" :owner="true" :admin="(user.permissions & 1) != 0" />
</template>
<script>
import UserView from "@/components/UserView.vue";
export default {
  components: { UserView },
  computed: {
    user: function () {
      return this.$store.state.user;
    },
    uuid: function () {
      return this.$store.state.user.uuid;
    }
  },
  data: function () {
    return {

    };
  },
  watch: {
    uuid: function (newUuid, oldUuid) {
      if (!newUuid && oldUuid) {
        this.$router.push("/login");
      }
    },
  },
  created: async function() {
    try {
      await this.$store.state.api.promises.auth;
    } catch (error) {
      this.$router.push("/login");
    }
  },
  methods: {
    
  },
};
</script>