<template>
  <b-container>
    <b-row class="d-flex justify-content-center py-3">
      <b-col col xl>
        <b-navbar toggleable="lg" type="light" variant="light" class="shadow border">
          <b-navbar-toggle target="shop-collapse"></b-navbar-toggle>
          <b-collapse id="shop-collapse" is-nav>
            <b-navbar-nav>
              <b-nav-form>
                <b-form-checkbox-group
                  v-model="filter"
                  :options="filtered"
                  buttons
                  button-variant="outline-success"
                ></b-form-checkbox-group>
              </b-nav-form>
            </b-navbar-nav>
            <b-navbar-nav class="ml-auto">
              <b-nav-form>
                <b-form-input class="mr-sm-2" placeholder="алмазный меч"></b-form-input>
                <b-button variant="outline-success" type="submit">Поиск</b-button>
              </b-nav-form>
              <b-nav-item>
                <b-button
                variant="outline-dark"
                block
                >Заказы</b-button>
              </b-nav-item>
              <b-nav-item>
                <b-button
                variant="danger"
                block
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
      filtered: ['Предметы', 'Блоки', 'Группы', 'Остальное'],
      filter: [],
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
  }
};
</script>
