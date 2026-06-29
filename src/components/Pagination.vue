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

const paginationItems = computed(() => {
  const { totalPages: total, currentPage: current } = props

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)  // 👈 cleaner than for loop
  }

  let start, end

  if (current <= 3) {
    start = 2
    end = Math.min(5, total - 1)
  } else if (current >= total - 2) {
    start = Math.max(2, total - 4)
    end = total - 1
  } else {
    start = current - 1
    end = current + 1
  }

  return [
    1,
    ...(start > 2 ? ['…'] : []),
    ...Array.from({ length: end - start + 1 }, (_, i) => start + i),
    ...(end < total - 1 ? ['…'] : []),
    total
  ]
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
}
.pg-btn:hover:not(:disabled):not(.active) {
  background: #f3f4f6;
}
.pg-btn.active {
  border: 1.5px solid #9ca3af;
  color: #111;
  font-weight: 700;
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
  user-select: none;
}
</style>
