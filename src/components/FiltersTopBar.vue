<template>
  <div class="filter-bar">

    <!-- Left: count -->
    <div class="filter-count">
      <strong>{{ resultCount.toLocaleString() }}</strong> listings found
    </div>

    <!-- Center: filters -->
    <div class="filter-inner">

      <!-- 1. For Sale / For Rent -->
      <div class="dropdown" ref="statusRef" v-if="showTypeFilter">
        <button class="fb-select-btn" :class="{ open: statusOpen }" @click="statusOpen = !statusOpen">
          <span>{{ statusLabel }}</span>
          <svg class="fb-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2.5">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        <div class="fb-panel" v-show="statusOpen">
          <ul class="fb-menu-list">
            <li v-for="opt in statusOptions" :key="opt.value">
              <button :class="{ 'is-selected': filters.status === opt.value }" @click="setStatus(opt.value, opt.label)">
                {{ opt.label }}
              </button>
            </li>
          </ul>
        </div>
      </div>

      <!-- 2. Price -->
      <div class="dropdown" ref="priceRef" v-if="showPriceFilter">
        <button class="fb-select-btn price-btn" :class="{ open: priceOpen }" @click="priceOpen = !priceOpen">
          <span>{{ priceLabel }}</span>
          <svg class="fb-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2.5">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        <div class="fb-panel price-panel" v-show="priceOpen">
          <div class="panel-title">Price Range</div>

          <!-- Slider -->
          <div class="price-histogram">
            <div v-for="(h, i) in histogramHeights" :key="i" class="price-bar"
              :class="{ 'in-range': isPriceBarInRange(i) }" :style="{ height: h + 'px' }">
            </div>
          </div>
          <div class="range-wrap">
            <div class="range-track"></div>
            <div class="range-fill"
              :style="{ left: priceSlider.lo + '%', width: (priceSlider.hi - priceSlider.lo) + '%' }"></div>
            <input type="range" min="0" max="100" v-model.number="priceSlider.lo" @input="onPriceSlider">
            <input type="range" min="0" max="100" v-model.number="priceSlider.hi" @input="onPriceSlider">
          </div>

          <!-- Min / Max inputs -->
          <div class="price-inputs">
            <div class="price-input-wrap">
              <span class="price-input-prefix">$</span>
              <input type="number" class="price-input" :placeholder="fmtPrice(PRICE_LOWER)" :min="PRICE_LOWER"
                :max="priceMaxVal - 1" :value="priceMinVal > PRICE_LOWER ? priceMinVal : ''"
                @change="setPriceMin($event.target.value)" />
            </div>
            <span class="price-separator">—</span>
            <div class="price-input-wrap">
              <span class="price-input-prefix">$</span>
              <input type="number" class="price-input" :placeholder="fmtPrice(PRICE_UPPER)" :min="priceMinVal + 1"
                :max="PRICE_UPPER" :value="priceMaxVal < PRICE_UPPER ? priceMaxVal : ''"
                @change="setPriceMax($event.target.value)" />
            </div>
          </div>

          <button class="panel-apply-btn" @click="applyPrice">Apply</button>
        </div>
      </div>

      <!-- 3. Beds & Baths -->
