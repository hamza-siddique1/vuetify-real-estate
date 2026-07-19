<template>
  <div class="filter-bar">

    <!-- Left: count -->
    <div class="filter-count">
      <strong>{{ resultCount.toLocaleString() }}</strong> listings found
    </div>

    <!-- Center: filters -->
    <div class="filter-inner">

      <!-- 1. For Sale / For Rent -->
      <div class="dropdown" ref="statusRef">
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
      <div class="dropdown" ref="priceRef">
        <button class="fb-select-btn" :class="{ open: priceOpen }" @click="priceOpen = !priceOpen">
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
              <input type="number" class="price-input" placeholder="Min" :value="priceMinVal > 0 ? priceMinVal : ''"
                @change="setPriceMin($event.target.value)" />
            </div>
            <span class="price-separator">—</span>
            <div class="price-input-wrap">
              <span class="price-input-prefix">$</span>
              <input type="number" class="price-input" placeholder="No max"
                :value="priceMaxVal < PRICE_MAX ? priceMaxVal : ''" @change="setPriceMax($event.target.value)" />
            </div>
          </div>

          <button class="panel-apply-btn" @click="applyPrice">Apply</button>
        </div>
      </div>

      <!-- 3. Beds & Baths -->
<!-- 3. Beds & Baths -->
<div class="dropdown" ref="bedsRef">
  <button class="fb-select-btn" :class="{ open: bedsOpen }" @click="bedsOpen = !bedsOpen">
    <span>{{ bedsLabel }}</span>
    <svg class="fb-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  </button>

  <div class="fb-panel beds-panel" v-show="bedsOpen">

    <!-- Bedrooms -->
    <div class="panel-section">
      <div class="panel-section-title">Bedrooms</div>
      <div class="ftog-group">
        <button
          v-for="opt in computedBedOptions"
          :key="opt.value"
          class="ftog-btn"
          :class="{ active: beds === opt.value }"
          @click="beds = opt.value"
        >
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
        <button
          v-for="opt in computedBathOptions"
          :key="opt.value"
          class="ftog-btn"
          :class="{ active: baths === opt.value }"
          @click="baths = opt.value"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <button class="panel-apply-btn" @click="applyBeds">Apply</button>
  </div>
</div>

      <!-- 4. Property Type -->
      <div class="dropdown" ref="propTypeRef">
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
        Filters
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
import { ref, reactive, computed, inject, onMounted, onUnmounted } from 'vue'
import AdvanceFilters from './AdvanceFilters.vue'

const perPage = inject('perPage', 12)
const defaultArea = inject('defaultArea', '')
const defaultType = inject('defaultType', 'sale')
const defaultPropTypes = inject('propertyTypes', [])
const defaultPriceMin = inject('priceMin', 0)
const defaultPriceMax = inject('priceMax', 0)

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
  if (type === 'lease') return 'For Rent'
  if (type === 'both') return ''
  return 'For Sale'
}
const statusLabel = ref(getDefaultStatus(defaultType) || 'For Sale')
const filters = reactive({
  status: getDefaultStatus(defaultType) || 'For Sale'
})

const statusOptions = [
  { value: '', label: 'Both' },
  { value: 'For Sale', label: 'For Sale' },
  { value: 'For Rent', label: 'For Rent' },
]

function setStatus(value, label) {
  filters.status = value
  statusLabel.value = label || 'For Sale'
  statusOpen.value = false
  emitChange()
}

/* ── Price filter ── */
const PRICE_MAX = 5000000
const priceSlider = reactive({ lo: 0, hi: 100 })
const priceMinVal = ref(defaultPriceMin || 0)
const priceMaxVal = ref(defaultPriceMax || PRICE_MAX)

