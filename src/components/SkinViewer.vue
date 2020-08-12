<template>
  <div ref="skinview3dinst"></div>
</template>
<script>
import * as skinview3d from "skinview3d"
export default {
  props: ["skinUrl", "cloakUrl"],
  mounted: function () {
      console.log(this.skinUrl);
    let skinViewer = new skinview3d.SkinViewer(this.$refs.skinview3dinst, {
      width: 300,
      height: 400,
      skin: this.skinUrl,
    });
    const control = skinview3d.createOrbitControls(skinViewer);
    control.enableRotate = true;
    skinViewer;
  },
};
</script>