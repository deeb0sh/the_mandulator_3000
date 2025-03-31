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
            <!-- <WGadd ref="modal"/> -->
            <button class="btn" @click="showWgAdd()">Добавить</button>
        </div>
        <div v-else class="wgadd">
            <form @submit.prevent="">
                <input ref="WGname" class="txt" type="text" placeholder="Имя пользователя" v-model.trim="wguser" />
                <img src="../img/rus1.png" width="30" @click="setLocaltion('RU')"/>
                <img src="../img/fin1.png" width="30" @click="setLocaltion('FI')"/>
                <img src="../img/ger1.png" width="30" @click="setLocaltion('DE')"/>     
                <button class="btn" @click="">Создать</button>
                <button class="btn" @click="closeWgAdd()">Отмена</button>
            </form>
        </div>
    </div>
</template>
    
<script>
    export default {
        data() {
            return {
                showAddMenu: false
            }
        },
        methods: {
            showWgAdd() {
                this.showAddMenu = true
                this.$nextTick(() => {
                    this.$refs.WGname.focus() // установка курсорва на поле ЛОГИН 
                })
            },
            closeWgAdd() {
                this.showAddMenu = false
                this.wguser = ''
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
    margin-left: 5px;
    /* transform: translate(-50%, -50%); */
    color: #313131;
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
    width: 30px; /* Примерный размер */
    height: 30px;
    margin-right: 10px; /* Отступ между картинкой и текстом */
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
  align-items: center; /* Выравнивание по вертикали */
  gap: 5px; /* Отступы между элементами */
}
</style>