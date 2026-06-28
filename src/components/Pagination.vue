<template>
  <div class="pagination-wrap" v-if="totalPages > 1">
    <!-- Previous arrow -->
    <button
      class="pg-btn pg-arrow"
      @click="goToPage(currentPage - 1)"
      :disabled="currentPage === 1"
      aria-label="Previous page"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
    </button>

    <!-- Page numbers and ellipsis -->
    <template v-for="(item, idx) in paginationItems" :key="idx">
      <span v-if="item === '…'" class="pg-ellipsis">…</span>
      <button
        v-else
        class="pg-btn"
        :class="{ active: item === currentPage }"
        @click="goToPage(item)"
        :aria-label="`Page ${item}`"
        :aria-current="item === currentPage ? 'page' : undefined"
      >
        {{ item }}
      </button>
    </template>

    <!-- Next arrow -->
    <button
      class="pg-btn pg-arrow"
      @click="goToPage(currentPage + 1)"
      :disabled="currentPage === totalPages"
      aria-label="Next page"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages:  { type: Number, required: true }
})

const emit = defineEmits(['page-change'])

/**
 * Generates pagination items: [1, 2, 3, 4, 5, '…', 305]
 * Shows: first page, current page ±1, last page, with ellipsis where needed
 */
const paginationItems = computed(() => {
  const total = props.totalPages
  const current = props.currentPage
  const items = []

  if (total <= 7) {
    // Show all pages if 7 or fewer
    for (let i = 1; i <= total; i++) {
      items.push(i)
    }
    return items
  }

  // Always show page 1
  items.push(1)

  // Calculate range around current page
  let start = Math.max(2, current - 1)
  let end = Math.min(total - 1, current + 1)

  // Adjust range to always show 3 pages in the middle when possible
  if (current <= 3) {
    start = 2
    end = Math.min(5, total - 1)
  } else if (current >= total - 2) {
    start = Math.max(2, total - 4)
    end = total - 1
  }

  // Add ellipsis before middle range if needed
  if (start > 2) {
    items.push('…')
  }

  // Add middle range
  for (let i = start; i <= end; i++) {
    items.push(i)
  }

  // Add ellipsis after middle range if needed
  if (end < total - 1) {
    items.push('…')
  }

  // Always show last page
  items.push(total)

  return items
})

function goToPage(page) {
  if (page < 1 || page > props.totalPages || page === props.currentPage) return
  emit('page-change', page)
}
</script>

<style scoped>
.pagination-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 36px 0 52px;
  min-height: 60px;
}

.pg-btn {
  min-width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  font-size: 14px;
  color: #374151;
  font-weight: 500;
  border-radius: 50%;
  cursor: pointer;
  padding: 0 4px;
  transition: background 0.12s;
  line-height: 1;
  flex-shrink: 0;
}

.pg-btn:hover:not(:disabled):not(.active) {
  background: #f3f4f6;
}

.pg-btn.active {
  border: 1.5px solid #9ca3af;
  color: #111;
  font-weight: 700;
  background: #fff;
}

.pg-btn:disabled {
  color: #d1d5db;
  cursor: default;
  pointer-events: none;
}

.pg-arrow {
  color: #6b7280;
  min-width: 32px;
}

.pg-ellipsis {
  font-size: 14px;
  color: #6b7280;
  padding: 0 6px;
  line-height: 36px;
  pointer-events: none;
  user-select: none;
}
</style>
