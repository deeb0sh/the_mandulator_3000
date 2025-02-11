import { createApp } from 'vue'

import App from './App.vue'
import Footer from './components/footer.vue'
import Player from './components/player.vue'
import RadioBlock from './components/radioblock.vue'
import Logmod from './components/login-modal.vue'
import router from './router'
//import { PromptModuleAPI } from '@vue/cli'


const app = createApp(App)
app.use(router)
app.component('RadioBlock',RadioBlock)
app.component('Player',Player)
app.component('Footer', Footer)
app.component('Logmod', Logmod)
app.mount('#app')



