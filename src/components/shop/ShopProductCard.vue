<template>
    <b-card bg-variant="light"
      class="my-4">
        <p><b>{{ model.name }}</b></p>
        <p>{{ model.description }}</p>
        <p><b>Цена:</b> {{ model.price }} р.</p>
        <b-form-input v-model="formQuantity"></b-form-input>
        <b-form-invalid-feedback v-model="formValidation">Размер заказа не может быть меньше 1</b-form-invalid-feedback>
        <b-button variant="primary" @click="createOrder()" v-if="this.$store.state.user.uuid">Купить</b-button>
    </b-card>
</template>
<script>
export default {
    props: ["model"],
    computed: {
        formValidation: function() {
            return this.formQuantity >= 1;
        }
    },
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