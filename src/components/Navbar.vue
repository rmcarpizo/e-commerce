
<template>
  <nav class="navbar navbar-expand-lg">
    <div class="container">
      <RouterLink class="navbar-brand fw-bold" to="/products">
       E-Commerce
      </RouterLink>

      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#mainNavbar"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="mainNavbar">
        <ul class="navbar-nav ms-auto align-items-lg-center gap-lg-2">

          <!-- products -->
          <li class="nav-item">
            <RouterLink class="nav-link" to="/products">Products</RouterLink>
          </li>

          <!-- cart (user only) -->
          <li v-if="!user.isAdmin" class="nav-item">
            <RouterLink class="nav-link" to="/cart">Cart</RouterLink>
          </li>

          <!-- my orders (user only) -->
          <li v-if="!user.isAdmin" class="nav-item">
            <RouterLink class="nav-link" to="/my-orders">My Orders</RouterLink>
          </li>

          <!-- orders (admin only) -->
          <li v-if="user.isAdmin" class="nav-item">
            <RouterLink class="nav-link" to="/orders">Orders</RouterLink>
          </li>

    

          <!-- profile -->
          <li class="nav-item">
            <RouterLink class="nav-link" to="/profile">Profile</RouterLink>
          </li>

          <!-- logout -->
          <li class="nav-item">
            <button class="btn btn-outline-secondary ms-lg-2" @click="logout">
              Logout
            </button>
          </li>

        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { RouterLink, useRouter } from "vue-router"
import { useUserStore } from "../stores/user"

const router = useRouter()
const user = useUserStore()

const logout = () => {
  user.clearToken()
  router.push("/login")
}

</script>
