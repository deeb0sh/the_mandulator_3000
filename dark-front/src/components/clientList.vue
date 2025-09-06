<template>
    <div v-if="clients && clients.length" class="main" :class="{ offline: wgStats?.status === 'offline' }">
        <div v-if="location==='RU'" class="head">
            <img src="../img/rus1.png" width="25" class="pad" /> <b>Москва</b>
        </div>
        <div v-if="location==='DE'" class="head">
            <img src="../img/hun1.png" width="25"  class="pad" /> <b>Будапешт</b>
        </div>
        <div v-if="location==='FI'" class="head">
            <img src="../img/fin1.png" width="25" class="pad" /> <b>Хельсинки</b> 
        </div>
        
        <div v-if="editShow" class="edit-overlay" @click="nameClose"></div> <!--  оверленый слой для отслеживания клика при активном редактирование имения -->
        
        <div v-for="(client, index) in clients" :key="index" class="body">
            <div class="name" :title="`IP: ${client.ip}\nПоследнее подключение: ${getPeerStats(client.id) ? formatTimestamp(getPeerStats(client.id).lastHandshake) : 'N/A'}`">
                <img src="../img/conn2.png" width="13" class="pad conn" :class="{ 'active': isActive(client.id) }"/> 
                <span v-if="!editShow || editId !== client.id " @click="nameEdit(client.id)" > {{ client.name }} </span>
                
                <span v-else class="edit-form"> 
            
                  <form @submit.prevent="renameWGuser(client.id, client.name)" :title="`Только латинские символы и цифры\nБез пробелов и спец символов`">
            
                    <input :ref="'newName-' + client.id" class="txt" :class="{ 'error-border': validationError }" type="text" placeholder="Новое имя" v-model.trim="form.wgname"> 
            
                    <img class="gap" src="../img/yes.png" width="14" @click="renameWGuser(client.id, client.name)" :title="применить"/>
            
                    <!-- <img class="gap"src="../img/no.png" width="14" @click="nameClose()" :title="закрыть"/> -->
                  </form>
            
                </span>
  
             </div>
    
            <div class="stats">
                <span v-if="getPeerStats(client.id)">
                  <div>    
                    rx: {{ formatBytes(getPeerStats(client.id).rx) }}
                  </div>
                  <div>
                    tx: {{ formatBytes(getPeerStats(client.id).tx) }}
                  </div>
                </span>
                <span v-else>
                  N/A
                </span>
            </div>          
            <div class="control">
                <img src="../img/qr.png" width="18" @click="qrcode(client.id)" title="QR-Код"/>
                <img src="../img/down.png" width="18" @click="downConf(client.id, client.name)" title="Скачать"/>
                <img src="../img/del.png" width="18" @click="delConf(client.id)" title="Удалить"/>
            </div>
        </div>
  </div>
  <div v-if="showQR" @click="closeQR()" class="modal-login">
      <div class="modal">
          <canvas id="qrcode"></canvas>
      </div>
  </div>
</template>
<script>
import QRCode from 'qrcode';
import { useVuelidate } from '@vuelidate/core'
import { required, maxLength} from '@vuelidate/validators'

const regexValid = (value) => /^[a-zA-Z0-9]+$/.test(value)

