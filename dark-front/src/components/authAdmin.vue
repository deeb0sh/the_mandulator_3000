<template>
    <div class="aria" v-if="showAuthPanel">
        <div class="header">
            <img src="../img/shest.png" width="35px"/>
            <span><b>AuthAdmin</b></span>
        </div>
            <div class="client" v-for="(user, index) in authUsers.users" :key="index">
                <div class="users">
                    <div class="login" :title="normalDate(user.lastLoginAt)" @click="getPeersStats(user.login); showStats(user.id)"><b>{{ user.login }}</b></div>
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
                <div class="stats" v-if="selectedUserId === user.id">
                    
                        <div class="date">вход на мандулятор: <b>{{ normalDate(user.lastLoginAt) }}</b></div>
                        <div class="userPeers" v-for="(stat, index) in stats" :key="index">
                            <div class="name">{{ stat.name }}</div>
                            <div class="location">{{ stat.serverName }}</div>
                            <div>{{ formatTimestamp(stat.stats.lastHandshake) }}</div>
                            <div>{{ formatBytes(stat.stats.rx) }}</div>
                            <div>{{ formatBytes(stat.stats.tx) }}</div>
                        </div>
                  
                    <!-- {{ stats || '...'}} -->
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
            },
            selectedUserId: null,
            stats: ''
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
        },
        normalDate(isoDate) {
            const date = new Date(isoDate);
            return date.toLocaleDateString("ru-RU");
        },
        async showStats(userId) {
            if (this.selectedUserId === userId) {
                this.selectedUserId = null
            } else {
                this.selectedUserId = userId
            }
        },
        // --- метод для получаение статистики пользователя
        async getPeersStats(name) {
            const token = localStorage.getItem('jwt')
            const req = await fetch(`/wg/stats/user/${name}`,{
                method: 'GET',
                headers: {
                    'Content-type': 'application/json', 
                    'Authorization': `Bearer ${token}`, // токен на проверку
                }
            })
            const data = await req.json() // ждём ответ от сервера
            this.stats = data.data
        },
        // переводим время в человечкский вид
        formatTimestamp(timestamp) {
            if (!timestamp) return 'N/A';
            const date = new Date(timestamp * 1000);
            return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            // hour: '2-digit',
            // minute: '2-digit',
            // second: '2-digit'
        })
        },
        // Форматирование байтов в читаемые единицы (КБ, МБ, ГБ)
        formatBytes(bytes) {
            if (!bytes) return '0 B';
            const units = ['B', 'KB', 'MB', 'GB', 'TB'];
            let value = bytes;
            let unitIndex = 0;
            while (value >= 1024 && unitIndex < units.length - 1) {
                value /= 1024;
                unitIndex++;
            }
            return `${value.toFixed(2)} ${units[unitIndex]}`;
        }
    }
}
</script>
<style scoped>
/* * {
    border: #ff06de solid 1px;
}    */
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
    /* padding: 10px */
}
.users {
    display: flex;
    /* align-items:flex-start; */
    justify-content: space-between;
    gap: 1px;
    flex-direction: row;
    width: 100%;
    /* padding: 1px */
}
.login {
    width: 150px;
}
.pass {
    width: 100px;
}
.stats {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 5px;
    flex-direction: column;
    width: 100%;
    font-size: 12px;
}
.userPeers {
    display: flex;
    align-items:flex-start;
    justify-content: space-between;
    gap: 5px;
    font-size: 11px;
    flex-direction: row;
    width: 100%;
    padding-bottom: 5px;
    border: 0px solid #313131;
}

.date {
    padding: 5px;
}
.userPeers .name {
    width: 65px; /* Ширина для имени */
    overflow: hidden;
    text-overflow: ellipsis; /* Если текст длинный - обрезаем с "..." */
    white-space: nowrap;
}

.userPeers .location {
    width: 30px; 
    text-align: left; 
}

.userPeers div:not(.name):not(.location) {
    width: 80px; 
    text-align: left; 
    /* font-family: monospace; */
    /* font-size: 10px; */
}
.userPeers:hover {
    background-color: #f5f5f5;
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