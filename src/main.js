import { createApp } from 'vue'
import App from '@/App'
import store from '@/store/index.js'
import PerfectScrollbar from 'vue3-perfect-scrollbar'
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'
import 'material-icons/iconfont/material-icons.css'

const app = createApp(App)
app.use(store)
app.use(PerfectScrollbar)
app.mount('#app')
