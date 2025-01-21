<template>
    <div>
        <audio v-bind:src="Source" type="audio/aac" controls></audio>
    </div>
</template>

<script>
    export default {
      props: [
        'Source'
     ]
    }
</script>

<style scoped>
*z {
    border: rgb(0, 164, 170) solid 1px;
}
</style>
