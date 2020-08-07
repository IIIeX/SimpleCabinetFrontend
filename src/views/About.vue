<template>
  <div class="about">
    <h1>{{ user.username }}</h1>
    <font v-if="user.uuid">UUID: {{ user.uuid }}<br></font>
    <font v-if="user.ext.gender">Пол: {{ user.ext.gender }}<br></font>
    <font v-if="user.ext.email">EMail: {{ user.ext.email }}<br></font>
    <font v-if="user.ext.status">Статус: {{ user.ext.status }}<br></font>
    <font v-if="user.ext.economyMoney > 0">Денег: {{ user.ext.economyMoney }}<br></font>
    <font v-if="user.ext.donateMoney > 0">Донат: {{ user.ext.donateMoney }}</font>
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default {
  computed: mapState({
    user: state => state.user
  })
}
</script>