<template>
    <div class="DivPlayer">
        <audio id="player" class="player" v-bind:src="Source" type="audio/aac" preload="metadata" />
        <input type="range" min="0" max="1" step="0.01" @input="setVolume" />
    </div>
</template>

<script>
export default {
    props: [
        'Source'
    ],
    methods: {
        setVolume(e) {
            const player = document.getElementById('player')
            if (player) player.volume = e.target.value
        }
}
}
</script>

<style scoped>

</style>
