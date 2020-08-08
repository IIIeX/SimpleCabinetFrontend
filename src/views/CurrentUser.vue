<template>
    <UserView :user="user" :owner=true />
</template>
<script>
import UserView from "./UserView.vue"
import { mapState } from 'vuex';
export default {
    components: { UserView },
    computed: mapState({
      user: state => state.user
    })
}
</script>