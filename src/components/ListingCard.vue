<template>
  <div class="col">
    <div class="listing-card">
      <div class="img-wrap">
        <img :src="listing.image" class="listing-img" :alt="listing.address" loading="lazy" />
        <span class="quality-badge">{{ listing.quality }}</span>
      </div>
      <div class="listing-info">
        <div class="price-row">
          <span class="listing-price">{{ formattedPrice }}</span>
          <span class="listing-days">{{ listing.days }} days on market</span>
        </div>
        <div class="listing-address" :title="listing.address">{{ listing.address }}</div>
        <div class="listing-meta">
          <!-- Land listing -->
          <template v-if="listing.acres !== null">
            <span class="meta-item">
              <svg class="meta-svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 21h18M3 7l9-4 9 4M4 7v14M20 7v14M9 21V11h6v10"/>
              </svg>
              {{ listing.acres }} acres
            </span>
          </template>
          <!-- Residential listing -->
          <template v-else>
            <span class="meta-item">
              <svg class="meta-svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 20V10a2 2 0 012-2h16a2 2 0 012 2v10"/>
                <path d="M2 14h20"/>
                <path d="M7 14v-3a1 1 0 011-1h3a1 1 0 011 1v3"/>
              </svg>
              {{ listing.beds }}
            </span>
            <span class="meta-item">
              <svg class="meta-svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 12h16v2a6 6 0 01-6 6H10a6 6 0 01-6-6v-2z"/>
                <path d="M6 12V5a2 2 0 114 0v1"/>
              </svg>
              {{ listing.baths }}
            </span>
            <span class="meta-item">
              <svg class="meta-svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
              {{ listing.sqft?.toLocaleString() }} ft²
            </span>
          </template>
          <button class="meta-heart" :class="{ saved: isSaved }"
                  @click.stop="toggleSave" aria-label="Save listing">
            <i :class="isSaved ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  listing: { type: Object, required: true },
  saved:   { type: Boolean, default: false }
})

const emit = defineEmits(['toggle-save'])

const formattedPrice = computed(() => {
  if (props.listing.status === 'For Rent') {
    return '$' + props.listing.price.toLocaleString() + '/mo'
  }
  return '$' + props.listing.price.toLocaleString()
})

const isSaved = computed(() => props.saved)

function toggleSave() {
  emit('toggle-save', props.listing.id)
}
</script>

<style scoped>
.listing-card {
  background: #fff;
  border: 1px solid #e0e3e8;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: box-shadow .2s ease;
}
.listing-card:hover { box-shadow: 0 6px 22px rgba(0,0,0,.13); }

.img-wrap { position: relative; }
.listing-img { width: 100%; height: 182px; object-fit: cover; display: block; }

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

@media (max-width: 575px)  { .listing-img { height: 190px; } }
@media (min-width: 1400px) { .listing-img { height: 188px; } }
</style>
