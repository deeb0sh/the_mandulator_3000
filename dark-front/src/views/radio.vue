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
        <div>
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
            <button v-on:click="SetStream('breakcore')">IDM Break Core</button><br>
            <button v-on:click="SetStream('dub')">Dub</button><br>
            <button v-on:click="SetStream('reggae')">Reggae</button><br>
            <button v-on:click="SetStream('djpepe')">DJ Pepe Collection</button><br>
            <button v-on:click="SetStream('trance')">Trance</button><br>
            <button v-on:click="SetStream('idm')">IDM</button><br>
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
                    "minimal": "http://amoris.sknt.ru:80/minimal",
                    "dnb": "http://amoris.sknt.ru:80/dnb",
                    "techno": "http://amoris.sknt.ru:80/techno",
                    "dubtechno": "http://amoris.sknt.ru:80/dubtechno",
                    "triphop": "http://amoris.sknt.ru:80/triphop",
                    "deeptech": "http://amoris.sknt.ru:80/deeptech",
                    "ambient": "http://amoris.sknt.ru:80/ambient",
                    "dubstep": "http://amoris.sknt.ru:80/dubstep",
                    "goa": "http://amoris.sknt.ru:80/goa",
                    "newage": "http://amoris.sknt.ru:80/newage",
                    "dubtechnomix": "http://amoris.sknt.ru:80/dubtechnomix",
                    "electro": "http://amoris.sknt.ru:80/electro",
                    "electronic": "http://amoris.sknt.ru:80/electronic",
                    "breakbeat": "http://amoris.sknt.ru:80/breakbeat",
                    "breaks": "http://amoris.sknt.ru:80/breaks",
                    "breakcore": "http://amoris.sknt.ru:80/breakcore",
                    "dub": "http://amoris.sknt.ru:80/dub",
                    "reggae": "http://amoris.sknt.ru:80/reggae",
                    "djpepe": "http://amoris.sknt.ru:80/djpepe",
                    "trance": "http://amoris.sknt.ru:80/trance",
                    "idm": "http://amoris.sknt.ru:80/idm",
                }
                this.url = StreamUrls[tmp]
                // if (tmp === "minimal") {
                //     this.url = "http://amoris.sknt.ru:80/minimal"
                // } 
                // else if (tmp === "dnb") {
                //     this.url = "http://amoris.sknt.ru:80/dnb"
                // }
                // else if (tmp === "techno") {
                //     this.url = "http://amoris.sknt.ru:80/techno"
                // }
                // else if (tmp === "dubtechno") {
                //     this.url = "http://amoris.sknt.ru:80/dubtechno"
                // }
                // else if (tmp === "triphop") {
                //     this.url = "http://amoris.sknt.ru:80/triphop"
                // }
                // else if (tmp === "deeptech") {
                //     this.url = "http://amoris.sknt.ru:80/deeptech"
                // }
                // else if (tmp === "ambient") {
                //     this.url = "http://amoris.sknt.ru:80/ambient"
                // }
                // else if (tmp === "dubstep") {
                //     this.url = "http://amoris.sknt.ru:80/dubstep"
                // }
                // else if (tmp === "goa") {
                //     this.url = "http://amoris.sknt.ru:80/goa"
                // }
                // else if (tmp === "newage") {
                //     this.url = "http://amoris.sknt.ru:80/newage"
                // }
                // else if (tmp === "dubtechnomix") {
                //     this.url = "http://amoris.sknt.ru:80/dubtechnomix"
                // }
                // else if (tmp === "electro") {
                //     this.url = "http://amoris.sknt.ru:80/electro"
                // }
                // else if (tmp === "electronic") {
                //     this.url = "http://amoris.sknt.ru:80/electronic"
                // }
                // else if (tmp === "breakbeat") {
                //     this.url = "http://amoris.sknt.ru:80/breakbeat"
                // }
                // else if (tmp === "breaks") {
                //     this.url = "http://amoris.sknt.ru:80/breaks"
                // }
                // else if (tmp === "breakcore") {
                //     this.url = "http://amoris.sknt.ru:80/breakcore"
                // }
                // else if (tmp === "dub") {
                //     this.url = "http://amoris.sknt.ru:80/dub"
                // }
                // else if (tmp === "reggae") {
                //     this.url = "http://amoris.sknt.ru:80/reggae"
                // }
                // else if (tmp === "djpepe") {
                //     this.url = "http://amoris.sknt.ru:80/djpepe"
                // }
                // else if (tmp === "trance") {
                //     this.url = "http://amoris.sknt.ru:80/trance"
                // }
                // else if (tmp === "idm") {
                //     this.url = "http://amoris.sknt.ru:80/idm"
                // }
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