<template>
  <form @submit.prevent="addProduct" class="mb-3 d-flex flex-column gap-2">
    <label>
      <span>Product Name:</span>
      <input
        v-model="name"
        class="form-control"
        placeholder="Enter product name"
        required
      />
    </label>

    <label>
      <span>Description:</span>
      <textarea
        v-model="description"
        class="form-control"
        placeholder="Enter product description"
        rows="4"
        required
      ></textarea>
    </label>

    <label>
      <span>Price:</span>
      <input
        v-model.number="price"
        type="number"
        class="form-control"
        placeholder="Enter price"
        min="0"
        step="0.01"
        required
      />
    </label>

    <button class="btn btn-primary" :disabled="isLoading || !isFormValid">
      {{ isLoading ? "Saving..." : "Save" }}
    </button>

    <div v-if="errorMessage" class="alert alert-danger">
      {{ errorMessage }}
    </div>
  </form>
</template>

<script setup>
import { ref, watch } from "vue";
import api from "../api";
import { useRouter } from "vue-router";

const router = useRouter();


const name = ref("");
const description = ref("");
const price = ref("");

const isFormValid = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");

watch(
  [name, description, price],
  ([newName, newDescription, newPrice]) => {
    isFormValid.value =
      newName !== "" &&
      newDescription !== "" &&
      newPrice !== "" &&
      newPrice > 0;
  },
  { immediate: true }
);

const addProduct = async () => {
  errorMessage.value = "";
  
  try {
    isLoading.value = true;

    await api.post("/products", {
      name: name.value,
      description: description.value,
      price: price.value,
    });

    name.value = "";
    description.value = "";
    price.value = "";

    isLoading.value = false;

    router.push("/products");
  } catch (error) {
    console.error("Failed to add product:", error);
    errorMessage.value = error.response?.data?.message || "Failed to add product";
    isLoading.value = false;
  }
};
</script>