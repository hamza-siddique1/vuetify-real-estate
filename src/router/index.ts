import { createRouter, createWebHistory } from 'vue-router'
import ListingsView from '@/views/ListingsView.vue'
import ListingDetailView from '@/views/ListingDetailView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/',                    component: ListingsView },
    { path: '/listing/:mlsNumber',  component: ListingDetailView },
  ]
})

export default router
