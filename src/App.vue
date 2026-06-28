<template>
  <div id="app">
    <!-- ── Filter Bar ── -->
    <div class="filter-bar d-flex align-items-center justify-content-center">
      <div class="d-flex align-items-center gap-2" style="margin-right: 8%;">

        <!-- All Listings (property type) custom dropdown -->
        <div class="dropdown">
          <button class="fb-select-btn" type="button"
                  data-bs-toggle="dropdown" data-bs-auto-close="true"
                  aria-expanded="false" id="dd-type-btn" style="min-width:152px;">
            <span id="dd-type-label">{{ filterValues.typeLabel }}</span>
            <svg class="fb-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <ul class="dropdown-menu fb-select-menu">
            <li v-for="opt in typeOptions" :key="opt.value">
              <button class="dropdown-item" :class="{ 'is-selected': filterValues.type === opt.value }"
                      @click="setDropdown('type', opt.value, opt.label)">{{ opt.label }}</button>
            </li>
          </ul>
        </div>

        <!-- Both / Status custom dropdown -->
        <div class="dropdown">
          <button class="fb-select-btn" type="button"
                  data-bs-toggle="dropdown" data-bs-auto-close="true"
                  aria-expanded="false" id="dd-status-btn" style="min-width:108px;">
            <span id="dd-status-label">{{ filterValues.statusLabel }}</span>
            <svg class="fb-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <ul class="dropdown-menu fb-select-menu">
            <li v-for="opt in statusOptions" :key="opt.value">
              <button class="dropdown-item" :class="{ 'is-selected': filterValues.status === opt.value }"
                      @click="setDropdown('status', opt.value, opt.label)">{{ opt.label }}</button>
            </li>
          </ul>
        </div>

        <!-- Advanced — green border, green icon -->
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

    <!-- ══════════════════════════════════════
         ADVANCED FILTERS OFFCANVAS DRAWER
    ════════════════════════════════════════ -->
    <div class="offcanvas offcanvas-end" tabindex="-1" id="advancedDrawer"
         aria-labelledby="advancedDrawerLabel">

      <!-- Header / tabs -->
      <div class="offcanvas-header border-bottom px-4 pt-4 pb-0 align-items-start">
        <div class="d-flex gap-4 flex-grow-1">
          <button class="adv-tab" :class="{ active: activeTab === 'adv' }" @click="switchTab('adv')">
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
          <button class="adv-tab" :class="{ active: activeTab === 'quality' }" @click="switchTab('quality')">
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
            <div class="ftog-group" id="tog-beds">
              <button v-for="opt in bedOptions" :key="opt.value"
                      class="ftog-btn" :class="{ active: drawerFilters.beds === opt.value }"
                      @click="toggleFilter('beds', opt.value)">{{ opt.label }}</button>
            </div>
          </div>

          <!-- Baths -->
          <div class="mb-4">
            <div class="adv-label">Baths</div>
            <div class="ftog-group" id="tog-baths">
              <button v-for="opt in bathOptions" :key="opt.value"
                      class="ftog-btn" :class="{ active: drawerFilters.baths === opt.value }"
                      @click="toggleFilter('baths', opt.value)">{{ opt.label }}</button>
            </div>
          </div>

          <!-- Garage -->
          <div class="mb-4">
            <div class="adv-label">Garage</div>
            <div class="ftog-group" id="tog-garage">
              <button v-for="opt in garageOptions" :key="opt.value"
                      class="ftog-btn" :class="{ active: drawerFilters.garage === opt.value }"
                      @click="toggleFilter('garage', opt.value)">{{ opt.label }}</button>
            </div>
          </div>

          <!-- Parking -->
          <div class="mb-4">
            <div class="adv-label">Parking</div>
            <div class="ftog-group" id="tog-parking">
              <button v-for="opt in parkingOptions" :key="opt.value"
                      class="ftog-btn" :class="{ active: drawerFilters.parking === opt.value }"
                      @click="toggleFilter('parking', opt.value)">{{ opt.label }}</button>
            </div>
          </div>

          <!-- Price -->
          <div class="mb-4">
            <div class="adv-label">Price</div>
            <!-- Histogram bars -->
            <div class="price-histogram" id="price-histogram">
              <div v-for="(h, i) in histogramHeights" :key="i"
                   class="price-bar" :class="{ 'in-range': isBarInRange(i) }"
                   :style="{ height: h + 'px' }"></div>
            </div>
            <!-- Dual range slider -->
            <div class="range-wrap">
              <div class="range-track"></div>
              <div class="range-fill" :style="{ left: priceSlider.lo + '%', width: (priceSlider.hi - priceSlider.lo) + '%' }"></div>
              <input type="range" id="range-min" min="0" max="100" v-model.number="priceSlider.lo" @input="updatePriceSlider">
              <input type="range" id="range-max" min="0" max="100" v-model.number="priceSlider.hi" @input="updatePriceSlider">
            </div>
            <div class="price-labels">
              <span>min<br><strong>{{ fmtPriceShort(priceMin) }}</strong></span>
              <span style="text-align:right;">max<br><strong>{{ priceSlider.hi >= 99 ? '$5M+' : fmtPriceShort(priceMax) }}</strong></span>
            </div>
          </div>

          <!-- Days on Market / Sold Within -->
          <div class="row g-3 mb-4">
            <div class="col-6">
              <div class="adv-label">Days on Market</div>
              <select class="adv-select" v-model="drawerFilters.daysOnMarket">
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
                  <input type="number" v-model.number="drawerFilters.yearFrom" placeholder="Any" min="1900" max="2026">
                </div>
              </div>
              <div class="col-6">
                <div class="year-built-box">
                  <span>To</span>
                  <input type="number" v-model.number="drawerFilters.yearTo" placeholder="2026" min="1900" max="2026">
                </div>
              </div>
            </div>
          </div>

          <!-- Quality (also in advanced tab for convenience) -->
          <div class="mb-4">
            <div class="adv-label">Quality</div>
            <div class="ftog-group" id="tog-quality">
              <button v-for="opt in qualityOptions" :key="opt.value"
                      class="ftog-btn" :class="{ active: drawerFilters.quality === opt.value }"
                      @click="toggleFilter('quality', opt.value)">{{ opt.label }}</button>
            </div>
          </div>

        </div><!-- /content-adv -->

        <!-- ── QUALITY TAB ── -->
        <div v-show="activeTab === 'quality'" id="content-quality">
          <div class="mt-4 mb-4">
            <div class="adv-label">Listing Quality Score</div>
            <p class="text-muted" style="font-size:13px;">Filter listings by their quality rating based on listing completeness and photo quality.</p>
            <div class="ftog-group" id="tog-quality2">
              <button v-for="opt in qualityOptions" :key="opt.value"
                      class="ftog-btn" :class="{ active: drawerFilters.quality === opt.value }"
                      @click="toggleFilter('quality', opt.value)">{{ opt.label }}</button>
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
        <button class="btn-show" id="show-btn" data-bs-dismiss="offcanvas" @click="applyFilters">
          Show {{ filteredCount }} listings
        </button>
      </div>

    </div><!-- /offcanvas -->

    <!-- ── Sub-header ── -->
    <div class="sub-header d-flex align-items-center justify-content-between">
      <span><strong>{{ filteredCount.toLocaleString() }}</strong> listings found</span>
      <div class="d-flex align-items-center gap-2">
        <span class="text-muted">Sort by:</span>
        <select class="form-select form-select-sm" style="width:168px;font-size:13px;font-weight:500;border-color:#d1d5db;"
                v-model="sortValue" @change="applyFilters">
          <option value="newest">Newest to oldest</option>
          <option value="oldest">Oldest to newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="sqft-desc">Largest first</option>
        </select>
      </div>
    </div>

    <!-- ── Grid ── -->
    <div class="px-grid pt-3" style="padding-left:40px;padding-right:40px;">
      <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 row-cols-xxl-6 g-3"
           id="listings-grid">
              <div class="col" v-for="listing in listings">
                <ListingCard></ListingCard>
              </div>

      </div>
      <div v-if="filteredData.length === 0" id="no-results" class="text-center py-5">
        <i class="bi bi-house-slash display-3 text-muted"></i>
        <p class="text-muted mt-3 mb-3">No listings match your filters.</p>
        <button class="btn btn-outline-primary btn-sm" @click="resetFilters">
          <i class="bi bi-arrow-counterclockwise me-1"></i>Reset Filters
        </button>
      </div>
      <!-- Pagination -->
      <div class="pagination-wrap" v-if="totalPages > 1">
        <button class="pg-btn pg-arrow" @click="goToPage(currentPage - 1)" :disabled="currentPage === 1">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <template v-for="(item, idx) in paginationItems" :key="idx">
          <span v-if="item === '…'" class="pg-ellipsis">…</span>
          <button v-else class="pg-btn" :class="{ active: item === currentPage }" @click="goToPage(item)">{{ item }}</button>
        </template>
        <button class="pg-btn pg-arrow" @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import ListingCard from './components/listings/ListingCard.vue'

