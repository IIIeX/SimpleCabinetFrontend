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
      this.$router.push("/user");
    } catch (error) {
      this.$router.push("/login");
    }
  },
};
</script>
<style lang="sass">
img.pixelated
    image-rendering: pixelated
</style>
