import { createApp } from 'vue'
import App from '@/App'
import store from '@/store/index.js'
import PerfectScrollbar from 'vue3-perfect-scrollbar'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import 'vue3-perfect-scrollbar/dist/vue3-perfect-scrollbar.css'
import 'material-icons/iconfont/material-icons.css'

const app = createApp(App)
app.use(store)
app.use(PerfectScrollbar)
app.component('Button', Button)
app.component('Modal', Modal)
app.mount('#app')
