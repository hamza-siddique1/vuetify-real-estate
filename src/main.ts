import { createApp } from 'vue'
import { registerPlugins } from '@/plugins'
import ListingsView from '@/views/ListingsView.vue'
import ListingDetailView from '@/views/ListingDetailView.vue'

const config  = (window as any).RepliersConfig ?? {}
const apiBase = config.apiBase  ?? 'http://localhost:3001'
const view    = config.view     ?? 'listings'
const mls     = config.mlsNumber ?? ''

const el = document.getElementById('repliers-app')

// Read all settings from data attributes
const settings = {
  apiBase,
  perPage:         Number(el?.dataset.perPage)                       || 12,
  columns:         Number(el?.dataset.columns)                       || 3,
  heading:         el?.dataset.heading                               || '',
  defaultArea:     el?.dataset.defaultArea                           || '',
  defaultType:     el?.dataset.defaultType                           || 'sale',
  propertyTypes:   JSON.parse(el?.dataset.propertyTypes  || '[]'),
  showFilters:     el?.dataset.showFilters      !== 'no',
  showPriceFilter: el?.dataset.showPriceFilter  !== 'no',
  showSortFilter:  el?.dataset.showSortFilter   !== 'no',
}

let app
console.log(config);
if ( view === 'detail' && mls ) {
  app = createApp( ListingDetailView, { apiBase, mlsNumber: mls })
} else {
  app = createApp( ListingsView, { apiBase })
}

registerPlugins(app)
app.mount('#repliers-app')
