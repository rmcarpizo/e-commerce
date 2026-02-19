import { createRouter, createWebHistory } from "vue-router"
import { useUserStore } from "../stores/user"

import Register from "../pages/Register.vue"
import Login from "../pages/Login.vue"
import Products from "../pages/Products.vue"
import ProductDetails from "../pages/ProductDetails.vue"
import Cart from "../pages/Cart.vue"
import Orders from "../pages/Orders.vue"
import AddProduct from "../pages/AddProduct.vue"
import EditProduct from "../pages/EditProduct.vue"
import Profile from "../pages/Profile.vue"
import MyOrders from "../pages/MyOrders.vue"

const routes = [
  { path: "/", redirect: "/products" },

  { path: "/register", name: "Register", component: Register },
  { path: "/login", name: "Login", component: Login },

  { path: "/products", name: "Products", component: Products, meta: { requiresAuth: true } },
  { path: "/products/:id", name: "ProductDetails", component: ProductDetails, meta: { requiresAuth: true } },

  { path: "/cart", name: "Cart", component: Cart, meta: { requiresAuth: true } },

  /* admin order history */
  { path: "/orders", name: "Orders", component: Orders, meta: { requiresAuth: true, requiresAdmin: true } },

  /* user order history */
  { path: "/my-orders", name: "MyOrders", component: MyOrders, meta: { requiresAuth: true } },

  /* profile */
  { path: "/profile", name: "Profile", component: Profile, meta: { requiresAuth: true } },

  /* admin product management */
  { path: "/add-product", name: "AddProduct", component: AddProduct, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: "/edit-product/:id", name: "EditProduct", component: EditProduct, meta: { requiresAuth: true, requiresAdmin: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("token")
  const userStore = useUserStore()

  if ((to.path === "/login" || to.path === "/register") && token) {
    return next("/products")
  }

  if (to.meta.requiresAuth && !token) {
    return next("/login")
  }

  if (to.meta.requiresAdmin && !userStore.isAdmin) {
    return next("/products")
  }

  next()
})

export default router
