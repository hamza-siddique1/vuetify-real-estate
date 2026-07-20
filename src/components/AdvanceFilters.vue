<template>
  <!-- Backdrop -->
  <div class="adv-backdrop" v-show="open" @click="$emit('close')" />

  <!-- Drawer -->
  <div class="adv-drawer" :class="{ 'is-open': open }">

    <!-- Header -->
    <div class="adv-header">
      <div class="adv-tabs">
        <button class="adv-tab" :class="{ active: activeTab === 'adv' }" @click="activeTab = 'adv'">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#15803d" stroke-width="2.2"
            stroke-linecap="round" stroke-linejoin="round">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
            <circle cx="9" cy="6" r="2" fill="#fff" stroke="#15803d" />
            <circle cx="16" cy="12" r="2" fill="#fff" stroke="#15803d" />
            <circle cx="9" cy="18" r="2" fill="#fff" stroke="#15803d" />
          </svg>
          Advanced Filters
        </button>
      </div>
      <button class="adv-close" @click="$emit('close')" aria-label="Close">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>

    <!-- Body -->
    <div class="adv-body">

      <!-- ADVANCED TAB -->
      <div v-show="activeTab === 'adv'">
        <p>More Filters will be added here</p>
      </div>
    </div>

    <!-- Footer -->
    <div class="adv-footer">
      <button class="btn-reset" @click="resetFilters">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="1 4 1 10 7 10" />
          <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
        </svg>
        Reset filters
      </button>
      <button class="btn-show" @click="applyAndClose">
        Show {{ resultCount.toLocaleString() }} listings
      </button>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      numBedrooms: '', numBathrooms: '', garage: '', parking: '', quality: '',
      daysOnMarket: '', yearFrom: null, yearTo: null,
      priceMin: 0, priceMax: Infinity
    })
  },
  open: { type: Boolean, default: false },
  resultCount: { type: Number, default: 0 }
})

const emit = defineEmits(['update:modelValue', 'change', 'reset', 'close'])

const activeTab = ref('adv')
const PRICE_MAX = 5000000

const localFilters = reactive({
  beds: '',
  baths: '',
  quality: '',
  daysOnMarket: '',
  yearFrom: null,
  yearTo: null,
  priceMin: 0,
  priceMax: Infinity
})
const slider = reactive({ lo: 0, hi: 100 })

const histogramHeights = [4, 8, 18, 32, 52, 72, 88, 95, 90, 82, 68, 54, 40, 30, 22, 16, 11, 8, 6, 4, 3, 5, 2, 2, 1]

const bedOptions = [
  { value: '', label: 'Any' },
  { value: 'studio', label: 'Studio' },
  { value: '1', label: '1+' },
  { value: '2', label: '2+' },
  { value: '3', label: '3+' },
  { value: '4', label: '4+' },
]

const bathOptions = [
  { value: '', label: 'Any' },
  { value: '1', label: '1+' },
  { value: '2', label: '2+' },
  { value: '3', label: '3+' },
  { value: '4', label: '4+' },
  { value: '5', label: '5+' },
]

const priceMin = computed(() => Math.round((slider.lo / 100) * PRICE_MAX))
const priceMax = computed(() => slider.hi >= 99 ? Infinity : Math.round((slider.hi / 100) * PRICE_MAX))

function isBarInRange(i) {
  const pct = (i / histogramHeights.length) * 100
  return pct >= slider.lo && pct <= slider.hi
}

function fmtPriceShort(v) {
  if (v >= 1000000) return '$' + (v / 1000000).toFixed(1).replace(/\.0$/, '') + 'M'
  if (v >= 1000) return '$' + Math.round(v / 1000) + 'k'
  return '$' + v
}

function setFilter(key, value) {
  localFilters[key] = value
  emitChange()
}

function updateSlider() {
  if (slider.lo >= slider.hi) slider.lo = Math.min(slider.hi - 1, 99)
  localFilters.priceMin = priceMin.value
  localFilters.priceMax = priceMax.value
  emitChange()
}

function emitChange() {
  emit('update:modelValue', { ...localFilters })
  emit('change', { ...localFilters })
}

function applyAndClose() {
  emit('close')
}

function resetFilters() {
  Object.assign(localFilters, {
    beds: '', baths: '', quality: '',
    daysOnMarket: '', yearFrom: null, yearTo: null,
    priceMin: 0, priceMax: Infinity
  })
  slider.lo = 0
  slider.hi = 100
  emit('update:modelValue', { ...localFilters })
  emit('reset')
}

watch(() => props.modelValue, (v) => Object.assign(localFilters, v), { deep: true })
</script>

<style scoped>
/* ── Backdrop ── */
.adv-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 200;
}

