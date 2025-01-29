<template> 
    <div class="main">
        <div class="container">
            <div>
                <span class="header-text"><i>DarkSurf.ru</i></span>
            </div>
            <div class="nav">
                <RouterLink to="/" @mouseover="OnMouseMSG('Главная')"><img src="../img/logozbs.png" width="165px"></RouterLink>
                <RouterLink to="/radio" @mouseover="OnMouseMSG('Радио Anima Amoris')"><img src="../img/logo_radio.png" width="70"></RouterLink>
                <RouterLink to="/m3000" @mouseover="OnMouseMSG('Мандулятор 3000')"><img src="../img/logo_mand.png" width="70"></RouterLink>
                <RouterLink to="/pindos" @mouseover="OnMouseMSG('Окно к пиндосам')"><img src="../img/logo_pindos.png" width="70"></RouterLink>
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
    width: 70%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items:center;
}

.container {
    margin-top: -200px;
    width: 525px;
}

.nav {
    display: flex;
    justify-content: center;
    align-items: center;
    
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
</style>