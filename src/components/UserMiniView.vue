<template>
  <b-card>
    <b-card-header class="d-flex align-items-center justify-content-between">
      <strong class="text-info">{{ user.username }}</strong>
    </b-card-header>
    <b-card-body>
      <b-img :src="this.skinurl" fluid></b-img>
      <b-alert show variant="secondary">UUID: {{ user.uuid }}</b-alert>
      <b-alert show variant="success"
        >Пол:
        {{
          user.gender == "FEMALE"
            ? "Женский"
            : user.gender == "MALE"
            ? "Мужской"
            : "Не указан"
        }}</b-alert
      >
      <b-button variant="primary" @click="followUser()"
        >Перейти к профилю</b-button
      >
    </b-card-body>
  </b-card>
</template>
<script>
export default {
  data: function () {
    return {
      skinurl: null,
      cloakurl: null,
    };
  },
  props: ["user"],
  mounted: async function() {
      this.fetchUserSkinInfo();
  },
  methods: {
    followUser: function () {
      this.$router.push("/user/name/" + this.user.username);
    },
    fetchUserSkinInfo: async function () {
      var info = await this.$store.dispatch("request", {
        type: "profileByUUID",
        uuid: this.user.uuid,
      });
      console.log(info);
      if(info.playerProfile.skin)
        this.skinurl = info.playerProfile.skin.url;
    },
  },
};
</script>