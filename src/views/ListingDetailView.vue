<template>
  <div>

    <!-- Loading -->
    <div v-if="loading" class="state-box">
      <div class="spinner"></div>
      <p class="text-muted">Loading listing...</p>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="state-box">
      <p class="text-muted">{{ error }}</p>
      <button class="nav-btn" @click="goBack">← Go back</button>
    </div>

    <!-- Content -->
    <template v-else-if="listing">

      <!-- Top bar -->
      <div class="main-wrap">
        <div class="topbar">
        <div class="breadcrumb">
          <a :href="listingsUrl">Listings</a>
          <span>/</span>
          <span>{{ fullAddress }}</span>
        </div>
        <div class="nav-actions">
          <button class="nav-btn" @click="goBack">← Back to results</button>
        </div>
      </div>

        <!-- Header -->
        <div class="listing-header">
          <div class="listing-header-left">
            <h1 class="listing-title">{{ fullAddress }}</h1>
            <div class="listing-address" v-if="show(listing.address?.city)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {{ listing.address.city }}<template v-if="show(listing.address?.state)">, {{ listing.address.state
              }}</template>
              <template v-if="show(listing.address?.zip)"> {{ listing.address.zip }}</template>
              <template v-if="show(listing.address?.neighborhood)"> — {{ listing.address.neighborhood }}</template>
            </div>
            <div class="meta-chips">
              <span class="status-badge" v-if="show(listing.standardStatus)">
                <span class="status-dot"></span>{{ listing.standardStatus }}
              </span>
              <span class="meta-chip" v-if="show(listing.mlsNumber)">MLS# {{ listing.mlsNumber }}</span>
              <span class="meta-chip" v-if="show(listing.daysOnMarket)">{{ listing.daysOnMarket }} days on market</span>
              <span class="meta-chip" v-if="show(listing.details?.style)">{{ listing.details.style }}</span>
              <span class="meta-chip" v-if="show(listing.details?.propertyType)">{{ listing.details.propertyType
              }}</span>
            </div>
          </div>
        </div>

        <!-- Stats bar -->
        <div class="stats-bar">
          <div class="stat-item" v-if="show(listing.listPrice)">
            <div class="stat-label">Price</div>
            <div class="stat-value price">${{ listing.listPrice.toLocaleString() }}</div>
          </div>
          <div class="stat-item" v-if="show(listing.details?.numBedrooms)">
            <div class="stat-label">Bedrooms</div>
            <div class="stat-value">{{ listing.details.numBedrooms }}</div>
          </div>
          <div class="stat-item" v-if="show(listing.details?.numBathrooms)">
            <div class="stat-label">Bathrooms</div>
            <div class="stat-value">{{ listing.details.numBathrooms }}</div>
            <div class="stat-sub" v-if="show(listing.details?.numBathroomsHalf)">+ {{ listing.details.numBathroomsHalf
            }} half</div>
          </div>
          <div class="stat-item" v-if="show(listing.details?.sqft)">
            <div class="stat-label">Square feet</div>
            <div class="stat-value">{{ Number(listing.details.sqft).toLocaleString() }}</div>
          </div>
          <div class="stat-item" v-if="show(usableSqft)">
            <div class="stat-label">Usable Square Footage</div>
            <div class="stat-value">{{ usableSqft }}</div>
          </div>
          <div class="stat-item" v-if="show(hoaFee)">
            <div class="stat-label">HOA / mo</div>
            <div class="stat-value">${{ hoaFee }}</div>
          </div>
          <div class="stat-item" v-if="show(listing.details?.yearBuilt)">
            <div class="stat-label">Year built</div>
            <div class="stat-value">{{ listing.details.yearBuilt }}</div>
          </div>
        </div>

        <!-- Content grid -->
        <div class="content-grid">

          <!-- Left col -->
          <div class="left-col">

            <!-- Gallery -->
            <div class="gallery" v-if="listing.images?.length">
              <div class="gallery-main">
                <img :src="currentImage" :alt="fullAddress" />
                <div class="gallery-nav">
                  <button class="gallery-arrow" @click="prevImg">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                  </button>
                  <button class="gallery-arrow" @click="nextImg">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                  </button>
                </div>
                <div class="gallery-count">{{ currentImgIndex + 1 }} / {{ listing.images.length }}</div>
              </div>
              <div class="gallery-thumbs">
                <img
                  v-for="(img, i) in listing.images"
                  :key="i"
                  class="gallery-thumb"
                  :src="imageUrl(img)"
                  :style="{ opacity: currentImgIndex === i ? 1 : 0.65 }"
                  @click="currentImgIndex = i"
                />
              </div>
            </div>

            <!-- Map -->
            <div class="map-section" a>
              <div class="map-section" v-if="listing.map?.latitude">
                <iframe
                  :src="`https://www.google.com/maps/embed/v1/place?key=API_KEY&q=${listing.map.latitude},${listing.map.longitude}&zoom=17`"
                  style="width:100%; height:340px; border:none;" loading="lazy" allowfullscreen></iframe>
              </div>

            </div>

            <!-- Remarks / Description -->
            <div class="section-card" v-if="show(listing.details?.description)">
              <div class="section-header">About this property</div>
              <div class="section-body">
                <p class="description-text" :class="{ clamped: !descExpanded }">
                  {{ listing.details.description }}
                </p>
                <span class="read-more" @click="descExpanded = !descExpanded">
                  {{ descExpanded ? 'Read less' : 'Read more' }}
                </span>
              </div>
            </div>

            <!-- Property Details -->
            <div class="section-card">
              <div class="section-header">Property details</div>
              <div class="section-body">
                <div class="details-cols">
                  <div>
                    <div class="detail-row" v-if="show(listing.mlsNumber)">
                      <span class="detail-key">MLS #</span>
                      <span class="detail-val">{{ listing.mlsNumber }}</span>
                    </div>
                    <div class="detail-row" v-if="show(listing.standardStatus)">
                      <span class="detail-key">Status</span>
                      <span class="detail-val">{{ listing.standardStatus }}</span>
                    </div>
                    <div class="detail-row" v-if="show(listing.details?.propertyType)">
                      <span class="detail-key">Property type</span>
                      <span class="detail-val">{{ listing.details.propertyType }}</span>
                    </div>
                    <div class="detail-row" v-if="show(listing.details?.style)">
                      <span class="detail-key">Style</span>
                      <span class="detail-val">{{ listing.details.style }}</span>
                    </div>
                    <div class="detail-row" v-if="show(listing.daysOnMarket)">
                      <span class="detail-key">Days on market</span>
                      <span class="detail-val">{{ listing.daysOnMarket }}</span>
                    </div>
                    <div class="detail-row" v-if="show(listing.type)">
                      <span class="detail-key">Listing type</span>
                      <span class="detail-val">{{ listing.type }}</span>
                    </div>
                  </div>
                  <div>
                    <div class="detail-row" v-if="show(listing.address?.city)">
                      <span class="detail-key">City</span>
                      <span class="detail-val">{{ listing.address.city }}</span>
                    </div>
                    <div class="detail-row" v-if="show(listing.address?.area)">
                      <span class="detail-key">County</span>
                      <span class="detail-val">{{ listing.address.area }}</span>
                    </div>
                    <div class="detail-row" v-if="show(listing.address?.neighborhood)">
                      <span class="detail-key">Neighborhood</span>
                      <span class="detail-val">{{ listing.address.neighborhood }}</span>
                    </div>
                    <div class="detail-row" v-if="show(listing.address?.zip)">
                      <span class="detail-key">Zip</span>
                      <span class="detail-val">{{ listing.address.zip }}</span>
                    </div>
                    <div class="detail-row" v-if="show(listing.address?.state)">
                      <span class="detail-key">State</span>
                      <span class="detail-val">{{ listing.address.state }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Interior Information -->
            <div class="section-card" v-if="hasInterior">
              <div class="section-header">Interior information</div>
              <div class="section-body">
                <div class="details-cols">
                  <div>
                    <div class="detail-row" v-if="show(listing.details?.numRooms)">
                      <span class="detail-key">Total rooms</span>
                      <span class="detail-val">{{ listing.details.numRooms }}</span>
                    </div>
                    <div class="detail-row" v-if="show(listing.details?.numBedrooms)">
                      <span class="detail-key">Bedrooms</span>
                      <span class="detail-val">{{ listing.details.numBedrooms }}</span>
                    </div>
                    <div class="detail-row" v-if="show(listing.details?.numBathrooms)">
                      <span class="detail-key">Full bathrooms</span>
                      <span class="detail-val">{{ listing.details.numBathrooms }}</span>
                    </div>
                    <div class="detail-row" v-if="show(listing.details?.numBathroomsHalf)">
                      <span class="detail-key">Half bathrooms</span>
                      <span class="detail-val">{{ listing.details.numBathroomsHalf }}</span>
                    </div>
                    <div class="detail-row" v-if="show(listing.details?.flooringType)">
                      <span class="detail-key">Flooring</span>
                      <span class="detail-val">{{ listing.details.flooringType }}</span>
                    </div>
                  </div>
                  <div>
                    <div class="detail-row" v-if="show(listing.details?.heating)">
                      <span class="detail-key">Heating</span>
                      <span class="detail-val">{{ listing.details.heating }}</span>
                    </div>
                    <div class="detail-row" v-if="show(listing.details?.airConditioning)">
                      <span class="detail-key">Cooling</span>
                      <span class="detail-val">{{ listing.details.airConditioning }}</span>
                    </div>
                    <div class="detail-row" v-if="show(listing.details?.basement1)">
                      <span class="detail-key">Basement</span>
                      <span class="detail-val">{{ listing.details.basement1 }}</span>
                    </div>
                    <div class="detail-row" v-if="show(listing.details?.balcony)">
                      <span class="detail-key">Balcony / Patio</span>
                      <span class="detail-val">{{ listing.details.balcony }}</span>
                    </div>
                    <div class="detail-row" v-if="show(listing.details?.extras)">
                      <span class="detail-key">Appliances</span>
                      <span class="detail-val">{{ listing.details.extras }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Rooms -->
            <div class="section-card" v-if="listing.rooms?.length">
              <div class="section-header">Rooms</div>
              <div class="section-body">
                <div class="rooms-grid">
                  <div class="room-item" v-for="(room, i) in listing.rooms" :key="i">
                    <div class="room-name">{{ room.description }}</div>
                    <div class="room-detail" v-if="show(roomSize(room))">{{ roomSize(room) }}</div>
                    <div class="room-detail" v-if="show(room.level)">{{ roomLevel(room.level) }}</div>
                    <div class="room-detail" v-if="show(room.features)">{{ room.features }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Exterior Information -->
            <div class="section-card" v-if="hasExterior">
              <div class="section-header">Exterior information</div>
              <div class="section-body">
                <div class="details-cols">
                  <div>
                    <div class="detail-row" v-if="show(listing.details?.exteriorConstruction1)">
                      <span class="detail-key">Exterior</span>
                      <span class="detail-val">{{ listing.details.exteriorConstruction1 }}</span>
                    </div>
                    <div class="detail-row" v-if="show(listing.details?.roofMaterial)">
                      <span class="detail-key">Roof</span>
                      <span class="detail-val">{{ listing.details.roofMaterial }}</span>
                    </div>
                    <div class="detail-row" v-if="show(listing.details?.foundationType)">
                      <span class="detail-key">Foundation</span>
                      <span class="detail-val">{{ listing.details.foundationType }}</span>
                    </div>
                    <div class="detail-row" v-if="show(listing.details?.waterfront)">
                      <span class="detail-key">Waterfront</span>
                      <span class="detail-val">{{ listing.details.waterfront }}</span>
                    </div>
                    <div class="detail-row" v-if="show(listing.lot?.acres)">
                      <span class="detail-key">Lot acres</span>
                      <span class="detail-val">{{ listing.lot.acres }}</span>
                    </div>
                    <div class="detail-row" v-if="show(listing.lot?.squareFeet)">
                      <span class="detail-key">Lot sq ft</span>
                      <span class="detail-val">{{ listing.lot.squareFeet }}</span>
                    </div>
                    <div class="detail-row" v-if="show(listing.lot?.dimensions)">
                      <span class="detail-key">Lot size</span>
                      <span class="detail-val">{{ listing.lot.dimensions }}</span>
                    </div>
                    <div class="detail-row" v-if="show(listing.lot?.features)">
                      <span class="detail-key">Lot features</span>
                      <span class="detail-val">{{ listing.lot.features }}</span>
                    </div>
                  </div>
                  <div>
                    <div class="detail-row" v-if="show(listing.details?.sewer)">
                      <span class="detail-key">Sewer</span>
                      <span class="detail-val">{{ listing.details.sewer }}</span>
                    </div>
                    <div class="detail-row" v-if="show(listing.details?.waterSource)">
                      <span class="detail-key">Water</span>
                      <span class="detail-val">{{ listing.details.waterSource }}</span>
                    </div>
                    <div class="detail-row" v-if="show(listing.details?.zoning)">
                      <span class="detail-key">Zoning</span>
                      <span class="detail-val">{{ listing.details.zoning }}</span>
                    </div>
                    <div class="detail-row" v-if="listing.nearby?.amenities?.length > 0">
                      <span class="detail-key">Nearby</span>
                      <span class="detail-val">{{ listing.nearby.amenities.join(', ') }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Parking & Pets -->
            <div class="section-card" v-if="hasParking">
              <div class="section-header">Parking &amp; Pets</div>
              <div class="section-body">
                <div class="details-cols">
                  <div>
                    <div class="sub-label">Parking</div>
                    <div class="detail-row" v-if="show(listing.condominium?.parkingType)">
                      <span class="detail-key">Type</span>
                      <span class="detail-val">{{ listing.condominium.parkingType }}</span>
                    </div>
                    <div class="detail-row" v-if="show(listing.details?.numGarageSpaces)">
                      <span class="detail-key">Garage spaces</span>
                      <span class="detail-val">{{ listing.details.numGarageSpaces }}</span>
                    </div>
                    <div class="detail-row" v-if="show(listing.details?.numParkingSpaces)">
                      <span class="detail-key">Total spaces</span>
                      <span class="detail-val">{{ listing.details.numParkingSpaces }}</span>
                    </div>
                  </div>
                  <div v-if="show(listing.condominium?.pets)">
                    <div class="sub-label">Pets</div>
                    <div class="detail-row">
                      <span class="detail-key">Allowed</span>
                      <span class="detail-val">{{ listing.condominium.pets }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Financial Information -->
            <div class="section-card" v-if="hasFinancial">
              <div class="section-header">Financial information</div>
              <div class="section-body">
                <div class="details-cols">
                  <div>
                    <div class="detail-row" v-if="show(listing.listPrice)">
                      <span class="detail-key">List price</span>
                      <span class="detail-val">${{ listing.listPrice.toLocaleString() }}</span>
                    </div>
                    <div class="detail-row" v-if="show(listing.taxes?.annualAmount)">
                      <span class="detail-key">Taxes</span>
                      <span class="detail-val">${{ listing.taxes.annualAmount.toLocaleString() }}</span>
                    </div>
                    <div class="detail-row" v-if="show(listing.taxes?.assessmentYear)">
                      <span class="detail-key">Tax year</span>
                      <span class="detail-val">{{ listing.taxes.assessmentYear }}</span>
                    </div>
                    <div class="detail-row" v-if="show(hoaFee)">
                      <span class="detail-key">HOA (monthly)</span>
                      <span class="detail-val">${{ hoaFee }}</span>
                    </div>
                  </div>
                  <div>
                    <div class="detail-row" v-if="show(listing.condominium?.condoCorp)">
                      <span class="detail-key">HOA corp</span>
                      <span class="detail-val">{{ listing.condominium.condoCorp }}</span>
                    </div>
                    <div class="detail-row" v-if="show(listing.soldPrice)">
                      <span class="detail-key">Sold price</span>
                      <span class="detail-val">${{ listing.soldPrice.toLocaleString() }}</span>
                    </div>
                    <div class="detail-row" v-if="show(listing.originalPrice)">
                      <span class="detail-key">Original price</span>
                      <span class="detail-val">${{ listing.originalPrice.toLocaleString() }}</span>
                    </div>
                    <div class="detail-row" v-if="show(listing.originalPrice)">
                      <span class="detail-key">Assessments include</span>
                      <span class="detail-val">{{ listing?.associationFeeIncludes }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Property Specific -->
            <div class="section-card" v-if="hasPropertySpecific">
              <div class="section-header">Property specific details</div>
              <div class="section-body">
                <div class="details-cols">
                  <div>
                    <div class="detail-row" v-if="show(listing.details?.yearBuilt)">
                      <span class="detail-key">Year built</span>
                      <span class="detail-val">{{ listing.details.yearBuilt }}</span>
                    </div>
                    <div class="detail-row" v-if="show(listing.condominium?.stories)">
                      <span class="detail-key">Stories</span>
                      <span class="detail-val">{{ listing.condominium.stories }}</span>
                    </div>
                    <div class="detail-row" v-if="show(listing.details?.numRooms)">
                      <span class="detail-key">Total rooms</span>
                      <span class="detail-val">{{ listing.details.numRooms }}</span>
                    </div>
                  </div>
                  <div>
                    <div class="detail-row" v-if="show(listing.class)">
                      <span class="detail-key">Class</span>
                      <span class="detail-val">{{ listing.class }}</span>
                    </div>
                    <div class="detail-row" v-if="show(listing.updatedOn)">
                      <span class="detail-key">Last updated</span>
                      <span class="detail-val">{{ new Date(listing.updatedOn).toLocaleDateString() }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Sidebar -->
          <div class="sidebar">
            <!-- MLS info -->
            <div class="mls-card">
              <div v-if="show(listing.mlsNumber)"><strong>MLS #:</strong> {{ listing.mlsNumber }}</div>
              <div v-if="show(listing.class)"><strong>Class:</strong> {{ listing.class }}</div>
              <div v-if="show(listing.updatedOn)"><strong>Last updated:</strong> {{ new
                Date(listing.updatedOn).toLocaleDateString() }}</div>
              <br/>
              <span style="font-size:11px; color:#94a3b8;">Information deemed reliable but not guaranteed.</span>
            </div>

          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
  apiBase: { type: String, default: 'http://localhost:3001' },
  mlsNumber: { type: String, default: '' }
})

const listing        = ref(null)
const loading        = ref(true)
const error          = ref(null)
const currentImgIndex = ref(0)
const descExpanded   = ref(false)
const isSaved        = ref(false)

const IMAGE_BASE = 'https://cdn.repliers.io/'

// ── Helpers ──

// Returns true only if value exists and is not empty
function show(val) {
  if (val === null || val === undefined) return false
  if (val === '' || val === false) return false
  if (Array.isArray(val) && val.length === 0) return false
  return true
}

function imageUrl(img) {
  if (!img) return ''
  return img.startsWith('http') ? img : IMAGE_BASE + img
}

function roomSize(room) {
  if (room.length && room.width) return `${room.length} × ${room.width}`
  return null
}

function roomLevel(level) {
  if (!level) return ''
  return level + ' Floor'
}

function goBack() {
  if (document.referrer) {
    window.history.back()
  } else {
    window.location.href = listingsUrl.value
  }
}

// ── Computed ──

const listingsUrl = computed(() => {
  // Go back to listings page — adjust slug as needed
  return window.location.origin + '/listings/'
})

const fullAddress = computed(() => {
  const a = listing.value?.address
  if (!a) return ''
  return [
    a.streetNumber,
    a.streetDirectionPrefix,
    a.streetName,
    a.streetSuffix,
    a.unitNumber ? '#' + a.unitNumber : null,
  ].filter(Boolean).join(' ')
})

const currentImage = computed(() => {
  const images = listing.value?.images
  if (!images?.length) return ''
  return imageUrl(images[currentImgIndex.value])
})

// HOA fee — details.HOAFee first, fallback to condominium.fees.maintenance
const hoaFee = computed(() => {
  return listing.value?.details?.HOAFee
    || listing.value?.condominium?.fees?.maintenance
    || null
})

// Section visibility — only show section if at least one field has a value
const hasInterior = computed(() => {
  const d = listing.value?.details
  if (!d) return false
  return show(d.numRooms) || show(d.numBedrooms) || show(d.numBathrooms) ||
    show(d.numBathroomsHalf) || show(d.flooringType) || show(d.heating) ||
    show(d.airConditioning) || show(d.basement1) || show(d.extras)
})

const hasExterior = computed(() => {
  const d = listing.value?.details
  const l = listing.value?.lot
  if (!d && !l) return false
  return show(d?.exteriorConstruction1) || show(d?.roofMaterial) ||
    show(d?.waterfront) || show(l?.acres) || show(l?.squareFeet) ||
    show(l?.dimensions) || show(d?.sewer) || show(d?.waterSource)
})

const hasParking = computed(() => {
  const d = listing.value?.details
  const c = listing.value?.condominium
  return show(c?.parkingType) || show(d?.numGarageSpaces) ||
    show(d?.numParkingSpaces) || show(c?.pets)
})

const hasFinancial = computed(() => {
  const t = listing.value?.taxes
  return show(listing.value?.listPrice) || show(t?.annualAmount) ||
    show(t?.assessmentYear) || show(hoaFee.value)
})

const hasPropertySpecific = computed(() => {
  const d = listing.value?.details
  const c = listing.value?.condominium
  return show(d?.yearBuilt) || show(c?.stories) || show(listing.value?.class)
})

const usableSqft = computed(() => {
  const rooms = listing.value?.rooms
  if (!rooms?.length) return null

  const total = rooms.reduce((sum, room) => {
    const l = Number(room.length)
    const w = Number(room.width)
    if (l && w) sum += l * w
    return sum
  }, 0)

  return total > 0 ? total.toLocaleString() : null
})

// ── Gallery ──

function nextImg() {
  const len = listing.value?.images?.length || 1
  currentImgIndex.value = (currentImgIndex.value + 1) % len
}

function prevImg() {
  const len = listing.value?.images?.length || 1
  currentImgIndex.value = (currentImgIndex.value - 1 + len) % len
}

// ── Fetch ──

onMounted(async () => {
  try {
    const mls = props.mlsNumber
    if (!mls) throw new Error('No MLS number provided')
    const res = await fetch(`${props.apiBase}/listings/${mls}`)
    if (!res.ok) throw new Error('Listing not found')
    listing.value = await res.json()
  } catch (e) {
    error.value = e.message || 'Failed to load listing'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.state-box {
  display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 0;
    gap: 12px;
}
.spinner {
  width: 36px;
    height: 36px;
  border: 3px solid #e2e8f0;
  border-top-color: #16a34a;
  border-radius: 50%;
  animation: spin .75s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.text-muted { color: #64748b; font-size: 13px; }

.topbar {
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
    align-items: center;
    justify-content: space-between;
  height: 52px;
  position: sticky;
    top: 0;
    z-index: 100;
}
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12.5px;
  color: #64748b;
}
.breadcrumb a { color: #16a34a; text-decoration: none; }
.nav-actions { display: flex; align-items: center; gap: 8px; }
.nav-btn {
  display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 6px 14px;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
    background: #fff;
    font-size: 12.5px;
    font-weight: 500;
    cursor: pointer;
    color: #334155;
    text-decoration: none;
  transition: background .15s;
}
.nav-btn:hover { background: #f8fafc; }

.main-wrap { max-width: 1180px; margin: 0 auto; padding: 24px 24px 64px; }

.listing-header {
  display: flex;
    align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
    gap: 16px;
}
.listing-title {
  font-size: 24px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.2;
}
.listing-address {
  font-size: 14px;
    color: #64748b;
    margin-top: 4px;
    display: flex;
    align-items: center;
    gap: 5px;
}
.meta-chips {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  flex-wrap: wrap;
}
.status-badge {
  display: inline-flex;
    align-items: center;
    gap: 5px;
    background: #f0fdf4;
    color: #16a34a;
    font-size: 12px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 20px;
    border: 1px solid #bbf7d0;
}
.status-dot { width: 6px; height: 6px; background: #16a34a; border-radius: 50%; }
.meta-chip {
  font-size: 12px;
  color: #64748b;
  background: #f1f5f9;
  padding: 3px 10px;
  border-radius: 20px;
}
.icon-btn {
  width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 1px solid #e2e8f0;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #64748b;
    transition: background .15s;
}
.icon-btn.saved { color: #ef4444; border-color: #fecaca; background: #fff5f5; }

.stats-bar {
  display: flex;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 24px;
    flex-wrap: wrap;
}
.stat-item {
  flex: 1;
  padding: 16px 20px;
  border-right: 1px solid #e2e8f0;
  min-width: 0;
}
.stat-item:last-child { border-right: none; }
.stat-label { font-size: 10.5px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: .6px; margin-bottom: 4px; }
.stat-value {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
  white-space: nowrap;
}
.stat-value.price { color: #16a34a; }
.stat-sub { font-size: 11px; color: #94a3b8; margin-top: 2px; }

.content-grid {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 24px;
  align-items: start;
}
.left-col {
  min-width: 0;
  overflow: hidden;
}

.gallery {
  border-radius: 10px;
  overflow: hidden;
  background: #0f172a;
  margin-bottom: 20px;
    min-width: 0;
}
.gallery-main {
  position: relative;
  height: 420px;
  overflow: hidden;
}
.gallery-main img { width: 100%; height: 100%; object-fit: cover; display: block; }
.gallery-nav {
  position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 100%;
    display: flex;
    justify-content: space-between;
    padding: 0 14px;
    pointer-events: none;
}
.gallery-arrow {
  width: 40px;
    height: 40px;
    background: rgba(255, 255, 255, .9);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    pointer-events: all;
    border: none;
    color: #0f172a;
}
.gallery-count {
  position: absolute;
    bottom: 12px;
    right: 14px;
    background: rgba(0, 0, 0, .55);
    color: #fff;
    font-size: 12px;
    padding: 3px 10px;
    border-radius: 20px;
}
.gallery-thumbs {
  display: flex;
  gap: 3px;
  padding: 3px;
  background: #0f172a;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,.2) transparent;
}
.gallery-thumb {
  width: 90px;
  height: 60px;
  flex-shrink: 0;
  object-fit: cover;
  cursor: pointer;
  border-radius: 4px;
  transition: opacity .15s;
}
.section-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 20px;
}

.section-header {
  background: #0f172a;
  color: #fff;
  padding: 12px 20px;
  font-size: 12.5px;
  font-weight: 600;
  letter-spacing: .4px;
  text-transform: uppercase;
}
.section-body { padding: 20px; }

.description-text { font-size: 14px; line-height: 1.75; color: #334155; }
.description-text.clamped {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.read-more { color: #16a34a; font-size: 13px; font-weight: 500; cursor: pointer; margin-top: 8px; display: inline-block; }

.details-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 0 32px; }
.detail-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
  padding: 9px 0;
  border-bottom: 1px solid #f1f5f9;
}
.detail-row:last-child { border-bottom: none; }
.detail-key {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
  min-width: 110px;
  white-space: nowrap;
  flex-shrink: 0;
}
.detail-val { font-size: 13px; font-weight: 600; color: #0f172a; }

.sub-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .6px; color: #94a3b8; margin-bottom: 12px; }

.rooms-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.room-item { background: #f8fafc; border-radius: 8px; padding: 12px; }
.room-name { font-size: 13px; font-weight: 600; color: #0f172a; margin-bottom: 4px; }
.room-detail { font-size: 12px; color: #64748b; }

.map-section {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 20px;
}

.map-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid #e2e8f0;
}
.map-title { font-size: 14px; font-weight: 600; color: #0f172a; }
.map-placeholder {
  height: 240px;
  background: #e8edf2;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  font-size: 13px;
  gap: 8px;
}

.action-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 16px; }
.action-btn {
  display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    background: #fff;
    cursor: pointer;
    width: 100%;
    color: #334155;
    font-size: 13px;
    font-weight: 500;
    text-decoration: none;
}
.action-btn:hover { background: #f8fafc; }
.action-icon {
  width: 36px;
  height: 36px;
  background: #0f172a;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.action-icon svg { color: #fff; }

.agent-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin-bottom: 16px; }
.agent-card h4 { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .5px; color: #94a3b8; margin-bottom: 14px; }
.agent-info { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.agent-avatar {
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: #0f172a;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  flex-shrink: 0;
}
.agent-name { font-size: 14px; font-weight: 600; color: #0f172a; }
.agent-company { font-size: 12px; color: #64748b; }
.agent-phones { display: flex; flex-direction: column; gap: 4px; margin-bottom: 12px; }
.phone-link { font-size: 13px; color: #16a34a; text-decoration: none; }
.contact-btn {
  width: 100%;
  padding: 11px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  margin-bottom: 8px;
}
.contact-btn.primary {
  background: #16a34a;
  color: #fff;
}
.contact-btn.secondary {
  background: #0f172a;
  color: #fff;
}
.contact-btn:last-child { margin-bottom: 0; }

.mls-card {
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 16px;
  font-size: 12.5px;
  color: #64748b;
  line-height: 2;
}
.mls-card strong { color: #0f172a; }

@media (max-width: 1024px) {
  .content-grid {
      grid-template-columns: 1fr 240px;
    }
  }
@media (max-width: 768px) {
  .main-wrap { padding: 16px 16px 48px; }
  .topbar { padding: 0 16px; }
  .breadcrumb { display: none; }
    .listing-header {
      flex-direction: column;
    }
  .listing-title { font-size: 18px; }
    .stats-bar {
      flex-wrap: wrap;
    }

    .stat-item {
      flex: 0 0 50%;
      border-right: none !important;
      border-bottom: 1px solid #e2e8f0;
    }

    .stat-item:nth-child(odd) {
      border-right: 1px solid #e2e8f0 !important;
    }

    .stat-item:nth-last-child(-n+2) {
      border-bottom: none;
    }

    .content-grid {
      grid-template-columns: 1fr;
    }
  .sidebar { order: -1; }
    .gallery-main {
      height: 260px;
    }

    .details-cols {
      grid-template-columns: 1fr;
      gap: 0;
    }

    .rooms-grid {
      grid-template-columns: repeat(2, 1fr);
    }
}
@media (max-width: 480px) {
  .gallery-main { height: 200px; }
  .rooms-grid { grid-template-columns: 1fr; }
    .stat-value {
      font-size: 16px;
    }
}

</style>