<!-- 3. Beds & Baths -->
      <div class="dropdown" ref="bedsRef" v-if="showBedsFilter">
        <button class="fb-select-btn beds_baths" :class="{ open: bedsOpen }" @click="bedsOpen = !bedsOpen">
          <span>{{ bedsLabel }}</span>
          <svg class="fb-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2.5">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        <div class="fb-panel beds-panel" v-show="bedsOpen">

          <!-- Bedrooms -->
          <div class="panel-section">
            <div class="panel-section-title">Bedrooms</div>
            <div class="ftog-group">
              <button v-for="opt in computedBedOptions" :key="opt.value" class="ftog-btn"
                :class="{ active: beds === opt.value }" @click="beds = opt.value">
                {{ opt.label }}
              </button>
            </div>
            <label class="exact-match-label">
              <input type="checkbox" v-model="exactBeds" class="exact-match-checkbox" />
              Use exact match
            </label>
          </div>

          <!-- Bathrooms -->
          <div class="panel-section">
            <div class="panel-section-title">Bathrooms</div>
            <div class="ftog-group">
              <button v-for="opt in computedBathOptions" :key="opt.value" class="ftog-btn"
                :class="{ active: baths === opt.value }" @click="baths = opt.value">
                {{ opt.label }}
              </button>
            </div>
          </div>

          <button class="panel-apply-btn" @click="applyBeds">Apply</button>
        </div>
      </div>

      <!-- 4. Property Type -->
      <div class="dropdown" ref="propTypeRef" v-if="showPropTypeFilter">
        <button class="fb-select-btn" :class="{ open: propTypeOpen }" @click="propTypeOpen = !propTypeOpen">
          <span>Property Type</span>
          <svg class="fb-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2.5">
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        <div class="fb-panel prop-panel" v-show="propTypeOpen">
          <div class="panel-title">Home Type</div>

          <button class="deselect-all" @click="toggleAllPropTypes">
            <svg v-if="selectedPropTypes.length === propertyTypeOptions.length" width="14" height="14"
              viewBox="0 0 24 24" fill="#1d4ed8" stroke="none">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {{ selectedPropTypes.length === propertyTypeOptions.length ? 'Deselect All' : 'Select All' }}
          </button>

          <ul class="prop-type-list">
            <li v-for="opt in propertyTypeOptions" :key="opt.value">
              <label class="prop-type-item">
                <input type="checkbox" class="prop-type-checkbox" :value="opt.value" v-model="selectedPropTypes" />
                {{ opt.label }}
              </label>
            </li>
          </ul>

          <button class="panel-apply-btn" @click="applyPropTypes">Apply</button>
        </div>
      </div>

      <!-- 5. Advanced -->
      <button class="fb-btn fb-btn-advanced" type="button" @click="showAdvanced = true" v-if="showAdvancedFilter">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round"
          stroke-linejoin="round">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
          <circle cx="9" cy="6" r="2" fill="#fff" />
          <circle cx="16" cy="12" r="2" fill="#fff" />
          <circle cx="9" cy="18" r="2" fill="#fff" />
        </svg>
        Advance Filters
      </button>

    </div>

    <!-- Right: sort -->
    <div class="sort-wrap">
      <span class="sort-label">Sort by:</span>
      <select class="sort-select" v-model="sortValue" @change="emitChange">
        <option v-for="opt in sortOptions" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
    </div>

  </div>

  <AdvanceFilters v-model="advancedFilters" :open="showAdvanced" :result-count="resultCount"
    @close="showAdvanced = false" @change="onAdvancedChange" @reset="resetAll" />
</template>

<script setup>
import { ref, reactive, computed, inject, onMounted, onUnmounted, watch } from 'vue'
import AdvanceFilters from './AdvanceFilters.vue'

const defaultType = inject('defaultType', 'sale')
const defaultSort = inject('defaultSort', 'createdOnDesc')
const defaultPropTypes = inject('propertyTypes', [])
const defaultPriceMin = inject('priceMin', 0)
const defaultPriceMax = inject('priceMax', 0)
const showTypeFilter = inject('showTypeFilter', true)
const showPriceFilter = inject('showPriceFilter', true)
const showBedsFilter = inject('showBedsFilter', true)
const showPropTypeFilter = inject('showPropTypeFilter', true)
const showAdvancedFilter = inject('showAdvancedFilter', true)

const statusLabel = ref(getDefaultStatus(defaultType) || 'For Sale')
const filters = reactive({
  status: getDefaultStatus(defaultType) || 'For Sale'
})

// 1. Admin bounds — fixed, never change unless admin updates widget
const ADMIN_PRICE_MIN = defaultPriceMin > 0 ? defaultPriceMin : 0
const ADMIN_PRICE_MAX = defaultPriceMax > 0 ? defaultPriceMax : 0

