<template>
    <img class="pixelated" style="width: 100%" ref="img"/>
</template>
<script>
export default {
    mounted: function() {
    },
    methods: {
        draw: function(skinurl) {
        var canvas = document.createElement("canvas");
        var context = canvas.getContext('2d');
        var img = new Image();
        img.crossOrigin = "anonymous";
        var result = this.$refs.img;
        img.onload = function() {
            var scale = img.naturalWidth / 64;
            var headpos = scale*8;
            canvas.width = headpos;
            canvas.height = headpos;
            context.drawImage(img, headpos /*sourceX*/, headpos /*sourceX*/, headpos /*sourceWidth*/ , headpos /*sourceHeight*/,
                           0 /*destX*/, 0/*destY*/, headpos /*destWidth*/, headpos /*destHeight*/);
            result.src = canvas.toDataURL("image/png");
        };
        img.src = skinurl;
        }
    },
}
</script>
<style scoped>

</style>