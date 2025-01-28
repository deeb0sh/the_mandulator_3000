<template>
    <div class="DivPlayer">
        <audio id="player" class="player" v-bind:src="Source" controls type="audio/aacp" preload="metadata" />
    </div>
</template>

<script>
export default {
    props: [
        'Source'
    ],
}
</script>

<style scoped>

</style>
