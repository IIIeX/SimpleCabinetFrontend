import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from "bootstrap-vue"
import router from './router'
import store from './store'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
Vue.use(BootstrapVue)
Vue.config.productionTip = false
const api = store.state.api;
api.connect('ws://localhost:9274/api');
/*
api.onOpen = () => {
   var res = localStorage.getItem("authdata");
   if(res)
   {
     var resdata = JSON.parse(res);
     console.log(resdata);
     api.sendRequest("restoreSession", { session: resdata.session }, (result) => {
      console.log(result);
      this.$store.commit('onAuth', resdata);
      this.$root.api.sendRequest('lkExtendedInfo', {}, (extInfo) => {
        console.log(extInfo);
        this.$store.commit('onExtInfo', extInfo);
      }, (error) => {
        console.log(JSON.stringify(error))
      });
      router.push("/currentuser");
     }, (error) => {
       console.log(error);
       router.push("/login");
     });
   }
   else
   {
    router.push("/login");
   }
};
*/
api.callbacks.onopen = () => {
  var sessionId = localStorage.getItem("sessionId");
  if(sessionId)
  {
     api.sendRequest("restoreSession", { session: sessionId, needUserInfo: true }, (result) => {
      console.log(result);
      store.commit('onUserInfo', result.userInfo);
      api.sendRequest('lkExtendedInfo', {}, (extInfo) => {
        console.log(extInfo);
        store.commit('onExtInfo', extInfo);
      }, (error) => {
        console.log(JSON.stringify(error))
      });
     }, () => {});
  }
};
new Vue({
  router,
  store,
  data: {
    api
  },
  render: h => h(App)
}).$mount('#app')
