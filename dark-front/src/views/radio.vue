<template> 
    <div class="main">
        <div class="container">
                <div class="nav">
                    <RouterLink to="/radio"><img src="../img/logo_radio.png" width="170"></RouterLink>
                    <span class="header-text"><i>Anima Amoris</i></span>
                </div>
                <div class="nav">
                    <RouterLink to="/"><img src="../img/logozbs.png" width="70"></RouterLink>
                    <RouterLink to="/m3000"><img src="../img/logo_mand.png" width="70"></RouterLink>
                    <RouterLink to="/pindos"><img src="../img/logo_pindos.png" width="70"></RouterLink>                      
                </div>
        </div>
        <div class="radio">
            <RadioBlock StyleInfo="Minimal Deep Techno" Style="minimal"/>
            <RadioBlock StyleInfo="Drum and Bass" Style="dnb"/>
            <RadioBlock StyleInfo="Techno" Style="techno"/>
        </div>
        <div>
            <br><br><br>
            <button v-on:click="SetStream('minimal')">Minimal Deep Techno</button><br>
            <button v-on:click="SetStream('dnb')">Drum and Bass</button><br>
            <button v-on:click="SetStream('techno')">Techno</button><br>
            <button v-on:click="SetStream('dubtechno')">Dub Techno</button><br>
            <button v-on:click="SetStream('triphop')">Trip Hop Lounge</button><br>
            <button v-on:click="SetStream('deeptech')">Deep Tech House</button><br>
            <button v-on:click="SetStream('ambient')">Ambient</button><br>
            <button v-on:click="SetStream('dubstep')">Dub Step</button><br>
            <button v-on:click="SetStream('goa')">Goa Psy Trance</button><br>
            <button v-on:click="SetStream('newage')">New Age</button><br>
            <button v-on:click="SetStream('dubtechnomix')">Dub Techno Mix</button><br>
            <button v-on:click="SetStream('electro')">Electro</button><br>
            <button v-on:click="SetStream('electronic')">Electronic Styles</button><br>
            <button v-on:click="SetStream('breakbeat')">Breakbeat Hardcore</button><br>
            <button v-on:click="SetStream('breaks')">Breaks</button><br>
            <button v-on:click="SetStream('breakcore')">IDM Breakcore</button><br>
            <button v-on:click="SetStream('dub')">Dub</button><br>
            <button v-on:click="SetStream('reggae')">Reggae</button><br>
            <button v-on:click="SetStream('djpepe')">DJ Pepe Collection</button><br>
            <button v-on:click="SetStream('trance')">Trance</button><br>
            <button v-on:click="SetStream('idm')">IDM</button><br>
            <br>
            <button v-on:click="SetStream('STOP')">STOP</button><br>
        </div>
    </div>
    <Player v-bind:Source="url"/>
</template>
<script>
export default {
    data(){
            return {
                url: null
            };
    },
    methods: {
            SetStream(tmp) {
                const StreamUrls = { 
                    "minimal": "https://amoris.sknt.ru/minimal",
                    "dnb": "https://amoris.sknt.ru/dnb",
                    "techno": "https://amoris.sknt.ru/techno",
                    "dubtechno": "https://amoris.sknt.ru/dubtechno",
                    "triphop": "https://amoris.sknt.ru/triphop",
                    "deeptech": "https://amoris.sknt.ru/deeptech",
                    "ambient": "https://amoris.sknt.ru/ambient",
                    "dubstep": "https://amoris.sknt.ru/dubstep",
                    "goa": "https://amoris.sknt.ru/goa",
                    "newage": "https://amoris.sknt.ru/newage",
                    "dubtechnomix": "https://amoris.sknt.ru/dubtechnomix",
                    "electro": "https://amoris.sknt.ru/electro",
                    "electronic": "https://amoris.sknt.ru/electronic",
                    "breakbeat": "https://amoris.sknt.ru/breakbeat",
                    "breaks": "https://amoris.sknt.ru/breaks",
                    "breakcore": "https://amoris.sknt.ru/breakcore",
                    "dub": "https://amoris.sknt.ru/dub",
                    "reggae": "https://amoris.sknt.ru/reggae",
                    "djpepe": "https://amoris.sknt.ru/djpepe",
                    "trance": "https://amoris.sknt.ru/trance",
                    "idm": "https://amoris.sknt.ru/idm",
                    "STOP": ""
                }
                this.url = StreamUrls[tmp]
                setTimeout(() => {  
                        document.getElementById('player').play(); 
                }, 250);
            }
    }
}
</script>
<style scoped>
*z {
    border: #ffc400 solid 1px;
}

.main {
    flex: 1 0 auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: top;
    align-items:center;
}

.container {
    margin-top: 10px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.radio {
    display: flex;
    flex-direction: row;
}

.nav {
    display: flex;
    justify-content: center;
    align-items: center;
    
}

.header-text {
    font-family: HH;
    font-size: 60px;  
    color: #313131; 
}
</style>