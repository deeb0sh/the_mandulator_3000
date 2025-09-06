<template>
    <div class="aria">
        <div class="header">
            <img src="../img/wireguard.svg" width="35px"/>
            <span><b>WireGuard</b></span>
        </div>
        <div class="client">
            <clientList :clients="ruClients" location="RU" @user-check="userCheck" />  
            <clientList :clients="deClients" location="DE" @user-check="userCheck" />
            <clientList :clients="fiClients" location="FI" @user-check="userCheck" />    
        </div>
       <!-- ХОБА БЛЕТЬ -->
        <div v-if="!showAddMenu" class="nav">
            <button class="btn" @click="showWgAdd()">Добавить</button>
        </div>
        <div v-else class="wgadd">
            <form @submit.prevent="createWGuser()">
                <div class="nav">
                    <input ref="WGname" class="txt" :class="{ 'error-border': validationError }" type="text" placeholder="Имя пользователя" v-model.trim="form.wguser" @input="validationError = false" />
                </div>
                <div class="nav">
                    <img src="../img/rus1.png" width="30" :class="{ selected: location === 'RU' }" @click="setLocaltion('RU')" />
                    <img src="../img/fin1.png" width="30" :class="{ selected: location === 'FI' }" @click="setLocaltion('FI')" />
                    <img src="../img/hun1.png" width="30" :class="{ selected: location === 'DE' }" @click="setLocaltion('DE')" />     
                    <button class="btn" type="submit">Создать</button>
                    <button class="btn" @click="closeWgAdd()">Отмена</button>
                </div>
            </form>
        </div>
       
        <div  v-if="v$.form.wguser.$error || v$.location.$error || onErr" class="errorMsg">
            <span v-if="v$.form.wguser.$error" class="user-error">
                Только: a-z, A-Z, 0-9 и 1 - 15 символов
            </span>
            <div>
            <span v-if="v$.location.$error" class="location-error">
                Выбери локацию
            </span>
            <span v-if="onErr" class="limit-error">
                {{ onErr }}
            </span>
            </div>
        </div>
    </div>
</template>
    
<script>
import { useVuelidate } from '@vuelidate/core'
import { required, maxLength} from '@vuelidate/validators'


const regexValid = (value) => /^[a-zA-Z0-9]+$/.test(value)

    export default {
        data() {
            return {
                ruClients: [],
                deClients: [],
                fiClients: [],
                showAddMenu: false,
                location: null,
                onErr: null,
                allClient: null,
                form: {
                    wguser: ''
                },
                v$: useVuelidate(), // подрубаем валидатор vuelidate
                validationError: false // для подкрашивания инпут
            }
        },
        created() {
            this.userCheck()
        },
        validations: {
            form: {
                wguser: { 
                    required,
                    maxLength: maxLength(15),
                    regexValid
                }
            },
            location: { required }
        },
        methods: {
            async userCheck() {
                try {
                    const token = localStorage.getItem('jwt')
                    const req = await fetch('/wg/check',{
                        method: 'GET',
                        headers: {
                            'Content-type': 'application/json', 
                            'Authorization': `Bearer ${token}`, // токен на проверку
                        }
                    })
                    const data = await req.json() // ждём ответ от сервера
                    if ( data.message == "invalid") {
                        localStorage.removeItem('jwt')
                        this.onErr = data.onErr  
                        this.$router.push('/')
                    }
                    if ( data.message == "valid") {
                        if (Array.isArray(data.allClinet) && data.allClinet.length > 0) { // проверяем является ли массивом И его длина больше 0
                                this.allClient = data.allClinet[0].clients
                                this.ruClients = this.allClient.filter(c => c.serverName === 'RU') 
                                this.deClients = this.allClient.filter(c => c.serverName === 'DE')
                                this.fiClients = this.allClient.filter(c => c.serverName === 'FI')
                        } 
                        else {
                                this.allClient = [] // или обработка ошибки
                        }
                    }       
                }
                catch (e) {
                    this.onErr = `Oшибка! WG-сервер не отвечает ${e}`
                }
            },
            async createWGuser() { // метод создание впн-полтьзователя
                //this.v$.$invalid = false
                this.v$.$touch()
                                 
                // if (this.v$.$invalid) return // если сработал валидаор то всё
                
                if (this.v$.form.wguser.required.$invalid || this.v$.form.wguser.regexValid.$invalid || this.v$.location.required.$invalid) {
                    this.validationError = true
                    //console.log(this.v$.$errors)
                    return
                }
                
                const token = localStorage.getItem('jwt') // 
                const req = await fetch('/wg/create',{
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                            wguser: this.form.wguser, 
                            location: this.location,              
                    })
                })
                const data = await req.json()
                this.onErr = data.onErr
                if (!this.onErr) {
                    this.userCheck()
                    this.showAddMenu = false 
                } 
            },
            showWgAdd() { // показать меню добавления пользователя
                this.showAddMenu = true
                this.$nextTick(() => { // textTick ждать полного рендеренга ДОМ
                    this.$refs.WGname.focus() // установка курсорва на поле ЛОГИН 
                })
            },
            closeWgAdd() { // закрываем меню добавляние профиля и очищаем форму
                this.showAddMenu = false
                this.form.wguser = ''
                this.location = null,
                this.onErr = '',
                this.v$.$reset(),
                this.validationError = false
            },
            setLocaltion(x) {
                this.location = x
            }
        }
    }
