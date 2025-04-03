<template>
    <div class="aria">
        <div class="header">
            <img src="../img/wireguard.svg" width="35px"/>
            <span><b>WireGuard</b></span>
        </div>
        <div>
            <p>user1</p>
            <p>user1</p>
            <p>user1</p>
        </div>
       <!-- ХОБА БЛЕТЬ -->
        <div v-if="!showAddMenu">
            <button class="btn" @click="showWgAdd()">Добавить</button>
        </div>
        <div v-else class="wgadd">
            <form @submit.prevent="createWGuser()">
                <div class="nav">
                    <input ref="WGname" class="txt" type="text" placeholder="Имя пользователя" v-model.trim="form.wguser" />
                </div>
                <div class="nav">
                    <img src="../img/rus1.png" width="30" :class="{ selected: location === 'RU' }" @click="setLocaltion('RU')" />
                    <img src="../img/fin1.png" width="30" :class="{ selected: location === 'FI' }" @click="setLocaltion('FI')" />
                    <img src="../img/ger1.png" width="30" :class="{ selected: location === 'DE' }" @click="setLocaltion('DE')" />     
                    <button class="btn" @click="">Создать</button>
                    <button class="btn" @click="closeWgAdd()">Отмена</button>
                </div>
            </form>
        </div>
        
        <div  v-if="v$.form.wguser.$error || v$.location.$error" class="errorMsg">
            <span v-if="v$.form.wguser.$error" class="user-error">
                Только: a-z, A-Z, 0-9 и максимум 20 символов
            </span>
            <span v-if="v$.location.$error" class="location-error">
                Выбери локацию
            </span>
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
                showAddMenu: false,
                location: null,
                form: {
                    wguser: ''
                },
                v$: useVuelidate()
            }
        },
        validations: {
            form: {
                wguser: { 
                    required,
                    maxLength: maxLength(20),
                    regexValid
                }
            },
            location: { required }
        },
        methods: {
            async createWGuser() {
                this.v$.$touch()
                if ( this.v$.$invalid ) {
                    return // если срабатывает ничего не делаем
                }

                
                const token = localStorage.getItem('jwt')
                const req = await fetch('/users/wgcreate',{
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                            user: this.form.wguser, // передаём имя 
                            location: this.location // передаём локацию
                        })
                })

            },
            showWgAdd() {
                this.showAddMenu = true
                this.$nextTick(() => { // textTick ждать полного рендеренга ДОМ
                    this.$refs.WGname.focus() // установка курсорва на поле ЛОГИН 
                })
            },
            closeWgAdd() { // закрываем меню добавляние профиля и очищаем форму
                this.showAddMenu = false
                this.form.wguser = ''
                this.location = null
                this.v$.$reset()
            },
            setLocaltion(x) {
                this.location = x
            }
        }
    }
</script>

<style scoped>
/* * {
    border: #9e0e0e solid 1px;
} */
.aria {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background: #cacaca94;
    border-radius: 8px;   
    border: 1px solid #ffffff;
    padding: 10px;
    width: 600px;
    /* margin-left: 5px; */
    /* transform: translate(-50%, -50%); */
    color: #313131;
}
.errorMsg {
    position: relative;
    padding-top: 5px;
    width: 490px;
    color: #313131;
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
.header {
    display: flex; 
    align-items: center; /* Выравнивание по вертикали */
    justify-content: start; /* Оставляем элементы слева (по умолчанию) */
    height: 100%; /* Пример фиксированной высоты */
    padding: 10px; /* Отступы */
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
}
@media (max-width: 620px) {
    .aria {
        border-radius: 0px;   
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
}


</style>