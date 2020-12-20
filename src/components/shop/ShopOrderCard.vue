<template>
    <b-card
    header-tag="header"
    bg-variant="light"
    :border-variant="statusVariant"
    class="shadow">
      <template #header>
        <strong>Заказ #{{ order.orderId }}</strong>
      </template>
      <b-card-sub-title>Статус</b-card-sub-title>
      <b-card-text :class="'text-'+statusVariant">{{ order.status }}</b-card-text>
    </b-card>
</template>
<script>
export default {
    props: [ "order" ],
    computed: {
      statusVariant: function () {
        if(this.order.status == "FAILED") return "danger";
        if(this.order.status == "SUCCESS") return "success";
        return "primary";
      }
    }
}
</script>
