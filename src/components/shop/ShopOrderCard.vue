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
      <b-input-group size="sm">
        <b-form-input disabled placeholder="20.12.2020" class="w-50"></b-form-input>
        <b-form-input disabled placeholder="23:59" class="w-25"></b-form-input>
      </b-input-group>
    </b-card>
</template>
<script>
export default {
    props: [ "order" ],
    computed: {
      statusVariant: function () {
        if(this.order.status == "FAILED") return "danger";
        if(this.order.status == "FINISHED") return "success";
        return "secondary";
      }
    }
}
</script>
