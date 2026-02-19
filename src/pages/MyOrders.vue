<template>
  <div class="container py-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="mb-0">Order History</h1>
      <RouterLink to="/products" class="btn btn-dark">Back</RouterLink>
    </div>

    <div v-if="isLoading" class="text-center my-5 py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else-if="orders.length === 0" class="text-center">
      <h5>No orders yet.</h5>
      <p class="text-muted mb-0">Checkout an item first, then come back here.</p>
    </div>

    <div v-else class="table-responsive">
      <table class="table table-hover table-striped align-middle mb-0">
        <thead class="table-dark">
          <tr>
            <th>Order ID</th>
            <th>Products</th>
            <th>Total</th>
            <th>Ordered On</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="order in orders" :key="order._id">
            <td>{{ order._id }}</td>

            <td>
              <ul class="mb-0">
                <li v-for="item in order.productsOrdered" :key="item.productId">
                  {{ displayItemName(item) }} (Qty: {{ item.quantity }})
                </li>
              </ul>
            </td>

            <td>₱{{ order.totalPrice }}</td>
            <td>{{ formatDate(order.orderedOn) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter, RouterLink } from "vue-router"
import api from "../api"
import { useUserStore } from "../stores/user"

const router = useRouter()
const user = useUserStore()

const orders = ref([])
const productsById = ref({}) // { [productId]: "Product Name" }
const isLoading = ref(false)

/* products list (best-effort) */
const fetchProducts = async () => {
  try {
    const res = await api.get("/products")

    // supports: res.data = [] OR { products: [] } OR { data: [] }
    const list = res.data?.products || res.data?.data || res.data || []

    const map = {}
    for (const p of list) {
      const id = p._id || p.id
      const name = p.name || p.title
      if (id && name) map[id] = name
    }

    productsById.value = { ...productsById.value, ...map }
  } catch (e) {
    console.error("Failed to fetch products:", e)
  }
}

/* fetch single product name if missing */
const fetchProductNameById = async (id) => {
  if (!id) return
  if (productsById.value[id]) return

  try {
    const res = await api.get(`/products/${id}`)
    const p = res.data?.product || res.data?.data || res.data
    const name = p?.name || p?.title
    if (name) {
      productsById.value = { ...productsById.value, [id]: name }
    }
  } catch (e) {
    // if product can't be fetched (deleted/forbidden), keep ID
    console.error("Failed to fetch product by id:", id, e)
  }
}

const productName = (id) => productsById.value[id] || id

/* if backend already stores name inside order item, use it first */
const displayItemName = (item) => {
  const stored =
    item.productName || item.name || item.title || item.product?.name || item.product?.title

  const id = item.productId
  const name = stored || productName(id)

  // lazy fetch if still an ID
  if (!stored && (!productsById.value[id] || productsById.value[id] === id)) {
    fetchProductNameById(id)
  }

  return name
}

/* my orders */
const fetchMyOrders = async () => {
  isLoading.value = true
  try {
    const res = await api.get("/orders/my-orders") // change if your endpoint differs
    orders.value = res.data?.orders || res.data || []
  } catch (e) {
    console.error("Failed to fetch my orders:", e)
    orders.value = []
  }
  isLoading.value = false
}

/* date */
const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

onMounted(async () => {
  if (!user.token) return router.push("/login")

  await fetchProducts()
  await fetchMyOrders()

  // after orders load, try to resolve any missing names
  for (const o of orders.value) {
    for (const item of o.productsOrdered || []) {
      if (item?.productId && !productsById.value[item.productId]) {
        fetchProductNameById(item.productId)
      }
    }
  }
})
</script>