<template>
  <b-card no-body class="shadow">
    <b-card-header class="d-flex align-items-center justify-content-between">
      <strong class="text-info">{{ model.name }}</strong>
      <span v-if="model.description">
        <b-icon
          icon="info-circle-fill"
          variant="info"
          scale="1.5"
          :id="model.name"
        ></b-icon>
        <b-tooltip :target="model.name">
          <p>{{ model.description }}</p>
        </b-tooltip>
      </span>
    </b-card-header>
    <b-card-body align="center">
      <b-img-lazy
        width="64"
        :src="
          model.pictureUrl
            ? model.pictureUrl
            : 'https://static.wikia.nocookie.net/minecraft_gamepedia/images/a/af/Apple_JE3_BE3.png'
        "
      ></b-img-lazy>
      <b-form-spinbutton
        v-model="formQuantity"
        min="1"
        max="100"
        class="mt-2"
      ></b-form-spinbutton>
    </b-card-body>
    <b-card-footer align="center">
      <b-list-group flush class="mb-2">
        <b-list-group-item v-if="model.count >= 0" variant="danger" class="p-1">
          <small>Осталось {{ model.count }} штук.</small>
        </b-list-group-item>
        <b-list-group-item v-if="model.endDate ? true : false" variant="danger" class="p-1">
          <small>Осталось {{ endDateDays }} дней.</small>
        </b-list-group-item>
      </b-list-group>
      <b-input-group size="sm">
        <b-input-group-prepend>
          <b-input-group-text
            ><b-icon icon="cash-stack" aria-hidden="true"></b-icon
          ></b-input-group-text>
        </b-input-group-prepend>
        <b-form-input
          disabled
          :placeholder="(formQuantity * model.price).toFixed(2) + ' руб.'"
        ></b-form-input>
        <b-input-group-append>
          <b-button
            variant="success"
            @click="createOrder()"
            v-if="this.$store.state.user.uuid"
          >
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
  computed: {
    endDateDays: function() {
      var date = Date.parse(this.model.endDate);
      return (date - Date.now()) / (60*60*24);
    }
  },
  data: function () {
    return {
      formQuantity: 1,
    };
  },
  methods: {
    createOrder: async function () {
      try {
        var res = await this.$store.dispatch("request", {
          type: "lkCreateOrder",
          productId: this.model.id,
          quantity: this.formQuantity,
        });
        this.$bvToast.toast(
          "Заказ #" + res.orderId + " успешно создан и передан в обработку",
          {
            title: "Покупка товара",
            variant: "success",
            autoHideDelay: 15000,
          }
        );
      } catch (e) {
        this.$bvToast.toast(e, {
          title: "Покупка товара не удалась",
          variant: "danger",
          autoHideDelay: 15000,
        });
      }
    },
  },
};
</script>
