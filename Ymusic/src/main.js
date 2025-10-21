import { createApp } from 'vue'
import App from './App.vue'

// 引入路由
import router from './router'

// 引入elementPlus组件
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 引入pinia存储库
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate' // pinia持久化插件

// 引入懒加载
import VueLazyload from 'vue-lazyload';

// 引入全局css
import '@arco-design/web-vue/dist/arco.css';
import '@/style.css'

const app = createApp(App)

// 注册element图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(VueLazyload, {
    loading: './img/jige.png',
})

app.use(pinia).use(router).use(ElementPlus).mount('#app')