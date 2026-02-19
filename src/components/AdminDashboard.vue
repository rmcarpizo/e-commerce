<template>
  <div class="card border-0 shadow-sm">
    <div class="card-body p-4">
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 class="mb-1">Admin Dashboard</h2>
          <div class="text-muted small">Manage products and view user orders</div>
        </div>

        <div class="d-flex flex-wrap gap-2">
          <RouterLink to="/add-product" class="btn btn-dark">
            Add New Product
          </RouterLink>
          <RouterLink to="/orders" class="btn btn-outline-dark">
            Show User Orders
          </RouterLink>
        </div>
      </div>

      <div v-if="isLoading" class="text-center my-5 py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else class="table-responsive">
        <table class="table table-hover table-striped align-middle mb-0">
          <thead class="table-dark">
            <tr>
              <th>Name</th>
              <th class="w-50">Description</th>
              <th>Price</th>
              <th>Availability</th>
              <th class="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product._id">
              <td class="fw-semibold">{{ product.name }}</td>
              <td class="text-muted">{{ product.description }}</td>
              <td class="fw-semibold">₱{{ product.price }}</td>
              <td>
                <span
                  :class="product.isActive ? 'badge bg-success-subtle text-success' : 'badge bg-danger-subtle text-danger'"
                >
                  {{ product.isActive ? 'Available' : 'Unavailable' }}
                </span>
              </td>
              <td class="text-end">
                <div class="d-inline-flex gap-2">
                  <RouterLink
                    :to="`/edit-product/${product._id}`"
                    class="btn btn-outline-primary btn-sm"
                    @click="editProduct(product._id)"
                  >
                    Edit
                  </RouterLink>

                  <button
                    v-if="product.isActive"
                    class="btn btn-outline-danger btn-sm"
                    @click="disableProduct(product._id)"
                  >
                    Disable
                  </button>
                  <button
                    v-else
                    class="btn btn-outline-success btn-sm"
                    @click="activateProduct(product._id)"
                  >
                    Activate
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import api from '../api'

const router = useRouter()
const products = ref([])
const isLoading = ref(false)

const fetchAllProducts = async () => {
  isLoading.value = true
  try {
    const res = await api.get('/products')
    products.value = res.data
  } catch (error) {
    console.error('Failed to fetch products:', error)
  }
  isLoading.value = false
}

const editProduct = (productId) => {
  router.push(`/edit-product/${productId}`)
}

const disableProduct = async (productId) => {
  try {
    await api.patch(`/products/${productId}/archive`)
    // Refresh the product list
    await fetchAllProducts()
  } catch (error) {
    console.error('Failed to disable product:', error)
    alert('Failed to disable product')
  }
}

const activateProduct = async (productId) => {
  try {
    await api.patch(`/products/${productId}/activate`)
    // Refresh the product list
    await fetchAllProducts()
  } catch (error) {
    console.error('Failed to activate product:', error)
    alert('Failed to activate product')
  }
}

onMounted(() => {
  fetchAllProducts()
})
</script>