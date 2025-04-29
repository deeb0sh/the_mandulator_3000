<template> 
    <div class="main" v-if="isValidating === false">   <!-- не показываем станицу пока не будит проведена валидация-->      
        <div class="header">
            <div class="nav">
                <RouterLink to="/"><img class="logo" src="../img/logozbs.png" width="80"></RouterLink>
                <span class="header-text"><i> DarkSurf.ru </i></span>
            </div>
            <div class="nav">
                <a href="#" @click="logOut()"><img src="../img/exit2.png" ></a>
            </div>
        </div>
        <div class="container">
            <invite v-if="checkRole3(roleID) || checkRole2(roleID) || checkRole1(roleID)" />   <!-- инваты создают только роли 2 и 3 и 1 -->
            <WG />
        </div>
        <div>
            
        </div>
    </div>     
</template>

<script>
import { getVisitorId } from '../utils/fingerP' // фингер принт
import { jwtDecode } from 'jwt-decode'
    export default {
        name: 'm3000',
        data() {
            return {
                 token: null,
                 isValidating: true,
                 username: null,
                 roleID: null,
                 inCode: null
            }
        },
        async mounted() { // валидация сессии до рендеренга мандулятора
            document.documentElement.style.overflow = 'auto' // сброс скрытие скрола
            await this.sessionValid()
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
            async sessionValid() {
                try {
                    const token = localStorage.getItem('jwt');
                    if (!token) {
                        this.$router.push('/') // если токена нет, перенаправляем на главную
                        return
                    }
                    const fingerprint = await getVisitorId()
                    const res = await fetch('/auth/login', {
                            method: 'GET',
                            headers: {
                                     'Content-Type': 'application/json',
                                     'Authorization': `Bearer ${token}`,
                                     'X-Fingerprint': fingerprint,
                             },
                    })
                    const data = await res.json();
                    if (data.message === 'valid') {
                        this.token = token
                        this.isValidating = false // Валидация прошла успешно, показываем страницу
                        const decod = jwtDecode(token)
                        this.username = decod.user
                        this.roleID = decod.role 
                    }   
                    else {
                        localStorage.removeItem('jwt');
                        this.$router.replace('/'); // если токен невалидный, перенаправляем на главную
                    }
                } 
                catch (e) {
                    this.$router.replace('/'); // ошибка, перенаправляем на главную
                }
            },
            async logOut() {
                if (confirm("Вы уверены, что хотите выйти?")) {
                    await new Promise(resolve => setTimeout(resolve, 100))
                    localStorage.clear();
                    this.$router.replace('/')
                    await this.$router.replace('/')
                }
            }
        }
    }
</script>
    
<style scoped>
    /* * {
        border: #ff00ff solid 1px;
    } * */
    .header-text {
        font-family: HH;
        font-size: 50px;  
        color: #313131; 
    }   
    
    html, body {
        height: 100%;
        margin: 0;
        padding: 0;
        overflow-y: auto; /* скролл на уровне окна */
        min-height: 100vh;
    }   

    .main {
        flex: 1 0 auto;
        width: 95%;
        min-height: 100%;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        justify-content: flex-start; /* вместо top, его нет в CSS */
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
        flex-wrap: nowrap; /* Позволяет переносить элементы на новую строку */
        align-items: flex-start; /* Выравнивание по верхней границе */
        gap: 10px; 
        
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
        flex-direction: column-reverse;  
        flex-wrap: wrap;                 
        justify-content: center;         
        height: auto;   
    }
}
@media (max-width:620px ) {
    .container {
        display: flex;
        flex-direction: column-reverse;  
        flex-wrap: wrap;                
        justify-content: center;         
        height: auto;
        width: 100%;   
    }
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