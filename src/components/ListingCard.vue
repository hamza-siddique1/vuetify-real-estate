<template>
  <v-card rounded="xl" max-width="300" elevation="1">
    <div class="img-zone">
      <v-img :src="listing.image" height="196" cover />
      <div class="top-badges">
        <span :class="['status-pill', listing.forRent ? 'rent' : '']">
          {{ listing.forRent ? 'For rent' : 'For sale' }}
        </span>
        <button class="heart-btn" aria-label="Save listing">
          <v-icon :icon="mdiHeartOutline" size="16" />
        </button>
      </div>
      <span class="counter">1 / {{ listing.imageCount }}</span>
      <div class="price-panel">
        <div class="price">{{ listing.price }}</div>
        <div class="addr">
          <v-icon :icon="mdiMapMarkerOutline" size="13" />
          {{ listing.address }}, {{ listing.city }}
        </div>
      </div>
    </div>

    <v-card-text class="card-body">
      <div class="meta-row">
        <span class="type-tag">{{ listing.type }}</span>
        <span class="listed-ago">Listed {{ listing.listedAgo }}</span>
      </div>

      <div class="specs">
        <div class="spec-item">
          <v-icon :icon="mdiBedOutline" size="18" />
          <span class="spec-val">{{ listing.beds }}</span>
          <span class="spec-lbl">Beds</span>
        </div>
        <div class="spec-item">
          <v-icon :icon="mdiShower" size="18" />
          <span class="spec-val">{{ listing.baths }}</span>
          <span class="spec-lbl">Baths</span>
        </div>
        <div class="spec-item">
          <v-icon :icon="mdiCarOutline" size="18" />
          <span class="spec-val">{{ listing.parking }}</span>
          <span class="spec-lbl">Parking</span>
        </div>
        <div class="spec-item">
          <v-icon :icon="mdiRuler" size="18" />
          <span class="spec-val">{{ listing.sqft }}</span>
          <span class="spec-lbl">Sq ft</span>
        </div>
      </div>

      <v-btn block flat color="#0f172a" class="cta-btn">
        View details
        <v-icon :icon="mdiArrowRight" size="16" class="ml-1" />
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup>
import {
  mdiHeartOutline, mdiMapMarkerOutline,
  mdiBedOutline, mdiShower, mdiCarOutline,
  mdiRuler, mdiArrowRight,
} from '@mdi/js'

defineProps({
  listing: { type: Object, required: true }
})
</script>

<style scoped>
.img-zone { position: relative; height: 196px; overflow: hidden; }
.top-badges {
  position: absolute; top: 10px; left: 10px; right: 10px;
  display: flex; justify-content: space-between; align-items: flex-start;
}
.status-pill {
  background: #fff; color: #111;
  font-size: 11px; font-weight: 500;
  padding: 4px 10px; border-radius: 20px;
}
.status-pill.rent { background: #1e40af; color: #fff; }
.heart-btn {
  width: 30px; height: 30px;
  background: rgba(255,255,255,0.9);
  border-radius: 50%; border: none;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; color: #555;
}
.counter {
  position: absolute; bottom: 62px; right: 10px;
  background: rgba(0,0,0,0.5); color: #fff;
  font-size: 11px; padding: 2px 7px; border-radius: 4px;
}
.price-panel {
  position: absolute; bottom: 0; left: 0; right: 0;
  background: #0f172a; padding: 10px 14px;
}
.price-panel .price { font-size: 18px; font-weight: 500; color: #fff; }
.price-panel .addr {
  font-size: 12px; color: rgba(255,255,255,0.6);
  margin-top: 2px; display: flex; align-items: center; gap: 3px;
}
.card-body { padding: 14px 16px 16px !important; }
.meta-row {
  display: flex; align-items: center;
  justify-content: space-between; margin-bottom: 14px;
}
.type-tag {
  font-size: 11px; font-weight: 500;
  background: #eff6ff; color: #1d4ed8;
  padding: 3px 10px; border-radius: 20px;
  border: 1px solid #bfdbfe;
}
.listed-ago { font-size: 11px; color: rgba(0,0,0,0.45); }
.specs {
  display: flex; border: 1px solid rgba(0,0,0,0.1);
  border-radius: 8px; overflow: hidden; margin-bottom: 16px;
}
.spec-item {
  flex: 1; display: flex; flex-direction: column;
  align-items: center; padding: 10px 4px; gap: 2px;
  border-right: 1px solid rgba(0,0,0,0.08);
}
.spec-item:last-child { border-right: none; }
.spec-val { font-size: 13px; font-weight: 500; }
.spec-lbl { font-size: 10px; color: rgba(0,0,0,0.45); }
.cta-btn { color: #fff !important; font-size: 13px; letter-spacing: 0; }
</style>