<template>
  <div class="container py-5">
    <h2 class="text-center mb-4">Your Shopping Cart</h2>

    <div v-if="isLoading" class="text-center my-5 py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-if="!isLoading && cartItems.length === 0" class="text-center">
      <h5>Your cart is empty</h5>
      <RouterLink to="/products" class="btn btn-primary mt-3">
        Browse Products
      </RouterLink>
    </div>

    <div v-if="!isLoading && cartItems.length > 0">
      <table class="table table-bordered">
        <thead class="table-dark">
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in cartItems" :key="item.productId">
            <td>
              <RouterLink :to="`/products/${item.productId}`" class="text-primary">
                {{ item.productName || 'Product' }}
              </RouterLink>
            </td>
            <td>₱{{ (item.subtotal / item.quantity).toFixed(2) }}</td>
            <td>
              <div class="d-flex align-items-center">
                <button 
                  class="btn btn-sm btn-dark"
                  @click="updateQuantity(item.productId, item.quantity - 1)"
                  :disabled="item.quantity <= 1"
                >
                  -
                </button>
                <span class="mx-3">{{ item.quantity }}</span>
                <button 
                  class="btn btn-sm btn-dark"
                  @click="updateQuantity(item.productId, item.quantity + 1)"
                >
                  +
                </button>
              </div>
            </td>
            <td>₱{{ item.subtotal.toFixed(2) }}</td>
            <td>
              <button 
                class="btn btn-danger btn-sm"
                @click="removeItem(item.productId)"
              >
                Remove
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="d-flex justify-content-between align-items-center mb-3">
        <h4>Total: <span class="text-warning">₱{{ totalPrice.toFixed(2) }}</span></h4>
      </div>

      <div class="d-flex gap-2">
        <button 
          class="btn btn-success"
          @click="checkout"
          :disabled="isCheckingOut"
        >
          {{ isCheckingOut ? 'Processing...' : 'Checkout' }}
        </button>
        <button 
          class="btn btn-danger"
          @click="clearCart"
        >
          Clear Cart
        </button>
      </div>

      <div v-if="successMessage" class="alert alert-success mt-3">
        {{ successMessage }}
      </div>

      <div v-if="errorMessage" class="alert alert-danger mt-3">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import api from '../api'
import { useUserStore } from '../stores/user'

const router = useRouter()
const user = useUserStore()

const cartItems = ref([])
const isLoading = ref(false)
const isCheckingOut = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const totalPrice = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.subtotal, 0)
})

const fetchCart = async () => {
  isLoading.value = true
  try {
    const res = await api.get('/cart')
    const items = res.data
    
    
    const itemsWithNames = await Promise.all(
      items.map(async (item) => {
        try {
          const productRes = await api.get(`/products/${item.productId}`)
          return {
            ...item,
            productName: productRes.data.name
          }
        } catch (error) {
          console.error(`Failed to fetch product ${item.productId}:`, error)
          return {
            ...item,
            productName: 'Unknown Product'
          }
        }
      })
    )
    
    cartItems.value = itemsWithNames
  } catch (error) {
    console.error('Failed to fetch cart:', error)
  }
  isLoading.value = false
}

const updateQuantity = async (productId, newQuantity) => {
  try {
    await api.patch('/cart/update-cart-quantity', {
      productId,
      newQuantity
    })
    
    
    await fetchCart()
  } catch (error) {
    errorMessage.value = 'Failed to update quantity'
  }
}

const removeItem = async (productId) => {
  try {
    await api.delete(`/cart/${productId}/remove-from-cart`)
    
    
    await fetchCart()
  } catch (error) {
    errorMessage.value = 'Failed to remove item'
  }
}

const clearCart = async () => {
  if (!confirm('Are you sure you want to clear your cart?')) return
  
  try {
    await api.delete('/cart/clear-cart')
    cartItems.value = []
  } catch (error) {
    errorMessage.value = 'Failed to clear cart'
  }
}

const checkout = async () => {
  isCheckingOut.value = true
  errorMessage.value = ''
  
  try {
    await api.post('/orders/checkout')
    successMessage.value = 'Order placed successfully!'
    
    setTimeout(() => {
      router.push('/products')
    }, 2000)
  } catch (error) {
    errorMessage.value = error.response?.data?.error || 'Checkout failed'
  }
  isCheckingOut.value = false
}

onMounted(() => {
  if (!user.token) {
    router.push('/login')
  } else {
    fetchCart()
  }
})
</script>