const priceLabel = computed(() => {
  const min = priceMinVal.value
  const max = priceMaxVal.value
  if (min === 0 && max >= PRICE_MAX) return 'Any Price'
  if (min > 0 && max >= PRICE_MAX) return `${fmtPrice(min)}+`
  if (min === 0) return `Up to ${fmtPrice(max)}`
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

function onPriceSlider() {
  if (priceSlider.lo >= priceSlider.hi) {
    priceSlider.lo = Math.min(priceSlider.hi - 1, 99)
  }
  priceMinVal.value = Math.round((priceSlider.lo / 100) * PRICE_MAX)
  priceMaxVal.value = priceSlider.hi >= 99 ? PRICE_MAX : Math.round((priceSlider.hi / 100) * PRICE_MAX)
}

function setPriceMin(val) {
  const v = Number(val) || 0
  priceMinVal.value = v
  priceSlider.lo = Math.min((v / PRICE_MAX) * 100, priceSlider.hi - 1)
}

function setPriceMax(val) {
  const v = Number(val) || PRICE_MAX
  priceMaxVal.value = v
  priceSlider.hi = Math.max((v / PRICE_MAX) * 100, priceSlider.lo + 1)
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
  { value: '1',   label: exactBaths.value ? '1'   : '1+'        },
  { value: '1.5', label: exactBaths.value ? '1.5' : '1.5+'      },
  { value: '2',   label: exactBaths.value ? '2'   : '2+'        },
  { value: '3',   label: exactBaths.value ? '3'   : '3+'        },
  { value: '4',   label: exactBaths.value ? '4'   : '4+'        },
])

const bedsLabel = computed(() => {
  const b  = beds.value
  const ba = baths.value
  if (!b && !ba) return 'Beds & Baths'
  const parts = []
  if (b) {
    if (b === 'studio')         parts.push('Studio')
    else if (exactBeds.value)   parts.push(`${b} bd`)
    else                        parts.push(`${b}+ bd`)
  }
  if (ba) {
    if (exactBaths.value)       parts.push(`${ba} ba`)
    else                        parts.push(`${ba}+ ba`)
  }
  return parts.join(', ')
})

function applyBeds() {
  bedsOpen.value = false
  emitChange()
}

/* ── Property type filter (checkboxes) ── */
const propertyTypeOptions = [
  { value: 'Residential', label: 'Houses', propertyType: ['Residential'] },
  { value: 'Condos', label: 'Condos/Co-ops', style: ['Condominium', 'Apartment', 'Flat Condo', 'Other Condo'] },
  { value: 'Townhome', label: 'Townhomes', style: ['Townhouse'] },
  { value: 'Multi Family', label: 'Multi-family', style: ['Multi Family', 'Multi-Family 2-4'] },
  { value: 'Land', label: 'Lots/Land', propertyType: ['Land'] },
  { value: 'Commercial', label: 'Commercial', propertyType: ['Commercial Sale'] },
  { value: 'Semi Detached', label: '2 to 4 Units', style: ['Duplex', 'Half Duplex', 'Quadruplex', 'Triplex'] },
]

// Default to all selected or widget defaults
const selectedPropTypes = ref(
  defaultPropTypes.length > 0
    ? [...defaultPropTypes]
    : propertyTypeOptions.map(o => o.value)
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
const sortValue = ref('createdOnDesc')
const sortOptions = [
  { value: 'createdOnDesc', label: 'Newest to oldest' },
  { value: 'createdOnAsc', label: 'Oldest to newest' },
  { value: 'listPriceAsc', label: 'Price: Low to High' },
  { value: 'listPriceDesc', label: 'Price: High to Low' },
  { value: 'sqftDesc', label: 'Largest first' },
  { value: 'bedsDesc', label: 'Most bedrooms' },
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
const STATIC_FIELDS = 'status,type,class,listPrice,listDate,lastStatus,soldPrice,soldDate,address,map,images,imagesScore,imageInsights,details.numBathrooms,details.numBathroomsPlus,details.numBedrooms,details.numBedroomsPlus,details.propertyType,details.sqft,details.style,lot,office,agents,updatedOn,daysOnMarket,boardId,openHouse,timestamps,permissions'
const CLASSES = ['condo', 'residential']

const statusMap = {
  '': { status: ['A'], type: 'sale' },
  'For Sale': { status: ['A'], type: 'sale' },
  'For Rent': { status: ['A'], type: 'lease' },
  'Sold': { status: ['U'], type: 'sale' },
}

/* ── Emit ── */
function emitChange() {
  const params = new URLSearchParams()

  params.append('listings', 'true')
  params.append('fields', STATIC_FIELDS)
  params.append('resultsPerPage', String(perPage))
  params.append('sortBy', sortValue.value)
  CLASSES.forEach(c => params.append('class', c))

  // Status + type
  const statusRule = statusMap[filters.status] ?? statusMap['For Sale']
  params.append('type', statusRule.type)
  statusRule.status.forEach(v => params.append('status', v))

  // Property types from checkboxes
  if (selectedPropTypes.value.length > 0 &&
    selectedPropTypes.value.length < propertyTypeOptions.length) {
    const propTypes = new Set()
    const styles = new Set()

    selectedPropTypes.value.forEach(val => {
      const opt = propertyTypeOptions.find(o => o.value === val)
      if (!opt) return
      opt.propertyType?.forEach(v => propTypes.add(v))
      opt.style?.forEach(v => styles.add(v))
    })

    propTypes.forEach(v => params.append('propertyType', v))
    styles.forEach(v => params.append('style', v))
  }

  // Widget defaults
  if (defaultArea) params.append('area', defaultArea)

  // Price from filter bar
  if (priceMinVal.value > 0) params.append('minPrice', String(priceMinVal.value))
  if (priceMaxVal.value < PRICE_MAX) params.append('maxPrice', String(priceMaxVal.value))

  // Widget price defaults (only if filter not set)
  if (priceMinVal.value === 0 && defaultPriceMin > 0) params.append('minPrice', String(defaultPriceMin))
  if (priceMaxVal.value >= PRICE_MAX && defaultPriceMax > 0) params.append('maxPrice', String(defaultPriceMax))

  // Beds from filter bar
  if (beds.value === 'studio') {
    params.append('minBedrooms', '0')
    params.append('maxBedrooms', '0')
  } else if (beds.value) {
    if (exactBeds.value) {
      params.append('minBedrooms', beds.value)
      params.append('maxBedrooms', beds.value)
    } else {
      params.append('minBedrooms', beds.value)
    }
  }

  // Baths from filter bar
  if (baths.value) {
    if (exactBaths.value) {
      params.append('minBathrooms', baths.value)
      params.append('maxBathrooms', baths.value)
    } else {
      params.append('minBathrooms', baths.value)
    }
  }

  // Advanced filters
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
  priceMinVal.value = 0
  priceMaxVal.value = PRICE_MAX
  priceSlider.lo = 0
  priceSlider.hi = 100
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

onMounted(() => {
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

/* ── Trigger button ── */
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
    left: 12px;
    right: 12px;
    min-width: unset;
  }
}

</style>
