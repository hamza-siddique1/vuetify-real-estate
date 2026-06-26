<template>
  <v-app>
    <v-main>
      <v-container class="py-8">
        <v-row>
          <v-col
            v-for="listing in listings"
            :key="listing.address"
            cols="12" sm="6" md="4"
          >
            <ListingCard :listing="listing" />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import ListingCard from './components/ListingCard.vue'

const listings = [
  {
    image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600',
    imageCount: 24, price: '$998,000',
    address: '414 Mortimer Avenue', city: 'Toronto',
    beds: 3, baths: 3, parking: 0, sqft: '1,850',
    type: 'Detached', listedAgo: '21 hours ago', forRent: false,
  },
  {
    image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600',
    imageCount: 32, price: '$4,200 / mo',
    address: '2 Rowley Avenue', city: 'Toronto',
    beds: 4, baths: 2, parking: 1, sqft: '2,100',
    type: 'Semi-detached', listedAgo: '2 days ago', forRent: true,
  },
  {
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600',
    imageCount: 18, price: '$1,250,000',
    address: '88 Maple Street', city: 'Toronto',
    beds: 5, baths: 4, parking: 2, sqft: '3,200',
    type: 'Detached', listedAgo: '3 days ago', forRent: false,
  },
]
</script>