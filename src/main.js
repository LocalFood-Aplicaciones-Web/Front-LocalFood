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

// Detectar idioma guardado o usar el del navegador
const getDefaultLocale = () => {
  // 1. Verificar si hay idioma guardado en localStorage
  const savedLocale = localStorage.getItem('locale')
  if (savedLocale) {
    return savedLocale
  }

  // 2. Usar el idioma del navegador
  const browserLocale = navigator.language.split('-')[0]
  if (browserLocale === 'es') {
    return 'es'
  }
  if (browserLocale === 'en') {
    return 'en'
  }

  // 3. Por defecto, español
  return 'es'
}

const defaultLocale = getDefaultLocale()

// Create i18n instance
const i18n = createI18n({
    legacy: false,
    locale: defaultLocale, // default locale (español o inglés según navegador)
    fallbackLocale: 'es',
    messages: {
        en,
        es
    }
})

// Actualizar localStorage cuando cambie el idioma
const changeLocale = (locale) => {
  i18n.global.locale.value = locale
  localStorage.setItem('locale', locale)
}

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

// Exponer función global para cambiar idioma
app.config.globalProperties.$changeLocale = changeLocale

app.mount('#app')
