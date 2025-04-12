<template>
    <div v-if="clients && clients.length">
    <ul>
      <li v-for="(client, index) in clients" :key="index">
        {{ client.name }} — {{ client.ip }}
      </li>
    </ul>
  </div>
  
</template>
<script>
export default {
  props: {
    clients: '',
  }
}
</script>

<style scoped>
</style>