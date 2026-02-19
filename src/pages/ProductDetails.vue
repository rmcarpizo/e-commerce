<template>
  <div class="container py-5" style="max-width: 800px;">
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center my-5 py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-if="!isLoading && product" class="card">
      <div class="card-header bg-dark text-white">
        <h3 class="mb-0">{{ product.name }}</h3>
      </div>
      <div class="card-body">
        <p class="mb-3">{{ product.description }}</p>
        <p class="mb-3"><strong>Price: <span class="text-warning">₱{{ product.price }}</span></strong></p>
        
        <div class="mb-4">
          <label class="form-label"><strong>Quantity:</strong></label>
          <div class="d-flex align-items-center">
            <button 
              class="btn btn-dark"
              @click="decreaseQuantity"
              :disabled="quantity <= 1"
            >
              -
            </button>
            <input 
              type="number" 
              v-model.number="quantity" 
              class="form-control text-center mx-2" 
              style="max-width: 100px;"
              min="1"
              readonly
            />
            <button 
              class="btn btn-dark"
              @click="increaseQuantity"
            >
              +
            </button>
          </div>
        </div>

        <button 
          class="btn btn-primary w-100 mb-3"
          @click="addToCart"
          :disabled="isAddingToCart"
        >
          {{ isAddingToCart ? 'Adding...' : 'Add to Cart' }}
        </button>

        <div v-if="successMessage" class="alert alert-success">
          {{ successMessage }}
        </div>

        <div v-if="errorMessage" class="alert alert-danger">
          {{ errorMessage }}
        </div>

        <RouterLink to="/products" class="btn btn-secondary w-100">
          Back to Products
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import api from '../api'
import { useUserStore } from '../stores/user'

const route = useRoute()
const router = useRouter()
const user = useUserStore()

const product = ref(null)
const quantity = ref(1)
const isLoading = ref(false)
const isAddingToCart = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const fetchProduct = async () => {
  isLoading.value = true
  try {
    const res = await api.get(`/products/${route.params.id}`)
    product.value = res.data
  } catch (error) {
    console.error('Failed to fetch product:', error)
    errorMessage.value = 'Failed to load product details'
  }
  isLoading.value = false
}

const increaseQuantity = () => {
  quantity.value++
}

const decreaseQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--
  }
}

const addToCart = async () => {
  isAddingToCart.value = true
  successMessage.value = ''
  errorMessage.value = ''

  try {
    await api.post('/cart/add-to-cart', {
      productId: product.value._id,
      quantity: quantity.value,
      price: product.value.price
    })
    successMessage.value = 'Added to Cart!'
    
    setTimeout(() => {
      successMessage.value = ''
    }, 2000)
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Failed to add to cart'
  }
  isAddingToCart.value = false
}

onMounted(() => {
  if (!user.token) {
    router.push('/login')
  } else {
    fetchProduct()
  }
})
</script>