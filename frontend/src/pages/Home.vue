<script setup lang="ts">
import { onMounted } from 'vue'
import Navbar from '@/components/layout/Navbar.vue'
import SearchBox from '@/components/common/SearchBox.vue'
import ProductListItem from '@/components/product/ProductListItem.vue'
import { useProductStore } from '@/stores/product'

const productStore = useProductStore()
onMounted(async () => {
  await productStore.loadProduct()
})

const onSearch = async (keyword : string) => {
  await productStore.loadProduct(keyword)
} 
  
</script>

<template>
  <main>
    <Navbar />
    <div class="container mx-auto px-4 py-3 gap-4 flex flex-col">
      <h1>Our Products</h1>
      <SearchBox @search="onSearch" />
      <div>
        <router-link 
          to="/create" 
        >
          <button>+ Add new product</button>
        </router-link>
      </div>
      <div v-if="productStore.isLoading">
        loading...
      </div>
      <div class="grid grid-cols-1 gap-4">
        <ProductListItem v-for="product in productStore.products" :key="product.id" :product="product" />
      </div>
    </div>
  </main>
</template>
