<template>
  <div class="container py-5" style="max-width: 720px;">
    <h1 class="text-center mb-4">Profile</h1>

    <div class="card border-0 shadow-sm mb-4">
      <div class="card-body">
        <div><strong>Name:</strong> {{ displayName }}</div>
        <div><strong>Email:</strong> {{ displayEmail }}</div>
       
      </div>
    </div>

    <div class="card border-0 shadow-sm">
      <div class="card-body">
        <h4 class="mb-3">Change Password</h4>

        <div class="mb-2">
          <input v-model="oldPassword" type="password" class="form-control" placeholder="Old password" />
        </div>

        <div class="mb-2">
          <input v-model="newPassword" type="password" class="form-control" placeholder="New password" />
        </div>

        <div class="mb-2">
          <input v-model="confirmPassword" type="password" class="form-control" placeholder="Confirm new password" />
        </div>

        <div v-if="confirmPassword && !passwordsMatch" class="text-danger small mb-2">
          Password does not match.
        </div>

        <button class="btn btn-primary mt-2" @click="updatePassword" :disabled="loading || !canSubmit">
          {{ loading ? "Updating..." : "Update Password" }}
        </button>

        <div v-if="success" class="alert alert-success mt-3 mb-0">{{ success }}</div>
        <div v-if="error" class="alert alert-danger mt-3 mb-0">{{ error }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue"
import { useRouter } from "vue-router"
import api from "../api"
import { useUserStore } from "../stores/user"

const router = useRouter()
const user = useUserStore()

const details = ref({})

const oldPassword = ref("")
const newPassword = ref("")
const confirmPassword = ref("")

const loading = ref(false)
const success = ref("")
const error = ref("")

const passwordsMatch = computed(() => newPassword.value === confirmPassword.value)

const canSubmit = computed(() => {
  return (
    oldPassword.value.trim() &&
    newPassword.value.trim() &&
    confirmPassword.value.trim() &&
    passwordsMatch.value
  )
})

const safeNameFrom = (obj) => {
  if (!obj) return ""
  if (obj.fullName) return obj.fullName
  if (obj.name) return obj.name
  const first = obj.firstName || ""
  const last = obj.lastName || ""
  return `${first} ${last}`.trim()
}

const displayName = computed(() => {
  // 1) from /users/details
  const a = safeNameFrom(details.value)
  if (a) return a

  // 2) from pinia store (if you store name there)
  const b = safeNameFrom(user)
  if (b) return b

  // 3) fallback: show email username as "name" (testing@mail.com -> testing)
  const email = displayEmail.value
  if (email && email.includes("@")) return email.split("@")[0]

  return "N/A"
})

const displayEmail = computed(() => {
  return details.value?.email || user.email || user.user?.email || ""
})

const isAdmin = computed(() => {
  return Boolean(details.value?.isAdmin ?? user.isAdmin)
})

const fetchDetails = async () => {
  try {
    const res = await api.get("/users/details")
    details.value = res.data || {}
  } catch (e) {
    details.value = {}
  }
}

const updatePassword = async () => {
  loading.value = true
  success.value = ""
  error.value = ""

  try {
    await api.patch("/users/update-password", {
      oldPassword: oldPassword.value,
      newPassword: newPassword.value,
    })

    success.value = "Password updated."
    oldPassword.value = ""
    newPassword.value = ""
    confirmPassword.value = ""
  } catch (e) {
    error.value = e.response?.data?.error || "Failed to update password."
  }

  loading.value = false
}

onMounted(async () => {
  if (!user.token) return router.push("/login")
  await fetchDetails()
})
</script>