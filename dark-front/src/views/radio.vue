<template> 
    <div class="main">
        <div class="header">
            <div class="nav">
                <RouterLink to="/"><img class="logo" src="../img/logozbs.png" width="80"></RouterLink>
                <span class="header-text"><i> DarkSurf.ru </i></span>
            </div>
            <!-- <div class="nav">
                <RouterLink to="/"><a href="/"><img src="../img/exit2.png" ></a></RouterLink>
            </div> -->
        </div>
        <div class="container">
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
            
        </div>
    </div>
    <Player class="player-fixed" v-bind:Source="url"/>
    
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
/* * {
    border: #ffc400 solid 1px;
} */

.main {
        flex: 1 0 auto;
        width: 95%;
        min-height: 100%;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        justify-content: flex-start; 
        align-items: center;
        padding-bottom: 80px;
    }

    .header {
        display: flex;
        align-items: flex-start; 
        justify-content: space-between;
        gap: 10px; 
        width: 950px;
        margin-top: 20px;
        margin-bottom: 30px;
    }

.container {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly; /* Равномерное распределение */
    width: 100%;                  /* Занимает всю ширину */
    max-width: 920px;             /* Максимальная ширина */
    margin: 0 auto;               /* Центрирование */
             
}


.radio {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 920px;
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

@media (max-width:950px ){
    .header {
        display: flex;
        align-items: flex-start; 
        justify-content: space-between;
        gap: 10px; 
        width: 100%;
        margin-top: 5px;
        margin-bottom: 15px;
    }
}
@media (max-width:910px ) {
    .container {
        display: flex;
        flex-direction: row-reverse;  /* Колонка в обратном порядке */
        flex-wrap: wrap;                 /* Перенос на новую строку */
        justify-content: center;         /* Центрирование */
        height: auto;   
    }
}
@media (max-width:620px ) {
    
    .header-text {
        font-size: 40px;  
    }
}
@media (max-width: 410px) {
    .logo {
        width: 60px;
    }
    img {
        width: 30px;
    }
    .header-text {
        font-size: 35px;  
    }
    .header {
        margin: 10px;
    }
}
@media (max-width: 320px) {
    .header-text {
        font-size: 27px;  
    }
}
</style>