export default {
  props: {
    // clients: '', типа так нельзя :(
    // location: '',
    clients: {
      type: Array,
      required: true
    },
    location: {
      type: String,
      required: true
    }
  },
  emits: [
    'user-check'
  ],
  data() {
    return {
      editShow: false,
      editId: null,
      form: { 
        wgname: null
      },
      showQR: false,
      wgStats: null,
      statsInterval: null,
      v$: useVuelidate(), // подрубаем валидатор vuelidate
      validationError: false
    }
  },
  validations: {
    form: {
      wgname: { 
        required, // поле не должно быть пусты
        maxLength: maxLength(15),  // максмум 15 символов
        regexValid
      }
    },
  },
  mounted() {
    this.getWgStats(this.location),
    this.statsInterval = setInterval(() => {
      this.getWgStats(this.location);
    }, 5000) // каждые 5 сек
  },
  beforeUnmount() {
    if (this.statsInterval) {
      clearInterval(this.statsInterval); // Очистка интервала при уничтожении компонента
    }
  },
  methods: {
    async delConf(id) {
      if (confirm("удалить?")) {
        const token = localStorage.getItem('jwt') 
        const confDel = await fetch('/wg/create', {
          method: 'DELETE',
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: id
          })
        })
        const data = await confDel.json()
        if (data.message === "valid") {
          this.$emit('user-check')
        }
      }
    },
    async downConf(id, name) {
      const token = localStorage.getItem('jwt') 
        const resp = await fetch('/wg/download', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: id
          })
        })
        
        if (resp.ok) {
          const config = await resp.text();
          // отправляем конфиг на лету
          const blob = new Blob([config], { type: 'application/octet-stream' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `${name}.conf`;  // Имя файла, который будет скачан
          link.click();
        }
      },
      async qrcode(id) {
        const token = localStorage.getItem('jwt') 
        const resp = await fetch('/wg/download', {
          method: 'POST',
          headers: {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: id
          })
        })
        const config = await resp.text();
        this.showQR = true
        this.$nextTick(() => {
          const canvas = document.getElementById('qrcode');
          if (canvas) {
            QRCode.toCanvas(canvas, config,{ width: 180 });
          }
        })
      },
      closeQR() {
        this.showQR = false
      },
      async getWgStats(server) {
        const token = localStorage.getItem('jwt')
        const req = await fetch(`/wg/stats/${server}`,{
          method: 'GET',
          headers: {
            'Content-type': 'application/json', 
            'Authorization': `Bearer ${token}`, // токен на проверку
          }
        })
        const data = await req.json() // ждём ответ от сервера
        this.wgStats = data
      },
    // получаем статистику пира по client.id
    getPeerStats(clientId) {
      if (this.wgStats?.data?.peers) {
        return this.wgStats.data.peers.find(peer => peer.id === clientId);
      }
      return null;
    },
    // переводим время в человечкский вид
    formatTimestamp(timestamp) {
      if (!timestamp) return 'N/A';
      const date = new Date(timestamp * 1000);
      return date.toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
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
    },
    // проверяем онлайн если lastHandshake больше 2 мин тогда peer оффлайн
    isActive(clientId) {
      const peer = this.getPeerStats(clientId);
      if (!peer || !peer.lastHandshake) return false;
      const now = Math.floor(Date.now() / 1000); // Текущее время в секундах
      const twoMinutes = 2 * 60; // 2 минуты в секундах
      return (now - peer.lastHandshake) <= twoMinutes;
    },
    nameEdit(id) {
      this.editId = id
      this.editShow = true
      this.form.wgname = ''
      this.validationError = false
      this.$nextTick(() => {
        const refName = 'newName-' + id;
          if (this.$refs[refName] && this.$refs[refName][0]) {
            this.$refs[refName][0].focus();
          }
      });
    },
    nameClose() {
      this.editShow = false
      this.form.wgname = ''
      this.validationError = false
    },
    async renameWGuser(id, cname) {
      this.validationError = false // сбрасываем старую ошибку валидации если она есть
      this.v$.$touch() // хуякс
      const idClient = id;
      const currentName = cname;
      const editName = this.form.wgname;
      if ( this.v$.$invalid || currentName === editName ) {
        this.validationError = true
        return // если срабатывает ничего не делаем 
      }
      try {
        const token = localStorage.getItem('jwt')
        const response = await fetch('/wg/create',{
                        method: 'PUT',
                        headers: {
                          'Content-Type': 'application/json',
                          'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({
                          id: Number(idClient),
                          wgname: editName
                        })
                   })
        const data = await response.json();
        if (data.message === "valid") {
          this.$emit('user-check'); // Обновляем список
          this.nameClose(); // Закрываем форму
        } 
        else {
          this.onErr = data.onErr || 'Ошибка сервера';
        }
      } 
      catch (error) {
        this.onErr = 'Ошибка сети';
      }
      this.editShow = false;
    }
  }
}
</script>

