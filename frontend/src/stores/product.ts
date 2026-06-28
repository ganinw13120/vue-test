import 'pinia-plugin-persistedstate'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Product } from '@/models/product'
import axios from 'axios'

export const useProductStore = defineStore('product', () => {
  const products = ref<Product[]>([])
  const isLoading = ref<boolean>(false)

  async function loadProduct(keyword : string = "") {
    try {
      isLoading.value = true
      const response = await axios.get<Product[]>('http://localhost:3000/products', {
        params : keyword ? { keyword } : {}
      })
      products.value = response.data
    } catch (err) {
      console.error('Failed to fetch products:', err)
      products.value = [];
    } finally {
      isLoading.value = false
    }
  }

  async function getProductDetail(id : string) : Promise<Product> {
    try {
      isLoading.value = true
      const response = await axios.get<Product>(`http://localhost:3000/products/${id}`)
      return response.data
    } catch (err:any) {
      console.error(`Failed to load product ${id}:`, err)
      throw err?.response?.data.message ?? err
    } finally {
      isLoading.value = false
    }
  }

  async function createProduct(newProductData: Omit<Product, 'id'>) {
    try {
      isLoading.value = true
      const response = await axios.post<Product>('http://localhost:3000/products', newProductData)
      
      loadProduct()
    } catch (err) {
      console.error('Failed to create product:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateProduct(id: number, newProductData: Omit<Product, 'id'>) {
    try {
      isLoading.value = true
      const response = await axios.patch<Product>('http://localhost:3000/products/' + id, newProductData)
      products.value = [...products.value, response.data]
      
      loadProduct()
    } catch (err) {
      console.error('Failed to create product:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function deleteProduct(id: number) {
    try {
      isLoading.value = true
      const response = await axios.delete('http://localhost:3000/products/' + id)
      loadProduct()
    } catch (err) {
      console.error('Failed to create product:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }


  return { products, isLoading, loadProduct, createProduct, getProductDetail, updateProduct, deleteProduct }
}, {
    persist: true
})