<script setup>
import { ref, onMounted } from "vue";
import { useRouter, RouterLink } from "vue-router";
import api from "../api";
import { useUserStore } from '../stores/user';

const router = useRouter();
const user = useUserStore();

const firstName = ref("");
const lastName = ref("");
const email = ref("");
const mobileNumber = ref("");
const password = ref("");
const verifyPassword = ref("");
const error = ref("");
const loading = ref(false);

const REGISTER_ENDPOINT = "/users/register";

function isValidMobile(mobile) {
  return /^\d{11}$/.test(mobile);
}

async function register() {
  error.value = "";
  
  if (
    !firstName.value.trim() ||
    !lastName.value.trim() ||
    !email.value.trim() ||
    !mobileNumber.value.trim() ||
    !password.value ||
    !verifyPassword.value
  ) {
    error.value = "All fields are required.";
    return;
  }
  
  if (!isValidMobile(mobileNumber.value.trim())) {
    error.value = "Mobile number must be 11 digits.";
    return;
  }
  
  if (password.value !== verifyPassword.value) {
    error.value = "Passwords do not match.";
    return;
  }
  
  loading.value = true;
  try {
    await api.post(REGISTER_ENDPOINT, {
      firstName: firstName.value.trim(),
      lastName: lastName.value.trim(),
      email: email.value.trim(),
      password: password.value,
      mobileNo: mobileNumber.value.trim(),
    });
    router.push("/login");
  } catch (e) {
    error.value = e?.response?.data?.message || "Registration failed.";
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
      <h2 class="fw-bold">Register</h2>
      <p class="text-muted">Create your account</p>
    </div>
    
    <div class="card mx-auto shadow-sm" style="max-width: 720px;">
      <div class="card-body p-4">
        <div class="row">
          <div class="col-md-6 mb-3">
            <label class="form-label">First Name:</label>
            <input 
              v-model.trim="firstName" 
              class="form-control" 
              placeholder="Enter your First Name"
              required
            />
          </div>
          <div class="col-md-6 mb-3">
            <label class="form-label">Last Name:</label>
            <input 
              v-model.trim="lastName" 
              class="form-control" 
              placeholder="Enter your Last Name"
              required
            />
          </div>
        </div>
        
        <div class="mb-3">
          <label class="form-label">Email:</label>
          <input 
            v-model.trim="email" 
            type="email" 
            class="form-control" 
            placeholder="Enter your email"
            required
          />
        </div>
        
        <div class="mb-3">
          <label class="form-label">Mobile Number:</label>
          <input
            v-model.trim="mobileNumber"
            class="form-control"
            placeholder="Enter your 11 digit mobile number"
            maxlength="11"
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
            required
          />
        </div>
        
        <div class="mb-3">
          <label class="form-label">Verify Password:</label>
          <input
            v-model="verifyPassword"
            type="password"
            class="form-control"
            placeholder="Verify your password"
            required
          />
        </div>
        
        <div v-if="error" class="alert alert-danger py-2 text-center">
          {{ error }}
        </div>
        
        <button
          class="btn btn-danger w-100 py-2"
          @click="register"
          :disabled="loading"
        >
          <span
            v-if="loading"
            class="spinner-border spinner-border-sm me-2"
          ></span>
          Please enter your registration details
        </button>
      </div>
    </div>
    
    <div class="text-center mt-3">
      <span class="text-muted">Already have an account? </span>
      <RouterLink to="/login" class="text-primary">Click here</RouterLink>
      <span class="text-muted"> to log in.</span>
    </div>
  </div>
</template>