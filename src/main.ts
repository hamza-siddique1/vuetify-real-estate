import { createApp } from 'vue'
import { registerPlugins } from '@/plugins'
import ListingsView from '@/views/ListingsView.vue'
import ListingDetailView from '@/views/ListingDetailView.vue'

const config  = (window as any).RepliersConfig ?? {}
const apiBase = config.apiBase  ?? 'http://localhost:3001'
const view    = config.view     ?? 'listings'
const mls     = config.mlsNumber ?? ''

let app

if ( view === 'detail' && mls ) {
  app = createApp( ListingDetailView, { apiBase, mlsNumber: mls })
} else {
  app = createApp( ListingsView, { apiBase })
}

registerPlugins(app)
app.mount('#repliers-app')
