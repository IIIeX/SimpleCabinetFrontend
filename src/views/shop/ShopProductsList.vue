<template>
    <div>
        <b-row>
        <b-col v-for="product in this.products" :key="product.id" cols="4">
            <ShopProductCard :model="product"></ShopProductCard>
        </b-col>
        </b-row>
        <b-pagination @change="followPage" v-model="this.page" :number-of-pages="this.pages"></b-pagination>
    </div>
</template>
<script>
import ShopProductCard from "@/components/shop/ShopProductCard.vue"
export default {
    components: { ShopProductCard },
    data: function() {
        return {
            pages: 10,
            page: 1,
            products: []
        };
    },
    methods: {
        fetchProducts: async function(id) {
            var info = await this.$store.dispatch("request", {
                type: "lkFetchProducts",
                lastId: id,
            });
            console.log(info);
            return info.products;
        },
        followPage: async function(page) {
            console.log(page);
            this.products = await this.fetchProducts((page-1)*10);
            if(this.products.length < 10 && page < this.pages) this.pages = page;
        }
    },
    created: async function() {
        this.products = await this.fetchProducts(0);
        console.log(this.products);
    }
}
</script>