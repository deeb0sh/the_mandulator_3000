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
            <div class="map">
                <img src="../img/map.png" width="450">
            </div>
            <div class="info">
                <div class="ip">
                   <b> {{ userIp }}</b>
                </div>
                <div class="ip ip6">
                   <b> {{ userIpv6 }}</b>
                </div>
                <div class="ip ip6">
                   <b> {{ response }}</b>
                </div>
            </div>
        </div>
        <div>
            <br><br><br>
            
        </div>
    </div>
    
</template>
<script>


export default {
    data(){
            return {
                userIp: "Определение IPv4 ...",
                userIpv6: "Определение IPv6 ...",
                response: null,
                latency: null
            }
    },
    async mounted() {
        this.getIpv4()  
        this.getIpv6()
        this.socketConnect()
    },
    methods: {
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
        async socketConnect() {
            const ws = new WebSocket('wss://darksurf.ru:5554/')

            await new Promise((resolve) => {
                ws.open = resolve
            })

            const start = performance.now()
            ws.send('ping')

            const result = await new Promise((resolve) => {
                ws.onmessage = (e) => {
                    resolve(JSON.parse(e.data))
                }
            })

            ws.close()

            this.response = result
        }
        
    }
}
</script>
<style scoped>
/* * {
    border: #ff00d4 solid 1px;
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
    padding: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
}
.map {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 0 auto;
}
.map img {
    max-width: 100%;  /* Изображение не будет превышать ширину контейнера */
    height: auto;     /* Сохраняет пропорции */
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