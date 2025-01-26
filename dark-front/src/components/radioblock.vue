<template>
    <div class="block">
        <div class="users">
            user: {{ users }}
        </div>
        <div>
            <img src="../img/vinil.png" width="100">
        </div>
        <div>
            <h2>{{ StyleInfo }}</h2>
            <div class="info">
                {{ track }}
            </div>
        </div>
    </div>
</template>
  
<script>
    export default {
        props: [
            'StyleInfo',
            'Style'
        ],
        mounted() {
            this.StreamInfo(),
            this.timer()
        },
        data() {
            return {
                users: "N/A",
                track: "N/A"
            }
        },
        methods: {
            timer() {
                setInterval(this.StreamInfo,10000)
            },
            async StreamInfo(){
                    const resp = await fetch("https://amoris.sknt.ru/" + this.Style + "/stats.json")
                    const data = await resp.text()
                    const text = data.replace(/(^metadata.*?\()|(..)$|(\*\ amoris.sknt.ru)/g,'')
                    const info = JSON.parse(text)
                    this.users = info["uniquelisteners"]
                    this.track = info["songtitle"]
            }
        }
    }
</script>

<style scoped>
*z {
    border: #8c00ff solid 1px;
}

img {
    margin-left: 10px;
    margin-right: 10px;
}

.users{
    text-align: right;
    font-size: 11px;
    margin-right: 20px;
}

.info {
    margin-left: 20px;
    margin-right: 20px;
    margin-bottom: 10px;
    text-align: center;
}
.block {
    border: #313131 solid 0px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 250px;
    text-align: center;
}
</style>
  
