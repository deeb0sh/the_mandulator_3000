<template>
    <div v-if="showLogin" class="modal-login">
    <!-- модальное окно Регистрация -->
        <div v-if="showReg" class="modal">
            <div class="header">
                 <!-- <b>Регистрация</b>  -->
                <img class="mand" src="../img/logo_mand.png" width="130"/>
            </div>
            <div>
                <form @submit.prevent="setPostReg()">
                      <input class="txt" type="text" placeholder="Логин" v-model.trim="forms.reg.user">
                      <br>
                      <input class="txt" type="password" id="password" placeholder="Пароль" v-model.trim="forms.reg.password" >
                      <input class="txt" type="password" id="confirmPassword" placeholder="Повторить пароль" v-model.trim="forms.reg.confirmPassword" >
                      <br>
                      <input class="txt" type="text" placeholder="Инвайт код" v-model.trim="forms.reg.inCode">
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
            <div>
                <form @submit.prevent="setPostLogin()">
                      <input class="txt" type="text" placeholder="Логин" v-model.trim="forms.login.user">
                      <input class="txt" type="password" placeholder="Пароль" v-model.trim="forms.login.passwd" autocomplete="no">
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
import { required, minLength, sameAs, helpers } from '@vuelidate/validators'

    const regexValid = helpers.regex(/^[a-zA-Z0-9_]+$/)

       
    export default {
        setup() {
            const forms = ref ({
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
                        user: { required, regexValid },
                        passwd: { required, regexValid }
                    },
                    reg: {
                        user: { required, regexValid, minLength: minLength(3)  },
                        password: { required, regexValid, minLength: minLength(5) },
                        confirmPassword: { required, regexValid, sameAs: sameAs(computed(() => forms.value.reg.password)) },
                        inCode: { required, regexValid, minLength: minLength(4) }
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

            return { forms, v$, setPostLogin, setPostReg}
        },
        data() {
            return {
                showReg: false,
                showLogin: false,
                // passwd: '',
                // confirm: '',
                // user:'',
                // inCode: ''
            }
        },
        methods: {
            // setPostLogin() {
            //     if (!this.$v.$invalid) {
            //         alert('логин улетел')
            //     }
            //     else {
            //         alert('ХУй')
            //     }
            // },
            // setPostReg() {
            //         alert('регистрация улетела')
            // },
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