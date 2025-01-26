<template>
    <div class="block" @click="StreamInfo()">
        <div class="dop">
            <img src="../img/vinil.png" width="100">
        </div>
        <div>
            <h2>Minimal Deep Techno</h2>
            <div class="info">
                <b>user:</b> {{ users }}<br>
                <b>Track:</b> {{ track }}
            </div>
        </div>
    </div>
</template>
  
<script>
//https://amoris.sknt.ru/minimal/stats.json
    export default {
        data() {
            return {
                users: null,
                track: null
            }
        },
        methods: {
            async StreamInfo() {
                    const resp = await fetch('http://amoris.sknt.ru:80/minimal/stats.json')
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
    margin-top: 10px;
    
}
.info {
    margin-left: 20px;
    margin-right: 20px;
    margin-bottom: 10px;
    text-align: left;
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
  
