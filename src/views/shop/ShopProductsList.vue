<template>
  <b-container>
    <b-row class="d-flex justify-content-center py-3">
      <b-col cols="auto">
        <span>блок для фильтра</span>
      </b-col>
    </b-row>
    <b-row class="d-flex justify-content-center py-3">
      <b-col
      lg="3"
      class="pb-3"
      v-for="product in this.products"
      :key="product.id"
      >
        <ShopProductCard :model="product"></ShopProductCard>
      </b-col>
    </b-row>
    <b-row class="d-flex justify-content-center py-3">
      <b-col cols="auto">
        <b-pagination
          @change="followPage"
          v-model="this.page"
          :total-rows="this.pages * 10"
          :per-page="10"
        ></b-pagination>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import ShopProductCard from "@/components/shop/ShopProductCard.vue";
export default {
  components: { ShopProductCard },
  data: function () {
    return {
      pages: 10,
      page: 1,
      products: [],
    };
  },
  methods: {
    fetchProducts: async function (id) {
      var info = await this.$store.dispatch("request", {
        type: "lkFetchProducts",
        lastId: id,
      });
      console.log(info);
      return info.products;
    },
    followPage: async function (page) {
      console.log(page);
      this.products = await this.fetchProducts((page - 1) * 10);
      if (this.products.length < 10 && page < this.pages) this.pages = page;
    },
  },
  created: async function () {
    this.products = await this.fetchProducts(0);
    console.log(this.products);
  },
};
</script>
<style lang="sass">
.card-body
  img
    image-rendering: pixelated
</style>
