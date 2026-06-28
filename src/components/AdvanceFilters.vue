<template>
  <div class="offcanvas offcanvas-end" tabindex="-1" id="advancedDrawer"
       aria-labelledby="advancedDrawerLabel">

    <!-- Header / tabs -->
    <div class="offcanvas-header border-bottom px-4 pt-4 pb-0 align-items-start">
      <div class="d-flex gap-4 flex-grow-1">
        <button class="adv-tab" :class="{ active: activeTab === 'adv' }" @click="activeTab = 'adv'">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#15803d"
               stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/>
            <line x1="4" y1="18" x2="20" y2="18"/>
            <circle cx="9" cy="6" r="2" fill="#fff" stroke="#15803d"/>
            <circle cx="16" cy="12" r="2" fill="#fff" stroke="#15803d"/>
            <circle cx="9" cy="18" r="2" fill="#fff" stroke="#15803d"/>
          </svg>
          Advanced Filters
        </button>
        <button class="adv-tab" :class="{ active: activeTab === 'quality' }" @click="activeTab = 'quality'">
          <span class="adv-tab-sparkle">✦</span> Quality Filters
        </button>
      </div>
      <button type="button" class="btn-close ms-2 mt-1" data-bs-dismiss="offcanvas"
              aria-label="Close"></button>
    </div>

    <!-- Body -->
    <div class="offcanvas-body px-4 py-0" style="overflow-y:auto;">

      <!-- ── ADVANCED TAB ── -->
      <div v-show="activeTab === 'adv'" id="content-adv">

        <!-- Beds -->
        <div class="mt-4 mb-4">
          <div class="adv-label">Beds</div>
          <div class="ftog-group">
            <button v-for="opt in bedOptions" :key="opt.value"
                    class="ftog-btn" :class="{ active: localFilters.beds === opt.value }"
                    @click="setFilter('beds', opt.value)">{{ opt.label }}</button>
          </div>
        </div>

        <!-- Baths -->
        <div class="mb-4">
          <div class="adv-label">Baths</div>
          <div class="ftog-group">
            <button v-for="opt in bathOptions" :key="opt.value"
                    class="ftog-btn" :class="{ active: localFilters.baths === opt.value }"
                    @click="setFilter('baths', opt.value)">{{ opt.label }}</button>
          </div>
        </div>

        <!-- Garage -->
        <div class="mb-4">
          <div class="adv-label">Garage</div>
          <div class="ftog-group">
            <button v-for="opt in garageOptions" :key="opt.value"
                    class="ftog-btn" :class="{ active: localFilters.garage === opt.value }"
                    @click="setFilter('garage', opt.value)">{{ opt.label }}</button>
          </div>
        </div>

        <!-- Parking -->
        <div class="mb-4">
          <div class="adv-label">Parking</div>
          <div class="ftog-group">
            <button v-for="opt in parkingOptions" :key="opt.value"
                    class="ftog-btn" :class="{ active: localFilters.parking === opt.value }"
                    @click="setFilter('parking', opt.value)">{{ opt.label }}</button>
          </div>
        </div>

        <!-- Price -->
        <div class="mb-4">
          <div class="adv-label">Price</div>
          <!-- Histogram bars -->
          <div class="price-histogram">
            <div v-for="(h, i) in histogramHeights" :key="i"
                 class="price-bar" :class="{ 'in-range': isBarInRange(i) }"
                 :style="{ height: h + 'px' }"></div>
          </div>
          <!-- Dual range slider -->
          <div class="range-wrap">
            <div class="range-track"></div>
            <div class="range-fill" :style="{ left: slider.lo + '%', width: (slider.hi - slider.lo) + '%' }"></div>
            <input type="range" min="0" max="100" v-model.number="slider.lo" @input="updateSlider">
            <input type="range" min="0" max="100" v-model.number="slider.hi" @input="updateSlider">
          </div>
          <div class="price-labels">
            <span>min<br><strong>{{ fmtPriceShort(priceMin) }}</strong></span>
            <span style="text-align:right;">max<br><strong>{{ slider.hi >= 99 ? '$5M+' : fmtPriceShort(priceMax) }}</strong></span>
          </div>
        </div>

        <!-- Days on Market / Sold Within -->
        <div class="row g-3 mb-4">
          <div class="col-6">
            <div class="adv-label">Days on Market</div>
            <select class="adv-select" v-model="localFilters.daysOnMarket" @change="emitChange">
              <option value="">Any</option>
              <option value="1">1 day</option>
              <option value="7">7 days</option>
              <option value="14">14 days</option>
              <option value="30">30 days</option>
              <option value="90">90 days</option>
            </select>
          </div>
          <div class="col-6">
            <div class="adv-label" style="color:#9ca3af;">Sold Within</div>
            <select class="adv-select" disabled>
              <option value="">Any</option>
            </select>
          </div>
        </div>

        <!-- Year Built -->
        <div class="mb-4">
          <div class="adv-label">Year built</div>
          <div class="row g-3">
            <div class="col-6">
              <div class="year-built-box">
                <span>From</span>
                <input type="number" v-model.number="localFilters.yearFrom" placeholder="Any" min="1900" max="2026" @change="emitChange">
              </div>
            </div>
            <div class="col-6">
              <div class="year-built-box">
                <span>To</span>
                <input type="number" v-model.number="localFilters.yearTo" placeholder="2026" min="1900" max="2026" @change="emitChange">
              </div>
            </div>
          </div>
        </div>

        <!-- Quality -->
        <div class="mb-4">
          <div class="adv-label">Quality</div>
          <div class="ftog-group">
            <button v-for="opt in qualityOptions" :key="opt.value"
                    class="ftog-btn" :class="{ active: localFilters.quality === opt.value }"
                    @click="setFilter('quality', opt.value)">{{ opt.label }}</button>
          </div>
        </div>

      </div><!-- /content-adv -->

      <!-- ── QUALITY TAB ── -->
      <div v-show="activeTab === 'quality'" id="content-quality">
        <div class="mt-4 mb-4">
          <div class="adv-label">Listing Quality Score</div>
          <p class="text-muted" style="font-size:13px;">Filter listings by their quality rating based on listing completeness and photo quality.</p>
          <div class="ftog-group">
            <button v-for="opt in qualityOptions" :key="opt.value"
                    class="ftog-btn" :class="{ active: localFilters.quality === opt.value }"
                    @click="setFilter('quality', opt.value)">{{ opt.label }}</button>
          </div>
        </div>
      </div><!-- /content-quality -->

    </div><!-- /offcanvas-body -->

    <!-- Footer -->
    <div class="adv-footer">
      <button class="btn-reset" @click="resetFilters">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="1 4 1 10 7 10"/>
          <path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
        </svg>
        Reset filters
      </button>
      <button class="btn-show" data-bs-dismiss="offcanvas" @click="emitChange">
        Show {{ resultCount.toLocaleString() }} listings
      </button>
    </div>

  </div><!-- /offcanvas -->
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      beds: '', baths: '', garage: '', parking: '', quality: '',
      daysOnMarket: '', yearFrom: null, yearTo: null,
      priceMin: 0, priceMax: Infinity
    })
  },
  resultCount: { type: Number, default: 0 }
})

