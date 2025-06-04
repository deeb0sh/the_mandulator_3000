<template>
<div class="aria">
   профиль:
    <div class="invite" >
      {{ username }}
    </div>
</div>
</template>
<script>
import { jwtDecode } from 'jwt-decode'
  export default {
    data () {
        return {
            roleID: null,
            username: null
        }
    },
    created() {
        this.getInfo()
    },
    methods: {
        getInfo() {
            const token = localStorage.getItem('jwt');
            const decod = jwtDecode(token)
            this.username = decod.user
            this.roleID = decod.role 
        }
    }
  }
</script>
<style scoped>
/* * {
    border: #8c00ff solid 1px;
} */
.aria {
    
    background: #cacaca71;
    border-radius: 8px;   
    border: 0px solid #ffffff;
    padding: 10px;
    margin-bottom: 10px;
    min-width: 230px;
    max-width: 230px;
    /* transform: translate(-50%, -50%); */
    color: #313131;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
.invite {
    color:#313131;
    padding: 10px;
    font-family: HH;
    font-size:  23px;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 5px; 
    justify-content: center; 
}
.info {
    font-size:  31px;
    width: 140px;
    display: flex;
    font-family: HH;
    justify-content:flex-start
}
</style>