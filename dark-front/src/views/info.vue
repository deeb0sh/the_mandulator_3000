<template> 
    <div class="main">
        <div class="header">
            <div class="nav1">
                <RouterLink to="/"><img class="logo" src="../img/logozbs.png" width="80"></RouterLink>
                <span class="header-text"><i> DarkSurf.ru </i></span>
            </div>
            <div class="nav">
                <RouterLink to="/"><a href="/"><img src="../img/exit2.png" ></a></RouterLink>
            </div>
        </div>
        <div class="container">
            <div class="map" >
                <karta300 v-if="isMobile" />
                <karta450 v-else />
            </div>
            <div class="info">
                <div class="ip">
                  <b> {{ userIp }}</b>
                </div>
                <div class="ip ip6">
                   <b> {{ userIpv6 }}</b>
                </div>
                <div class="ip">
                   <img src="../img/fin1.png" width="30"> <b>&nbsp;-&nbsp;{{ pingFI }} ms</b>
                </div>
                <div class="ip">
                   <img src="../img/ger1.png" width="30"> <b>&nbsp;-&nbsp;{{ pingDE }} ms</b>
                </div>
                <div class="ip">
                   <img src="../img/rus1.png" width="30"> <b>&nbsp;-&nbsp;{{ pingRU }} ms</b>
                </div>
            </div>
        </div>
        <div>
            <br><br><br>
            
        </div>
    </div>
    
</template>
<script>
import Karta300 from '@/components/karta300.vue'


export default {
    data(){
        return {
            isMobile: '',
            userIp: "Определение IPv4 ...",
            userIpv6: "Определение IPv6 ...",
            pingFI: null, 
            pingDE: null,
            pingRU: null
        }
    },
    async mounted() {
        this.chechScreen()
        this.getIpv4()  
        this.getIpv6()
        this.monitor('wss://fi.darksurf.ru:5554/', 'pingFI')
        this.monitor('wss://de.darksurf.ru:5554/', 'pingDE')
        this.monitor('wss://ru.darksurf.ru:5554/', 'pingRU')
    },
    methods: { 
        chechScreen() {
            this.isMobile = innerWidth <= 470;
        },
        async getIpv4() {
            try {
                const response = await fetch("https://api.ipify.org?format=json");
                const data = await response.json();
                this.userIp = data.ip;
            } 
            catch (error) {
                this.userIp = "Не удалось получить IP";
            }
        },
        async getIpv6() {
            try {
                const response = await fetch("https://api64.ipify.org?format=json")
                const data = await response.json()
                if (data.ip.includes('.')) {
                    this.userIpv6 = "IPv6 отсутствует"
                    return
                }
                this.userIpv6 = data.ip
            }
            catch (error) {
                this.userIpv6 = "IPv6 не поределён"
            }
        },
        async monitor(wss, ping) {
            const ws = new WebSocket(wss)
            let pingStart = 0
            const calibration = {
                'pingFI': 9,
                'pingDE': 0,
                'pingRU': 0
            }
            ws.onopen = () => {
                pingStart = performance.now()
                ws.send('ping')
            }
            ws.onmessage = (response) => {
                const clientReceiveTime = performance.now()
                const sockPong = JSON.parse(response.data)
                
                const rtt = ((clientReceiveTime - pingStart) - calibration[ping] - sockPong.sTime  ).toFixed(1)
                this[ping] = rtt 
                setTimeout(() => { 
                    pingStart = performance.now()
                    ws.send('ping')                   
                    }, 1000)
                }
        },
    }
}
</script>
<style scoped>
 /* * {
    border: #ff00d4 solid 1px;
}  */

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
.container {flex-direction: column;
    width: 100%;                  /* Занимает всю ширину */
    max-width: 920px;             /* Максимальная ширина */
    margin: 0 auto;               /* Центрирование */     
    display: flex;
    flex-direction: row;  /* Колонка в обратном порядке */
    flex-wrap: wrap;                 /* Перенос на новую строку */
    justify-content: center;         /* Центрирование */
    height: auto;    
}
.nav {
    display: flex;
    justify-content: center;
    align-items: center;  
}
.nav1 {
    display: flex;
    justify-content: center;
    align-items: center;  
}
.header-text {
    font-family: HH;
    font-size: 50px;  
    color: #313131; 
}
.ip {
    font-size: 27px;
    border-radius: 8px;   
    border: 1px solid #ffffff;
    margin: 5px;
    padding: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
    display: flex;          /* Добавлено */
    align-items: center;    /* Добавлено */
    
}
.map {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 0 auto;
}
.info {
    background: #cacaca71;
    border-radius: 8px;   
    border: 0px solid #ffffff;
    padding: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15); 
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
        flex-direction: row;  /* Колонка в обратном порядке */
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
    .nav img {
        width: 30px;
    }
    .header-text {
        font-size: 35px;  
    }
    .header {
        margin: 10px;
    }
    .ip {
        font-size: 14px;
    }
}
@media (max-width: 320px) {
    .header-text {
        font-size: 27px;  
    }
}
</style>