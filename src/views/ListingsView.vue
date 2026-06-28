<template>
  <div class="listings-page">

    <!-- Filter Bar -->
    <ListingFilters />

    <!-- Sub-header -->
    <div class="sub-header">
      <span>
        <strong>{{ store.totalCount.toLocaleString() }}</strong>
        {{ subheaderLabel }}
      </span>
      <div class="sort-wrap">
        <span class="sort-label">Sort by:</span>
        <select class="sort-select" :value="store.filters.sortBy"
                @change="onSortChange">
          <option value="newest">Newest to oldest</option>
          <option value="oldest">Oldest to newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="sqft-desc">Largest first</option>
        </select>
      </div>
    </div>

    <!-- Grid -->
    <ListingsGrid />

    <!-- Pagination -->
    <ListingPagination />

    <!-- Advanced Drawer -->
    <AdvancedDrawer />

  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import ListingFilters    from '@/components/listings/ListingFilters.vue'
import ListingsGrid      from '@/components/listings/ListingsGrid.vue'
import ListingPagination from '@/components/listings/ListingPagination.vue'
import AdvancedDrawer    from '@/components/listings/AdvancedDrawer.vue'
import { useListingStore } from '@/stores/useListingStore'

const store = useListingStore()

const subheaderLabel = computed(() => {
  const s = store.filters.status
  if (s === 'A') return 'listings for sale'
  if (s === 'U') return 'listings sold'
  return 'listings found'
})

function onSortChange(e: Event) {
  store.setFilters({ sortBy: (e.target as HTMLSelectElement).value })
}

/* Initial load */
onMounted(() => { store.load() })
</script>

<style scoped>
.listings-page {
  background: #f3f4f6;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.sub-header {
  background: #fff;
  border-bottom: 1px solid #e5e7eb;
  padding: 8px 40px;
  font-size: 13.5px;
  display: flex; align-items: center; justify-content: space-between;
}
.sub-header strong { font-weight: 700; color: #111; }

.sort-wrap  { display: flex; align-items: center; gap: 8px; }
.sort-label { color: #6b7280; }
.sort-select {
  border: 1px solid #d1d5db; border-radius: 8px;
  padding: 5px 10px; font-size: 13px; font-weight: 500;
  color: #374151; background: #fff; cursor: pointer; outline: none;
}
.sort-select:focus { border-color: #16a34a; }

@media (max-width: 575px) {
  .sub-header { padding: 8px 16px; flex-wrap: wrap; gap: 8px; }
}
</style>
