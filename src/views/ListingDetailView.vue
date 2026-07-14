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
      <button class="nav-btn" @click="router.back()">← Go back</button>
    </div>

    <!-- Content -->
    <template v-else-if="listing">

      <!-- Top bar -->
      <div class="topbar">
        <div class="breadcrumb">
          <router-link to="/">Listings</router-link>
          <span>/</span>
          <span>{{ fullAddress }}</span>
        </div>
        <div class="nav-actions">
          <button class="nav-btn" @click="router.back()">← Back to results</button>
        </div>
      </div>

      <div class="main-wrap">

        <!-- Header -->
        <div class="listing-header">
          <div class="listing-header-left">
            <h1 class="listing-title">{{ fullAddress }}</h1>
            <div class="listing-address">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              {{ listing.address?.city }}, {{ listing.address?.state }} {{ listing.address?.zip }}
              <template v-if="listing.address?.neighborhood"> — {{ listing.address.neighborhood }}</template>
            </div>
            <div style="display:flex; gap:8px; margin-top:8px; align-items:center; flex-wrap:wrap;">
              <span class="status-badge"><span class="status-dot"></span> {{ listing.standardStatus }}</span>
              <span style="font-size:12px; color:#94a3b8;">MLS# {{ listing.mlsNumber }}</span>
              <span style="font-size:12px; color:#94a3b8;">·</span>
              <span style="font-size:12px; color:#94a3b8;">{{ listing.daysOnMarket }} days on market</span>
              <span style="font-size:12px; color:#94a3b8;">·</span>
              <span style="font-size:12px; color:#94a3b8;">{{ listing.details?.style }}</span>
            </div>
          </div>
          <div class="listing-header-actions">
            <button class="icon-btn" :class="{ saved: isSaved }" @click="isSaved = !isSaved" title="Save">
              <svg width="17" height="17" viewBox="0 0 24 24" :fill="isSaved ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            </button>
            <button class="icon-btn" title="Print" @click="window.print()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            </button>
          </div>
        </div>

        <!-- Stats bar -->
        <div class="stats-bar">
          <div class="stat-item">
            <div class="stat-label">Price</div>
            <div class="stat-value price">${{ listing.listPrice?.toLocaleString() }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Bedrooms</div>
            <div class="stat-value">{{ listing.details?.numBedrooms ?? '—' }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Bathrooms</div>
            <div class="stat-value">{{ listing.details?.numBathrooms ?? '—' }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">Square feet</div>
            <div class="stat-value">{{ listing.details?.sqft ?? '—' }}</div>
          </div>
          <div class="stat-item" v-if="listing.condominium?.fees?.maintenance">
            <div class="stat-label">HOA</div>
            <div class="stat-value">${{ listing.condominium.fees.maintenance }}</div>
            <div class="stat-sub">per month</div>
          </div>
          <div class="stat-item" v-if="listing.details?.yearBuilt">
            <div class="stat-label">Year built</div>
            <div class="stat-value">{{ listing.details.yearBuilt }}</div>
          </div>
        </div>

        <!-- Two column -->
        <div class="content-grid">

          <!-- Left -->
          <div class="left-col">

            <!-- Gallery -->
            <div class="gallery">
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
                <div class="gallery-count">{{ currentImgIndex + 1 }} / {{ listing.images?.length }}</div>
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

            <!-- Description -->
            <div class="section-card" v-if="listing.details?.description">
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

            <!-- Property details -->
            <div class="section-card">
              <div class="section-header">Property details</div>
              <div class="section-body">
                <div class="details-cols">
                  <div>
                    <div class="detail-row"><span class="detail-key">Property type</span><span class="detail-val">{{ listing.details?.propertyType ?? '—' }}</span></div>
                    <div class="detail-row"><span class="detail-key">Style</span><span class="detail-val">{{ listing.details?.style ?? '—' }}</span></div>
                    <div class="detail-row"><span class="detail-key">Year built</span><span class="detail-val">{{ listing.details?.yearBuilt ?? '—' }}</span></div>
                    <div class="detail-row"><span class="detail-key">Heating</span><span class="detail-val">{{ listing.details?.heating ?? '—' }}</span></div>
                    <div class="detail-row"><span class="detail-key">Cooling</span><span class="detail-val">{{ listing.details?.airConditioning ?? '—' }}</span></div>
                    <div class="detail-row"><span class="detail-key">Flooring</span><span class="detail-val">{{ listing.details?.flooringType ?? '—' }}</span></div>
                  </div>
                  <div>
                    <div class="detail-row"><span class="detail-key">MLS #</span><span class="detail-val">{{ listing.mlsNumber }}</span></div>
                    <div class="detail-row"><span class="detail-key">Status</span><span class="detail-val">{{ listing.standardStatus }}</span></div>
                    <div class="detail-row"><span class="detail-key">Type</span><span class="detail-val">{{ listing.type }}</span></div>
                    <div class="detail-row"><span class="detail-key">Neighborhood</span><span class="detail-val">{{ listing.address?.neighborhood ?? '—' }}</span></div>
                    <div class="detail-row"><span class="detail-key">Area</span><span class="detail-val">{{ listing.address?.area ?? '—' }}</span></div>
                    <div class="detail-row"><span class="detail-key">Zip</span><span class="detail-val">{{ listing.address?.zip }}</span></div>
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
                    <div class="room-detail">{{ room.level }}</div>
                    <div class="room-detail" v-if="room.features">{{ room.features }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Lot details -->
            <div class="section-card" v-if="listing.lot">
              <div class="section-header">Lot details</div>
              <div class="section-body">
                <div class="details-cols">
                  <div>
                    <div class="detail-row"><span class="detail-key">Lot features</span><span class="detail-val">{{ listing.lot?.features ?? '—' }}</span></div>
                    <div class="detail-row"><span class="detail-key">Acres</span><span class="detail-val">{{ listing.lot?.acres ?? '—' }}</span></div>
                    <div class="detail-row"><span class="detail-key">Sq ft</span><span class="detail-val">{{ listing.lot?.squareFeet ?? '—' }}</span></div>
                  </div>
                  <div>
                    <div class="detail-row"><span class="detail-key">Sewer</span><span class="detail-val">{{ listing.details?.sewer ?? '—' }}</span></div>
                    <div class="detail-row"><span class="detail-key">Water</span><span class="detail-val">{{ listing.details?.waterSource ?? '—' }}</span></div>
                    <div class="detail-row"><span class="detail-key">Foundation</span><span class="detail-val">{{ listing.details?.foundationType ?? '—' }}</span></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Exterior / Parking / Pets -->
            <div class="section-card" v-if="listing.condominium">
              <div class="section-header">Parking &amp; Pets</div>
              <div class="section-body">
                <div class="details-cols">
                  <div class="sub-section">
                    <div class="sub-label">Parking</div>
                    <div class="detail-row"><span class="detail-key">Type</span><span class="detail-val">{{ listing.condominium?.parkingType ?? '—' }}</span></div>
                  </div>
                  <div class="sub-section">
                    <div class="sub-label">Pets</div>
                    <div class="detail-row"><span class="detail-key">Allowed</span><span class="detail-val">{{ listing.condominium?.pets ?? '—' }}</span></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Financial -->
            <div class="section-card">
              <div class="section-header">Financial information</div>
              <div class="section-body">
                <div class="details-cols">
                  <div>
                    <div class="detail-row"><span class="detail-key">List price</span><span class="detail-val">${{ listing.listPrice?.toLocaleString() }}</span></div>
                    <div class="detail-row"><span class="detail-key">HOA fee</span><span class="detail-val">{{ listing.condominium?.fees?.maintenance ? '$' + listing.condominium.fees.maintenance + '/mo' : '—' }}</span></div>
                    <div class="detail-row"><span class="detail-key">Taxes</span><span class="detail-val">{{ listing.taxes?.annualAmount ? '$' + listing.taxes.annualAmount : '—' }}</span></div>
                  </div>
                  <div>
                    <div class="detail-row"><span class="detail-key">Nearby</span><span class="detail-val">{{ listing.nearby?.amenities?.join(', ') ?? '—' }}</span></div>
                    <div class="detail-row"><span class="detail-key">Zoning</span><span class="detail-val">{{ listing.details?.zoning ?? '—' }}</span></div>
                    <div class="detail-row"><span class="detail-key">HOA corp</span><span class="detail-val">{{ listing.condominium?.condoCorp ?? '—' }}</span></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Appliances -->
            <div class="section-card" v-if="listing.details?.extras">
              <div class="section-header">Appliances &amp; extras</div>
              <div class="section-body">
                <p class="description-text">{{ listing.details.extras }}</p>
              </div>
            </div>

            <!-- Map placeholder -->
            <div class="map-section" v-if="listing.map?.latitude">
              <div class="map-header">
                <span class="map-title">📍 {{ fullAddress }}</span>

<a :href="`https://www.google.com/maps?q=${listing.map.latitude},${listing.map.longitude}`" target="_blank" class="nav-btn">Open in maps</a>
              </div>
              <div class="map-placeholder">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {{ listing.map.latitude }}, {{ listing.map.longitude }}
              </div>
            </div>

          </div>

          <!-- Sidebar -->
          <div class="sidebar">

            <!-- MLS info -->
            <div class="mls-card">
              <strong>MLS #:</strong> {{ listing.mlsNumber }}<br/>
              <strong>Board ID:</strong> {{ listing.boardId }}<br/>
              <strong>Class:</strong> {{ listing.class }}<br/>
              <strong>Last updated:</strong> {{ new Date(listing.updatedOn).toLocaleDateString() }}<br/>
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
import { useRoute, useRouter } from 'vue-router'
import { inject } from 'vue'

const props = defineProps({
  apiBase: { type: String, required: true },
  mlsNumber: { type: String, required: true }
})

const route = useRoute()
const apiBase = inject('apiBase', 'http://localhost:3001')

const listing        = ref(null)
const loading        = ref(true)
const error          = ref(null)
const currentImgIndex = ref(0)
const descExpanded   = ref(false)
const isSaved        = ref(false)

const IMAGE_BASE = 'https://cdn.repliers.io/'

function imageUrl(img) {
  if (!img) return ''
  return img.startsWith('http') ? img : IMAGE_BASE + img
}

const currentImage = computed(() => {
  const images = listing.value?.images
  if (!images?.length) return ''
  return imageUrl(images[currentImgIndex.value])
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
    a.city,
    a.state,
    a.zip
  ].filter(Boolean).join(' ')
})

function nextImg() {
  const len = listing.value?.images?.length || 1
  currentImgIndex.value = (currentImgIndex.value + 1) % len
}

function prevImg() {
  const len = listing.value?.images?.length || 1
  currentImgIndex.value = (currentImgIndex.value - 1 + len) % len
}


onMounted(async () => {
  try {
    const res = await fetch(`${props.apiBase}/listings/${props.mlsNumber}`)
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
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.state-box {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  padding: 80px 0; gap: 12px;
}
.spinner {
  width: 36px; height: 36px;
  border: 3px solid #e2e8f0;
  border-top-color: #16a34a;
  border-radius: 50%;
  animation: spin .75s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.text-muted { color: #64748b; font-size: 13px; }

/* ── Top bar ── */
.topbar {
  background: #fff;
  border-bottom: 1px solid #e2e8f0;
  padding: 0 32px;
  display: flex; align-items: center; justify-content: space-between;
  height: 52px;
  position: sticky; top: 0; z-index: 100;
}
.breadcrumb {
  display: flex; align-items: center; gap: 6px;
  font-size: 12.5px; color: #64748b;
}
.breadcrumb a { color: #16a34a; text-decoration: none; }
.nav-actions { display: flex; align-items: center; gap: 8px; }
.nav-btn {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 6px 14px; border-radius: 6px;
  border: 1px solid #e2e8f0; background: #fff;
  font-size: 12.5px; font-weight: 500; cursor: pointer;
  color: #334155; text-decoration: none;
  transition: background .15s;
}
.nav-btn:hover { background: #f8fafc; }

/* ── Main wrap ── */
.main-wrap { max-width: 1180px; margin: 0 auto; padding: 24px 24px 64px; }

/* ── Header ── */
.listing-header {
  display: flex; align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px; gap: 16px;
}
.listing-title { font-size: 26px; font-weight: 700; color: #0f172a; line-height: 1.2; }
.listing-address {
  font-size: 14px; color: #64748b;
  margin-top: 4px; display: flex; align-items: center; gap: 5px;
}
.status-badge {
  display: inline-flex; align-items: center; gap: 5px;
  background: #f0fdf4; color: #16a34a;
  font-size: 12px; font-weight: 600;
  padding: 3px 10px; border-radius: 20px;
  border: 1px solid #bbf7d0; margin-top: 8px;
}
.status-dot { width: 6px; height: 6px; background: #16a34a; border-radius: 50%; }
.listing-header-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.icon-btn {
  width: 40px; height: 40px; border-radius: 50%;
  border: 1px solid #e2e8f0; background: #fff;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #64748b; transition: background .15s;
}
.icon-btn:hover { background: #f8fafc; }
.icon-btn.saved { color: #ef4444; border-color: #fecaca; background: #fff5f5; }

/* ── Stats bar ── */
.stats-bar {
  display: flex; background: #fff;
  border: 1px solid #e2e8f0; border-radius: 10px;
  overflow: hidden; margin-bottom: 24px;
}

.stat-item {
  flex: 1;
  padding: 16px 20px;
  border-right: 1px solid #e2e8f0;
  min-width: 0;        /* 👈 prevents overflow */
  overflow: hidden;
}
.stat-value {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
  line-height: 1.1;
  white-space: nowrap;  /* 👈 don't wrap price */
  overflow: hidden;
  text-overflow: ellipsis;
}

.stat-item:last-child { border-right: none; }
.stat-label { font-size: 10.5px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: .6px; margin-bottom: 4px; }
.stat-value.price { color: #16a34a; }
.stat-sub { font-size: 11px; color: #94a3b8; margin-top: 2px; }

/* ── Content grid ── */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 24px;
  align-items: start;
  min-width: 0;        /* 👈 key fix */
}
.left-col {
  min-width: 0;        /* 👈 prevents left col from pushing sidebar off */
  overflow: hidden;
}

/* ── Gallery ── */
.gallery {
  border-radius: 10px;
  overflow: hidden;
  background: #0f172a;
  margin-bottom: 24px;
  min-width: 0;        /* 👈 prevents stretching */
  width: 100%;
}
.gallery-main { position: relative; height: 440px; overflow: hidden; }
.gallery-main img { width: 100%; height: 100%; object-fit: cover; display: block; }
.gallery-nav {
  position: absolute; top: 50%; transform: translateY(-50%);
  width: 100%; display: flex; justify-content: space-between;
  padding: 0 14px; pointer-events: none;
}
.gallery-arrow {
  width: 40px; height: 40px; background: rgba(255,255,255,.9);
  border-radius: 50%; display: flex; align-items: center; justify-content: center;
  cursor: pointer; pointer-events: all; border: none; color: #0f172a; transition: background .15s;
}
.gallery-arrow:hover { background: #fff; }
.gallery-count {
  position: absolute; bottom: 12px; right: 14px;
  background: rgba(0,0,0,.55); color: #fff;
  font-size: 12px; padding: 3px 10px; border-radius: 20px;
}
.gallery-thumbs {
  display: flex;
  gap: 3px;
  padding: 3px;
  background: #0f172a;
  overflow-x: auto;     /* 👈 scroll, don't stretch */
  overflow-y: hidden;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,.2) transparent;
}
.gallery-thumb {
  width: 90px;
  height: 60px;
  flex-shrink: 0;       /* 👈 never shrink thumbs */
  object-fit: cover;
  cursor: pointer;
  border-radius: 4px;
  transition: opacity .15s;
}
/* ── Section card ── */
.section-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; margin-bottom: 20px; }
.section-header { background: #0f172a; color: #fff; padding: 12px 20px; font-size: 13px; font-weight: 600; letter-spacing: .4px; text-transform: uppercase; }
.section-body { padding: 20px; }

/* ── Description ── */
.description-text { font-size: 14px; line-height: 1.75; color: #334155; }
.description-text.clamped { display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
.read-more { color: #16a34a; font-size: 13px; font-weight: 500; cursor: pointer; margin-top: 8px; display: inline-block; }

/* ── Details ── */
.details-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 0 32px; }
.detail-row { display: flex; align-items: baseline; gap: 8px; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
.detail-row:last-child { border-bottom: none; }
.detail-key { font-size: 12.5px; color: #94a3b8; font-weight: 500; white-space: nowrap; min-width: 110px; }
.detail-val { font-size: 13px; font-weight: 600; color: #0f172a; }

/* ── Sub section ── */
.sub-section { margin-bottom: 20px; }
.sub-section:last-child { margin-bottom: 0; }
.sub-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .6px; color: #94a3b8; margin-bottom: 12px; }

/* ── Rooms ── */
.rooms-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.room-item { background: #f8fafc; border-radius: 8px; padding: 12px; }
.room-name { font-size: 13px; font-weight: 600; color: #0f172a; margin-bottom: 4px; }
.room-detail { font-size: 12px; color: #64748b; }

/* ── Map ── */
.map-section { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; overflow: hidden; margin-bottom: 20px; }
.map-header { display: flex; align-items: center; justify-content: space-between; padding: 14px 20px; border-bottom: 1px solid #e2e8f0; }
.map-title { font-size: 14px; font-weight: 600; color: #0f172a; }
.map-placeholder { height: 240px; background: #e8edf2; display: flex; align-items: center; justify-content: center; color: #94a3b8; font-size: 13px; gap: 8px; }

/* ── Sidebar ── */
.action-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; margin-bottom: 16px; }
.action-btn {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 14px; border-radius: 8px;
  border: 1px solid #e2e8f0; background: #fff;
  cursor: pointer; width: 100%; margin-bottom: 8px;
  color: #334155; font-size: 13px; font-weight: 500;
  text-decoration: none; transition: background .15s;
}
.action-btn:hover { background: #f8fafc; }
.action-icon { width: 36px; height: 36px; background: #0f172a; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.action-icon svg { color: #fff; }

.agent-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin-bottom: 16px; }
.agent-card h4 { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: .5px; color: #94a3b8; margin-bottom: 14px; }
.agent-info { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.agent-avatar { width: 46px; height: 46px; border-radius: 50%; background: #0f172a; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 600; flex-shrink: 0; }
.agent-name { font-size: 14px; font-weight: 600; color: #0f172a; }
.agent-company { font-size: 12px; color: #64748b; }
.agent-phones { display: flex; flex-direction: column; gap: 4px; margin-bottom: 12px; }
.phone-link { font-size: 13px; color: #16a34a; text-decoration: none; }
.contact-btn { width: 100%; padding: 11px; border-radius: 8px; font-size: 13.5px; font-weight: 600; cursor: pointer; border: none; margin-bottom: 8px; transition: background .15s; }
.contact-btn.primary { background: #16a34a; color: #fff; }
.contact-btn.primary:hover { background: #15803d; }
.contact-btn.secondary { background: #0f172a; color: #fff; }
.contact-btn.secondary:hover { background: #1e293b; }
.contact-btn:last-child { margin-bottom: 0; }

.mls-card { background: #fff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 16px; font-size: 12px; color: #64748b; line-height: 1.7; }
.mls-card strong { color: #0f172a; }


/* ── Tablet ── */
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr 240px;
  }
  .stats-bar {
    flex-wrap: wrap;
  }
  .stat-item {
    flex: 1;
    padding: 16px 20px;
    border-right: 1px solid #e2e8f0;
    min-width: 0;        /* 👈 prevents overflow */
    overflow: hidden;
  }
  .stat-item:nth-child(3n) { border-right: none; }
}

/* ── Mobile ── */
@media (max-width: 768px) {
  .main-wrap { padding: 16px 16px 48px; }
  .topbar { padding: 0 16px; }
  .breadcrumb { display: none; }

  /* Header */
  .listing-header { flex-direction: column; gap: 12px; }
  .listing-title { font-size: 18px; }
  .listing-header-actions { align-self: flex-start; }

  /* Stats — 2 per row */
  .stats-bar {
    flex-wrap: wrap;
    border-radius: 10px;
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
  .stat-value { font-size: 18px; }

  /* Content — single column, sidebar on top */
  .content-grid {
    grid-template-columns: 1fr;
  }
  .sidebar { order: -1; }

  /* Gallery */
  .gallery-main { height: 240px; }

  /* Details — single column */
  .details-cols {
    grid-template-columns: 1fr;
    gap: 0;
  }

  /* Rooms — 2 columns on mobile */
  .rooms-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  /* Section body padding */
  .section-body { padding: 16px; }
}

/* ── Small mobile ── */
@media (max-width: 480px) {
  .listing-title { font-size: 16px; }
  .gallery-main { height: 200px; }
  .rooms-grid { grid-template-columns: 1fr; }
  .stat-value { font-size: 16px; }
  .stat-label { font-size: 10px; }
}
</style>
