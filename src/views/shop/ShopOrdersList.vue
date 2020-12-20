<template>
    <b-container>
      <b-row class="d-flex justify-content-center py-3">
        <b-col
        lg="3"
        class="pb-3"
        v-for="order in this.list"
        :key="order.orderId"
        >
          <ShopOrderCard :order="order"></ShopOrderCard>
        </b-col>
      </b-row>
      <b-row class="d-flex justify-content-center py-3">
        <b-col cols="auto">
          <b-pagination
            @change="followPage"
            :total-rows="this.pages*this.maxQuery"
            :per-page="this.maxQuery"
          ></b-pagination>
        </b-col>
      </b-row>
    </b-container>
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
      maxQuery: 12,
    };
  },
  created: async function () {
    console.log(123);
    this.list = await this.fetchOrders(0);
    this.refreshPagesCount();
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
      this.maxQuery = info.maxQuery;
      return info.list;
    },

    followPage: async function (page) {
      console.log(page);
      this.list = await this.fetchOrders((page - 1));
      this.page = page;
      this.refreshPagesCount();
    },
    refreshPagesCount: function() {
      if(this.list.length < this.maxQuery && this.page < this.pages) this.pages = this.page;
    },
  },
};
</script>
