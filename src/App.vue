<template>
  <div id="app">
    <!-- Top Filter Bar -->
    <FiltersTopBar v-model="topFilters" @change="onFilterChange" />

    <!-- Advanced Filters Drawer -->
    <AdvanceFilters
      v-model="advancedFilters"
      :result-count="totalCount"
      @change="onFilterChange"
      @reset="onFilterChange"
    />

    <!-- Sub-header -->
    <div class="sub-header d-flex align-items-center justify-content-between">
      <span><strong>{{ totalCount.toLocaleString() }}</strong> listings found</span>
      <div class="d-flex align-items-center gap-2">
        <span class="text-muted">Sort by:</span>
        <select class="form-select form-select-sm"
                style="width:168px;font-size:13px;font-weight:500;border-color:#d1d5db;"
                v-model="sortValue" @change="onFilterChange">
          <option value="newest">Newest to oldest</option>
          <option value="oldest">Oldest to newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="sqft-desc">Largest first</option>
        </select>
      </div>
    </div>

    <!-- Grid -->
    <div class="px-grid pt-3" style="padding-left:40px;padding-right:40px;">
      <!-- Loading state -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="text-muted mt-3">Loading listings...</p>
      </div>

      <!-- Error state -->
      <div v-else-if="error" class="text-center py-5">
        <i class="bi bi-exclamation-triangle display-3 text-warning"></i>
        <p class="text-muted mt-3">{{ error }}</p>
        <button class="btn btn-outline-primary btn-sm" @click="fetchListings">
          <i class="bi bi-arrow-clockwise me-1"></i>Retry
        </button>
      </div>

      <!-- Listings Grid -->
      <template v-else>
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 row-cols-xxl-6 g-3">
          <ListingCard
            v-for="listing in listings"
            :key="listing.id"
            :listing="listing"
            :saved="savedSet.has(listing.id)"
            @toggle-save="toggleHeart"
          />
        </div>

        <!-- No results -->
        <div v-if="listings.length === 0" class="text-center py-5">
          <i class="bi bi-house-slash display-3 text-muted"></i>
          <p class="text-muted mt-3 mb-3">No listings match your filters.</p>
          <button class="btn btn-outline-primary btn-sm" @click="resetAllFilters">
            <i class="bi bi-arrow-counterclockwise me-1"></i>Reset Filters
          </button>
        </div>

        <!-- Pagination -->
        <Pagination
          :current-page="currentPage"
          :total-pages="totalPages"
          @page-change="onPageChange"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import FiltersTopBar from './components/FiltersTopBar.vue'
import AdvanceFilters from './components/AdvanceFilters.vue'
import ListingCard from './components/ListingCard.vue'
import Pagination from './components/Pagination.vue'

/* ═══════════════════════════════════════
   STATE
═══════════════════════════════════════ */
const listings = ref([])
const totalCount = ref(0)
const totalPages = ref(1)
const currentPage = ref(1)
const loading = ref(false)
const error = ref(null)
const savedSet = ref(new Set())
const sortValue = ref('newest')

// Top bar filters (Property Type, Status)
const topFilters = reactive({
  type: '',
  status: ''
})

// Advanced drawer filters
const advancedFilters = reactive({
  beds: '',
  baths: '',
  garage: '',
  parking: '',
  quality: '',
  daysOnMarket: '',
  yearFrom: null,
  yearTo: null,
  priceMin: 0,
  priceMax: Infinity
})

/* ═══════════════════════════════════════
   API CALL
═══════════════════════════════════════ */
async function fetchListings() {
  loading.value = true
  error.value = null

  try {
    // Build query params from all filters
    const params = new URLSearchParams()

    // Pagination
    params.append('page', currentPage.value)
    params.append('per_page', 12)

    // Sorting
    params.append('sort', sortValue.value)

    // Top filters
    if (topFilters.type)   params.append('type', topFilters.type)
    if (topFilters.status) params.append('status', topFilters.status)

    // Advanced filters
    if (advancedFilters.beds)        params.append('beds', advancedFilters.beds)
    if (advancedFilters.baths)       params.append('baths', advancedFilters.baths)
    if (advancedFilters.garage)      params.append('garage', advancedFilters.garage)
    if (advancedFilters.parking)      params.append('parking', advancedFilters.parking)
    if (advancedFilters.quality)      params.append('quality', advancedFilters.quality)
    if (advancedFilters.daysOnMarket) params.append('days_on_market', advancedFilters.daysOnMarket)
    if (advancedFilters.yearFrom)     params.append('year_from', advancedFilters.yearFrom)
    if (advancedFilters.yearTo)       params.append('year_to', advancedFilters.yearTo)
    if (advancedFilters.priceMin > 0) params.append('price_min', advancedFilters.priceMin)
    if (advancedFilters.priceMax !== Infinity) params.append('price_max', advancedFilters.priceMax)

    // Replace with your actual API endpoint
    const response = await fetch(`http://localhost:3001/repliers.json?${params.toString()}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    // Adjust these based on your API response structure
    listings.value = data.listings || []
    totalCount.value = data.count
    totalPages.value = data.numPages

  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Failed to load listings'
    listings.value = []
    totalCount.value = 0
    totalPages.value = 1
  } finally {
    loading.value = false
  }
}

/* ═══════════════════════════════════════
   EVENT HANDLERS
═══════════════════════════════════════ */
function onFilterChange() {
  currentPage.value = 1  // Reset to page 1 when filters change
  fetchListings()
}

function onPageChange(page) {
  currentPage.value = page
  fetchListings()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function toggleHeart(id) {
  const set = savedSet.value
  if (set.has(id)) set.delete(id)
  else set.add(id)
}

function resetAllFilters() {
  topFilters.type = ''
  topFilters.status = ''
  advancedFilters.beds = ''
  advancedFilters.baths = ''
  advancedFilters.garage = ''
  advancedFilters.parking = ''
  advancedFilters.quality = ''
  advancedFilters.daysOnMarket = ''
  advancedFilters.yearFrom = null
  advancedFilters.yearTo = null
  advancedFilters.priceMin = 0
  advancedFilters.priceMax = Infinity
  sortValue.value = 'newest'
  currentPage.value = 1
  fetchListings()
}

/* Boot */
onMounted(() => {
  fetchListings()
})
</script>

<style>
body { background: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }

.sub-header {
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  padding: 8px 24px;
  font-size: 13.5px;
}
.sub-header strong { font-weight: 700; color: #111; }

@media (max-width: 575px) {
  .sub-header, .px-grid { padding-left: 16px !important; padding-right: 16px !important; }
}
</style>
