<template>
  <div>
    <b-container>
      <b-row class="d-flex justify-content-center py-3">
        <b-col v-for="order in this.list" :key="order.orderId" cols="4">
          <ShopOrderCard :order="order"></ShopOrderCard>
        </b-col>
      </b-row>
      <b-row class="d-flex justify-content-center py-3">
        <b-col cols="auto">
          <b-pagination
            @change="followPage"
            :total-rows="this.pages*10"
            :per-page="10"
          ></b-pagination>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import ShopOrderCard from "@/components/shop/ShopOrderCard";
export default {
  components: { ShopOrderCard },
  data: function () {
    return {
      loading: true,
      list: [],
      page: 1,
      pages: 14,
    };
  },
  created: async function () {
    console.log(123);
    this.list = await this.fetchOrders(0);
    console.log(this.list);
  },
  methods: {
    fetchOrders: async function (id) {
      await this.$store.state.api.promises.onauth_promise;
      var info = await this.$store.dispatch("request", {
        type: "lkFetchOrders",
        lastId: id,
      });
      console.log(info);
      return info.list;
    },

    followPage: async function (page) {
      console.log(page);
      this.list = await this.fetchOrders((page - 1));
      if(this.list.length < 10 && page < this.pages) this.pages = page;
    },
  },
};
</script>