// 2. API bounds — from response, used for slider visual limits only
let PRICE_LOWER = ADMIN_PRICE_MIN
let PRICE_UPPER = ADMIN_PRICE_MAX || 5000000

// 3. User selected values — what actually gets sent to API
const priceMinVal = ref(ADMIN_PRICE_MIN)
const priceMaxVal = ref(ADMIN_PRICE_MAX || 5000000)
const userAdjustedPrice = ref(false)
const lastTypeFilter = ref(filters.status)
const priceBounds = inject('priceBounds', ref({ min: 0, max: 5000000 }))

defineProps({
  resultCount: { type: Number, default: 0 }
})
const emit = defineEmits(['change'])

/* ── Panel open state ── */
const statusOpen = ref(false)
const priceOpen = ref(false)
const bedsOpen = ref(false)
const propTypeOpen = ref(false)
const showAdvanced = ref(false)

/* ── Refs for click outside ── */
const statusRef = ref(null)
const priceRef = ref(null)
const bedsRef = ref(null)
const propTypeRef = ref(null)

/* ── Status filter ── */
function getDefaultStatus(type) {
  const t = type?.toLowerCase()
  if (t === 'lease') return 'For Rent'
  if (t === 'both' || t === '') return 'Both'
  return 'For Sale'
}

const statusOptions = [
  { value: '', label: 'Both' },
  { value: 'For Sale', label: 'For Sale' },
  { value: 'For Rent', label: 'For Rent' },
]

function setStatus(value, label) {
  lastTypeFilter.value = filters.status
  filters.status = value
  statusLabel.value = label || 'For Sale'
  statusOpen.value = false
  userAdjustedPrice.value = false
  emitChange()
}

const priceSlider = reactive({ lo: 0, hi: 100 })

function priceToSlider(price) {
  if (PRICE_UPPER === PRICE_LOWER) return 0
  const pct = ((price - PRICE_LOWER) / (PRICE_UPPER - PRICE_LOWER)) * 100
  return Math.max(0, Math.min(100, Math.round(pct)))  // 👈 clamp 0–100
}

function sliderToPrice(pct) {
  const price = Math.round(PRICE_LOWER + (pct / 100) * (PRICE_UPPER - PRICE_LOWER))
  return Math.max(PRICE_LOWER, Math.min(PRICE_UPPER, price))  // 👈 clamp to bounds
}

function onPriceSlider() {
  priceSlider.lo = Math.max(0, Math.min(priceSlider.lo, priceSlider.hi - 1))
  priceSlider.hi = Math.min(100, Math.max(priceSlider.hi, priceSlider.lo + 1))

  userAdjustedPrice.value = true
  priceMinVal.value = sliderToPrice(priceSlider.lo)
  priceMaxVal.value = sliderToPrice(priceSlider.hi)
}

function setPriceMin(val) {
  const v = Number(val)
  if (isNaN(v) || v === 0) {
    priceMinVal.value = PRICE_LOWER
    priceSlider.lo = 0
    return
  }

  const clamped = Math.max(PRICE_LOWER, Math.min(v, priceMaxVal.value - 1))
  priceMinVal.value = clamped
  priceSlider.lo = priceToSlider(clamped)
  userAdjustedPrice.value = true
}

function setPriceMax(val) {
  const v = Number(val)
  if (isNaN(v) || v === 0) {
    priceMaxVal.value = PRICE_UPPER
    priceSlider.hi = 100
    return
  }

  const clamped = Math.min(PRICE_UPPER, Math.max(v, priceMinVal.value + 1))
  priceMaxVal.value = clamped
  priceSlider.hi = priceToSlider(clamped)
  userAdjustedPrice.value = true
}

const priceLabel = computed(() => {
  const min = priceMinVal.value
  const max = priceMaxVal.value
  if (min === PRICE_LOWER && max === PRICE_UPPER) return 'Price'
  if (min > PRICE_LOWER && max === PRICE_UPPER) return `${fmtPrice(min)}+`
  if (min === PRICE_LOWER) return `Up to ${fmtPrice(max)}`
  return `${fmtPrice(min)} – ${fmtPrice(max)}`
})

