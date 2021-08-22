import { createApp } from 'vue'
import App from './App.vue'
import store from '@/store'
import 'material-icons/iconfont/material-icons.css'

const app = createApp(App)
app.config.globalProperties.$store = store
app.mount('#app')
