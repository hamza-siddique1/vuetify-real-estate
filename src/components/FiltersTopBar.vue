<template>
  <div class="filter-bar">
    <div class="filter-inner">

      <!-- Property Type Dropdown -->
      <div class="dropdown" ref="typeRef">
        <button class="fb-select-btn" :class="{ open: typeOpen }" style="min-width:152px" @click="typeOpen = !typeOpen">
          <span>{{ typeLabel }}</span>
          <svg class="fb-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2.5">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        <ul class="fb-menu" v-show="typeOpen">
          <li v-for="opt in typeOptions" :key="opt.value">
            <button :class="{ 'is-selected': filters.type === opt.value }" @click="setType(opt.value, opt.label)">
              {{ opt.label }}
            </button>
          </li>
        </ul>
      </div>

      <!-- Status Dropdown -->
      <div class="dropdown" ref="statusRef">
        <button class="fb-select-btn" :class="{ open: statusOpen }" style="min-width:108px"
          @click="statusOpen = !statusOpen">
          <span>{{ statusLabel }}</span>
          <svg class="fb-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2.5">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        <ul class="fb-menu" v-show="statusOpen">
          <li v-for="opt in statusOptions" :key="opt.value">
            <button :class="{ 'is-selected': filters.status === opt.value }" @click="setStatus(opt.value, opt.label)">
              {{ opt.label }}
            </button>
          </li>
        </ul>
      </div>

      <!-- Advanced button -->
      <button class="fb-btn fb-btn-advanced" type="button" @click="showAdvanced = true">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round"
          stroke-linejoin="round">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
          <circle cx="9" cy="6" r="2" fill="#fff" />
          <circle cx="16" cy="12" r="2" fill="#fff" />
          <circle cx="9" cy="18" r="2" fill="#fff" />
        </svg>
        Advanced
      </button>

      <!-- Sort (moved from App.vue sub-header) -->
      <div class="sort-wrap">
        <span class="sort-label">Sort by:</span>
        <select class="sort-select" v-model="sortValue" @change="emitChange">
          <option value="newest">Newest to oldest</option>
          <option value="oldest">Oldest to newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="sqft-desc">Largest first</option>
        </select>
      </div>

    </div>
  </div>

  <!-- Advanced Drawer -->
  <AdvanceFilters v-model="advancedFilters" :open="showAdvanced" :result-count="resultCount"
    @close="showAdvanced = false" @change="emitChange" @reset="resetAll" />
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import AdvanceFilters from './AdvanceFilters.vue'

defineProps({
  resultCount: { type: Number, default: 0 }
})

const emit = defineEmits(['change'])

/* ── Dropdown open state ── */
const typeOpen = ref(false)
const statusOpen = ref(false)
const typeRef = ref(null)
const statusRef = ref(null)
const showAdvanced = ref(false)

/* ── Filter state (moved from App.vue) ── */
const typeLabel = ref('All Listings')
const statusLabel = ref('Both')
const sortValue = ref('newest')

const filters = reactive({ type: '', status: '' })

const advancedFilters = reactive({
  beds: '', baths: '', garage: '', parking: '',
  quality: '', daysOnMarket: '',
  yearFrom: null, yearTo: null,
  priceMin: 0, priceMax: Infinity
})

/* ── Options ── */
const typeOptions = [
  { value: '', label: 'All Listings' },
  { value: 'Residential', label: 'Residential' },
  { value: 'Condos', label: 'Condos' },
  { value: 'Townhome', label: 'Townhome' },
  { value: 'Semi Detached', label: 'Semi Detached' },
  { value: 'Multi Family', label: 'Multi Family' },
  { value: 'Land', label: 'Land' },
  { value: 'Commercial', label: 'Commercial' },
]

const statusOptions = [
  { value: '', label: 'Both' },
  { value: 'For Sale', label: 'For Sale' },
  { value: 'For Rent', label: 'For Rent' },
  { value: 'Sold', label: 'Sold' },
]

/* ── Setters ── */
function setType(value, label) {
  filters.type = value
  typeLabel.value = label
  typeOpen.value = false
  emitChange()
}

function setStatus(value, label) {
  filters.status = value
  statusLabel.value = label
  statusOpen.value = false
  emitChange()
}