const histogramHeights = [4, 8, 18, 32, 52, 72, 88, 95, 90, 82, 68, 54, 40, 30, 22, 16, 11, 8, 6, 4, 3, 5, 2, 2, 1]

function isPriceBarInRange(i) {
  const pct = (i / histogramHeights.length) * 100
  return pct >= priceSlider.lo && pct <= priceSlider.hi
}

function fmtPrice(v) {
  if (v >= 1000000) return '$' + (v / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (v >= 1000) return '$' + Math.round(v / 1000) + 'K'
  return '$' + v
}

function applyPrice() {
  priceOpen.value = false
  emitChange()
}

/* ── Beds & Baths ── */
const beds       = ref('')
const baths      = ref('')
const exactBeds  = ref(false)
const exactBaths = ref(false)

const computedBedOptions = computed(() => [
  { value: '', label: exactBeds.value ? 'Studio' : 'Any' },
  { value: '1', label: exactBeds.value ? '1' : '1+' },
  { value: '2', label: exactBeds.value ? '2' : '2+' },
  { value: '3', label: exactBeds.value ? '3' : '3+' },
  { value: '4', label: exactBeds.value ? '4' : '4+' },
  { value: '5', label: exactBeds.value ? '5' : '5+' },
])

const computedBathOptions = computed(() => [
  { value: '',    label: 'Any'                                   },
  { value: '1', label: exactBaths.value ? '1' : '1+' },
  { value: '2',   label: exactBaths.value ? '2'   : '2+'        },
  { value: '3',   label: exactBaths.value ? '3'   : '3+'        },
  { value: '4',   label: exactBaths.value ? '4'   : '4+'        },
  { value: '5', label: exactBaths.value ? '5' : '5+' },
])

const bedsLabel = computed(() => {
  const b  = beds.value
  const ba = baths.value
  if (!b && !ba) return 'Beds & Baths'

  const parts = []
  if (b) {
    if (b === 'studio') parts.push('Studio')
    else if (exactBeds.value) parts.push(`${b} bd`)
    else parts.push(`${b}+ bd`)
  }

  if (ba) {
    if (exactBaths.value) parts.push(`${ba} ba`)
    else parts.push(`${ba}+ ba`)
  }
  if (b && !ba) parts.push('0+ ba')
  if (!b && ba) parts.push('0+ b')

  return parts.join(', ') || 'Beds & Baths'
})

function applyBeds() {
  bedsOpen.value = false
  emitChange()
}

const propertyTypeOptions = [
  {
    value: 'Residential',
    label: 'Houses (Detached)',
    raw: { 'raw.MRD_TYP': ['Detached Single'] }
  },
  {
    value: 'Condos',
    label: 'Condos / Co-ops',
    raw: { 'raw.MRD_TYP': ['Attached Single'] }
  },
  {
    value: 'Lofts',
    label: 'Lofts',
    raw: { 'raw.MRD_TPC': ['Condo-Loft'] }
  },
  {
    value: 'Townhome',
    label: 'Townhouses',
    raw: { 'raw.MRD_TPC': ['Townhouse-Ranch', 'Townhouse-2 Story', 'Townhouse 3+ Stories', 'Townhouse-TriLevel', 'Townhouse'] }
  },
  {
    value: 'Semi Detached',
    label: '2 to 4 Flats',
    raw: { 'raw.MRD_TYP': ['Two to Four Units'] }
  },
  {
    value: 'Multi Family',
    label: 'Multi-Family (5+ units)',
    raw: { 'raw.MRD_TYP': ['Multi Family 5+'] }
  },
  {
    value: 'Land',
    label: 'Land',
    raw: { 'raw.MRD_TYP': ['Land'] }
  },
  {
    value: 'Commercial',
    label: 'Commercial',
    raw: { 'raw.MRD_TYP': ['Office/Tech', 'Bus / Bus w/Real Est', 'Retail/Stores', 'Mixed Use', 'Instut/To Develop', 'Industrial'] }
  },
  {
    value: 'Rentals',
    label: 'Rentals',
    raw: { 'raw.MRD_TYP': ['Residential Lease'] },
    type: 'lease'
  },
]

const selectedPropTypes = ref(
  defaultPropTypes.length > 0
    ? [...defaultPropTypes]
    : []
)

function toggleAllPropTypes() {
  if (selectedPropTypes.value.length === propertyTypeOptions.length) {
    selectedPropTypes.value = []
  } else {
    selectedPropTypes.value = propertyTypeOptions.map(o => o.value)
  }
}

function applyPropTypes() {
  propTypeOpen.value = false
  emitChange()
}

/* ── Sort ── */
const sortValue = ref(defaultSort)
const sortOptions = [
  { value: 'createdOnDesc', label: 'Newest to oldest' },
  { value: 'createdOnAsc', label: 'Oldest to newest' },
  { value: 'listPriceAsc', label: 'Price: Low to High' },
  { value: 'listPriceDesc', label: 'Price: High to Low' },
]

/* ── Advanced filters ── */
const advancedFilters = reactive({
  beds: '', baths: '', quality: '',
  daysOnMarket: '', yearFrom: null, yearTo: null,
  priceMin: 0, priceMax: Infinity
})

function onAdvancedChange(newFilters) {
  Object.assign(advancedFilters, newFilters)
  emitChange()
}

/* ── Static fields ── */
const STATIC_FIELDS = 'mlsNumber,status,type,class,listPrice,listDate,lastStatus,soldPrice,soldDate,address,map,images,imagesScore,imageInsights,details.numBathrooms,details.numBathroomsPlus,details.numBedrooms,details.numBedroomsPlus,details.propertyType,details.sqft,details.style,lot,office,agents,updatedOn,daysOnMarket,boardId,openHouse,timestamps,permissions'
const CLASSES = ['condo', 'residential']

const statusMap = {
  '': { status: ['A'], type: ['sale', 'lease'] },
  'Both': { status: ['A'], type: ['sale', 'lease'] },
  'For Sale': { status: ['A'], type: 'sale' },
  'For Rent': { status: ['A'], type: 'lease' },
  'Sold': { status: ['U'], type: 'sale' },
}

/* ── Emit ── */
function emitChange() {
  const params = new URLSearchParams()

  params.append('listings', 'true')
  params.append('fields', STATIC_FIELDS)
  params.append('sortBy', sortValue.value)

  // Status + type
  const statusRule = statusMap[filters.status] ?? statusMap['For Sale']
  const types = Array.isArray(statusRule.type) ? statusRule.type : [statusRule.type]
  types.forEach(t => params.append('type', t))
  statusRule.status.forEach(v => params.append('status', v))

  // Property type checkboxes
  const activeTypes = filters.status === 'For Rent'
    ? selectedPropTypes.value
    : selectedPropTypes.value.filter(t => t !== 'Rentals')

  const nonRentalOptions = propertyTypeOptions.filter(o => o.value !== 'Rentals')

  if (activeTypes.length > 0 && activeTypes.length < nonRentalOptions.length) {
    const rawParams = {}

    activeTypes.forEach(val => {
      const opt = propertyTypeOptions.find(o => o.value === val)
      if (!opt?.raw) return

      Object.entries(opt.raw).forEach(([rawKey, rawValues]) => {
        if (!rawParams[rawKey]) rawParams[rawKey] = new Set()
        rawValues.forEach(v => rawParams[rawKey].add(v))
      })
    })

    Object.entries(rawParams).forEach(([key, values]) => {
      values.forEach(v => params.append(key, v))
    })

  } else if (activeTypes.length === nonRentalOptions.length) {
    // All selected — no property type filter needed
  }

  // Price params
  if (userAdjustedPrice.value) {
    params.append('minPrice', String(priceMinVal.value))
    params.append('maxPrice', String(priceMaxVal.value))
  } else {
    if (ADMIN_PRICE_MIN > 0) params.append('minPrice', String(ADMIN_PRICE_MIN))
    if (ADMIN_PRICE_MAX > 0) params.append('maxPrice', String(ADMIN_PRICE_MAX))
  }
  // Beds
  if (beds.value === 'studio') {
    params.append('minBedrooms', '0')
    params.append('maxBedrooms', '0')
  } else if (beds.value) {
    params.append('minBedrooms', beds.value)
    if (exactBeds.value) params.append('maxBedrooms', beds.value)
  }

  // Baths
  if (baths.value) {
    params.append('minBaths', baths.value)
    if (exactBaths.value) params.append('maxBaths', baths.value)
  }

  // Advanced
  if (advancedFilters.quality) params.append('quality', advancedFilters.quality)
  if (advancedFilters.daysOnMarket) params.append('maxDom', advancedFilters.daysOnMarket)
  if (advancedFilters.yearFrom) params.append('minYearBuilt', advancedFilters.yearFrom)
  if (advancedFilters.yearTo) params.append('maxYearBuilt', advancedFilters.yearTo)

  emit('change', params)
}

/* ── Reset ── */
function resetAll() {
  filters.status = getDefaultStatus(defaultType) || 'For Sale'
  statusLabel.value = getDefaultStatus(defaultType) || 'For Sale'
  sortValue.value = 'createdOnDesc'
  beds.value = ''
  baths.value = ''
  exactBeds.value = false
  exactBaths.value = false
  priceSlider.lo = 0
  priceSlider.hi = 100

  userAdjustedPrice.value = false
  priceMinVal.value = ADMIN_PRICE_MIN
  priceMaxVal.value = ADMIN_PRICE_MAX || 5000000

  selectedPropTypes.value = propertyTypeOptions.map(o => o.value)
  Object.assign(advancedFilters, {
    beds: '', baths: '', quality: '',
    daysOnMarket: '', yearFrom: null, yearTo: null,
    priceMin: 0, priceMax: Infinity
  })
  emitChange()
}

/* ── Click outside to close panels ── */
function onClickOutside(e) {
  if (statusRef.value && !statusRef.value.contains(e.target)) statusOpen.value = false
  if (priceRef.value && !priceRef.value.contains(e.target)) priceOpen.value = false
  if (bedsRef.value && !bedsRef.value.contains(e.target)) bedsOpen.value = false
  if (propTypeRef.value && !propTypeRef.value.contains(e.target)) propTypeOpen.value = false
}

watch(priceBounds, ({ min, max }) => {
  const apiMin = (min != null && min >= 0) ? min : 0
  const apiMax = (max != null && max > 0) ? max : 5000000

  PRICE_LOWER = apiMin
  PRICE_UPPER = apiMax

  if (!userAdjustedPrice.value) {
    priceMinVal.value = ADMIN_PRICE_MIN > 0
      ? Math.max(ADMIN_PRICE_MIN, apiMin)
      : apiMin

    priceMaxVal.value = ADMIN_PRICE_MAX > 0
      ? Math.min(ADMIN_PRICE_MAX, apiMax)
      : apiMax

    priceSlider.lo = priceToSlider(priceMinVal.value)
    priceSlider.hi = priceToSlider(priceMaxVal.value)
  }
}, { deep: true })

// Watch status → sync Rentals in property types
watch(() => filters.status, (status) => {
  if (status === 'For Rent') {
    // Add Rentals to selected if not already there
    if (!selectedPropTypes.value.includes('Rentals')) {
      selectedPropTypes.value = [...selectedPropTypes.value, 'Rentals']
    }
  } else {
    // Remove Rentals when switching away from For Rent
    selectedPropTypes.value = selectedPropTypes.value.filter(t => t !== 'Rentals')
  }
})

// Watch selectedPropTypes → sync status filter
watch(selectedPropTypes, (types) => {
  console.log(types);
  const hasRentals = types.includes('Rentals')
  const hasOthers = types.some(t => t !== 'Rentals')

  if (hasRentals && !hasOthers) {
    // Only Rentals selected → set For Rent
    filters.status = 'For Rent'
    statusLabel.value = 'For Rent'
  } else if (hasRentals && hasOthers) {
    // Rentals + others → set Both
    filters.status = ''
    statusLabel.value = 'Both'
  } else if (!hasRentals && filters.status === 'For Rent') {
    // Rentals unchecked → switch to For Sale
    filters.status = 'For Sale'
    statusLabel.value = 'For Sale'
  }
}, { deep: true })

onMounted(() => {
  priceSlider.lo = 0
  priceSlider.hi = 100
  priceMinVal.value = PRICE_LOWER
  priceMaxVal.value = PRICE_UPPER
  emitChange()
  document.addEventListener('click', onClickOutside)
})
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>

<style scoped>

/* ── Filter bar ── */
.filter-bar {
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  padding: 10px 24px;
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  overflow: visible;
}

/* ── Left: count ── */
.filter-count {
  font-size: 13px;
  color: #374151;
  white-space: nowrap;
  flex-shrink: 0;
}
.filter-count strong {
  font-weight: 700;
  color: #111;
}

/* ── Center: filters ── */
.filter-inner {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: center;
  overflow: visible;
}

/* ── Right: sort ── */
.sort-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
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

/* ── Dropdown wrapper ── */
.dropdown {
  position: relative;
}
.beds_baths {
  min-width: 140px;
}

.price-btn {
  min-width: 145px;
  justify-content: space-between;
}

/* ── Trigger button ── */
.fb-select-btn {
  max-width: 160px;
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
  gap: 10px;
  cursor: pointer;
  white-space: nowrap;
  transition: border-color .15s;
}
.fb-select-btn:hover {
  border-color: #9ca3af;
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

/* ── Panel ── */
.fb-panel {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 8px 28px rgba(0,0,0,.12);
  z-index: 200;
  min-width: 240px;
  padding: 16px;
}
.panel-title {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: .5px;
  margin-bottom: 14px;
}

/* ── Status panel ── */
.fb-menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.fb-menu-list li button {
  display: block;
  width: 100%;
  padding: 10px 12px;
  font-size: 14px;
  color: #374151;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  border-radius: 6px;
  transition: background .12s;
}
.fb-menu-list li button:hover {
  background: #f3f4f6;
}
.fb-menu-list li button.is-selected {
  font-weight: 600;
  color: #111;
  background: #f0fdf4;
}

/* ── Price panel ── */
.price-panel {
  min-width: 350px;
}
.price-histogram {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  padding: 0 2px 4px;

}
.price-bar {
  flex: 1;
  background: #d1fae5;
  border-radius: 2px 2px 0 0;
  transition: background .15s;
}
.price-bar.in-range {
  background: #16a34a;
}
.range-wrap {
  position: relative;
  height: 24px;
  margin: 4px;
}
.range-track {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 4px;
  background: #e5e7eb;
  border-radius: 2px;
  transform: translateY(-50%);
}
.range-fill {
  position: absolute;
  height: 4px;
  background: #16a34a;
  border-radius: 2px;
  top: 50%;
  transform: translateY(-50%);
}
.range-wrap input[type="range"] {
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  pointer-events: none;
  height: 24px;
  outline: none;
  margin: 0;
}
.range-wrap input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #15803d;
  border: 3px solid #fff;
  box-shadow: 0 1px 5px rgba(0,0,0,.28);
  cursor: pointer;
  pointer-events: all;
}
.range-wrap input[type="range"]::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #15803d;
  border: 3px solid #fff;
  box-shadow: 0 1px 5px rgba(0,0,0,.28);
  cursor: pointer;
  pointer-events: all;
}
.price-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
}
.price-separator {
  color: #9ca3af;
  font-size: 14px;
  flex-shrink: 0;
}
.price-input-wrap {
  flex: 1;
  display: flex;
  align-items: center;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 8px 10px;
  gap: 4px;
  transition: border-color .15s;
}
.price-input-wrap:focus-within {
  border-color: #16a34a;
}
.price-input-prefix {
  font-size: 13px;
  color: #374151;
  font-weight: 500;
}
.price-input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 13px;
  color: #111;
  background: transparent;
}

