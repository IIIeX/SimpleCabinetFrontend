<template>
  <Wait>
  </Wait>
</template>
<script>
import Wait from "@/components/Wait.vue"
export default {
  components: {Wait},
  created: async function () {
    try {
      await this.$store.state.api.promises.auth;
      this.$router.push("/currentuser");
    } catch (error) {
      this.$router.push("/login");
    }
  },
};
</script>