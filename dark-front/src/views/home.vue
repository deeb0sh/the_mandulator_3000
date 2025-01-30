<template> 
    <div class="main">
        <div class="container">
            <div>
                <span class="header-text"><i>DarkSurf.ru</i></span>
            </div>
            <div class="nav">
                <div>
                    <RouterLink to="/" @mouseover="OnMouseMSG('Расчудесный ресурс ❤️')"><img src="../img/logozbs.png" width="165px"></RouterLink>
                </div>
                <div class="nav2">
                    <RouterLink to="/radio" @mouseover="OnMouseMSG('Радио Anima Amoris')"><img src="../img/logo_radio.png" width="70"></RouterLink>
                    <RouterLink to="/m3000" @mouseover="OnMouseMSG('Мандулятор 3000')"><img src="../img/logo_mand.png" width="70"></RouterLink>
                    <RouterLink to="/pindos" @mouseover="OnMouseMSG('Окно к пиндосам')"><img src="../img/logo_pindos.png" width="70"></RouterLink>
                </div>
            </div>
            <div class="msg">{{ msg }}</div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            msg: "Расчудесный ресурс ❤️"
        };
    },
    methods: {
        OnMouseMSG(x) {
            this.msg = x
        }
    }
}
</script>

<style scoped>
*z {
    border: #00ff15 solid 1px;
}

.main {
    flex: 1 0 auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.container {
    margin-top: -200px;
    width: 525px;
}

.nav {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 10px;   
}

.msg {
    position: relative;
    margin-top: -40px;
    margin-left: 250px;
    text-align: center;
    width: 200px;
    font-size: 15px;
}

.header-text {
    font-family: HH;
    font-size: 50px;  
    color: #313131; 
}

@media (max-width: 533px) {
    .container {
        margin-top: -120px; 
        width: 345px;
        text-align: center;
    }
    .nav {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        justify-content: center;
        width: 100%;
    }
    .nav2   {
        margin-top: 15px;
    }
    .msg {
        position: relative;
        margin-top: 10px;
        margin-left: 75px;
        text-align: center;
        width: 200px;
        font-size: 15px;
    }
}
@media (max-width: 320px) {
    .header-text {
        font-size: 45px;  
    }
}
</style>