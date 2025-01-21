<template> 
    <div class="main">
        <div class="container">
                <div class="nav">
                    <RouterLink to="/radio" @mouseover="OnMouseMSG('Радио Anima Amoris')"><img src="../img/logo_radio.png" width="120"></RouterLink>
                    <span class="header-text"><i>Anima Amoris</i></span>
                </div>
                <div class="nav">
                    <RouterLink to="/" @mouseover="OnMouseMSG('Главная')"><img src="../img/logozbs.png" width="70"></RouterLink>
                    <RouterLink to="/m3000" @mouseover="OnMouseMSG('Мандулятор 3000')"><img src="../img/logo_mand.png" width="70"></RouterLink>
                    <RouterLink to="/pindos" @mouseover="OnMouseMSG('Окно к пиндосам')"><img src="../img/logo_pindos.png" width="70"></RouterLink>                      
                </div>
        </div>
        
        
    <Player Source="http://amoris.sknt.ru:80/minimal"/><br>
    <Player Source="http://amoris.sknt.ru:80/dnb"/><br> 
    </div>
</template>
<script>
import Player from '../components/player.vue';

</script>
<style scoped>
*z {
    border: rgb(255, 196, 0) solid 1px;
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
    width: 90%;
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