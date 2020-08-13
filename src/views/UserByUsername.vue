<template>
    <UserView v-if="user" :user="user" :owner="false" :admin="(user.permissions & 1) != 0"/>
</template>
<script>
import UserView from "@/components/UserView.vue"
export default {
    components: { UserView },
    props: ["username"],
    data: () => {
        return {
            user: undefined
        }
    },
    methods: {
        fetchUser: async function(username) {
            const api = this.$root.api;
            var info = await api.request('profileByUsername', {username});
            var extInfo = await api.request('lkExtendedInfo', {username});
            console.log(info);
            console.log(extInfo);
            return {
                username: info.playerProfile.username,
                uuid: info.playerProfile.uuid,
                permissions: 0,
                flags: 0,
                ext: extInfo
            };
        }
    },
    async created() {
        this.user = await this.fetchUser(this.username);
    }
}
</script>