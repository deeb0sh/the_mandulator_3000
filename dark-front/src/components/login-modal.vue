<template>
    <div v-if="show" class="modal-shadow">
        <div class="modal">
            <div class="header">
                <!-- <b>Мандулятор</b> -->
                <img class="mand" src="../img/logo_mand.png" width="130"/>
            </div>
            <div>
                <form @submit.prevent="setPost()">
                      <input class="txt" type="text" id="user" placeholder="Логин" v-model.trim="user">
                      <input class="txt" type="password" id="password"  placeholder="Пароль" v-model.trim="password" autocomplete="no">
                      <br>
                      <center>
                            <button class="btn inter">Вход</button>
                      </center>
                </form>
          </div><br>
          <div>
            <a href="#">Регистрация</a><br>
            <a href="#" @click="closeModal()">Закрыть</a>
          </div>    
        </div>
    </div>
</template>
<script>
    export default {
        name: "ModalWindow",
        data() {
            return {
                show: false
            }
        },
        methods: {
            closeModal() {
                this.show = false
                document.documentElement.style.overflow = 'auto'
            }
        }
    }
</script>
<style>

.modal-shadow {
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