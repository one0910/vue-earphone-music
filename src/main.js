import './assets/main.scss'
import './assets/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VeeValidatePlugin } from './includes/validation'
import { auth } from './includes/firebase'

import App from './App.vue'
import router from './router'

let app = null
auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App)
    app.use(createPinia())
    app.use(router)
    app.use(VeeValidatePlugin);
    app.mount('#app')
  }
})