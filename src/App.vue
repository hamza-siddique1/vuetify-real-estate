<template>
  <div id="app">
    <FiltersTopBar :result-count="totalCount" @change="onFiltersChange" />

    <div class="sub-header">
      <strong>{{ totalCount.toLocaleString() }}</strong> listings found
    </div>

    <div class="px-grid">

      <div v-if="loading" class="state-box">
        <div class="spinner"></div>
        <p class="text-muted">Loading listings...</p>
      </div>

      <div v-else-if="error" class="state-box">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="1.5">
          <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <p class="text-muted">{{ error }}</p>
        <button class="btn-outline" @click="fetchListings">Retry</button>
      </div>

      <template v-else>
        <div class="listings-grid">
          <ListingCard v-for="listing in listings" :key="listing.id" :listing="listing"
            :saved="savedSet.has(listing.id)" @toggle-save="toggleSave" />
        </div>

        <div v-if="listings.length === 0" class="state-box">
          <p class="text-muted">No listings match your filters.</p>
        </div>

        <Pagination :current-page="currentPage" :total-pages="totalPages" @page-change="onPageChange" />
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import FiltersTopBar from './components/FiltersTopBar.vue'
import ListingCard from './components/ListingCard.vue'
import Pagination from './components/Pagination.vue'

const listings = ref([])
const totalCount = ref(0)
const totalPages = ref(1)
const currentPage = ref(1)
const loading = ref(false)
const error = ref(null)
const savedSet = ref(new Set())

// Holds latest params from FiltersTopBar
let activeParams = new URLSearchParams()

async function fetchListings() {
  loading.value = true
  error.value = null
  try {
    activeParams.set('page', currentPage.value)
    activeParams.set('per_page', 12)
    const res = await fetch(`http://localhost:3001/repliers.json?${activeParams.toString()}`)
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
    const data = await res.json()
    listings.value = data.listings || []
    totalCount.value = data.count
    totalPages.value = data.numPages

    smoothScrollToTop();
    // 👇 scroll AFTER data loads, not before
    //window.scrollTo({ top: 0, behavior: 'smooth' })

  } catch (e) {
    error.value = e.message || 'Failed to load listings'
    listings.value = []
    totalCount.value = 0
    totalPages.value = 1
  } finally {
    loading.value = false
  }
}

// 👇 remove scrollTo from here
function onPageChange(page) {
  currentPage.value = page
  fetchListings()
}

function onFiltersChange(params) {
  activeParams = params
  currentPage.value = 1
  fetchListings()
}

function toggleSave(id) {
  savedSet.value.has(id) ? savedSet.value.delete(id) : savedSet.value.add(id)
}

function smoothScrollToTop() {
  const start = window.scrollY
  const duration = 500  // ms
  const startTime = performance.now()

  function step(currentTime) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    // Ease out cubic
    const ease = 1 - Math.pow(1 - progress, 3)
    window.scrollTo(0, start * (1 - ease))
    if (progress < 1) requestAnimationFrame(step)
  }

  requestAnimationFrame(step)
}

onMounted(fetchListings)
</script>

<style>
* {
  box-sizing: border-box;
}

body {
  background: #f3f4f6;
  font-family: 'Inter', sans-serif;
  margin: 0;
}

.sub-header {
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  padding: 8px 24px;
  font-size: 13.5px;
  font-weight: 400;
  }

  .sub-header strong {
    font-weight: 700;
    color: #111;
  }

  .px-grid {
    padding: 16px 40px;
  }

  .listings-grid {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(1, 1fr);
  }

  @media (min-width: 576px) {
    .listings-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (min-width: 768px) {
    .listings-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  @media (min-width: 992px) {
    .listings-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }

  @media (min-width: 1200px) {
    .listings-grid {
      grid-template-columns: repeat(5, 1fr);
    }
  }

  @media (min-width: 1400px) {
    .listings-grid {
      grid-template-columns: repeat(6, 1fr);
    }
  }

  .state-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 0;
    gap: 12px;
  }

  .spinner {
    width: 36px;
    height: 36px;
    border: 3px solid #e5e7eb;
    border-top-color: #1976d2;
    border-radius: 50%;
    animation: spin .75s linear infinite;
  }

  html {
    scroll-behavior: smooth;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .btn-outline {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 14px;
    font-size: 13px;
    font-weight: 500;
    color: #1976d2;
    background: #fff;
    border: 1px solid #1976d2;
    border-radius: 6px;
    cursor: pointer;
  }

  .btn-outline:hover {
    background: #eff6ff;
  }

  .text-muted {
    color: #6b7280;
    font-size: 13px;
    margin: 0;
  }

  .px-grid {
    padding: 16px 24px;
    /* reduce side padding from 40px */
    overflow-x: hidden;
    /* fix horizontal scroll */
  }

  .listings-grid {
    display: grid;
    gap: 10px;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    /* auto-fill, smaller min */
  }

  body {
    overflow-x: hidden;
}

@media (max-width: 575px) {
  .px-grid {
      padding: 12px 16px;
    }
}
</style>
