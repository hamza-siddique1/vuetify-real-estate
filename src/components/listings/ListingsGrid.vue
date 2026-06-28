
<template>
  <div>
    <!-- Loading skeletons -->
    <div v-if="store.loading" class="listings-grid" :style="gridStyle">
      <div v-for="n in store.config.perPage" :key="n" class="skeleton-card">
        <div class="skeleton-img"></div>
        <div class="skeleton-line w-60"></div>
        <div class="skeleton-line w-90"></div>
        <div class="skeleton-line w-40"></div>
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="store.error" class="state-msg">
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none"
           stroke="#ef4444" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <p>{{ store.error }}</p>
      <button @click="store.load()">Try Again</button>
    </div>

    <!-- Results -->
    <div v-else-if="store.listings.length" class="listings-grid" :style="gridStyle">
      <ListingCard
        v-for="listing in store.listings"
        :key="listing.id"
        :listing="listing"
        @select="onSelect"
        @save="onSave"
      />
    </div>

    <!-- Empty -->
    <div v-else class="state-msg">
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none"
           stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <path d="M9 22V12h6v10"/>
        <line x1="4" y1="4" x2="20" y2="20"/>
      </svg>
      <p>No listings match your filters.</p>
      <button @click="store.resetFilters()">Reset Filters</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import ListingCard from './ListingCard.vue'
import { useListingStore } from '@/stores/useListingStore'
import type { Listing } from '@/types/listing'

const store = useListingStore()

/* Desktop columns from widget config; mobile handled by CSS media queries */
const gridStyle = computed(() => ({
  '--cols': String(store.config.columns),
}))

function onSelect(listing: Listing) {
  window.location.href = `/listings/${listing.id}`
}

function onSave(id: string, saved: boolean) {
  // Hook for wishlist/save feature
  console.log(`Listing ${id} ${saved ? 'saved' : 'unsaved'}`)
}
</script>

<style scoped>
.listings-grid {
  display: grid;
  /* Desktop: use --cols from widget config */
  grid-template-columns: repeat(var(--cols, 6), 1fr);
  gap: 12px;
  padding: 20px 40px 0;
}

/* ── Responsive overrides for smaller screens ── */
@media (max-width: 1399px) { .listings-grid { grid-template-columns: repeat(min(var(--cols, 6), 5), 1fr); } }
@media (max-width: 1199px) { .listings-grid { grid-template-columns: repeat(min(var(--cols, 6), 4), 1fr); } }
@media (max-width: 991px)  { .listings-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 767px)  { .listings-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 575px)  { .listings-grid { grid-template-columns: 1fr; padding: 16px 16px 0; } }

/* ── State messages ── */
.state-msg {
  text-align: center;
  padding: 70px 20px;
  color: #6b7280;
}
.state-msg svg { opacity: .5; margin-bottom: 14px; }
.state-msg p   { font-size: 15px; margin-bottom: 16px; }
.state-msg button {
  border: 1.5px solid #16a34a; border-radius: 8px;
  background: #fff; color: #16a34a;
  padding: 8px 22px; font-size: 13.5px; font-weight: 500; cursor: pointer;
}
.state-msg button:hover { background: #f0fdf4; }

/* ── Skeleton ── */
.skeleton-card {
  background: #fff; border: 1px solid #e0e3e8;
  border-radius: 12px; overflow: hidden; padding-bottom: 13px;
}
.skeleton-img { width: 100%; height: 182px; background: #eef0f3; }
.skeleton-line {
  height: 12px; background: #eef0f3; border-radius: 4px;
  margin: 11px 13px 0;
}
.skeleton-line.w-40 { width: 40%; }
.skeleton-line.w-60 { width: 60%; }
.skeleton-line.w-90 { width: 90%; }
.skeleton-img, .skeleton-line { animation: pulse 1.4s ease-in-out infinite; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: .5; } }
</style>