const emit = defineEmits(['update:modelValue', 'change', 'reset'])

const activeTab = ref('adv')
const PRICE_MAX = 5000000

const localFilters = reactive({ ...props.modelValue })

const slider = reactive({
  lo: 0,
  hi: 100
})

const histogramHeights = [4,8,18,32,52,72,88,95,90,82,68,54,40,30,22,16,11,8,6,4,3,5,2,2,1]

const bedOptions = [
  { value: '', label: 'Any' },
  { value: 'studio', label: 'Studio' },
  { value: 1, label: '1+' },
  { value: 2, label: '2+' },
  { value: 3, label: '3+' },
  { value: 4, label: '4+' },
]

const bathOptions = [
  { value: '', label: 'Any' },
  { value: 1, label: '1+' },
  { value: 2, label: '2+' },
  { value: 3, label: '3+' },
  { value: 4, label: '4+' },
  { value: 5, label: '5+' },
]

const garageOptions = [
  { value: '', label: 'Any' },
  { value: 1, label: '1+' },
  { value: 2, label: '2+' },
  { value: 3, label: '3+' },
  { value: 4, label: '4+' },
  { value: 5, label: '5+' },
]

const parkingOptions = [
  { value: '', label: 'Any' },
  { value: 1, label: '1+' },
  { value: 2, label: '2+' },
  { value: 3, label: '3+' },
  { value: 4, label: '4+' },
  { value: 5, label: '5+' },
]

const qualityOptions = [
  { value: '', label: 'Any' },
  { value: 'GOOD', label: 'Good' },
  { value: 'AVERAGE', label: 'Average' },
  { value: 'POOR', label: 'Poor' },
  { value: 'FAIR', label: 'Fair' },
]

const priceMin = computed(() => Math.round((slider.lo / 100) * PRICE_MAX))
const priceMax = computed(() => slider.hi >= 99 ? Infinity : Math.round((slider.hi / 100) * PRICE_MAX))

function isBarInRange(i) {
  const total = histogramHeights.length
  const pct = (i / total) * 100
  return pct >= slider.lo && pct <= slider.hi
}

function fmtPriceShort(v) {
  if (v >= 1000000) return '$' + (v/1000000).toFixed(1).replace(/\.0$/,'') + 'M'
  if (v >= 1000) return '$' + Math.round(v/1000) + 'k'
  return '$' + v
}

function setFilter(key, value) {
  localFilters[key] = value
  emitChange()
}

function updateSlider() {
  if (slider.lo >= slider.hi) {
    slider.lo = Math.min(slider.hi - 1, 99)
  }
  localFilters.priceMin = priceMin.value
  localFilters.priceMax = priceMax.value
  emitChange()
}

function emitChange() {
  emit('update:modelValue', { ...localFilters })
  emit('change')
}

