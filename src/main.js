import './assets/main.scss'
import './assets/base.css'
import 'nprogress/nprogress.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VeeValidatePlugin } from './includes/validation'
import { auth } from './includes/firebase'
import progressBar from './includes/progress-bar'
import i18n from './includes/i18n'

import App from './App.vue'
import router from './router'

progressBar(router)
let app = null
auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App)
    app.use(createPinia())
    app.use(router)
    app.use(VeeValidatePlugin);
    app.use(i18n)
    app.mount('#app')
  }
})