<style scoped>
/* * {
    border: #0e9e0e solid 1px;
}  */
.main {
  width: 100%;
  margin-bottom: 15px;
}
.main.offline {
  background-color: #ff000013; /* Красный фон с прозрачностью */
  border-radius: 8px;
}
.name {
  width: 350px;
  display: flex;
  justify-content: flex-start;     /* по горизонтали */
  align-items: center;         /* по вертикали */
  vertical-align: middle;
}
.control {
  display: flex;
  justify-content: space-between;     /* по горизонтали */
  align-items: center;         /* по вертикали */
  vertical-align: middle;
  width: 60px;
}
.pad {
  padding-right: 10px;
}
.head {
  display: flex;
  justify-content: flex-start;     /* по горизонтали */
  align-items: center;         /* по вертикали */
  vertical-align: middle;
  font-size: 17px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ffffff;
}

.stats {
  font-size: 9px;
  color: #969696;
  display: flex;
  justify-content: flex-start; /* Align tx and rx to the right */
  gap: 10px;
  width: 70px;
  margin-right: 10px; /* Optional: Add margin to fine-tune distance from .control */

  /* @media (max-width: 402px) {
    display: none; 
  } */

}

.conn {
  transition: filter 0.3s ease; /* Плавный переход для эффекта */
}

.conn.active {
  filter: drop-shadow(0 0 1px #00ff00) drop-shadow(0 0 10px #00ff00);
}

.body {
  display: flex;
  justify-content: space-between;     /* по горизонтали */
  align-items: center;         /* по вертикали */
  vertical-align: middle;
  margin: 12px;
}
.body:hover {
    background-color: #f5f5f5;
    border-radius: 8px;
    box-shadow: 0 0 10px 10px rgba(245, 245, 245, 0.6); /* Свечение того же цвета */
}

.modal-login {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #2a7449a1; /* Полупрозрачный черный цвет */
  backdrop-filter: blur(5px); /* Размытие фона */
  display: flex;
  justify-content: center;
  align-items: center;
 
}
.modal {
    background: #d8d8d8c7;
    border-radius: 8px;
    
    border: 1px solid #ffffff;
    padding: 15px;
    /* min-width: 185px;
    max-width: 185px; */
    position: absolute;
    top: 35%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.txt {
    display: inline-block;
    width: 100px;
    height: 10px;
    padding: 0.375rem 0.75rem;
    font-family: sber;
    font-size: 14px;
    font-weight: 10;
    line-height: 1;
    color: #212529;
    background-color: #ffffff;
    background-clip: padding-box;
    border: 0px solid #bdbdbd;
    border-radius: 0.25rem;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}
.txt::placeholder {
    color: #212529;
    opacity: 0.4;
}
.gap {
  padding-left: 5px;
}

.error-border {
  /* border: 0.5px solid #ff4444 !important; */
  /* box-shadow: 0 0 0 2px rgba(255, 68, 68, 0.2); */
  background-color: #ff00001a;
  transition: background-color 0.3s ease;
}
.edit-form {
  z-index: 20;
}
.edit-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0);
  z-index: 10;
}

@media (max-width: 580px) {
  .name {
    width: 280px;
  }
}

@media (max-width: 490px) {
  .name {
    width: 200px;
  }
}
@media (max-width: 400px) {
  .name {
    width: 150px;
  }
}
@media (max-width: 402px) {
  .txt {
    width: 80px; 
    padding: 0.25rem 0.5rem; /* Уменьшаем отступы */
  }
  .gap {
    padding-left: 3px;
  }
}
</style>