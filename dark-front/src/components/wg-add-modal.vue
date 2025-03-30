<template>
    <div class="modal-add" v-if="showWGadd">
        <div class="modal">
            <div class="header">
                <img class="mand" src="../img/wireguard.svg" width="70"/>
            </div>
            <div>
                <form @submit.prevent="setWgConf()">
                    <input ref="WGlogin" class="txt" type="text" placeholder="Имя пользователя" v-model.trim="WGname" />
                    <br>
                    <div align="center">
                        <button class="btn inter">Создать</button>        
                    </div>
                </form><br>
            </div>
            <a href="#" @click="closeWGadd()">Закрыть</a>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                showWGadd: false
            }
        },
        methods: {
            openWGadd() {
                this.showWGadd = true
                this.$nextTick(() => {
                    this.$refs.WGlogin.focus() // установка курсорва на поле WGlogin
                })
            },
            closeWGadd() {
                this.showWGadd = false
            },
            setWgConf() {

            }
        }
    }
</script>

<style scoped>
.modal-add {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #2a7449a1; /* Полупрозрачный черный цвет */
  backdrop-filter: blur(5px); /* Размытие фона */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; /* Убедитесь, что модальное окно поверх других элементов */
}
.modal {
    background: #d8d8d8c7;
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