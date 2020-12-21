<template>
  <b-card no-body>
    <template #header>
      <strong>{{ user.username }}</strong>
    </template>
    <b-card-body>
      <b-alert
        show
        variant="light"
        align="center"
      >
        <b-img-lazy
        height="64"
        class="pixelated"
        :src="
          this.skinurl
          ? this.skinurl
          : 'http://assets.mojang.com/SkinTemplates/steve.png'">
        </b-img-lazy>
      </b-alert>
      <b-card-sub-title>UUID:</b-card-sub-title>
      <b-alert show>{{ user.uuid }}</b-alert>
      <b-card-sub-title>Пол:</b-card-sub-title>
      <b-alert show>
        {{
          user.gender == "FEMALE"
            ? "Женский"
            : user.gender == "MALE"
            ? "Мужской"
            : "Не указан"
        }}</b-alert>
    </b-card-body>
    <b-card-footer class="p-0">
      <b-button
      class="btn-block"
      variant="info"
      squared
      @click="followUser()"
      >Открыть профиль</b-button>
    </b-card-footer>
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
