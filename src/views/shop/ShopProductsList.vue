<template>
  <b-container>
    <b-row class="d-flex justify-content-center py-3">
      <b-col cols="auto">
        <ShopCreateProduct ref="createProduct"></ShopCreateProduct>
        <b-button-group v-if="(this.$store.state.user.permissions & 1) != 0">
          <b-button variant="danger" @click="$refs.createProduct.show()">Создать новый товар</b-button>
        </b-button-group>

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
          :total-rows="this.pages * this.maxQuery"
          :per-page="this.maxQuery"
        ></b-pagination>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import ShopProductCard from "@/components/shop/ShopProductCard.vue";
import ShopCreateProduct from "@/components/shop/ShopCreateProduct.vue";
export default {
  components: { ShopProductCard, ShopCreateProduct },
  data: function () {
    return {
      pages: 10,
      page: 1,
      maxQuery: 12,
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
      this.maxQuery = info.maxQuery;
      return info.products;
    },
    followPage: async function (page) {
      console.log(page);
      this.products = await this.fetchProducts(page - 1);
      this.page = page;
      this.refreshPagesCount();
    },
    refreshPagesCount: function() {
      if(this.products.length < this.maxQuery && this.page < this.pages) this.pages = this.page;
      if(this.products.length >= this.maxQuery && this.page >= this.pages) this.pages++;
    },
  },
  created: async function () {
    this.products = await this.fetchProducts(0);
    this.refreshPagesCount();
    console.log(this.products);
  },
};
</script>
<style lang="sass">
.card-body
  img
    image-rendering: pixelated
</style>
