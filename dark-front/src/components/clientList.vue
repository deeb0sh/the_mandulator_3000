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
                <img src="../img/qr.png" width="18" title="QR-Код"/>
                <img src="../img/down.png" width="18" @click="downConf(client.id, client.name)" title="Скачать"/>
                <img src="../img/del.png" width="18" @click="delConf(client.id, client.name)" title="Удалить"/>
            </div>
        </div>
  </div>
  
</template>
<script>
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
  data() {
    return {

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
        const blob = await resp.blob()
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${name}.conf`; // или имя клиента, если знаешь
        link.click();
        URL.revokeObjectURL(link.href);
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
</style>