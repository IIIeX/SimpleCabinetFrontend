<template>
        <b-card no-body class="shadow">
          <b-card-header class="d-flex align-items-center justify-content-between">
            <strong class="text-info">{{ model.name }}</strong>
          </b-card-header>
          <b-card-body>
            <b-card-text v-if="model.description"><markdown-it-vue :content="model.description"></markdown-it-vue></b-card-text>
            <b-form-spinbutton v-model="formQuantity" min="1" max="100"></b-form-spinbutton>
          </b-card-body>
          <b-card-footer align="center">
            <b-list-group
              flush
              class="mb-2"
              v-if="(model.count >= 0 || model.endDate)"
            >
              <b-list-group-item v-if="model.count >= 0" variant="danger" class="p-1">
                <small>Осталось {{ model.count }} штук.</small>
              </b-list-group-item>
              <b-list-group-item v-if="model.endDate ? true : false" variant="danger" class="p-1">
                <small>Осталось {{ endDateDays }} дней.</small>
              </b-list-group-item>
            </b-list-group>
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
    computed: {
      endDateDays: function() {
        var dateObj = this.model.endDate;
        var date = new Date(dateObj.date.year, dateObj.date.month-1, dateObj.date.day,  dateObj.time.hour, dateObj.time.minute, dateObj.time.second);
        return Math.ceil((date.getTime() - Date.now()) / (60*60*24*1000));
      }
    },
    data: function() {
        return {
            formQuantity: 1
        };
    },
    methods: {
        createOrder: async function() {
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
        if(this.model.count > 0) {
          this.model.count -= this.formQuantity;
        }
      } catch (e) {
        this.$bvToast.toast(e.error, {
          title: "Покупка товара не удалась",
          variant: "danger",
          autoHideDelay: 15000,
        });
      }
        }
    }
}
</script>
