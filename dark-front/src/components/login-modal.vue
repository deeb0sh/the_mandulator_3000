<template>
    <div v-if="showLogin" class="modal-login">
    <!-- модальное окно Регистрация -->
        <div v-if="showReg" class="modal">
            <div class="header">
                 <!-- <b>Регистрация</b>  -->
                <img class="mand" src="../img/logo_mand.png" width="130"/>
            </div>
            <div class="errorMsg" v-if="regTouched && v$.forms.reg.$invalid">
                <p v-if="v$.forms.reg.user.regexValid.$invalid || v$.forms.reg.password.regexValid.$invalid || v$.forms.reg.confirmPassword.regexValid.$invalid || v$.forms.reg.inCode.regexValid.$invalid">Недопустимые сиволы. </p>
                <p v-if="v$.forms.reg.user.maxLength.$invalid || v$.forms.reg.password.maxLength.$invalid || v$.forms.reg.confirmPassword.maxLength.$invalid || v$.forms.reg.inCode.maxLength.$invalid">Привышена длина. </p>
                <p v-if="v$.forms.reg.confirmPassword.sameAs.$invalid">Пароли не совподают. </p>
                <p v-if="v$.forms.reg.user.minLength.$invalid || v$.forms.reg.password.minLength.$invalid ||  v$.forms.reg.inCode.minLength.$invalid">Минимум 4 символа. </p>
            </div>
            <div>
                <form @submit.prevent="setPostReg()">
                        <input class="txt" type="text" placeholder="Логин" v-model.trim="forms.reg.user" @input="regTouched=true" @keyup="regTouched=true" @compositionupdate="regTouched=true">
                        <br>
                        <input class="txt" type="password" id="password" placeholder="Пароль" v-model.trim="forms.reg.password" @input="userTouched=true" @keyup="regTouched=true" @compositionupdate="regTouched=true">
                        <input class="txt" type="password" id="confirmPassword" placeholder="Повторить пароль" v-model.trim="forms.reg.confirmPassword" @input="regTouched=true" @keyup="regTouched=true" @compositionupdate="regTouched=true">
                        <br>
                        <input class="txt" type="text" placeholder="Инвайт код" v-model.trim="forms.reg.inCode" @input="regTouched=true" @keyup="regTouched=true" @compositionupdate="regTouched=true">
                        <br>
                        <div align="center">
                            <button class="btn inter" :disabled="v$.forms.reg.$invalid">Регистрация</button>
                        </div>
                </form>
          </div><br>
          <div>
            <a href="#" @click="closeregForm()">Вход</a><br>
            <a href="#" @click="closeModal()">Закрыть</a>
          </div>    
        </div>
    
    <!-- модальное окно Логин -->
        <div v-else class="modal">
            <div class="header">
                <!-- <b>Логин</b>  -->
                <img class="mand" src="../img/logo_mand.png" width="130"/>
            </div>
            <div class="errorMsg" v-if="userTouched && v$.forms.login.user.regexValid.$invalid || v$.forms.login.passwd.regexValid.$invalid || v$.forms.login.user.maxLength.$invalid || v$.forms.login.passwd.maxLength.$invalid ">
                <p v-if="v$.forms.login.user.regexValid.$invalid || v$.forms.login.passwd.regexValid.$invalid">Недопустимые сиволы. </p>
                <p v-if="v$.forms.login.user.maxLength.$invalid || v$.forms.login.passwd.maxLength.$invalid">Привышена длина. </p>
            </div>
            <div>
                <form @submit.prevent="setPostLogin()">
                      <input class="txt" type="text" placeholder="Логин" v-model.trim="forms.login.user" @input="userTouched=true" @keyup="userTouched=true" @compositionupdate="userTouched=true"> 
                      <input class="txt" type="password" placeholder="Пароль" v-model.trim="forms.login.passwd" @input="userTouched=true" @keyup="userTouched=true" @compositionupdate="userTouched=true" autocomplete="no">
                      <br>
                      <div align="center">
                            <button class="btn inter" :disabled="v$.forms.login.$invalid">Вход</button>
                      </div>
                </form>
            </div><br>
            <div>
                <a href="#" @click="regForm()">Регистрация</a><br>
                <a href="#" @click="closeModal()">Закрыть</a>
            </div>    
        </div>
    </div>
</template>
<script>
import { ref, computed } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, sameAs, helpers, maxLength } from '@vuelidate/validators'

    const regexValid = helpers.regex(/^[a-zA-Z0-9_]+$/)

    const userTouched = ref(false)
    const regTouched = ref(false)

    export default {
        setup() {
   
            const forms = ref({
                login: {
                    user: '',
                    passwd: ''
                },
                reg: {
                    user: '',
                    password: '',
                    confirmPassword: '',
                    inCode: ''
                }
            })

            const rules = ref({
                forms: {
                    login: {
                        user: { required, regexValid, maxLength: maxLength(20) },
                        passwd: { required, regexValid,maxLength: maxLength(20) }
                    },
                    reg: {
                        user: { required, regexValid, minLength: minLength(4),maxLength: maxLength(20)  },
                        password: { required, regexValid, minLength: minLength(4),maxLength: maxLength(20) },
                        confirmPassword: { required, regexValid,maxLength: maxLength(20), sameAs: sameAs(computed(() => forms.value.reg.password)) },
                        inCode: { required, regexValid, minLength: minLength(4), maxLength: maxLength(20) }
                    }
                }
            })

            const v$ = useVuelidate(rules, { forms })
            
            const setPostLogin = () => {
                if (v$.value.forms.login.$invalid) {
                    alert('хуй 1')
                    return
                }
                alert('логин улетел')       
            }

            const setPostReg = () => {
                if (v$.value.forms.reg.$invalid) {
                    alert('XYq 2')
                    return
                }
                alert('регистрация ушла')
            }

            return { forms, v$, userTouched, regTouched, setPostLogin, setPostReg}
        },
        data() {
            return {
                showReg: false,
                showLogin: false,
            }
        },
        methods: {
            closeModal() {
                this.showLogin = false
                this.showReg = false
                document.documentElement.style.overflow = 'auto'
            },
            regForm() {
                this.showReg = true
            },
            closeregForm() {
                this.showReg = false
            }
        }
    }
</script>
<style>

.modal-login {
    position: absolute;
    top: 0;
    left: 0;
    min-height: 100%;
    width: 100%;
    background: #2a7449a1;
}
.modal {
    background: #d8d8d8ea;
    border-radius: 8px;
    border: 1px solid #ffffff;
    padding: 15px;
    min-width: 185px;
    max-width: 185px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.errorMsg {
    position:fixed; 
    z-index: 999; 
    margin-top:-50%;
    color:#ffffff; 
    font-size: 10px;
    align-items: center;
    text-align: center;
    width: 185px;
    background: #2a7449a1;
    border-radius: 6px;
}
.btn {
    display: inline-block;
    outline: none;
    border: 1px solid #313131;
    border-radius: 6px;
    font-family: sber;
    align-items: center;
    vertical-align: middle;
    line-height: 28px;
    font-size: 14px;
    text-decoration: none;
    color: #313131;
    background-color: #ffffff;
    cursor: pointer;
    user-select: none;
    appearance: none;
}
.inter {
    color: #ffffff;
    background-color: #313131;
}
button:disabled {
    opacity: 0.5;
}
.txt {
    display: block;
    width: 160px;
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
.header {
    font-family: sber;
    font-size: 25px;  
    color: #313131;
    text-align: center;
}
.mand {
    margin-top: 10px;
    margin-bottom: 20px;
}
a {
    color: #313131;
  }
</style>