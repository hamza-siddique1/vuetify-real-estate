import { createApp } from 'vue'
import { registerPlugins } from '@/plugins'
import ListingsView from '@/views/ListingsView.vue'
import ListingDetailView from '@/views/ListingDetailView.vue'

const config  = (window as any).RepliersConfig ?? {}
const apiBase = config.apiBase      ?? 'http://localhost:3001'
const view    = config.view         ?? 'listings'
const mls     = config.mlsNumber    ?? ''

function mountApp() {
  const el = document.getElementById('repliers-app')
  if (!el) return

  const settings = {
    apiBase,
    perPage:            Number(el.dataset.perPage)           || 12,
    defaultArea:        el.dataset.defaultArea               || '',
    defaultType:        el.dataset.defaultType               || 'sale',
    propertyTypes:      JSON.parse(el.dataset.propertyTypes  || '[]'),
    priceMin:           Number(el.dataset.priceMin)          || 0,
    priceMax:           Number(el.dataset.priceMax)          || 0,
    showTypeFilter:     el.dataset.showTypeFilter     === 'yes',
    showPriceFilter:    el.dataset.showPriceFilter    === 'yes',
    showBedsFilter:     el.dataset.showBedsFilter     === 'yes',
    showPropTypeFilter: el.dataset.showPropTypeFilter === 'yes',
    showAdvancedFilter: el.dataset.showAdvancedFilter === 'yes',
    googleMapsKey:      config.googleMapsKey ?? '',
  }

  const app = view === 'detail' && mls
    ? createApp(ListingDetailView, { apiBase, mlsNumber: mls, googleMapsKey: config.googleMapsKey })
    : createApp(ListingsView, settings)

  registerPlugins(app)
  app.mount('#repliers-app')
}

mountApp()

window.addEventListener('elementor/frontend/init', () => {
  ;(window as any).elementorFrontend?.hooks?.addAction(
    'frontend/element_ready/repliers-listings.default',
    mountApp
  )
})
