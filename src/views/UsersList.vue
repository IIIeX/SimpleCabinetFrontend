<template>
<b-container>
    <b-form inline>
        <label class="mr-sm-2" for="inline-form-custom-select-pref">Поиск пользователя: </label>
    <b-form-input class="mb-2 mr-sm-2 mb-sm-0" v-model="search" type="text"></b-form-input>
    <b-button @click="refreshSearch()" variant="success">Найти</b-button>
    </b-form>
          <b-row class="d-flex justify-content-center py-3">
        <b-col
        lg="3"
        class="pb-3"
        v-for="user in this.list"
        :key="user.orderId"
        >
          <UserMiniView :user="user"></UserMiniView>
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
import UserMiniView from "@/components/UserMiniView";
export default {
  components: { UserMiniView },
  data: function () {
    return {
      loading: true,
      list: [],
      page: 1,
      pages: 14,
      maxQuery: 12,
      search: null
    };
  },
  created: async function () {
    console.log(123);
    this.list = await this.fetchUsers(0);
    this.refreshPagesCount();
    console.log(this.list);
  },
  methods: {
    fetchUsers: async function (id) {
      await this.$store.state.api.promises.onauth_promise;
      var info = await this.$store.dispatch("request", {
        type: "lkFetchUsers",
        lastId: id,
        filterByName: this.search
      });
      console.log(info);
      this.maxQuery = info.maxQuery;
      return info.list;
    },
    refreshSearch: async function () {
        this.list = await this.fetchUsers(0);
        this.page = 1;
        this.refreshPagesCount();
    },
    followPage: async function (page) {
      console.log(page);
      this.list = await this.fetchUsers((page - 1));
      this.page = page;
      this.refreshPagesCount();
    },
    refreshPagesCount: function() {
      if(this.list.length < this.maxQuery && this.page < this.pages) this.pages = this.page;
      if(this.list.length >= this.maxQuery && this.page >= this.pages) this.pages++;
    },
  },
};
</script>