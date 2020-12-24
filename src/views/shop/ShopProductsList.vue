<template>
  <b-container>
    <b-row class="d-flex justify-content-center py-3">
      <b-col col xl>
        <b-navbar toggleable="xl" type="light" variant="light" class="shadow border">
          <b-navbar-toggle target="shop-collapse"></b-navbar-toggle>
          <b-collapse id="shop-collapse" is-nav>
            <b-navbar-nav>
              <b-nav-form class="py-2">
                <b-form-radio-group
                  v-model="filter"
                  :options="filtered"
                  buttons
                  button-variant="outline-success"
                  size="sm"
                ></b-form-radio-group>
              </b-nav-form>
            </b-navbar-nav>
            <b-navbar-nav class="ml-auto">
              <b-nav-form
              class="py-2"
              @submit="goSearch"
              >
                <b-form-input v-model="search" class="mr-sm-2" placeholder="алмазный меч"></b-form-input>
                <b-button variant="outline-success" class="mr-sm-2" type="submit">Поиск</b-button>
              </b-nav-form>
              <b-nav-item>
                <b-button
                v-if="$store.state.user.uuid ? true : false"
                variant="outline-dark"
                @click="$router.push('/shop/orders')"
                >Заказы</b-button>
              </b-nav-item>
              <b-nav-item>
                <b-button
                variant="danger"
                @click="$refs.createProduct.show()"
                v-if="(this.$store.state.user.permissions & 1) != 0"
                >Добавить товар</b-button>
              </b-nav-item>
            </b-navbar-nav>
          </b-collapse>
        </b-navbar>
        <ShopCreateProduct ref="createProduct"></ShopCreateProduct>
      </b-col>
    </b-row>
    <!-- <b-row class="d-flex justify-content-center py-3">
      <b-col col xl>
        <ShopCreateProduct ref="createProduct"></ShopCreateProduct>
        <b-input-group>
          <b-input-group-prepend is-text>
          <b-form-checkbox-group
            v-model="filter"
            :options="filtered"
            switches
          ></b-form-checkbox-group>
          </b-input-group-prepend>
          <b-form-input></b-form-input>
          <b-input-group-append>
            <b-button variant="outline-success">Поиск</b-button>
            <b-button variant="danger" @click="$refs.createProduct.show()" v-if="(this.$store.state.user.permissions & 1) != 0">+</b-button>
          </b-input-group-append>
        </b-input-group>
      </b-col>
    </b-row> -->
    <b-row class="d-flex justify-content-center py-3">
      <b-col
      lg="3"
      class="pb-3"
      v-for="product in this.products"
      :key="product.id"
      >
        <ShopProductCard v-if="product.type != 'GROUP'" :model="product"></ShopProductCard>
        <ShopGroupCard v-if="product.type == 'GROUP'" :model="product"></ShopGroupCard>
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
import ShopGroupCard from "@/components/shop/ShopGroupCard.vue";
import ShopCreateProduct from "@/components/shop/ShopCreateProduct.vue";
export default {
  components: { ShopProductCard, ShopGroupCard, ShopCreateProduct },
  data: function () {
    return {
      pages: 10,
      page: 1,
      maxQuery: 12,
      products: [],
      filtered: [{text: 'Все', value: null}, {text: 'Предметы и блоки', value: "ITEM"}, {text: 'Привилегии', value: "GROUP"}, {text: 'Другие услуги', value: "SPECIAL"}],
      filter: null,
      search: null
    };
  },
  methods: {
    fetchProducts: async function (id) {
      var info = await this.$store.dispatch("request", {
        type: "lkFetchProducts",
        lastId: id,
        filterByType: this.filter,
        filterByName: this.search ? this.search : null
      });
      console.log(info);
      this.maxQuery = info.maxQuery;
      return info.products;
    },
    goSearch: async function(e) {
        e.preventDefault();
        this.products = await this.fetchProducts(0);
        this.page = 1;
        this.refreshPagesCount();
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
  mounted: async function(){
    try {
      await this.$store.state.api.promises.auth;
    } catch(e) {
        this.$bvToast.toast("Для покупки необходимо войти в аккаунт", {
          title: "Магазин",
          variant: "danger",
          autoHideDelay: 10000,
        });
    }
  },
  watch: {
    "filter": async function(newValue, oldValue) {
      if(newValue != oldValue)
        this.products = await this.fetchProducts(0);
        this.page = 1;
        this.refreshPagesCount();
    }
  }
};
</script>
