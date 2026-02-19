<template>
  <div id="edit-product" class="mx-auto my-5 px-2">
    <h1 class="text-center">Edit Product</h1>
    <div class="d-flex justify-content-end">
      <RouterLink to="/products" class="btn btn-sm btn-dark mb-3">Go back</RouterLink>
    </div>
    <EditProductForm />
  </div>
</template>

<script setup>
import EditProductForm from '@/components/EditProductForm.vue';
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
#edit-product {
  max-width: 600px;
}
</style>