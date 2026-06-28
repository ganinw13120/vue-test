<script setup lang="ts">
import { ref, onMounted } from 'vue'
import Navbar from '@/components/layout/Navbar.vue'
import { useProductStore } from '@/stores/product'
import { useRouter } from 'vue-router'

const router = useRouter()

const productStore = useProductStore()

const props = defineProps<{
  id: string
}>()

const product = ref<Product | null>(null)
const error = ref<string>('')

onMounted(async () => {
    try {
        const data = await productStore.getProductDetail(props.id)
        product.value = data
    } catch (e) {
        error.value = e
    }
})

const handleEditProduct = () => {
    router.push('/product/' + props.id + '/edit')
}

const handleDeleteProduct = async () => {
    await productStore.deleteProduct(props.id)
    router.push('/')
}

</script>

<template>
  <main>
    <Navbar />
    <div class="container mx-auto px-4 py-3 gap-4 flex flex-col">
        <div class="flex gap-6 my-3">
            <button class="secondary-button shadow" @click="router.push('/')">
            ← Back to products
            </button>

            <button class="secondary-button shadow" @click="handleEditProduct">
            Edit
            </button>

            <button class="secondary-button shadow" @click="handleDeleteProduct">
            Delete
            </button>
        </div>
        <div v-if="productStore.isLoading">
            loading...
        </div>
        <div v-if="error">
            {{error}}
        </div>
        
        <div v-else-if="product">
            <div class="flex items-start gap-4">
                <img 
                    v-if="product.logoLocation" 
                    :src="product.logoLocation" 
                    alt="Product Logo" 
                    class="w-16 h-16 rounded-lg object-cover bg-slate-100 border border-slate-100"
                />
                <div class="space-y-1">
                    <h1 class="text-2xl font-bold text-slate-900 leading-tight">
                    {{ product.productTitle }}
                    </h1>
                    <p class="text-sm font-medium text-slate-500">
                    {{ product.productTagline }}
                    </p>
                </div>
                
            </div>
            <div class="space-y-6 my-6">
                <div>
                    <span class="text-xs font-semibold text-slate-400 block uppercase">Price</span>
                    <span class="text-lg font-bold text-slate-900">
                    ${{ product.variableDenomPriceMinAmount || '0.00' }} - ${{ product.variableDenomPriceMaxAmount || '0.00' }}
                    </span>
                </div>
                <div>
                    <span class="text-xs font-semibold text-slate-400 block uppercase">Product Name</span>
                    <span class="text-lg font-bold text-slate-900">
                        {{product.name}}
                    </span>
                </div>
                <div>
                    <span class="text-xs font-semibold text-slate-400 block uppercase">Voucher Type</span>
                    <span class="text-lg font-bold text-slate-900">
                        {{product.voucherTypeName}}
                    </span>
                </div>
                <span class="text-xs font-semibold text-slate-400 block uppercase">Description</span>
                <div>
                    <div class="text-slate-700 mt-1.5 text-sm prose prose-slate max-w-none" v-html="product.longDescription"></div>
                </div>

                <div class="text-slate-600 mt-1.5 text-sm prose prose-slate max-w-none" v-html="product.shortDescription"></div>
                </div>

                <div class="pt-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-t border-slate-100">
                
            </div>
        </div>
    </div>
  </main>
</template>
