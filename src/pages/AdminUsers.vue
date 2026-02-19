<template>
  <div class="container py-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1 class="m-0">Users</h1>

      <button class="btn btn-dark" @click="goBack">Back</button>
    </div>

    <div v-if="errorMsg" class="alert alert-danger">
      {{ errorMsg }}
    </div>

    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div v-else class="card border-0 shadow-sm">
      <div class="card-body p-0">
        <div class="table-responsive">
          <table class="table align-middle mb-0">
            <thead>
              <tr>
                <th class="px-4 py-3 text-uppercase small text-muted">Name</th>
                <th class="px-4 py-3 text-uppercase small text-muted">Email</th>
                <th class="px-4 py-3 text-uppercase small text-muted">Role</th>
                <th class="px-4 py-3 text-uppercase small text-muted text-end">Action</th>
              </tr>
            </thead>

            <tbody>
              <tr v-if="users.length === 0">
                <td colspan="4" class="px-4 py-4 text-center text-muted">
                  No users found.
                </td>
              </tr>

              <tr v-for="u in users" :key="u._id">
                <td class="px-4 py-3 fw-semibold">
                  {{ fullName(u) }}
                </td>

                <td class="px-4 py-3">
                  {{ u.email }}
                </td>

                <td class="px-4 py-3">
                  <span
                    class="badge"
                    :class="u.isAdmin ? 'bg-success-subtle text-success border' : 'bg-light text-dark border'"
                  >
                    {{ u.isAdmin ? "Admin" : "User" }}
                  </span>
                </td>

                <td class="px-4 py-3 text-end">
                  <button
                    class="btn btn-outline-dark btn-sm"
                    :disabled="u.isAdmin || promotingId === u._id"
                    @click="setAsAdmin(u._id)"
                  >
                    {{ u.isAdmin ? "Admin" : (promotingId === u._id ? "Updating..." : "Set as Admin") }}
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="successMsg" class="alert alert-success mt-3">
      {{ successMsg }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import api from "../api";
import { useUserStore } from "../stores/user";

const router = useRouter();
const userStore = useUserStore();

const users = ref([]);
const isLoading = ref(false);
const errorMsg = ref("");
const successMsg = ref("");
const promotingId = ref("");

const fullName = (u) => {
  const fn = u?.firstName?.trim() || "";
  const ln = u?.lastName?.trim() || "";
  const name = `${fn} ${ln}`.trim();
  return name || "(No name)";
};

const fetchUsers = async () => {
  isLoading.value = true;
  errorMsg.value = "";
  successMsg.value = "";

  try {
    // BACKEND MUST HAVE: GET /users/all (admin only)
    const res = await api.get("/users/all");
    users.value = Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    errorMsg.value =
      err?.response?.data?.message ||
      "Failed to load users. Make sure backend has GET /users/all (admin only).";
    users.value = [];
  } finally {
    isLoading.value = false;
  }
};

const setAsAdmin = async (userId) => {
  promotingId.value = userId;
  errorMsg.value = "";
  successMsg.value = "";

  try {
    // BACKEND ALREADY HAS: PATCH /users/:userId/set-as-admin (admin only)
    await api.patch(`/users/${userId}/set-as-admin`);
    successMsg.value = "User updated to admin.";
    await fetchUsers();
  } catch (err) {
    errorMsg.value =
      err?.response?.data?.message || "Failed to set user as admin.";
  } finally {
    promotingId.value = "";
  }
};

const goBack = () => {
  router.push("/products");
};

onMounted(() => {
  if (!userStore.token) return router.push("/login");
  if (!userStore.isAdmin) return router.push("/products");
  fetchUsers();
});
</script>