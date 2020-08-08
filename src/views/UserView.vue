<template>
  <div class="about">
    <img :src="user.skin"/>
    <h1>{{ user.username }}</h1>
    <font v-if="user.uuid">UUID: {{ user.uuid }}<br></font>
    <font v-if="user.ext.gender">Пол: {{ user.ext.gender }}<br></font>
    <font v-if="user.ext.email">EMail: {{ user.ext.email }}<br></font>
    <font v-if="user.ext.status">Статус: {{ user.ext.status }}<br></font>
    <font v-if="user.ext.economyMoney > 0">Денег: {{ user.ext.economyMoney }}<br></font>
    <font v-if="user.ext.donateMoney > 0">Донат: {{ user.ext.donateMoney }}</font>
    <b-button v-if="owner" variant="primary" @click="uploadSkin()">Загрузить скин</b-button>
    <b-button v-if="owner" variant="primary" @click="uploadCloak()">Загрузить плащ</b-button>
  </div>
</template>
<script>
//import { mapState } from 'vuex';
export default {
  props: ["user", "owner", "admin"],
  //computed: mapState({
  //  user: state => state.user
  //})
  methods:  {
      uploadSkin: async function() {
        const data = await this.readFileToBase64();
        var result = await this.$root.api.request('lkUploadSkin', {
          skinType: "SKIN",
          data: data.split('+').join('-').split('/').join('_')
        });
        console.log(result);
      },
      uploadCloak: async function() {
        const data = await this.readFileToBase64();
        var result = await this.$root.api.request('lkUploadSkin', {
          skinType: "CLOAK",
          data: data.split('+').join('-').split('/').join('_')
        });
        console.log(result);
      },
      readFileToBase64: async function() {
        return new Promise((resolve, reject) => {
          var input = document.createElement('input');
          input.type = 'file';
          input.accept = "image/png";
          input.click();
          input.onchange = function(e) {
            // getting a hold of the file reference
            var file = e.target.files[0]; 

            // setting up the reader
            var reader = new FileReader();
            reader.readAsArrayBuffer(file);

            // here we tell the reader what to do when it's done reading...
            reader.onload = readerEvent => {
              var content = readerEvent.target.result; // this is the content!
              let base64String = btoa(String.fromCharCode(...new Uint8Array(content)));
              resolve( base64String );
            }
            reader.onerror = error => {
              reject ( error );
            }
          };
        })
      }
  }
}
</script>