/* ── Emit all params to App.vue ── */
function emitChange() {
  const params = new URLSearchParams()
  params.append('sort', sortValue.value)
  if (filters.type) params.append('type', filters.type)
  if (filters.status) params.append('status', filters.status)
  if (advancedFilters.beds) params.append('beds', advancedFilters.beds)
  if (advancedFilters.baths) params.append('baths', advancedFilters.baths)
  if (advancedFilters.garage) params.append('garage', advancedFilters.garage)
  if (advancedFilters.parking) params.append('parking', advancedFilters.parking)
  if (advancedFilters.quality) params.append('quality', advancedFilters.quality)
  if (advancedFilters.daysOnMarket) params.append('days_on_market', advancedFilters.daysOnMarket)
  if (advancedFilters.yearFrom) params.append('year_from', advancedFilters.yearFrom)
  if (advancedFilters.yearTo) params.append('year_to', advancedFilters.yearTo)
  if (advancedFilters.priceMin > 0) params.append('price_min', advancedFilters.priceMin)
  if (advancedFilters.priceMax !== Infinity) params.append('price_max', advancedFilters.priceMax)
  emit('change', params)
}

/* ── Reset (moved from App.vue) ── */
function resetAll() {
  filters.type = ''
  filters.status = ''
  typeLabel.value = 'All Listings'
  statusLabel.value = 'Both'
  sortValue.value = 'newest'
  Object.assign(advancedFilters, {
    beds: '', baths: '', garage: '', parking: '',
    quality: '', daysOnMarket: '',
    yearFrom: null, yearTo: null,
    priceMin: 0, priceMax: Infinity
  })
  emitChange()
}

/* ── Close dropdowns on outside click ── */
function onClickOutside(e) {
  if (typeRef.value && !typeRef.value.contains(e.target)) typeOpen.value = false
  if (statusRef.value && !statusRef.value.contains(e.target)) statusOpen.value = false
}
onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>

<style scoped>
.filter-bar {
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  padding: 9px 24px;
  position: sticky;
    top: 0;
    z-index: 100;
  }
  
  .filter-inner {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  
  .dropdown {
    position: relative;
}

.fb-select-btn {
  height: 38px;
  background: #fff;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;
  padding: 0 12px 0 14px;
  font-size: 13.5px;
  font-weight: 500;
  color: #374151;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  cursor: pointer;
  white-space: nowrap;
  transition: border-color .15s;
}
.fb-select-btn:hover {
  border-color: #9ca3af;
}

.fb-select-btn:focus {
  outline: none;
}

.fb-select-btn.open {
  border-color: #16a34a;
}

.fb-select-btn.open .fb-chevron {
  transform: rotate(180deg);
  color: #16a34a;
}

.fb-chevron {
  transition: transform .2s;
  color: #6b7280;
  flex-shrink: 0;
}

.fb-menu {
  position: absolute;
  top: calc(100% + 5px);
  left: 0;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, .13);
  padding: 5px 0;
  min-width: 210px;
  z-index: 200;
    list-style: none;
    margin: 0;
}
.fb-menu button {
  display: block;
  width: 100%;
  padding: 10px 18px;
  font-size: 14px;
  color: #374151;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
}
.fb-menu button:hover {
  background: #f3f4f6;
  color: #111;
}

.fb-menu button.is-selected {
  font-weight: 600;
  color: #111827;
}

.fb-btn {
  display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 38px;
  padding: 0 14px;
  font-size: 13.5px;
    font-weight: 500;
    border-radius: 8px;
  cursor: pointer;
  border: 1.5px solid #16a34a;
    color: #16a34a;
  background: #fff;
}

.fb-btn:hover {
  background: #f0fdf4;
}

.fb-btn svg {
  stroke: #16a34a;
}

.sort-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: 8%;
}

.sort-label {
  font-size: 13px;
  color: #6b7280;
  white-space: nowrap;
}

.sort-select {
  width: 168px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid #d1d5db;
    border-radius: 6px;
    padding: 4px 8px;
    background: #fff;
    color: #111;
    cursor: pointer;
    outline: none;
    height: 36px;
}

.sort-select:focus {
  border-color: #16a34a;
}

@media (max-width: 575px) {
  .filter-bar {
      padding: 9px 16px;
    }
}
</style>
