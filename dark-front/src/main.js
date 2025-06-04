import { createApp } from 'vue'

import App from './App.vue'
import Footer from './components/footer.vue'
import Player from './components/player.vue'
import RadioBlock from './components/radioblock.vue'
import Logmod from './components/login-modal.vue'
import invite from './components/invite.vue'
import profile from './components/profile.vue'
import WG from './components/wg.vue'
import clientList from './components/clientList.vue'
import router from './router'



const app = createApp(App)
app.use(router)
app.component('RadioBlock', RadioBlock)
app.component('Player', Player)
app.component('Footer', Footer)
app.component('Logmod', Logmod)
app.component('invite', invite)
app.component('profile', profile)
app.component('clientList', clientList)
app.component('WG', WG)
app.mount('#app')



