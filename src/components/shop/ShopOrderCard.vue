<template>
    <b-card bg-variant="light"
      class="my-4">
      <p>Заказ #{{ order.orderId }}</p>
      <p>Статус: {{ order.status }}</p>
    </b-card>
</template>
<script>
export default {
    props: [ "order" ]
    
}
</script>