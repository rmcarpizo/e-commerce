<template>
  <div class="container py-5">

    <div v-if="user.isAdmin">
      <AdminDashboard />
    </div>

    <div v-else>
      <h1 class="text-center mb-4">Our Products</h1>

      <div v-if="isLoading" class="text-center my-5 py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-if="!products.length && !isLoading" class="text-center">
        <h5>No products available.</h5>
      </div>

      <div v-if="!isLoading" class="row">
        <div v-for="product in products" :key="product._id" class="col-md-4 mb-4">
          <ProductCard :product="product" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../api'
import { useUserStore } from '../stores/user'
import { useRouter } from 'vue-router'
import ProductCard from '@/components/ProductCard.vue'
import AdminDashboard from '@/components/AdminDashboard.vue'

const user = useUserStore()
const router = useRouter()

const products = ref([])
const isLoading = ref(false)

const fetchProducts = async () => {
  isLoading.value = true
  try {

    const res = await api.get('/products/active')
    products.value = res.data
  } catch (error) {
    console.error('Failed to fetch products:', error)
  }
  isLoading.value = false
}

onMounted(() => {
  if (!user.token) {
    router.push('/login')
  } else {

    if (!user.isAdmin) {
      fetchProducts()
    }
  }
})
</script>