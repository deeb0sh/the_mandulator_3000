<template>
    <div class="footer">
      
        <span>{{ txt }}</span>
     
    </div>
</template>
  
<script>
    export default {
      props: [
        'txt'
     ]
    }
</script>

<style scoped>
/* * {
    border: rgb(140, 0, 255) solid 1px;
} */
.footer {
    flex: 0 0 auto;
    display: flex;
    justify-content: center;
    width: 100%;
}
</style>
  
