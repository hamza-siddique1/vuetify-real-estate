<template>
  <div class="col">
    <div class="listing-card promo-card">
      <template v-if="ad.type === 'image'">
        <a v-if="ad.imageLink" :href="ad.imageLink" target="_blank" rel="noopener noreferrer" class="img-wrap">
          <img :src="ad.image" class="listing-img" alt="Advertisement" loading="lazy" />
        </a>
        <div v-else class="img-wrap">
          <img :src="ad.image" class="listing-img" alt="Advertisement" loading="lazy" />
        </div>
      </template>

      <template v-else>
        <div class="promo-text-body">
          <h3 v-if="ad.heading" class="promo-heading">{{ ad.heading }}</h3>
          <p v-if="ad.paragraph" class="promo-paragraph">{{ ad.paragraph }}</p>
          <a v-if="ad.btnText && ad.btnLink" :href="ad.btnLink" target="_blank" rel="noopener noreferrer" class="btn-outline promo-btn">
            {{ ad.btnText }}
          </a>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
defineProps({
  ad: { type: Object, required: true }
})
</script>
<style>
.promo-card {
  display: flex;
  flex-direction: column;
}

/* Text ad fills the same vertical space a listing card would (image + info) */
.promo-text-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  gap: 0.6rem;
  padding: 1.5rem;
  min-height: 100%;
}

.promo-heading {
  font-size: 1.35rem;
  font-weight: 700;
  color: #111827;
  line-height: 1.25;
  margin: 0;
}

.promo-paragraph {
  font-size: 0.95rem;
  color: #4b5563;
  margin: 0;
}

.promo-btn {
  margin-top: 0.25rem;
}
</style>
