<template>
 
  <div v-if="isLoadingProduct" class="text-center my-5">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>

 
  <form v-if="!isLoadingProduct" @submit.prevent="updateProduct" class="mb-3 d-flex flex-column gap-2">
    <label>
      <span>Product Name:</span>
      <input
        v-model="name"
        class="form-control"
        placeholder="Enter product name..."
        required
      />
    </label>

    <label>
      <span>Description:</span>
      <textarea
        v-model="description"
        class="form-control"
        placeholder="Enter product description..."
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

    <button class="btn btn-success" :disabled="isUpdating || !isFormValid">
      {{ isUpdating ? "Updating..." : "Update" }}
    </button>

    <div v-if="successMessage" class="alert alert-success">
      {{ successMessage }}
    </div>

    <div v-if="errorMessage" class="alert alert-danger">
      {{ errorMessage }}
    </div>
  </form>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import api from "../api";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();


const name = ref("");
const description = ref("");
const price = ref("");

const isFormValid = ref(false);
const isLoadingProduct = ref(false);
const isUpdating = ref(false);
const successMessage = ref("");
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


const fetchProduct = async () => {
  isLoadingProduct.value = true;
  try {
    const res = await api.get(`/products/${route.params.id}`);
    const product = res.data;
    
    
    name.value = product.name;
    description.value = product.description;
    price.value = product.price;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    errorMessage.value = "Failed to load product details";
  }
  isLoadingProduct.value = false;
};

const updateProduct = async () => {
  errorMessage.value = "";
  successMessage.value = "";
  
  try {
    isUpdating.value = true;

    await api.patch(`/products/${route.params.id}/update`, {
      name: name.value,
      description: description.value,
      price: price.value,
    });

    successMessage.value = "Product updated successfully!";
    
   
    setTimeout(() => {
      router.push("/products");
    }, 1500);
  } catch (error) {
    console.error("Failed to update product:", error);
    errorMessage.value = error.response?.data?.message || "Failed to update product";
  }
  isUpdating.value = false;
};

onMounted(() => {
  fetchProduct();
});
</script>