/* ── Beds & Baths panel ── */
.beds-panel {
  min-width: 300px;
}
.panel-section {
  margin-bottom: 20px;
}
.panel-section:last-of-type {
  margin-bottom: 0;
}
.panel-section-title {
  font-size: 13px;
  font-weight: 600;
  color: #111;
  margin-bottom: 10px;
}
.ftog-group {
  display: flex;
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
  margin-bottom: 10px;
}
.ftog-btn {
  flex: 1;
  padding: 9px 4px;
  border: none;
  border-right: 1px solid #e5e7eb;
  background: #f5f6f7;
  color: #374151;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background .12s, color .12s;
}
.ftog-btn:last-child {
  border-right: none;
}
.ftog-btn.active {
  background: #15803d;
  color: #fff;
}
.ftog-btn:hover:not(.active) {
  background: #ecfdf5;
  color: #15803d;
}
.exact-match-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #374151;
  cursor: pointer;
}
.exact-match-checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #15803d;
}

/* ── Property type panel ── */
.prop-panel {
  min-width: 220px;
}
.deselect-all {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: #1d4ed8;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px 0;
  margin-bottom: 8px;
}
.prop-type-list {
  list-style: none;
  margin: 0;
  padding: 0;
}
.prop-type-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #f3f4f6;
  font-size: 14px;
  color: #111;
  cursor: pointer;
}
.prop-type-item:last-child {
  border-bottom: none;
}
.prop-type-checkbox {
  width: 18px;
  height: 18px;
  accent-color: #1d4ed8;
  cursor: pointer;
  flex-shrink: 0;
}

