<template>
<div class="aria">
   профиль:
    <div class="invite" >
      <div class="block">
        {{ username }}
        <img src="../img/oko.png" width="120" v-if="roleID === 3 || roleID === 2"/>
        <img src="../img/diamond2.png" width="160" v-else-if="roleID ===1"/>
        <img src="../img/diamond1.png" width="160" v-else />
      </div>
      <div class="block padd-top" v-if="!show">
            <button class="btn" @click="showForm()" >Сменить пароль</button>
      </div>
      <div class="block padd-top" v-else :title="`Требования к паролю:\nТолько латинские символы\nЦифры и - _`">
      <form @submit.prevent="newPassword()">
        <div class="input">
            <input ref="pass" autofocus class="txt" :class="{ 'error-border': validationError }" type="text" v-model.trim="form.password" placeholder="Новый пароль" @input="validationError = false; errorMsg = ''" >
            <input class="txt" :class="{ 'error-border': validationError }" type="text" v-model.trim="form.confirmPassword" placeholder="Подтверждение" @input="validationError = false; errorMsg = ''" >
        </div>
        <div class="error-message" v-if="validationError">
            {{ errorMsg }}
        </div>
        <div class="error-message hide" v-else>
            &nbsp;
        </div>
        <div class="gaps">
            <button class="btn" @click="showForm()">Сменить</button>
            <button class="btn" @click="closeForm()">Отмена</button>
        </div>
      </form>
      </div>
    </div>
</div>
</template>
<script>
import { jwtDecode } from 'jwt-decode'
import { useVuelidate } from '@vuelidate/core'
import { required, maxLength} from '@vuelidate/validators'

const regexValid = (value) => /^[a-zA-Z0-9_-]+$/.test(value)

  export default {
    data () {
        return {
            roleID: null,
            username: null,
            show: false,
            v$: useVuelidate(),
            validationError: false, // переменная для подсветки инпута
            form: {
                password: '',
                confirmPassword: ''
            },
            errorMsg: ''
        }
    },
    created() {
        this.getInfo()
    },
    validations: {
        form: {
            password: { 
                required, // поле не должно быть пусты
                maxLength: maxLength(15),  // максмум 15 символов
                regexValid
            },
            confirmPassword: {
                required,
                maxLength: maxLength(15),
                regexValid
            }
        }
    },
    methods: {
        getInfo() {
            const token = localStorage.getItem('jwt');
            const decod = jwtDecode(token)
            this.username = decod.user
            this.roleID = decod.role 
        },
        showForm() {
            this.show = true
            this.$nextTick(() => { // textTick ждать полного рендеренга ДОМ
                    this.$refs.pass.focus() // установка курсорва на поле ЛОГИН 
                })
        },
        async newPassword() {
             this.v$.$touch()

             if (this.v$.form.password.required.$invalid || this.v$.form.confirmPassword.required.$invalid) {
                this.validationError = true
                this.errorMsg = 'Поля не должны быть пустыми'
                return
             }

             if (this.v$.form.password.regexValid.$invalid || this.v$.form.confirmPassword.regexValid.$invalid) {
                this.validationError = true
                this.errorMsg = 'Только латинские цифры и -_'
                return
             }

             if (this.form.password != this.form.confirmPassword) {
                this.validationError = true
                this.errorMsg = 'Пароли не совподают'
                return 
             }

             const token = localStorage.getItem('jwt')
             const response = await fetch('/auth/newpass', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json', 
                    'Authorization': `Bearer ${token}`, // токен на проверку
                },
                body: JSON.stringify({
                    password: this.form.password,
                    confirmPassword: this.form.confirmPassword
                })
             })
            
            const data = await response.json()
            if (data.message === 'invalid') {
                this.errorMsg = 'ошибка на сервере'
            }
        
        },
        closeForm() {
            this.show = false
            this.form.password = ''
            this.form.confirmPassword = ''
            this.validationError = false
        }
    }
  }

</script>
<style scoped>
/* * {
    border: #8c00ff solid 1px;  
}  */
.aria {
    background: #cacaca71;
    border-radius: 8px;   
    border: 0px solid #ffffff;
    padding: 10px;
    margin-bottom: 10px;
    min-width: 230px;
    max-width: 100%;
    /* transform: translate(-50%, -50%); */
    color: #313131;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
.invite {
    color:#313131;
    padding: 10px;
    font-family: HH;
    font-size:  23px;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 5px; 
    justify-content: center; 
    align-items: center;
}
.block {
    display: flex;
    flex-direction: column;
}
.padd-top {
    display: flex;
    margin-top: 15px;
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
button:disabled {
    opacity: 0.5;
}
.txt {
    display: block;
    width: 140px;
    height: 16px;
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
.error-border {
    /* border: 0.5px solid #ff4444 !important;
    box-shadow: 0 0 0 2px rgba(255, 68, 68, 0.2); */
    background-color: #ff00001a;
    transition: background-color 0.3s ease;
}
.gaps {
    display: flex;
    justify-content: center;
    gap: 5px; 
    margin-top: 5px; 
}
.error-message {
    display: block;
    font-family: Sber;
    height: 15px; 
    color: #ff0000a1;
    font-size: 10px;
    margin-top: 4px;
}
.hide {
    visibility: hidden;
}
.input {
    display: flex;
    flex-direction: column;
    gap: 5px; 
}
</style>