<template>
  <div class="loading">
    <b-row class="justify-content-md-center">
      <b-col col md="6" class="my-4">
        <b-alert variant="success" align="center" show>
          <h4>Подождите, выполняем вход...</h4>
        </b-alert>
      </b-col>
    </b-row>
  </div>
</template>
<script>
export default {
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