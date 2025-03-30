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
        <div>
            <WGadd ref="modal"/>
            <button class="btn" @click="showWgAdd()">Добавить</button>
        </div>
    </div>
</template>
    
<script>
    export default {
        data() {
            return {
                // ....
            }
        },
        methods: {
            showWgAdd() {
                this.$refs.modal.openWGadd()
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
</style>