<template>
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
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: { type: Number, required: true },
  totalPages:  { type: Number, required: true }
})

const emit = defineEmits(['page-change'])

const paginationItems = computed(() => {
  const total = props.totalPages
  if (total <= 1) return []
  const cur = props.currentPage
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

function goToPage(page) {
  if (page < 1 || page > props.totalPages) return
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
