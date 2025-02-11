<template> 
<div class="main">          
    <div class="container">
        <div class="nav">
            <RouterLink to="/"><img src="../img/logozbs.png" width="165"></RouterLink>
            <span class="header-text"><i>window to the pindos</i></span>
        </div>
        <div class="nav">
            <RouterLink to="/radio"><img src="../img/logo_radio.png" width="70"></RouterLink>
            <!-- <RouterLink to="/m3000"><img src="../img/logo_mand.png" width="70"></RouterLink> -->
            <a href="#" @mouseover="OnMouseMSG('Мандулятор 3000')" @click="LoginShow()"><img src="../img/logo_mand.png" width="70"></a>
            <RouterLink to="/pindos"><img src="../img/logo_pindos.png" width="70"></RouterLink>                      
        </div>
    </div>
    <div>
        <h1>Отложено</h1>
    </div>
    <!-- <div>
        <form @submit.prevent="">
            <input class="txt" type="text" id="Url" placeholder="Url" v-model.trim="Url">
            <button class="btn inter"> Go </button>
        </form>
      <br>
    </div>
    <iframe v-bind:srcdoc="data" style="width: 100%; height: 80vh; border: none;"></iframe> 
      <p v-html="data"></p> -->
      <Logmod ref="modal" />
</div>     
</template>
<script>
export default {
    data(){
        return {
            data: ''
        };
    },
    methods: {
        LoginShow() {
                this.$refs.modal.show = true
            },
        async setUrl() {
            const resp = await fetch(
                '/api/proxy',{
                    mode: 'cors',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ "PostURL" : this.Url })
                }
            )
            this.data = await resp.text()
        }
    }
}
</script>

<style scoped>
*z {
    border: #00ff15 solid 1px;
}

.header-text {
    font-family: HH;
    font-size: 50px;  
    color: #313131; 
}

.main {
    flex: 1 0 auto;
    width: 90%;
    display: flex;
    flex-direction: column;
    justify-content: top;
    align-items:center;
}

.container {
    margin-top: 20px;
    margin-bottom: 30px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.nav {
    display: flex;
    justify-content: center;
    align-items: center;   
}

.btn {
    display: inline-block;
    outline: none;
    border: 1px solid #313131;
    border-radius: 6px;
    font-family: sber;
    align-items: center;
    vertical-align: middle;
    line-height: 28px;
    font-size: 14px;
    text-decoration: none;
    color: #313131;
    background-color: #ffffff;
    cursor: pointer;
    user-select: none;
    appearance: none;
}

.inter {
    color: #ffffff;
    background-color: #313131;
}
.txt {
    display: block;
    width: 360px;
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
</style>