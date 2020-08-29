<template>
  <div ref="skinview3dinst"></div>
</template>
<script>
import * as skinview3d from "skinview3d"
export default {
  props: ["skinUrl", "cloakUrl"],
  data: function() {
      return {
          skinViewer: null
      };
  },
  mounted: function () {
    console.log(this.skinUrl);
    this.skinViewer = new skinview3d.SkinViewer(this.$refs.skinview3dinst, {
      width: 300,
      height: 400,
      skin: this.skinUrl,
      cape: this.cloakUrl
    });
    const control = skinview3d.createOrbitControls(this.skinViewer);
    control.enableRotate = true;
  },
  watch: {
      skinUrl: function(newSkinUrl) {
          this.skinViewer.loadSkin(newSkinUrl);
      },
      cloakUrl: function(newCloakUrl) {
          this.skinViewer.loadCape(newCloakUrl);
      }
  }
};
</script>
