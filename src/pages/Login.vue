<script setup>
import { ref, onMounted } from "vue";
import { useRouter, RouterLink } from "vue-router";
import api from "../api";
import { useUserStore } from '../stores/user';

const router = useRouter();
const user = useUserStore();

const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);

const LOGIN_ENDPOINT = "/users/login";

async function login() {
  error.value = "";
  
  if (!email.value.trim() || !password.value) {
    error.value = "Please enter your email and password.";
    return;
  }
  
  loading.value = true;
  try {
    const res = await api.post(LOGIN_ENDPOINT, {
      email: email.value.trim(),
      password: password.value,
    });
    
    const token = res.data?.access || res.data?.token;
    if (!token) throw new Error("No token returned");
    

    user.setToken(token);
    
    router.push("/products");
  } catch (e) {
    error.value = e?.response?.data?.message || "Login failed.";
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  if (user.token) {
    router.push('/products');
  }
});
</script>

<template>
  <div class="container py-5">
    <div class="text-center mb-4">
      <h2 class="fw-bold">Log In</h2>
      <p class="text-muted">Welcome back. Please enter your details.</p>
    </div>
    
    <div class="card mx-auto shadow-sm" style="max-width: 420px;">
      <div class="card-body p-4">
       <form @submit.prevent="login">
        <div class="mb-3">
          <label class="form-label">Email:</label>
          <input
            v-model.trim="email"
            type="email"
            class="form-control"
            placeholder="Enter your email"
            autocomplete="email"
            name="email"
            required
          />
        </div>
        
        <div class="mb-3">
          <label class="form-label">Password:</label>
          <input
            v-model="password"
            type="password"
            class="form-control"
            placeholder="Enter your password"
            autocomplete="current-password" 
            name="password"
            required
          />
        </div>
        
        <div v-if="error" class="alert alert-danger py-2 text-center">
          {{ error }}
        </div>
        
        <button
          class="btn btn-primary w-100 py-2"
          @click="login"
          :disabled="loading"
        >
          <span
            v-if="loading"
            class="spinner-border spinner-border-sm me-2"
          ></span>
          Submit
        </button>
       </form>
      </div>
    </div>
    
    <div class="text-center mt-3">
      <span class="text-muted">Don't have an account yet? </span>
      <RouterLink to="/register" class="text-primary">Click here</RouterLink>
      <span class="text-muted"> to register.</span>
    </div>
  </div>
</template>