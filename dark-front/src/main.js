import { createApp } from 'vue'

import App from './App.vue'
import Footer from './components/footer.vue'
import Player from './components/player.vue'
import RadioBlock from './components/radioblock.vue'
import router from './router'


const app = createApp(App)
app.use(router)
app.component('RadioBlock',RadioBlock)
app.component('Player',Player)
app.component('Footer', Footer)
app.mount('#app')



