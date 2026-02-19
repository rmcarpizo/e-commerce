<template>
  <div class="container py-5">
    <div class="text-center mb-4">
      <h2 class="fw-bold">Register</h2>
      <p class="text-muted">Create your account</p>
    </div>
    
    <div class="card mx-auto shadow-sm" style="max-width: 720px;">
      <div class="card-body p-4">
        <form @submit.prevent="register">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label">First Name:</label>
              <input 
                v-model.trim="firstName" 
                class="form-control"
                :class="{ 'is-invalid': firstNameError }"
                placeholder="Enter your First Name"
                @blur="validateFirstName"
                required
              />
              <div v-if="firstNameError" class="invalid-feedback">
                {{ firstNameError }}
              </div>
            </div>
            <div class="col-md-6 mb-3">
              <label class="form-label">Last Name:</label>
              <input 
                v-model.trim="lastName" 
                class="form-control"
                :class="{ 'is-invalid': lastNameError }"
                placeholder="Enter your Last Name"
                @blur="validateLastName"
                required
              />
              <div v-if="lastNameError" class="invalid-feedback">
                {{ lastNameError }}
              </div>
            </div>
          </div>
          
          <div class="mb-3">
            <label class="form-label">Email:</label>
            <input 
              v-model.trim="email" 
              type="email" 
              class="form-control"
              :class="{ 'is-invalid': emailError }"
              placeholder="Enter your email"
              @blur="validateEmail"
              required
            />
            <div v-if="emailError" class="invalid-feedback">
              {{ emailError }}
            </div>
          </div>
          
          <div class="mb-3">
            <label class="form-label">Mobile Number:</label>
            <input
              v-model.trim="mobileNumber"
              class="form-control"
              :class="{ 'is-invalid': mobileError }"
              placeholder="Enter your 11 digit mobile number"
              maxlength="11"
              @keypress="allowNumbersOnly"
              @input="validateMobile"
              @blur="validateMobile"
              required
            />
            <div v-if="mobileError" class="invalid-feedback">
              {{ mobileError }}
            </div>
          </div>
          
          <div class="mb-3">
            <label class="form-label">Password:</label>
            <input 
              v-model="password" 
              type="password" 
              class="form-control"
              :class="{ 'is-invalid': passwordError }"
              placeholder="Enter your password (min 8 characters)"
              @input="validatePassword"
              @blur="validatePassword"
              required
            />
            <div v-if="passwordError" class="invalid-feedback">
              {{ passwordError }}
            </div>
          </div>
          
          <div class="mb-3">
            <label class="form-label">Verify Password:</label>
            <input
              v-model="verifyPassword"
              type="password"
              class="form-control"
              :class="{ 'is-invalid': verifyPasswordError }"
              placeholder="Verify your password"
              @input="validateVerifyPassword"
              @blur="validateVerifyPassword"
              required
            />
            <div v-if="verifyPasswordError" class="invalid-feedback">
              {{ verifyPasswordError }}
            </div>
          </div>
          
          <div v-if="generalError" class="alert alert-danger py-2 text-center">
            {{ generalError }}
          </div>
          
          <button
            type="submit"
            :class="isFormComplete ? 'btn btn-success w-100 py-2' : 'btn btn-danger w-100 py-2'"
            :disabled="loading || !isFormComplete"
          >
            <span
              v-if="loading"
              class="spinner-border spinner-border-sm me-2"
            ></span>
            {{ isFormComplete ? 'Create Account' : 'Please enter your registration details' }}
          </button>
        </form>
      </div>
    </div>
    
    <div class="text-center mt-3">
      <span class="text-muted">Already have an account? </span>
      <RouterLink to="/login" class="text-primary">Click here</RouterLink>
      <span class="text-muted"> to log in.</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
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
const generalError = ref("");
const loading = ref(false);


const firstNameError = ref("");
const lastNameError = ref("");
const emailError = ref("");
const mobileError = ref("");
const passwordError = ref("");
const verifyPasswordError = ref("");

const REGISTER_ENDPOINT = "/users/register";

// Validation functions

const allowNumbersOnly = (event) => {
  if (!/\d/.test(event.key)) {
    event.preventDefault();
  }
};

const validateFirstName = () => {
  if (!firstName.value.trim()) {
    firstNameError.value = "First name is required";
    return false;
  }
  if (firstName.value.trim().length < 2) {
    firstNameError.value = "First name must be at least 2 characters";
    return false;
  }
  firstNameError.value = "";
  return true;
};

const validateLastName = () => {
  if (!lastName.value.trim()) {
    lastNameError.value = "Last name is required";
    return false;
  }
  if (lastName.value.trim().length < 2) {
    lastNameError.value = "Last name must be at least 2 characters";
    return false;
  }
  lastNameError.value = "";
  return true;
};

const validateEmail = () => {
  if (!email.value.trim()) {
    emailError.value = "Email is required";
    return false;
  }
  if (!email.value.includes("@")) {
    emailError.value = "Email must contain '@' symbol";
    return false;
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email.value)) {
    emailError.value = "Please enter a valid email address (e.g., user@example.com)";
    return false;
  }
  emailError.value = "";
  return true;
};

const validateMobile = () => {
  if (!mobileNumber.value.trim()) {
    mobileError.value = "Mobile number is required";
    return false;
  }
  if (!/^\d+$/.test(mobileNumber.value)) {
    mobileError.value = "Mobile number must contain only numbers (0-9)";
    return false;
  }
  if (mobileNumber.value.length !== 11) {
    mobileError.value = "Mobile number must be exactly 11 digits";
    return false;
  }
  mobileError.value = "";
  return true;
};

const validatePassword = () => {
  if (!password.value) {
    passwordError.value = "Password is required";
    return false;
  }
  if (password.value.length < 8) {
    passwordError.value = "Password must be at least 8 characters long";
    return false;
  }
  passwordError.value = "";
  
 
  if (verifyPassword.value) {
    validateVerifyPassword();
  }
  return true;
};

const validateVerifyPassword = () => {
  if (!verifyPassword.value) {
    verifyPasswordError.value = "Please verify your password";
    return false;
  }
  if (password.value !== verifyPassword.value) {
    verifyPasswordError.value = "Passwords do not match";
    return false;
  }
  verifyPasswordError.value = "";
  return true;
};


const isFormComplete = computed(() => {
  return firstName.value.trim() !== '' &&
         lastName.value.trim() !== '' &&
         email.value.trim() !== '' &&
         mobileNumber.value.trim().length === 11 &&
         /^\d+$/.test(mobileNumber.value) &&
         /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value) &&
         password.value.length >= 8 &&
         verifyPassword.value.length >= 8 &&
         password.value === verifyPassword.value &&
         !firstNameError.value &&
         !lastNameError.value &&
         !emailError.value &&
         !mobileError.value &&
         !passwordError.value &&
         !verifyPasswordError.value;
});

async function register() {
  generalError.value = "";
  
  
  const isFirstNameValid = validateFirstName();
  const isLastNameValid = validateLastName();
  const isEmailValid = validateEmail();
  const isMobileValid = validateMobile();
  const isPasswordValid = validatePassword();
  const isVerifyPasswordValid = validateVerifyPassword();
  
  if (!isFirstNameValid || !isLastNameValid || !isEmailValid || 
      !isMobileValid || !isPasswordValid || !isVerifyPasswordValid) {
    generalError.value = "Please fix all errors before submitting";
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
    generalError.value = e?.response?.data?.message || "Registration failed. Please try again.";
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

<style scoped>
.invalid-feedback {
  display: block;
}
</style>