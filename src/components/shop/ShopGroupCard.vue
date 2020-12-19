<template>
        <b-card no-body class="shadow">
          <b-card-header class="d-flex align-items-center justify-content-between">
            <strong class="text-info">{{ model.name }}</strong>
            <span v-if="true">
              <b-icon icon="info-circle-fill" variant="info" scale="1.5" :id="model.name"></b-icon>
              <b-tooltip :target="model.name">
                <span>Время окончания акции.</span><br/>
                <span>Кол-во доступных заказов.</span>
              </b-tooltip>
            </span>
          </b-card-header>
          <b-card-body v-if="model.description">
            <b-card-text>{{ model.description }}</b-card-text>
          </b-card-body>
          <b-card-footer>
            <b-form-group v-slot="{ asdasdasd }">
              <b-form-radio v-model="formQuantity" :aria-describedby="asdasdasd" :name="model.name" value="1" selected>1 день</b-form-radio>
              <b-form-radio v-model="formQuantity" :aria-describedby="asdasdasd" :name="model.name" value="7">7 дней</b-form-radio>
              <b-form-radio v-model="formQuantity" :aria-describedby="asdasdasd" :name="model.name" value="30">30 дней</b-form-radio>
            </b-form-group>
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