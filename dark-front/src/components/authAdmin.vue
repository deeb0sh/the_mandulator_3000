<template>
    <div class="aria" v-if="showAuthPanel">
        <div class="header">
            <img src="../img/shest.png" width="35px"/>
            <span><b>AuthAdmin</b></span>
        </div>
            <div class="client" v-for="(user, index) in authUsers.users" :key="index">
                <div class="users">
                    <div class="login">{{ user.login }}</div>
                    <div>
                        <select name="select" @change="newRole(user)" v-model="user.roleID" size="1" >
                            <option value="0">0</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                        </select>
                    </div>
                    <div class="pass">
                       {{ user.password || '' }}
                    </div>
                    <div>
                        <img src="../img/reset.png" width="18" @click="genPass(user.id)" title="сбросить пароль"/>
                    </div>
                    <div>
                        <img src="../img/del.png" width="18" @click="delUser(user.id)" title="Удалить"/>
                    </div>
                </div>
            </div>
            <div class="gaps">
                <button class="btn" @click="closePanel()">Закрыть</button>
            </div>
    </div>
    <div class="aria" v-else>
       
            <button class="btn" @click="getAuthDB()">authAdmin</button>
        
    </div>
</template>
<script>

export default {
    data () {
        return {
            showAuthPanel: false,
            authUsers: {
                users: []
            }
        }
    },
    methods: {
        showAuth() {
            this.showAuthPanel = true
        },
        async getAuthDB() {
            const token = localStorage.getItem('jwt')
            const response = await fetch('/auth/update', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // токен на проверку
                }
            })
            const data = await response.json()
            this.authUsers = data
            this.showAuth()
        },
        closePanel() {
            this.showAuthPanel = false
        },
        async genPass(userId) {
            if (confirm('Обновить пароль ?')) {
                let newPass = ''
                const symbols = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
                for (let i = 0; i < 10; i++) {
                    newPass += symbols.charAt(Math.floor(Math.random() * symbols.length))
                }
                const user = this.authUsers.users.find(u => u.id === userId) // хуякс
                if (user) {
                    user.password = newPass
                    const response = await fetch('/auth/update', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                        },
                        body: JSON.stringify({
                            id: userId, // uuid
                            password: newPass
                        })
                    })
                    const data = await response.json()
                    if (data.message === 'invalid') {
                       alert(data.error)
                    }
                    
                }
            }
        },
        async delUser(userId) {
            if (confirm('Удалить пользователя ? ')) {
                const response = await fetch('/auth/update', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                        },
                        body: JSON.stringify({
                            id: userId, // uuid
                        })
                    })
                const data = await response.json()
                if (data.message === 'invalid') {
                    alert(data.error)
                }
                const rmLogin = data.rmLogin.login
                const resp = await fetch('/wg/check', {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                        },
                        body: JSON.stringify({
                            login: rmLogin, // логин
                        })
                    })
                const xz = resp.json()
                if (xz.message === 'invalid') {
                       alert(xz.error)
                    }
                await this.getAuthDB()
            }
        },
        async newRole(user) {
            if (confirm('обновить роль ?')) {
                const response = await fetch('/auth/update', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                        },
                        body: JSON.stringify({
                            id: user.id, // uuid
                            newrole: user.roleID
                        })
                    })
                    const data = await response.json()
                    if (data.message === 'invalid') {
                        alert(data.error)
                    }
                    await this.getAuthDB()
            }
        }
    }
}
</script>
<style scoped>
/* * {
    border: #1f9e0e solid 1px;
}   */
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
.gaps {
    display: flex;
    justify-content: center;
    gap: 5px; 
    margin-top: 5px; 
}
.header {
    display: flex; 
    align-items: center; 
    justify-content: start; 
    height: 100%; 
    padding: 10px; 
    font-size: 25px;
}
.header img {
    width: 30px; 
    height: 30px;
    margin-right: 5px;
}
.client {
    display: flex;
    align-items:flex-start;
    justify-content: center;
    flex-direction: column;
    width: 85%;
    padding: 10px
}
.users {
    display: flex;
    align-items:flex-start;
    justify-content: space-between;
    gap: 5px;
    flex-direction: row;
    width: 100%;
    /* padding: 1px */
}
.login {
    width: 280px;
}
.pass {
    width: 100px;
}


@media (max-width: 620px) {
    .aria {
        /* margin-right: 10px; */
        padding: 0px;
        padding-top: 10px;
        padding-bottom: 10px;
        width: 100%;
    }
    .login {
        width: 160px;
    }
}

</style>