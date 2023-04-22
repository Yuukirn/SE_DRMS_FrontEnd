import { createApp,Vue } from 'vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

createApp(App).use(router).use(Antd).use(createPinia()).mount('#app')
