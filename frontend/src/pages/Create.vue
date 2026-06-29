<script setup lang="ts">
import { ref } from 'vue'
import Navbar from '@/components/layout/Navbar.vue'
import { useProductStore } from '@/stores/product'
import { useRouter } from 'vue-router'
import ProductForm from '@/components/product/Form.vue'

const router = useRouter()

const productStore = useProductStore()

async function handleCreate(data : any) {
    productStore.createProduct(data)

    router.push('/')
}

</script>

<template>
  <main>
    <Navbar />
    <div class="container mx-auto px-4 py-3 gap-4 flex flex-col">
        <div class="flex gap-6">
            <div class="my-auto">
                <button class="secondary-button shadow" @click="router.push('/')">
                ← Back to products
                </button>
            </div>
            <div class="flex flex-col">
                <h1>Create new product</h1>
                Add a new product
            </div>
        </div>
        <ProductForm submit-button-text="Create new product" @submit="handleCreate" />
    </div>
  </main>
</template>
