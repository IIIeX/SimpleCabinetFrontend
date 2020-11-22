<template>
  <b-container>
    <b-button
      @click="modalInitPayment.show = !modalInitPayment.show"
      variant="danger"
      >Пополнить</b-button
    >
    <b-modal
      centered
      hide-header
      v-model="modalInitPayment.show"
      id="modal-2fa-disable"
      @ok="initPayment"
    >
      <b-input-group class="mb-2">
        <b-form-select
          v-model="modalInitPayment.paymentId"
          :options="modalInitPayment.payments"
        ></b-form-select>
        <b-form-input
          v-model="modalInitPayment.summ"
          type="number"
          placeholder="Сумма"
        ></b-form-input>
        <b-form-invalid-feedback :state="modalInitPaymentValidation"
          >Сумма должна быть в диапазоне от 10 до 60
          000р</b-form-invalid-feedback
        >
      </b-input-group>
    </b-modal>
  </b-container>
</template>
<script>
export default {
  computed: {
    user: function () {
      return this.$store.state.user;
    },
    uuid: function () {
      return this.$store.state.user.uuid;
    },
    modalInitPaymentValidation: function () {
      if (
        this.modalInitPayment.summ >= 10.0 &&
        this.modalInitPayment.summ <= 60000.0
      ) {
        return true;
      }
      return false;
    },
  },
  data: function () {
    return {
      modalInitPayment: {
        show: false,
        payments: ["UNITPAY", "ROBOKASSA"],
        paymentId: "UNITPAY",
        summ: 100.0,
        serverErrorShow: true,
        serverError: "Unknown error",
      },
    };
  },
  methods: {
    initPayment: async function (evt) {
      evt.preventDefault();
      this.modalInitPayment.serverErrorShow = true;
      try {
        var res = await this.$store.dispatch("request", {
          type: "lkInitPayment",
          sum: this.modalInitPayment.summ,
          variant: this.modalInitPayment.paymentId,
        });
        var body = "";
        var isFirst = true;
        for (var k in res.params) {
          if (!isFirst) body += "&";
          else isFirst = false;
          body += k + "=" + encodeURIComponent(res.params[k]);
        }
        console.log(res.redirectUri);
        console.log(body);
        window.location = res.redirectUri + "?" + body;
      } catch (e) {
        console.log(e);
        this.modalInitPayment.serverError = e.error;
        this.modalInitPayment.serverErrorShow = false;
      }
    },
  },
};
</script>