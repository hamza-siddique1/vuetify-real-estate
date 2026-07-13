import { createApp } from 'vue'
import { registerPlugins } from '@/plugins'
import App from './App.vue'

const el = document.getElementById('repliers-app')

const app = createApp(App, {
  apiUrl:      el?.dataset.apiUrl ?? 'http://localhost:3001/repliers.json',
  perPage:     Number(el?.dataset.perPage)   || 12,
  columns:     Number(el?.dataset.columns)   || 3,
  heading:     el?.dataset.heading           || '',
  defaultArea: el?.dataset.defaultArea       || '',
  defaultType: el?.dataset.defaultType       || 'sale',
})

registerPlugins(app)
app.mount('#repliers-app')