/* ═══════════════════════════════════════
   DATA
═══════════════════════════════════════ */
const listings = [
  { id: 1, price: 369000, days: 146, address: "7913 Eudora Ln, Springfield Ph B, Austin TX", beds: 4, baths: 2, sqft: 1752, acres: null, quality: "GOOD", status: "For Sale", type: "Residential", image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500&h=350&fit=crop" },
  { id: 2, price: 279000, days: 146, address: "18802 Nicklaus Dr, Point Venture, Bastrop TX", beds: 3, baths: 3, sqft: 1153, acres: null, quality: "AVERAGE", status: "For Sale", type: "Residential", image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500&h=350&fit=crop" },
  { id: 3, price: 265000, days: 146, address: "3282 N Senseney Cir, Ashton Place, Kyle TX", beds: 3, baths: 3, sqft: 1694, acres: null, quality: "AVERAGE", status: "For Sale", type: "Residential", image: "https://images.unsplash.com/photo-1598228723793-52759bba239c?w=500&h=350&fit=crop" },
  { id: 4, price: 719900, days: 146, address: "6303 Bexton Cir, Cherry Creek, Austin TX", beds: 3, baths: 2, sqft: 1834, acres: null, quality: "GOOD", status: "For Sale", type: "Residential", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=500&h=350&fit=crop" },
  { id: 5, price: 599900, days: 146, address: "5325 Bridgemore Blvd, Shelton Square, Cedar Park TX", beds: 3, baths: 3, sqft: 2488, acres: null, quality: "GOOD", status: "For Sale", type: "Residential", image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=500&h=350&fit=crop" },
  { id: 6, price: 199000, days: 146, address: "2913 Constitution Sq, Highland Lake Estates, Burnet TX", beds: null, baths: null, sqft: null, acres: 0.30, quality: "POOR", status: "For Sale", type: "Land", image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=500&h=350&fit=crop" },
  { id: 7, price: 245000, days: 146, address: "620 Davis Ranch Road, Ristvue, Bell TX", beds: null, baths: null, sqft: null, acres: 6.79, quality: "POOR", status: "For Sale", type: "Land", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=500&h=350&fit=crop" },
  { id: 8, price: 295000, days: 146, address: "Lot A County Rd 37, None, Fort Lupton CO", beds: null, baths: null, sqft: null, acres: 9.77, quality: "POOR", status: "For Sale", type: "Land", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=500&h=350&fit=crop" },
  { id: 9, price: 489900, days: 146, address: "14842 117th Place E, Buffalo Run, Commerce City CO", beds: 3, baths: 2, sqft: 1325, acres: null, quality: "AVERAGE", status: "For Sale", type: "Residential", image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=500&h=350&fit=crop" },
  { id: 10, price: 400000, days: 146, address: "4101 111th Circle W, Cotton Creek, Westminster CO", beds: 2, baths: 2, sqft: 1242, acres: null, quality: "AVERAGE", status: "For Sale", type: "Residential", image: "https://images.unsplash.com/photo-1510627489930-0c1b0bfb6785?w=500&h=350&fit=crop" },
  { id: 11, price: 2800, days: 12, address: "800 Brazos St #910, Downtown Austin TX", beds: 1, baths: 1, sqft: 740, acres: null, quality: "GOOD", status: "For Rent", type: "Residential", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=500&h=350&fit=crop" },
  { id: 12, price: 3500, days: 8, address: "1122 Colorado St #203, Bouldin Creek, Austin TX", beds: 2, baths: 2, sqft: 1100, acres: null, quality: "GOOD", status: "For Rent", type: "Residential", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500&h=350&fit=crop" },
  { id: 13, price: 540000, days: 3, address: "4401 Spicewood Springs Rd, Northwest Hills, Austin TX", beds: 4, baths: 3, sqft: 2200, acres: null, quality: "GOOD", status: "Sold", type: "Residential", image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500&h=350&fit=crop" },
  { id: 14, price: 312000, days: 59, address: "9901 Brodie Ln #17, Slaughter Creek, Austin TX", beds: 3, baths: 2, sqft: 1380, acres: null, quality: "AVERAGE", status: "For Sale", type: "Residential", image: "https://images.unsplash.com/photo-1494526585095-c41746248156?w=500&h=350&fit=crop" },
  { id: 15, price: 875000, days: 21, address: "3305 Pelham Dr, Barton Hills, Austin TX", beds: 5, baths: 4, sqft: 3100, acres: null, quality: "GOOD", status: "For Sale", type: "Residential", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=500&h=350&fit=crop" },
]

/* ═══════════════════════════════════════
   STATE
═══════════════════════════════════════ */
const savedSet = ref(new Set())
const activeTab = ref('adv')
const sortValue = ref('newest')
const currentPage = ref(1)
const PER_PAGE = 12
const PRICE_MAX = 5000000

const filterValues = reactive({
  type: '',
  typeLabel: 'All Listings',
  status: '',
  statusLabel: 'Both',
})

const drawerFilters = reactive({
  beds: '',
  baths: '',
  garage: '',
  parking: '',
  quality: '',
  daysOnMarket: '',
  yearFrom: null,
  yearTo: null,
})

const priceSlider = reactive({ lo: 0, hi: 100 })
const priceMin = ref(0)
const priceMax = ref(Infinity)

const filteredData = ref([...listings])

/* ═══════════════════════════════════════
   OPTIONS
═══════════════════════════════════════ */
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

const histogramHeights = [4,8,18,32,52,72,88,95,90,82,68,54,40,30,22,16,11,8,6,4,3,5,2,2,1]

/* ═══════════════════════════════════════
   COMPUTED
═══════════════════════════════════════ */
const filteredCount = computed(() => filteredData.value.length)

const totalPages = computed(() => Math.ceil(filteredData.value.length / PER_PAGE))

const paginatedListings = computed(() => {
  const start = (currentPage.value - 1) * PER_PAGE
  return filteredData.value.slice(start, start + PER_PAGE)
})

const paginationItems = computed(() => {
  const total = totalPages.value
  if (total <= 1) return []
  const cur = currentPage.value
  const show = new Set([1])
  for (let i = Math.max(2, cur - 1); i <= Math.min(total - 1, cur + 1); i++) show.add(i)
  show.add(total)
  const pages = [...show].sort((a, b) => a - b)
  const items = []
  for (let i = 0; i < pages.length; i++) {
    if (i > 0 && pages[i] - pages[i - 1] > 1) items.push('…')
    items.push(pages[i])
  }
  return items
})

/* ═══════════════════════════════════════
   METHODS
═══════════════════════════════════════ */
function fmtPrice(l) {
  if (l.status === "For Rent") return "$" + l.price.toLocaleString() + "/mo"
  return "$" + l.price.toLocaleString()
}

function fmtPriceShort(v) {
  if (v >= 1000000) return '$' + (v/1000000).toFixed(1).replace(/\.0$/,'') + 'M'
  if (v >= 1000) return '$' + Math.round(v/1000) + 'k'
  return '$' + v
}

function toggleHeart(id) {
  const set = savedSet.value
  if (set.has(id)) set.delete(id)
  else set.add(id)
}

function setDropdown(key, value, label) {
  filterValues[key] = value
  filterValues[key + 'Label'] = label
  applyFilters()
}

function toggleFilter(key, value) {
  drawerFilters[key] = value
  applyFilters()
}

function updatePriceSlider() {
  let lo = priceSlider.lo
  let hi = priceSlider.hi
  if (lo >= hi) {
    // prevent overlap
    if (lo >= hi) {
      priceSlider.lo = Math.min(hi - 1, 99)
      lo = priceSlider.lo
    }
  }
  priceMin.value = Math.round((lo / 100) * PRICE_MAX)
  priceMax.value = hi >= 99 ? Infinity : Math.round((hi / 100) * PRICE_MAX)
  applyFilters()
}

function isBarInRange(i) {
  const total = histogramHeights.length
  const pct = (i / total) * 100
  return pct >= priceSlider.lo && pct <= priceSlider.hi
}

function switchTab(tab) {
  activeTab.value = tab
}

function goToPage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function applyFilters() {
  const status = filterValues.status
  const type = filterValues.type
  const minBeds = typeof drawerFilters.beds === 'number' ? drawerFilters.beds : 0
  const minBaths = typeof drawerFilters.baths === 'number' ? drawerFilters.baths : 0
  const quality = drawerFilters.quality || ''
  const sort = sortValue.value

  let result = listings.filter(l => {
    if (status && l.status !== status) return false
    if (type && l.type !== type) return false
    if (quality && l.quality !== quality) return false
    if (l.price < priceMin.value || (priceMax.value !== Infinity && l.price > priceMax.value)) return false
    if (minBeds && (l.beds === null || l.beds < minBeds)) return false
    if (minBaths && (l.baths === null || l.baths < minBaths)) return false
    return true
  })

  if (sort === 'price-asc') result.sort((a, b) => a.price - b.price)
  if (sort === 'price-desc') result.sort((a, b) => b.price - a.price)
  if (sort === 'sqft-desc') result.sort((a, b) => (b.sqft || 0) - (a.sqft || 0))
  if (sort === 'oldest') result.sort((a, b) => b.days - a.days)
  if (sort === 'newest') result.sort((a, b) => a.days - b.days)

  filteredData.value = result
  currentPage.value = 1
}

function resetFilters() {
  filterValues.type = ''
  filterValues.typeLabel = 'All Listings'
  filterValues.status = ''
  filterValues.statusLabel = 'Both'
  drawerFilters.beds = ''
  drawerFilters.baths = ''
  drawerFilters.garage = ''
  drawerFilters.parking = ''
  drawerFilters.quality = ''
  drawerFilters.daysOnMarket = ''
  drawerFilters.yearFrom = null
  drawerFilters.yearTo = null
  priceSlider.lo = 0
  priceSlider.hi = 100
  priceMin.value = 0
  priceMax.value = Infinity
  sortValue.value = 'newest'
  applyFilters()
}

/* Boot */
onMounted(() => {
  applyFilters()
})
</script>

<style>
body { background: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }

/* ── Filter Bar ── */
.filter-bar {
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  padding: 9px 24px;
  position: sticky; top: 0; z-index: 100;
}

/* Shared height for all filter bar controls */
.filter-bar .fb-btn { height: 38px; font-size: 13.5px; font-weight: 500; border-radius: 8px; line-height: 1; }

/* ── Custom dropdown button ── */
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

/* ── Custom dropdown menu ── */
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

/* Base button reset */
.fb-btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 0 14px;
  cursor: pointer;
  background: #fff;
  border: 1px solid #cbd5e1;
  color: #374151;
  white-space: nowrap;
}
.fb-btn:hover { background: #f9fafb; }

/* Advanced — green border + green icon + text */
.fb-btn-advanced {
  border: 1.5px solid #16a34a;
  color: #16a34a;
}
.fb-btn-advanced:hover { background: #f0fdf4; }
.fb-btn-advanced svg { stroke: #16a34a; }

/* Save Search — plain gray */
.fb-btn-save { color: #6b7280; border-color: #d1d5db; }
.fb-btn-save svg { stroke: #9ca3af; }

/* Image Search & Compare — gradient border, gradient text */
.fb-btn-gradient {
  border: 1.5px solid transparent;
  background:
    linear-gradient(#fff, #fff) padding-box,
    linear-gradient(90deg, #f97316, #ec4899, #a855f7) border-box;
}
.fb-btn-gradient:hover {
  background:
    linear-gradient(#fff8f5, #fff8f5) padding-box,
    linear-gradient(90deg, #f97316, #ec4899, #a855f7) border-box;
}
.fb-gradient-text {
  background: linear-gradient(90deg, #f97316 0%, #ec4899 55%, #a855f7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 600;
}
/* Compare split — dropdown toggle part */
.fb-btn-compare-split {
  border: 1.5px solid transparent;
  background:
    linear-gradient(#fff, #fff) padding-box,
    linear-gradient(90deg, #ec4899, #a855f7) border-box;
  border-left: none !important;
  border-radius: 0 8px 8px 0 !important;
  padding: 0 10px;
  height: 38px;
  display: inline-flex; align-items: center;
  cursor: pointer;
  color: #9a3fcb;
}
.fb-btn-compare-split:hover { background: linear-gradient(#fff8f5,#fff8f5) padding-box, linear-gradient(90deg,#ec4899,#a855f7) border-box; }
.fb-btn-compare-main {
  border-radius: 8px 0 0 8px !important;
  border-right: none !important;
  padding-right: 8px;
}

/* Right view toggles */
.fb-view-btn {
  width: 38px; height: 38px;
  display: inline-flex; align-items: center; justify-content: center;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: #fff;
  color: #6b7280;
  cursor: pointer;
  font-size: 15px;
}
.fb-view-btn:hover { background: #f3f4f6; }
.fb-view-btn.active {
  background: #15803d;
  border-color: #15803d;
  color: #fff;
}

/* ── Sub-header ── */
.sub-header {
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  padding: 8px 24px;
  font-size: 13.5px;
}
.sub-header strong { font-weight: 700; color: #111; }

/* ── Card ── */
.listing-card {
  background: #fff;
  border: 1px solid #e0e3e8;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow .2s ease;
}
.listing-card:hover { box-shadow: 0 6px 22px rgba(0,0,0,.13); }

/* Image */
.img-wrap { position: relative; }
.listing-img { width: 100%; height: 182px; object-fit: cover; display: block; }

/* Quality badge */
.quality-badge {
  position: absolute;
  top: 9px; left: 9px;
  background: #1976d2;
  color: #fff;
  font-size: 10.5px;
  font-weight: 700;
  padding: 3px 9px;
  border-radius: 5px;
  letter-spacing: .5px;
  text-transform: uppercase;
  line-height: 1.4;
}

/* Info section */
.listing-info { padding: 11px 13px 13px; }

.price-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 6px;
  margin-bottom: 5px;
}
.listing-price { font-size: 17px; font-weight: 700; color: #111; flex-shrink: 0; }
.listing-days  { font-size: 11.5px; color: #6b7280; white-space: nowrap; text-align: right; }

.listing-address {
  font-size: 13px;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 9px;
  line-height: 1.3;
}

/* Meta row */
.listing-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12.5px;
  color: #374151;
}
.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  white-space: nowrap;
}
.meta-svg { color: #6b7280; flex-shrink: 0; }
.meta-heart {
  margin-left: auto;
  color: #b0b8c4;
  font-size: 16px;
  cursor: pointer;
  border: none; background: none; padding: 0;
  transition: color .15s;
  line-height: 1;
  flex-shrink: 0;
}
.meta-heart:hover { color: #dc2626; }
.meta-heart.saved { color: #dc2626; }

/* ── Responsive image height ── */
@media (max-width: 575px)  { .listing-img { height: 190px; } }
@media (min-width: 1400px) { .listing-img { height: 188px; } }

/* ══════════════════════════════
   ADVANCED DRAWER
══════════════════════════════ */
#advancedDrawer { width: 360px; }
@media (max-width: 480px) { #advancedDrawer { width: 100vw; } }

/* Drawer header tabs */
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

/* Section label */
.adv-label { font-size: 14.5px; font-weight: 600; color: #111827; margin-bottom: 10px; }

/* Toggle button group */
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

/* Price histogram */
.price-histogram {
  display: flex; align-items: flex-end; gap: 2px;
  height: 56px; padding: 0 2px 4px;
}
.price-bar {
  flex: 1; background: #86efac; border-radius: 2px 2px 0 0;
  transition: background .15s;
}
.price-bar.in-range { background: #16a34a; }

/* Dual range slider */
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

/* Drawer dropdowns */
.adv-select {
  width: 100%; border: 1px solid #e5e7eb; border-radius: 8px;
  padding: 9px 12px; font-size: 13.5px; color: #374151;
  background: #fff; cursor: pointer; appearance: auto;
}
.adv-select:focus { outline: none; border-color: #16a34a; box-shadow: none; }
.adv-select:disabled { background: #f9fafb; color: #9ca3af; }

/* Year built inputs */
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

/* Footer */
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

/* ── Grid spacing & responsive ── */
@media (max-width: 575px) {
  .filter-bar, .sub-header, .px-grid { padding-left: 16px !important; padding-right: 16px !important; }
}

/* ── Pagination ── */
.pagination-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 36px 0 52px;
  min-height: 60px;
}
.pg-btn {
  min-width: 36px; height: 36px;
  display: inline-flex; align-items: center; justify-content: center;
  border: none; background: none;
  font-size: 14px; color: #374151; font-weight: 500;
  border-radius: 50%;
  cursor: pointer;
  padding: 0 4px;
  transition: background .12s;
  line-height: 1;
  flex-shrink: 0;
}
.pg-btn:hover:not(:disabled):not(.active) { background: #f3f4f6; }
.pg-btn.active {
  border: 1.5px solid #9ca3af;
  color: #111;
  font-weight: 700;
  background: #fff;
}
.pg-btn:disabled { color: #d1d5db; cursor: default; pointer-events: none; }
.pg-arrow { color: #6b7280; min-width: 32px; }
.pg-ellipsis {
  font-size: 14px; color: #6b7280;
  padding: 0 6px; line-height: 36px;
  pointer-events: none; user-select: none;
}
</style>
