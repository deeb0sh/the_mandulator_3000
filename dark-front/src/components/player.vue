<template>
    <div class="DivPlayer">
        <audio id="player" class="player" v-bind:src="Source" controls type="audio/aacp" preload="none"></audio>
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
    border: #00a4aa solid 1px;
}

*::-webkit-media-controls-enclosure .light *::-webkit-media-controls, .light *::-webkit-media-text-track-container, .dark *::-webkit-media-controls, .dark *::-webkit-media-text-track-container {
    background-color: transparent;
  }

*::-webkit-media-controls-enclosure {
    background-color: transparent;
}

.DivPlayer {
    width: 100%;
}

.player {
    width: 100%;
    border: 0px solid #313131;
    border-radius: 0px;
    background: transparent;
}
</style>
