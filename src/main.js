import { createApp } from 'vue'
import App from './App.vue'
import store from '@/store'
import PerfectScrollbar from 'vue3-perfect-scrollbar'
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'
import 'material-icons/iconfont/material-icons.css'

const app = createApp(App)
app.config.globalProperties.$store = store
app.use(PerfectScrollbar)
app.mount('#app')
