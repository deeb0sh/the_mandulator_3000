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
                      <input class="txt" type="text" id="user2" placeholder="Логин" v-model.trim="forms.reg.user">
                      <br>
                      <input class="txt" type="password" id="passwd2" placeholder="Пароль" v-model.trim="forms.reg.passwd" autocomplete="no">
                      <input class="txt" type="password" placeholder="Повторить пароль" v-model.trim="forms.reg.confrim" autocomplete="no">
                      <br>
                      <input class="txt" type="text" placeholder="Инвайт код" v-model.trim="forms.reg.inCode">
                      <br>
                      {{ v$.$invalid }}
                      <center>
                            <button class="btn inter">Регистрация</button>
                      </center>
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
                      <input class="txt" type="text" id="user1" placeholder="Логин" v-model.trim="forms.login.user" >
                      <input class="txt" type="password" id="passwd1" placeholder="Пароль" v-model.trim="forms.login.passwd" autocomplete="no">
                      <br>
                      {{ v$.$invalid }}
                      <center>
                            <button class="btn inter">Вход</button>
                      </center>
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
import { ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength } from '@vuelidate/validators'

    export default {
        setup() {
            const forms = ref ({
                login: {
                    user: '',
                    passwd: ''
                },
                reg: {
                    user: '',
                    passwd: '',
                    confirm: '',
                    inCode: ''
                }
            })

            const rules = ref({
                forms: {
                    login: {
                        user: { required, minLength: minLength(3)  },
                        passwd: { required, minLength: minLength(5) }
                    },
                    reg: {
                        user: { required, minLength: minLength(3)  },
                        passwd: { required, minLength: minLength(5) },
                        confrim: { required, minLength: minLength(5)  },
                        inCode: { required, minLength: minLength(4) }
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