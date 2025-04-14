<template>
    <div v-if="clients && clients.length" class="main">
        <div v-if="location==='RU'" class="head">
            <img src="../img/rus1.png" width="25" class="pad" /> <b>Москва</b>
        </div>
        <div v-if="location==='DE'" class="head">
            <img src="../img/ger1.png" width="25"  class="pad" /> <b>Франкфурт</b>
        </div>
        <div v-if="location==='FI'" class="head">
            <img src="../img/fin1.png" width="25" class="pad" /> <b>Хельсинки</b>
        </div>
    
        <div v-for="(client, index) in clients" :key="index" class="body">
            <div class="name" :title=client.ip>
                <img src="../img/conn2.png" width="13" class="pad" /> 
                {{ client.name }} 
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
      showQR: false
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
          // Сохраняем конфиг в файл
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
.name {
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
.body {
  display: flex;
  justify-content: space-between;     /* по горизонтали */
  align-items: center;         /* по вертикали */
  vertical-align: middle;
  margin: 12px;
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
  z-index: 1000; /* Убедитесь, что модальное окно поверх других элементов */
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
</style>