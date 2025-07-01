<template>
    <div class="block" v-if="this.WaveActive(Style,isAction)">
        <div class="users">
            online: {{ users }}
        </div>
        <div class="vinil action">
            <img src="../img/vinil.png" width="80px">
        </div>
        <div>
            <span class="action"><b>{{ StyleInfo }}</b></span>
            <div class="info">
                {{ track }}
            </div>
        </div>
    </div>
    <div class="block" v-else>
        <div class="users">
            online: {{ users }}
        </div>
        <div class="vinil">
            <img src="../img/vinil.png" width="80px">
        </div>
        <div>
            <span class="style"><b>{{ StyleInfo }}</b></span>
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
            'Style',
            'isAction'
        ],
        mounted() {
            this.StreamInfo(),
            this.timer()
        },
        data() {
            return {
                users: "N/A",
                track: "N/A",
                Active: false
            }
        },
        methods: {
            WaveActive(x1,x2) {
                if (x1 === x2) {
                    return true
                }
                else {
                    return false
                }
            },
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
/* * {
    border: #8c00ff solid 1px;
}  */

.style {
    font-size: 20px;
}

.action  {
    font-size: 20px;
    text-shadow: 0 0 5px #1eff00;
}

.vinil {
    height: 80px;
}

.vinil.action {
    animation-name: rotation;
    animation-duration: 5s;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
}

@keyframes rotation {
    0% {
        transform:rotate(0deg);
    }
    100% {
        transform:rotate(360deg);
    }
}

.users{
    text-align: right;
    font-size: 11px;
    padding-right: 20px;
}

.info {
    text-align: center;
    padding: 5px 20px 15px 20px;
    height: 40px;
    white-space: wrap;    /* перенос строк */
    overflow: hidden;       /* Скрываем текст, выходящий за границы */
    text-overflow: ellipsis; /* Добавляем троеточие */
}

.block {
    margin-bottom: 20px;
    border: #313131 solid 0px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    justify-content: start;
    width: 230px;
    text-align: center;
}

/* @media (max-width: 914px) {
    .block {
        width: 160px;
    }
    .info {
        font-size: 12px;
    }

}
@media (max-width: 550px) {
    .block {
        width: 136px;
    }
    .info {
        font-size: 10px;
        padding: 5px 5px 5px 0px;
    }
    .users {
        font-size: 9px;
    }
}
@media (max-width: 407px) {
    .block {
        width: 133px;
    } 
   }   */

</style>
  
