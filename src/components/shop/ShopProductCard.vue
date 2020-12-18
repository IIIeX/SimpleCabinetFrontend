<template>
        <b-card no-body class="shadow" overlay>
          <b-card-header class="d-flex align-items-center justify-content-between">
            <strong class="text-info">{{ model.name }}</strong>
            <b-icon v-if="model.description" icon="info-circle-fill" variant="info" scale="1.5" :id="model.name"></b-icon>
          </b-card-header>
          <b-card-body class="d-flex align-items-center justify-content-between">
            <b-list-group>
              <b-list-group-item class="d-flex justify-content-between align-items-center">
                <b-icon icon="alarm-fill" variant="danger"></b-icon>
              </b-list-group-item>
              <b-list-group-item class="d-flex justify-content-between align-items-center">
                <b-icon icon="collection-fill" variant="danger"></b-icon>
              </b-list-group-item>
            </b-list-group>
            <b-img-lazy left width="64" :src="model.pictureUrl ? model.pictureUrl : 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/a/af/Apple_JE3_BE3.png'"></b-img-lazy>
            <b-form-spinbutton v-model="formQuantity" min="1" max="100" vertical></b-form-spinbutton>
          </b-card-body>
          <b-card-footer class="d-flex flex-row-reverse">
            <b-input-group size="sm">
              <b-input-group-prepend>
                <b-input-group-text><b-icon icon="cash-stack" aria-hidden="true"></b-icon></b-input-group-text>
              </b-input-group-prepend>
             <b-form-input disabled :placeholder="(formQuantity*model.price).toFixed(2) + ' руб.'"></b-form-input>
              <b-input-group-append>
                <b-button variant="success" @click="createOrder()" v-if="this.$store.state.user.uuid">
                  <b-icon icon="bag-plus"></b-icon>
                </b-button>
              </b-input-group-append>
            </b-input-group>
          </b-card-footer>
            <b-tooltip :target="model.name">
              <p>{{ model.description }}</p>
            </b-tooltip>
        </b-card>
</template>
<script>
export default {
    props: ["model"],
    computed: {},
    data: function() {
        return {
            formQuantity: 1
        };
    },
    methods: {
        createOrder: async function() {
            var res = await this.$store.dispatch("request", {
                type: "lkCreateOrder",
                productId: this.model.id,
                quantity: this.formQuantity
            });
            console.log(res);
        }
    }
}
</script>