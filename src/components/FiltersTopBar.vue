<template>
  <div class="filter-bar d-flex align-items-center justify-content-center">
    <div class="d-flex align-items-center gap-2" style="margin-right: 8%;">

      <!-- Property Type Dropdown -->
      <div class="dropdown">
        <button class="fb-select-btn" type="button"
                data-bs-toggle="dropdown" data-bs-auto-close="true"
                aria-expanded="false" style="min-width:152px;">
          <span>{{ typeLabel }}</span>
          <svg class="fb-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        <ul class="dropdown-menu fb-select-menu">
          <li v-for="opt in typeOptions" :key="opt.value">
            <button class="dropdown-item" :class="{ 'is-selected': modelValue.type === opt.value }"
                    @click="setType(opt.value, opt.label)">{{ opt.label }}</button>
          </li>
        </ul>
      </div>

      <!-- Status Dropdown -->
      <div class="dropdown">
        <button class="fb-select-btn" type="button"
                data-bs-toggle="dropdown" data-bs-auto-close="true"
                aria-expanded="false" style="min-width:108px;">
          <span>{{ statusLabel }}</span>
          <svg class="fb-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        <ul class="dropdown-menu fb-select-menu">
          <li v-for="opt in statusOptions" :key="opt.value">
            <button class="dropdown-item" :class="{ 'is-selected': modelValue.status === opt.value }"
                    @click="setStatus(opt.value, opt.label)">{{ opt.label }}</button>
          </li>
        </ul>
      </div>

      <!-- Advanced button -->
      <button class="fb-btn fb-btn-advanced"
              type="button" data-bs-toggle="offcanvas" data-bs-target="#advancedDrawer">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke-width="2.2"
             stroke-linecap="round" stroke-linejoin="round">
          <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/>
          <line x1="4" y1="18" x2="20" y2="18"/>
          <circle cx="9" cy="6" r="2" fill="#fff"/><circle cx="16" cy="12" r="2" fill="#fff"/>
          <circle cx="9" cy="18" r="2" fill="#fff"/>
        </svg>
        Advanced
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ type: '', status: '' })
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const typeLabel = ref('All Listings')
const statusLabel = ref('Both')

const typeOptions = [
  { value: '', label: 'All Listings' },
  { value: 'Residential', label: 'Residential' },
  { value: 'Condos', label: 'Condos' },
  { value: 'Townhome', label: 'Townhome' },
  { value: 'Semi Detached', label: 'Semi Detached' },
  { value: 'Multi Family', label: 'Multi Family' },
  { value: 'Land', label: 'Land' },
  { value: 'Business', label: 'Business' },
  { value: 'Commercial', label: 'Commercial' },
]

const statusOptions = [
  { value: '', label: 'Both' },
  { value: 'For Sale', label: 'For Sale' },
  { value: 'For Rent', label: 'For Rent' },
  { value: 'Sold', label: 'Sold' },
]

function setType(value, label) {
  typeLabel.value = label
  emit('update:modelValue', { ...props.modelValue, type: value })
  emit('change')
}

function setStatus(value, label) {
  statusLabel.value = label
  emit('update:modelValue', { ...props.modelValue, status: value })
  emit('change')
}
</script>

<style scoped>
.filter-bar {
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  padding: 9px 24px;
  position: sticky; top: 0; z-index: 100;
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
.fb-select-btn:hover  { border-color: #9ca3af; background: #fff; color: #374151; box-shadow: none; }
.fb-select-btn:focus  { outline: none; box-shadow: none; }
.fb-select-btn[aria-expanded="true"] { border-color: #16a34a; box-shadow: none; }
.fb-select-btn[aria-expanded="true"] .fb-chevron { transform: rotate(180deg); color: #16a34a; }

.fb-chevron { transition: transform .2s ease; color: #6b7280; flex-shrink: 0; }

.fb-select-menu {
  border: 1px solid #e5e7eb !important;
  border-radius: 10px !important;
  box-shadow: 0 8px 28px rgba(0,0,0,.13) !important;
  padding: 5px 0 !important;
  min-width: 210px;
  margin-top: 5px !important;
}
.fb-select-menu .dropdown-item {
  padding: 10px 18px;
  font-size: 14px;
  color: #374151;
  font-weight: 400;
  background: transparent;
  border: none;
  width: 100%;
  text-align: left;
}
.fb-select-menu .dropdown-item:hover  { background: #f3f4f6; color: #111; }
.fb-select-menu .dropdown-item.is-selected { color: #111827; font-weight: 600; }

.fb-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 0 14px;
  cursor: pointer;
  background: #fff;
  border: 1px solid #cbd5e1;
  color: #374151;
  white-space: nowrap;
  height: 38px;
  font-size: 13.5px;
  font-weight: 500;
  border-radius: 8px;
  line-height: 1;
}
.fb-btn:hover { background: #f9fafb; }

.fb-btn-advanced {
  border: 1.5px solid #16a34a;
  color: #16a34a;
}
.fb-btn-advanced:hover { background: #f0fdf4; }
.fb-btn-advanced svg { stroke: #16a34a; }

@media (max-width: 575px) {
  .filter-bar { padding-left: 16px !important; padding-right: 16px !important; }
}
</style>