/* ── Drawer ── */
.adv-drawer {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 360px;
  background: #fff !important;
    color: #111827 !important;
  z-index: 201;
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  transition: transform 0.3s ease;
}

.adv-drawer.is-open {
  transform: translateX(0);
}

@media (max-width: 480px) {
  .adv-drawer {
    width: 100vw;
  }
}

/* ── Header ── */
.adv-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  border-bottom: 1px solid #e5e7eb;
  padding: 16px 20px 0;
  flex-shrink: 0;
}

.adv-tabs {
  display: flex;
  gap: 20px;
  flex: 1;
}

.adv-tab {
  background: none;
    border: none;
    padding: 0 0 14px;
    font-size: 14px;
    font-weight: 600;
    color: #6b7280;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    border-bottom: 2.5px solid transparent;
    margin-bottom: -1px;
  transition: color .15s;
}
.adv-tab.active {
  color: #15803d;
  border-bottom-color: #15803d;
}
.adv-tab-sparkle {
  background: linear-gradient(90deg, #f97316, #ec4899, #a855f7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    font-size: 15px;
  }

  .adv-close {
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    padding: 2px;
    margin-left: 8px;
    display: flex;
    align-items: center;
  }

  .adv-close:hover {
    color: #111;
  }

  /* ── Body ── */
  .adv-body {
    flex: 1;
    overflow-y: auto;
    padding: 0 20px;
    color: #111827 !important;
      background: #fff !important;
  }

  .adv-section {
    margin: 20px 0;
    display: block;
  }

.adv-field-label {
  font-size: 14.5px;
  font-weight: 600;
color: #111827 !important;
    margin-bottom: 10px;
  display: block;
}

  .adv-hint {
    font-size: 13px;
    color: #6b7280;
    margin: 0 0 12px;
  }

  /* two-column row */
  .adv-row {
    display: flex;
    gap: 12px;
    margin: 20px 0;
}

.adv-col {
  flex: 1;
}

/* ── Toggle buttons ── */
.ftog-group {
  display: flex;
    border-radius: 10px;
    overflow: hidden;
  border: 1px solid #e5e7eb;
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

/* ── Price histogram ── */
.price-histogram {
  display: flex;
    align-items: flex-end;
    gap: 2px;
    height: 56px;
    padding: 0 2px 4px;
    margin-top: 60px;
}

.price-bar {
  flex: 1;
    background: #86efac;
    border-radius: 2px 2px 0 0;
  transition: background .15s;
}
.price-bar.in-range {
  background: #16a34a;
}

/* ── Dual range slider ── */
.range-wrap {
  position: relative;
  height: 24px;
  margin: 0 4px;
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
    box-shadow: 0 1px 5px rgba(0, 0, 0, .28);
    cursor: pointer;
    pointer-events: all;
}

.range-wrap input[type="range"]::-moz-range-thumb {
  width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #15803d;
    border: 3px solid #fff;
    box-shadow: 0 1px 5px rgba(0, 0, 0, .28);
    cursor: pointer;
  pointer-events: all;
}
.price-labels {
  display: flex;
  justify-content: space-between;
  font-size: 11.5px;
  color: #6b7280;
  margin-top: 4px;
}

/* ── Select ── */
.adv-select {
  width: 100%;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 9px 12px;
    font-size: 13.5px;
    color: #374151;
    background: #fff;
    cursor: pointer;
  }

  .adv-select:focus {
    outline: none;
    border-color: #16a34a;
  }

  .adv-select:disabled {
    background: #f9fafb;
    color: #9ca3af;
    cursor: default;
}

/* ── Year built ── */
.year-built-box {
  display: flex;
    align-items: center;
    gap: 8px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 8px 12px;
    background: #fff;
}
.year-built-box span {
  font-size: 13.5px;
  color: #374151;
  font-weight: 500;
  white-space: nowrap;
}
.year-built-box input {
  border: none;
    outline: none;
    font-size: 13.5px;
    color: #9ca3af;
    width: 100%;
    background: transparent;
}

/* ── Footer ── */
.adv-footer {
  border-top: 1px solid #e5e7eb;
    padding: 14px 20px;
    display: flex;
    gap: 10px;
    background: #fff;
    flex-shrink: 0;
  }

  .btn-reset {
    flex: 1;
    border: 1.5px solid #d1d5db;
    border-radius: 10px;
    background: #fff;
    color: #374151;
    font-size: 13.5px;
    font-weight: 500;
    padding: 11px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }

  .btn-reset:hover {
    background: #f9fafb;
}
.btn-show {
  flex: 1.4;
  border: none;
  border-radius: 10px;
  background: #15803d;
  color: #fff;
  font-size: 13.5px;
  font-weight: 600;
  padding: 11px;
  cursor: pointer;
}
.btn-show:hover {
  background: #166534;
}
</style>
