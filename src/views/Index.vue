<template>
    <div>
        <p>Подождите, выполняем вход...</p>
    </div>
</template>
<script>
export default {
    created: async function() {
        try {
            await this.$store.state.api.promises.auth;
            this.$router.push('/currentuser');
        } catch(error) {
            this.$router.push('/login');
        }
    }
}
</script>