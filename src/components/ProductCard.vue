<template>
  <div class="card h-100">
    <div class="card-body d-flex flex-column">
      <h5 class="card-title text-primary">{{ product.name }}</h5>
      <p class="card-text">{{ product.description }}</p>
      <p class="card-text"><strong class="text-warning">₱{{ product.price }}</strong></p>
      
      <div class="mt-auto">
        <RouterLink 
          :to="`/products/${product._id}`" 
          class="btn btn-primary w-100"
        >
          Details
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  product: {
    type: Object,
    required: true
  }
})
</script>