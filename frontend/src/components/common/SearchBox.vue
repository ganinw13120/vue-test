<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'search', keyword: string): void;
}>();

const keyword = ref('')
const handleSearch = () => {
  emit('search', keyword.value)
}

</script>

<template>
    <div class="flex gap-4">
        <input
            v-model="keyword"
            placeholder="Search products..."
            class="shadow w-full lg:w-1/2"
            @keyup.enter="handleSearch"
        />
        <button 
          class="shadow"
          @click="handleSearch"
        >Search</button>
    </div>
</template>