function resetFilters() {
  localFilters.beds = ''
  localFilters.baths = ''
  localFilters.garage = ''
  localFilters.parking = ''
  localFilters.quality = ''
  localFilters.daysOnMarket = ''
  localFilters.yearFrom = null
  localFilters.yearTo = null
  localFilters.priceMin = 0
  localFilters.priceMax = Infinity
  slider.lo = 0
  slider.hi = 100
  emit('update:modelValue', { ...localFilters })
  emit('reset')
}

// Sync with parent
watch(() => props.modelValue, (newVal) => {
  Object.assign(localFilters, newVal)
}, { deep: true })
</script>

<style scoped>
#advancedDrawer { width: 360px; }
@media (max-width: 480px) { #advancedDrawer { width: 100vw; } }

.adv-tab {
  background: none; border: none; padding: 0 0 14px;
  font-size: 14px; font-weight: 600; color: #6b7280;
  display: flex; align-items: center; gap: 6px; cursor: pointer;
  border-bottom: 2.5px solid transparent; margin-bottom: -1px;
  transition: color .15s;
}
.adv-tab.active { color: #15803d; border-bottom-color: #15803d; }
.adv-tab-sparkle {
  background: linear-gradient(90deg,#f97316,#ec4899,#a855f7);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text; font-size: 15px;
}

.adv-label { font-size: 14.5px; font-weight: 600; color: #111827; margin-bottom: 10px; }

.ftog-group {
  display: flex; border-radius: 10px; overflow: hidden;
  border: 1px solid #e5e7eb;
}
.ftog-btn {
  flex: 1; padding: 9px 4px; border: none;
  border-right: 1px solid #e5e7eb;
  background: #f5f6f7; color: #374151;
  font-size: 13px; font-weight: 500; cursor: pointer;
  transition: background .12s, color .12s;
}
.ftog-btn:last-child { border-right: none; }
.ftog-btn.active { background: #15803d; color: #fff; }
.ftog-btn:hover:not(.active) { background: #ecfdf5; color: #15803d; }

.price-histogram {
  display: flex; align-items: flex-end; gap: 2px;
  height: 56px; padding: 0 2px 4px;
}
.price-bar {
  flex: 1; background: #86efac; border-radius: 2px 2px 0 0;
  transition: background .15s;
}
.price-bar.in-range { background: #16a34a; }

.range-wrap { position: relative; height: 24px; margin: 0 4px; }
.range-track {
  position: absolute; top: 50%; left: 0; right: 0;
  height: 4px; background: #e5e7eb; border-radius: 2px;
  transform: translateY(-50%);
}
.range-fill {
  position: absolute; height: 4px; background: #16a34a;
  border-radius: 2px; top: 50%; transform: translateY(-50%);
}
.range-wrap input[type="range"] {
  position: absolute; width: 100%; top: 50%; transform: translateY(-50%);
  -webkit-appearance: none; appearance: none;
  background: transparent; pointer-events: none;
  height: 24px; outline: none; margin: 0;
}
.range-wrap input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none; width: 20px; height: 20px;
  border-radius: 50%; background: #15803d;
  border: 3px solid #fff; box-shadow: 0 1px 5px rgba(0,0,0,.28);
  cursor: pointer; pointer-events: all;
}
.range-wrap input[type="range"]::-moz-range-thumb {
  width: 20px; height: 20px; border-radius: 50%;
  background: #15803d; border: 3px solid #fff;
  box-shadow: 0 1px 5px rgba(0,0,0,.28); cursor: pointer;
  pointer-events: all;
}
.price-labels { display: flex; justify-content: space-between; font-size: 11.5px; color: #6b7280; margin-top: 4px; }

.adv-select {
  width: 100%; border: 1px solid #e5e7eb; border-radius: 8px;
  padding: 9px 12px; font-size: 13.5px; color: #374151;
  background: #fff; cursor: pointer; appearance: auto;
}
.adv-select:focus { outline: none; border-color: #16a34a; box-shadow: none; }
.adv-select:disabled { background: #f9fafb; color: #9ca3af; }

.year-built-box {
  display: flex; align-items: center;
  border: 1px solid #e5e7eb; border-radius: 8px;
  padding: 8px 12px; gap: 8px; background: #fff;
}
.year-built-box span { font-size: 13.5px; color: #374151; font-weight: 500; white-space: nowrap; }
.year-built-box input {
  border: none; outline: none; font-size: 13.5px; color: #9ca3af;
  width: 100%; background: transparent;
}

.adv-footer {
  border-top: 1px solid #e5e7eb; padding: 14px 20px;
  display: flex; gap: 10px; background: #fff;
}
.adv-footer .btn-reset {
  flex: 1; border: 1.5px solid #d1d5db; border-radius: 10px;
  background: #fff; color: #374151; font-size: 13.5px; font-weight: 500;
  padding: 11px; cursor: pointer; display: flex; align-items: center;
  justify-content: center; gap: 6px;
}
.adv-footer .btn-reset:hover { background: #f9fafb; }
.adv-footer .btn-show {
  flex: 1.4; border: none; border-radius: 10px;
  background: #15803d; color: #fff; font-size: 13.5px; font-weight: 600;
  padding: 11px; cursor: pointer;
}
.adv-footer .btn-show:hover { background: #166534; }
</style>
