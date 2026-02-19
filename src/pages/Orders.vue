<template>
  <div class="container py-5">
    <div class="card border-0 shadow-sm">
      <div class="card-body p-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1 class="mb-0">All User Orders</h1>

          <RouterLink to="/products" class="btn btn-dark">
            Back to Dashboard
          </RouterLink>
        </div>

        <div v-if="isLoading" class="text-center my-5 py-5">
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <div v-else-if="orders.length === 0" class="text-center">
          <h5>No orders yet.</h5>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th>Order ID</th>
                <th>User</th>
                <th>Products</th>
                <th>Total Price</th>
                <th>Order Date</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="order in orders" :key="order._id">
                <td class="fw-semibold">{{ order._id }}</td>

                <!-- ✅ show email/name instead of userId -->
                <td>
                  {{ userLabel(order.userId) }}
                </td>

                <td>
                  <ul class="mb-0">
                    <li
                      v-for="item in order.productsOrdered"
                      :key="item.productId"
                    >
                      {{ productName(item.productId) }} (Qty: {{ item.quantity }})
                    </li>
                  </ul>
                </td>

                <td>₱{{ order.totalPrice }}</td>
                <td>{{ formatDate(order.orderedOn) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="errorMsg" class="alert alert-danger mt-3 mb-0">
          {{ errorMsg }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter, RouterLink } from "vue-router"
import api from "../api"
import { useUserStore } from "../stores/user"

const router = useRouter()
const userStore = useUserStore()

const orders = ref([])
const productsById = ref({})
const usersById = ref({}) // ✅ map userId -> { email, name }
const isLoading = ref(false)
const errorMsg = ref("")

const fetchProducts = async () => {
  try {
    const res = await api.get("/products")
    const map = {}
    for (const p of res.data) map[p._id] = p
    productsById.value = map
  } catch (err) {
    productsById.value = {}
  }
}

const fetchUsers = async () => {
  try {
    // ✅ admin endpoint
    const res = await api.get("/users/all")
    const map = {}
    for (const u of res.data) {
      const name = `${u.firstName || ""} ${u.lastName || ""}`.trim()
      map[u._id] = {
        email: u.email,
        name,
      }
    }
    usersById.value = map
  } catch (err) {
    // if /users/all not working yet, we'll just fallback to ID
    usersById.value = {}
  }
}

const fetchAllOrders = async () => {
  try {
    const res = await api.get("/orders")
    orders.value = Array.isArray(res.data) ? res.data : []
  } catch (err) {
    orders.value = []
    errorMsg.value = "Failed to fetch orders."
  }
}

const productName = (productId) => {
  return productsById.value?.[productId]?.name || productId
}

const userLabel = (userId) => {
  const u = usersById.value?.[userId]
  if (!u) return userId
  // priority: email, else name, else id
  return u.email || u.name || userId
}

const formatDate = (date) => {
  if (!date) return ""
  return new Date(date).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

onMounted(async () => {
  if (!userStore.token) return router.push("/login")
  if (!userStore.isAdmin) return router.push("/products")

  isLoading.value = true
  errorMsg.value = ""

  await Promise.all([fetchProducts(), fetchUsers(), fetchAllOrders()])

  isLoading.value = false
})
</script>