<template>
    <div class="aria">
        <div> Инвайт код:</div>
        <div class="invite">{{ inCode }}</div>
        <div class="button">
            <button class="btn" @click="genInvite()" :disabled="this.$route.params.code">{{ this.$route.params.code ? 'Код не использован' : 'Сгенерировать' }}</button>
        </div>
    </div>
</template>
  
<script>
    export default {
        data() {
            return {
                inCode: "****-****"
            }
        },
        created() {
            this.checkCode()
        },
        methods: {
            checkCode() {
                if (this.$route.params.code) {
                    this.inCode = this.$route.params.code
                }
            },
            genInvite() { // генерируем инвайт код
                const part1 = Math.random().toString(36).substring(2, 6).toUpperCase()
                const part2 = Math.random().toString(36).substring(2, 6).toUpperCase()
                this.inCode = `${part1}-${part2}`
            }
        }
    }
</script>

<style scoped>
*z {
    border: rgb(140, 0, 255) solid 1px;
}
.aria {
    background: #2a7449a1;
    border-radius: 8px;   
    border: 1px solid #ffffff;
    padding: 10px;
    min-width: 230px;
    max-width: 230px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #313131;
}

.invite {
    color:#ffffff;
    font-size: 31px;
    text-align: center;
}
.button {
    text-align: center;
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
</style>
  
