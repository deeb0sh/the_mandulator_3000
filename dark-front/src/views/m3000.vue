<template> 
    <div class="main">          
        <div class="container">
            <div class="nav">
                <RouterLink to="/"><img src="../img/logozbs.png" width="80"></RouterLink>
                <span class="header-text"><i>{{ username }}</i></span>
            </div>
            <div class="nav">
                <!-- <RouterLink to="/radio"><img src="../img/logo_radio.png" width="70"></RouterLink> -->
                <a href="#" @click="logOut()"><img src="../img/exit2.png" ></a>
            </div>
        </div>
        <div class="container">
            <div>роль - {{ roleID }}</div><br>
            <div>инвайт - {{ inCode }}</div>
            <invite />
        </div>
        
    </div>     
    </template>
    <script>
    //import { jwtDecode } from 'jwt-decode'

    export default {
        data() {
            return {
                username: null,
                roleID: null,
                inCode: null
            }
        },
        created() {
                this.username = this.$route.params.user // username из jwt передано с auth-serv
                this.roleID = this.$route.params.role
                this.inCode = this.$route.params.code

        },
        mounted() {
           // 
        },
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
    *z {
        border: #00ff15 solid 1px;
    }
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