</script>

<style scoped>
/* * {
    border: #1f9e0e solid 1px;
}  */
.aria {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background: #cacaca71;
    border-radius: 8px;   
    border: 0px solid #ffffff;
    padding: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    width: 600px;
    /* margin-left: 5px; */
    /* transform: translate(-50%, -50%); */
    color: #313131;
}
.client {
    display: flex;
    align-items:flex-start;
    justify-content: center;
    flex-direction: column;
    width: 90%;
    padding: 10px
}
.errorMsg {
    position: relative;
    padding-top: 5px;
    width: 490px;
    color: #ff0000a1;
    /* color: #313131; */
    font-size: 10px;
    text-align: left;
}
.user-error {
    position: absolute;
    top: 0;
    left: 0;
}
.location-error {
    position: absolute;
    top: 0; 
    left: 275px;
}
.limit-error {
    position: absolute;
    top: 0; 
    left: 275px;
}
.header {
    display: flex; 
    align-items: center; 
    justify-content: start; 
    height: 100%; 
    padding: 10px; 
    font-size: 25px;
}
.header img {
    width: 30px; 
    height: 30px;
    margin-right: 5px;
}
.btn {
    display: inline-block;
    outline: none;
    border: 0px solid #313131;
    border-radius: 6px;
    font-family: sber;
    align-items: center;
    vertical-align: middle;
    line-height: 28px;
    font-size: 14px;
    text-decoration: none;
    color: #ffffff;
    background-color: #313131;
    cursor: pointer;
    user-select: none;
    appearance: none;
}
.btn:active {
  transform: scale(0.96);
  transition: transform 0.1s;
}
.txt {
    display: block;
    width: 260px;
    height: 20px;
    padding: 0.375rem 0.75rem;
    font-family: sber;
    font-size: 14px;
    font-weight: 10;
    line-height: 1.5;
    color: #212529;
    background-color: #ffffff;
    background-clip: padding-box;
    border: 1px solid #bdbdbd;
    border-radius: 0.25rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
.txt::placeholder {
    color: #212529;
    opacity: 0.4;
}
.wgadd form {
    display: flex;
    align-items: center; 
    gap: 5px; 
}
.wgadd img.selected {
    border-bottom: 1px solid #313131;
    padding-bottom: 3px;   
}
.nav {
    display: flex;
    align-items: center; 
    gap: 5px; 
    padding-top: 10px;
}
.error-border {
    /* border: 0.5px solid #ff4444 !important; */
    /* box-shadow: 0 0 0 2px rgba(255, 68, 68, 0.2); */
    background-color: #ff00001a;
    transition: background-color 0.3s ease;
}
@media (max-width: 620px) {
    .aria {
        border-radius: 8px;   
        border: 0px solid #ffffff;
        padding: 0px;
        width: 100%;
        
        padding-bottom: 10px;
    }
    .wgadd form {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        align-items: center; 
        gap: 5px; 
    }
    .txt {
        width: 220px;
    }
    .errorMsg {
        position: relative;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        align-items: center; 
        width: 100%;
        /* padding: 3px; */
    }
    .user-error {
        position: relative;
    }
    .location-error {
        position: relative;
        left: 0px;
    }
    .limit-error {
        position: relative;
        left: 0px;
    }
}


</style>