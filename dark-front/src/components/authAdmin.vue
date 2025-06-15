<template>
    <div class="aria" v-if="showAuthPanel">
        <span>
            Панель Authorization
        </span>
        {{ authUsers }}
    </div>
    <div class="aria" v-else>
        <button class="btn" @click="showAuth">Открыть Панель authAdmin</button>
    </div>
</template>
<script>

export default {
    data () {
        return {
            showAuthPanel: false,
            authUsers: ''            
        }
    },
    methods: {
        showAuth() {
            this.showAuthPanel = true
        },
        async getAuthDB() {
            const token = localStorage.getItem('jwt')
            const response = await fetch('/auth/panel', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // токен на проверку
                }
            })
            const data = await response.json()
            this.authUsers = data
        }
    }
}
</script>
<style scoped>
/* * {
    border: #1f9e0e solid 1px;
}  */
.aria {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background: #cacaca71;
    border-radius: 8px;   
    border: 0px solid #ffffff;
    margin-top: 10px;
    padding: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    width: 600px;
    /* margin-left: 5px; */
    /* transform: translate(-50%, -50%); */
    color: #313131;
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