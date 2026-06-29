import { createApp } from 'vue'
import App from './App.vue'

// Read config from the widget's data attributes
const el = document.getElementById('repliers-app')

declare const RepliersConfig: { apiUrl: string; nonce: string }

console.log(RepliersConfig.apiUrl);
const app = createApp(App, {
  apiUrl:      RepliersConfig?.apiUrl || '/wp-json/repliers/v1/listings',
  nonce:       RepliersConfig?.nonce  || '',
  perPage:     Number(el?.dataset.perPage)   || 12,
  columns:     Number(el?.dataset.columns)   || 3,
  heading:     el?.dataset.heading           || '',
  defaultArea: el?.dataset.defaultArea       || '',
  defaultType: el?.dataset.defaultType       || 'sale',
})

app.mount('#repliers-app')   // 👈 mount to the widget div
