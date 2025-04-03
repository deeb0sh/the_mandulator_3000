<template> 
    <div class="main">          
        <div class="header">
            <div class="nav">
                <RouterLink to="/"><img src="../img/logozbs.png" width="80"></RouterLink>
                <span class="header-text"><i>{{ username }}</i></span>
            </div>
            <div class="nav">
                <a href="#" @click="logOut()"><img src="../img/exit2.png" ></a>
            </div>
        </div>
        <div class="container">
            <invite v-if="checkRole3(roleID) || checkRole2(roleID)" />  <!--  инваты создают только роли 2 и 3  -->
            <WG />
        </div>
        <div>
            
        </div>
    </div>     
</template>

<script>
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
                this.roleID = this.$route.params.role // получаем роль пользлвателя
                this.inCode = this.$route.params.code // текущий инвайт
        },
        mounted() {
           // 
        },
        methods: {
            checkRole3(x) {
                return x === 3
            },
            checkRole2(x) {
                return x === 2
            },
            checkRole1(x) {
                return x === 1
            },
            checkRole0 (x) {
                return x === 0
            },
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
    /* * {
        border: #ff00ff solid 1px;
    } */
    .header-text {
        font-family: HH;
        font-size: 50px;  
        color: #313131; 
    }   
    .main {
        flex: 1 0 auto;
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: top;
        align-items: center;
        
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
        flex-wrap: nowrap; /* Позволяет переносить элементы на новую строку */
        align-items: flex-start; /* Выравнивание по верхней границе */
        gap: 3px; 
     }
   
    .nav {
        display: flex;
        justify-content: center;
        align-items: center;       
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
@media (max-width:878px ) {
    .container {
        display: flex;
        flex-direction: column-reverse;  /* Колонка в обратном порядке */
        flex-wrap: wrap;                 /* Перенос на новую строку */
        justify-content: center;         /* Центрирование */
        height: auto;   
    }
}
@media (max-width:620px ) {
    .container {
        display: flex;
        flex-direction: column-reverse;  /* Колонка в обратном порядке */
        flex-wrap: wrap;                 /* Перенос на новую строку */
        justify-content: center;         /* Центрирование */
        height: auto;
        width: 100%;   
    }
    .header-text {
        font-size: 45px;  
    }
}
@media (max-width: 410px) {
    img {
        width: 40px;
    }
    .header-text {
        font-size: 38px;  
    }
    .header {
        margin-bottom: 10px;
    }
}
@media (max-width: 320px) {
    .header-text {
        font-size: 27px;  
    }
}
</style>