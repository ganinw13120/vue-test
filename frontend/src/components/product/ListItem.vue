<script setup lang="ts">
import type { Product } from '@/models/product'
import DOMPurify from 'dompurify'

const props = defineProps<{
  product: Product;
}>();

const description = DOMPurify.sanitize(props.product.shortDescription)
</script>

<template>
    <a :href="`/products/${product.id}`">
        <div class="flex w-full product-item shadow p-3 rounded w-full hover:bg-gray-100">
            <div v-if="product.logoLocation">
                <img :src="product.logoLocation" 
                @error="(e) => (e.target as HTMLImageElement).style.display = 'none'"
                    alt="product-logo" class="w-28 h-full object-cover" 
                />
            </div>
            <div class="px-3">
                <h3>#{{product.id}} - {{ product.name }}</h3>
                <p>{{ product.productTitle }}</p>
            </div>
        </div>
    </a>
</template>