/* ── Apply button ── */
.panel-apply-btn {
  width: 100%;
  margin-top: 14px;
  padding: 10px;
  border: none;
  border-radius: 8px;
  background: #15803d;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background .15s;
}
.panel-apply-btn:hover {
  background: #166534;
}

/* ── Advanced/Filters button ── */
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
  transition: background .15s;
}
.fb-btn:hover {
  background: #f0fdf4;
}
.fb-btn svg {
  stroke: #16a34a;
}

/* ── Responsive ── */
@media (max-width: 900px) {
  .sort-label { display: none; }
  .sort-select { width: 130px; }
}

@media (max-width: 600px) {
  .filter-bar {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
      "filters filters"
      "count   sort";
    gap: 8px;
    padding: 10px 12px;
  }
  .filter-inner {
    grid-area: filters;
    justify-content: flex-start;
    overflow-x: auto;
    flex-wrap: nowrap;
  }
  .filter-count { grid-area: count; font-size: 12px; align-self: center; }
  .sort-wrap    { grid-area: sort;  justify-content: flex-end; }
  .sort-select  { width: 100%; font-size: 12px; }
  .fb-select-btn { font-size: 12px; padding: 0 8px 0 10px; }
  .fb-panel {
    position: fixed;
    left: 0;
      right: 0;
      bottom: 0;
      top: auto;
      border-radius: 16px 16px 0 0;
    min-width: unset;
    width: 100%;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 -4px 24px rgba(0, 0, 0, .15);
      z-index: 999;
      padding: 24px 20px 32px;
      /* 👈 add this */
    }

    /* backdrop for mobile panels */
    .dropdown::before {
      content: '';
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, .3);
      z-index: 998;
    }

    .dropdown:has(.fb-panel[style*="display: block"])::before,
    .dropdown:has(.fb-panel:not([style*="display: none"]))::before {
      display: block;
  }
}

</style>
