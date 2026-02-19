<template>
  <div id="add-product" class="mx-auto my-5 px-2">
    <h1 class="text-center">Add New Product</h1>
    <div class="d-flex justify-content-end">
      <RouterLink to="/products" class="btn btn-sm btn-dark mb-3">Go back</RouterLink>
    </div>
    <AddProductForm />
  </div>
</template>

<script setup>
import AddProductForm from '@/components/AddProductForm.vue';
import { useUserStore } from '@/stores/user';
import { onMounted } from 'vue';
import { RouterLink, useRouter } from 'vue-router';

const user = useUserStore()
const router = useRouter()

onMounted(() => {
 
  if (!user.token) {
    router.push('/login')
  } else if (!user.isAdmin) {
    
    router.push('/products')
  }
})
</script>

<style scoped>
#add-product {
  max-width: 600px;
}
</style>