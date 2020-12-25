<template>
<b-container>
  <b-row class="d-flex justify-content-center py-3">
    <b-col xl="6">
    <b-input-group>
      <b-input-group-append>
        <b-input-group-text>
          <b-icon icon="search" aria-hidden="true"></b-icon>
        </b-input-group-text>
      </b-input-group-append>
      <b-form-input v-model="search" type="text"></b-form-input>
      <b-input-group-append>
        <b-button @click="refreshSearch()" variant="success">Найти</b-button>
      </b-input-group-append>
    </b-input-group>
    </b-col>
  </b-row>
  <b-row class="d-flex justify-content-center py-3">
    <b-col
      lg="3"
      class="pb-3"
      v-for="user in this.list"
      :key="user.orderId"
    ><UserMiniView :user="user"></UserMiniView></b-col>
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
    this.list = await this.fetchUsers(0);
    this.refreshPagesCount();
  },
  methods: {
    fetchUsers: async function (id) {
      await this.$store.state.api.promises.onauth_promise;
      var info = await this.$store.dispatch("request", {
        type: "lkFetchUsers",
        lastId: id,
        filterByName: this.search ? this.search : null
      });
      var list = [];
      for (const i of info.list) {
        list.push({
          username: i.username,
          client: ""
        });
      }
      var skininfo = await this.$store.dispatch("request", {
        type: "batchProfileByUsername",
        list: list
      });
      skininfo.playerProfiles.forEach(function(value, i) {
          info.list[i].playerProfile = value;
      });
      this.maxQuery = info.maxQuery;
      return info.list;
    },
    refreshSearch: async function () {
        this.list = await this.fetchUsers(0);
        this.page = 1;
        this.refreshPagesCount();
    },
    followPage: async function (page) {
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
