<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  initialData?: Record<string, any>
  submitButtonText: string
}>()

const emit = defineEmits<{
  (e: 'submit', formData: typeof form.value): void
}>()

const form = ref({
  gvtId: null as number | null,
  name: '',
  productTagline: '',
  shortDescription: '',
  longDescription: '',
  logoLocation: '',
  productUrl: '',
  voucherTypeName: '',
  orderUrl: '',
  productTitle: '',
  variableDenomPriceMinAmount: '',
  variableDenomPriceMaxAmount: ''
})

watch(() => props.initialData, (newData) => {
  if (newData) {
    Object.assign(form.value, newData)
  }
}, { immediate: true, deep: true })

function handleSubmit() {
  emit('submit', { ...form.value })
}
</script>

<template>
    <form @submit.prevent="handleSubmit" class="bg-white rounded-xl p-6 shadow-sm border border-slate-100 space-y-6">
        <div class="flex flex-col gap-3">
            <div class="flex flex-col gap-1">
                <label class="text-sm font-semibold text-slate-700">Product Name *</label>
                <input v-model="form.name" type="text" required placeholder="e.g. Game of Sultans " class="form-input" />
            </div>

            <div class="flex flex-col gap-1">
                <label class="text-sm font-semibold text-slate-700">Product Title  *</label>
                <input v-model="form.productTitle" type="text" placeholder="e.g. Game of Sultans  (Canada) - Codashop" class="form-input" />
            </div>

            <div class="flex flex-col gap-1">
                <label class="text-sm font-semibold text-slate-700">GVT id  *</label>
                <input v-model.number="form.gvtId" type="number" placeholder="e.g. 4501" class="form-input" />
            </div>

            <div class="flex flex-col gap-1">
                <label class="text-sm font-semibold text-slate-700">Voucher Type Name  *</label>
                <input v-model="form.voucherTypeName" type="text" placeholder="e.g. MECHANIST" class="form-input" />
            </div>

            <div class="flex flex-col gap-1 md:col-span-2">
                <label class="text-sm font-semibold text-slate-700">Product Tagline  *</label>
                <input v-model="form.productTagline" type="text" placeholder="e.g. Top Up Game of Sultans Diamonds in Codashop" class="form-input" />
            </div>

            <div class="flex flex-col gap-1">
                <label class="text-sm font-semibold text-slate-700">Main Product Info URL  *</label>
                <input v-model="form.productUrl" type="text" placeholder="https://example.com/details" class="form-input" />
            </div>

            <div class="flex flex-col gap-1 md:col-span-2">
                <label class="text-sm font-semibold text-slate-700">Direct Purchase Order URL  *</label>
                <input v-model="form.orderUrl" type="url" placeholder="https://checkout.example.com/buy/id" class="form-input" />
            </div>

            <div class="flex flex-col gap-1 md:col-span-2">
                <label class="text-sm font-semibold text-slate-700">Short Summary Description</label>
                <textarea v-model="form.shortDescription" rows="4" placeholder="<a>View details</a> Detailed product context profiles..." class="form-input resize-none"></textarea>
            </div>

            <div class="flex flex-col gap-1 md:col-span-2">
                <label class="text-sm font-semibold text-slate-700">Long Structural Description (HTML String)</label>
                <textarea v-model="form.longDescription" rows="4" placeholder="<a>View details</a> Detailed product context profiles..." class="form-input resize-none"></textarea>
        </div>
        </div>
        <div>
            <button>{{ submitButtonText }}</button>
        </div>
    </form>
</template>
