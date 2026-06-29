<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Navbar from '@/components/layout/Navbar.vue'
import { useProductStore } from '@/stores/product'
import { useRouter } from 'vue-router'
import ProductForm from '@/components/product/Form.vue'

const router = useRouter()

const productStore = useProductStore()

const productName = ref('')

const initialProductData = ref<any>(null)

const props = defineProps<{
  id: string
}>()

onMounted(async () => {
  const product = await productStore.getProductDetail(props.id)
  console.log(product)
  productName.value = product.name
  initialProductData.value = product
})

async function handleUpdate(data : any) {
    productStore.updateProduct(props.id, data)
    router.push('/')
}

</script>

<template>
  <main>
    <Navbar />
    <div class="container mx-auto px-4 py-3 gap-4 flex flex-col">
        <div class="flex gap-6">
            <div class="my-auto">
                <button class="secondary-button shadow" @click="router.push('/products/' + props.id)">
                ← Back to products
                </button>
            </div>
            <div class="flex flex-col">
                <h1>Edit - {{productName}}</h1>
                Edit information of product
            </div>
        </div>
        <ProductForm 
            v-if="initialProductData" 
            :initial-data="initialProductData" 
            submit-button-text="Save Changes" 
            @submit="handleUpdate" 
        />
    </div>
  </main>
</template>
