<template> 
    <div class="main">          
        <div class="container">
            <div class="nav">
                <RouterLink to="/"><img src="../img/logozbs.png" width="165"></RouterLink>
                <span class="header-text"><i>Mandulator 3000</i></span>
            </div>
            <div class="nav">
                <RouterLink to="/radio"><img src="../img/logo_radio.png" width="70"></RouterLink>
                <a href="#" @click="logOut()"><img src="../img/exit1.png" width="70"></a>
            </div>
        </div>
    </div>     
    </template>
    <script>
    export default {
        methods: {
            logOut() {
                if (confirm("Вы уверены, что хотите выйти?")) {
                    localStorage.removeItem('jwt')
                    this.$router.push('/')
                }
            }
        }
    }
    </script>
    
    <style scoped>
    
    .header-text {
        font-family: HH;
        font-size: 50px;  
        color: #313131; 
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
    
    .nav {
        display: flex;
        justify-content: center;
        align-items: center;
        
    }
    </style>