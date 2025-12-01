import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import PrimeVue from 'primevue/config'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import Ripple from 'primevue/ripple'
import Tooltip from 'primevue/tooltip'

import 'primevue/resources/themes/lara-light-blue/theme.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import './style.css'

import App from './App.vue'
import router from './router'
import en from './locales/en.json'
import es from './locales/es.json'

// Create Pinia store
const pinia = createPinia()

// Create i18n instance
const i18n = createI18n({
    legacy: false,
    locale: 'en', // default locale
    fallbackLocale: 'en',
    messages: {
        en,
        es
    }
})

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(i18n)
app.use(PrimeVue, { 
    ripple: true,
    inputStyle: 'filled'
})
app.use(ToastService)
app.use(ConfirmationService)

app.directive('ripple', Ripple)
app.directive('tooltip', Tooltip)

app.mount('#app')
