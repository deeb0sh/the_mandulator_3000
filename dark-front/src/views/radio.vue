<template> 
    <div class="main">
        <div class="container">
                <div class="nav">
                    <RouterLink to="/"><img src="../img/logozbs.png" width="165"></RouterLink>
                    <span class="header-text"><i>Anima Amoris</i></span>
                </div>
                <div class="nav">
                    <RouterLink to="/radio"><img src="../img/logo_radio.png" width="70"></RouterLink>
                    <!-- <RouterLink to="/m3000"><img src="../img/logo_mand.png" width="70"></RouterLink> -->
                    <a href="#" @click="LoginShow()"><img src="../img/logo_mand.png" width="70"></a>
                    <!-- <RouterLink to="/pindos"><img src="../img/logo_pindos.png" width="70"></RouterLink>                       -->
                </div>
        </div>
        <div class="radio">
            <RadioBlock v-bind:isAction="LastClick" StyleInfo="Minimal Deep Techno" Style="minimal" v-on:click="SetStream('minimal')"/>
            <RadioBlock v-bind:isAction="LastClick" StyleInfo="Drum and Bass" Style="dnb" v-on:click="SetStream('dnb')"/>
            <RadioBlock v-bind:isAction="LastClick" StyleInfo="Techno" Style="techno" v-on:click="SetStream('techno')"/>
            <RadioBlock v-bind:isAction="LastClick" StyleInfo="Dub Techno" Style="dubtechno" v-on:click="SetStream('dubtechno')"/>
            <RadioBlock v-bind:isAction="LastClick" StyleInfo="Trance" Style="trance" v-on:click="SetStream('trance')"/>
            <RadioBlock v-bind:isAction="LastClick" StyleInfo="Deep Tech House" Style="deeptech" v-on:click="SetStream('deeptech')"/>
            
            <!-- <RadioBlock v-bind:isAction="LastClick" StyleInfo="Breakbeat Hardcore" Style="breakbeat" v-on:click="SetStream('breakbeat')"/> -->
            
            <RadioBlock v-bind:isAction="LastClick" StyleInfo="IDM Breakcore" Style="breakcore" v-on:click="SetStream('breakcore')"/>
            <RadioBlock v-bind:isAction="LastClick" StyleInfo="IDM" Style="idm" v-on:click="SetStream('idm')"/>
            <RadioBlock v-bind:isAction="LastClick" StyleInfo="Goa Psy Trance" Style="goa" v-on:click="SetStream('goa')"/>           
            <RadioBlock v-bind:isAction="LastClick" StyleInfo="New Age" Style="newage" v-on:click="SetStream('newage')"/>
            <RadioBlock v-bind:isAction="LastClick" StyleInfo="Dub Techno Mix" Style="dubtechnomix" v-on:click="SetStream('dubtechnomix')"/>
            <RadioBlock v-bind:isAction="LastClick" StyleInfo="Electro" Style="electro" v-on:click="SetStream('electro')"/> 
            <RadioBlock v-bind:isAction="LastClick" StyleInfo="Electronic Styles" Style="electronic" v-on:click="SetStream('electronic')"/>
            <RadioBlock v-bind:isAction="LastClick" StyleInfo="Ambient" Style="ambient" v-on:click="SetStream('ambient')"/>
            
            <!-- <RadioBlock v-bind:isAction="LastClick" StyleInfo="Breaks" Style="breaks" v-on:click="SetStream('breaks')"/>  -->
            
            <RadioBlock v-bind:isAction="LastClick" StyleInfo="Dub Step" Style="dubstep" v-on:click="SetStream('dubstep')"/>
            <RadioBlock v-bind:isAction="LastClick" StyleInfo="Dub" Style="dub" v-on:click="SetStream('dub')"/>
            <RadioBlock v-bind:isAction="LastClick" StyleInfo="Reggae" Style="reggae" v-on:click="SetStream('reggae')"/> 
            <RadioBlock v-bind:isAction="LastClick" StyleInfo="Trip Hop Lounge" Style="triphop" v-on:click="SetStream('triphop')"/>
         </div>
        <div>
            <br><br><br>
            <Logmod ref="modal" />
        </div>
    </div>
    <Player v-bind:Source="url"/>
    <Footer txt="&copy 2025 ebosh-product"/>
</template>
<script>


export default {
    data(){
            return {
                url: null,
                LastClick: ''
            };
    },
    methods: {
            LoginShow() {
                this.$refs.modal.showLogin = true
                document.documentElement.style.overflow = 'hidden'
            },
            SetStream(tmp) {
                if ((this.LastClick !== tmp) || (this.LastClick == '')) {
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
                                    "trance": "https://amoris.sknt.ru/trance",
                                    "idm": "https://amoris.sknt.ru/idm"
                        }
                        this.url = StreamUrls[tmp]
                        this.LastClick = tmp
                }
                else {
                        this.LastClick = ''
                        this.url = ""
                }
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
    width: 90%;
    display: flex;
    flex-direction: column;
    justify-content: top;
    align-items:center;
}

.container {
    margin-top: 20px;
    margin-bottom: 30px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.radio {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;

}

.nav {
    display: flex;
    justify-content: center;
    align-items: center;
    
}

.header-text {
    font-family: HH;
    font-size: 50px;  
    color: #313131; 
}

@media (max-width: 940px) {
    img {
        width: 70px;
    }
    .main {
        width: 100%;
    }
    .container {
        margin-top: 5px;
        margin-bottom: 10px;
    }
    .header-text {
        font-size: 40px; 
    }
}
@media (max-width: 660px) {
    .header-text {
        font-size: 20px;  
    }
    img {
        width: 40px;
    }
    .container {
        margin-top: 5px;
    }
}
@media (max-width: 370px) {
    .header-text {
        font-size: 16px;
    }
    img {
        width: 35px;
    }
}
</style>