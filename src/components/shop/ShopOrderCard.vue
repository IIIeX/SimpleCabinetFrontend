<template>
    <b-card
    header-tag="header"
    bg-variant="light"
    border-variant="success"
    class="shadow">
      <template #header>
        <strong>Заказ #{{ order.orderId }}</strong>
      </template>
      <b-card-sub-title>Статус</b-card-sub-title>
      <b-card-text class="text-success">{{ order.status }}</b-card-text>
    </b-card>
</template>
<script>
export default {
    props: [ "order" ]
}
</script>
