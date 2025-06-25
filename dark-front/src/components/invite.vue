<template>
    <div class="aria">
        <div> Инвайт код:</div>
        <div class="invite">{{ inCode }}</div>
        <div class="button">
            <button class="btn" @click="genInvite()" :disabled="this.check">{{ this.check ? 'Код не использован' : 'Сгенерировать' }}</button>
        </div>
    </div>
</template>
  
<script>
    export default {
        data() {
            return {
                inCode: "****-****",
                check: true
            }
        },
        created() {
            this.checkCode()
        },
        methods: {
            async checkCode() {
                const token = localStorage.getItem('jwt') // берём токен из локального хранилища
                const resp = await fetch('/auth/incode',{
                    method: 'GET',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }})
                const data = await resp.json()
                if (data.inCode === 'null') {
                    this.check = false
                } 
                else {
                    this.inCode = data.inCode
                    this.check = true
                }
            },
            async genInvite() { // генерируем инвайт код (ХХХХ-ХХХХ)
                const part1 = Math.random().toString(36).substring(2, 6).toUpperCase()
                const part2 = Math.random().toString(36).substring(2, 6).toUpperCase()
                this.inCode = `${part1}-${part2}`
                this.check = true
                const token = localStorage.getItem('jwt') // берём токен из локального хранилища
                const response = await fetch('/auth/incode',{
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                            incode: this.inCode,
                        })
                    })
                const data = await response.json()
                this.inCode = data.incode
              
            }
        }
    }  
</script>

<style scoped>
/* * {
    border: #313131 1px solid;
} */
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
    font-size: 23px;
    font-family: HH;
    gap: 5px;
    text-align: center;
    margin-bottom: 5px;
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
.btn:active {
  transform: scale(0.96);
  transition: transform 0.1s;
}
.btn:active {
  transform: scale(0.96);
  transition: transform 0.1s;
}
button:disabled {
    opacity: 0.5;
}

</style>
  
