import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '@/pages/Home.vue'
import CreatePage from '@/pages/Create.vue'
import EditProductPage from '@/pages/Edit.vue'
import ProductPage from '@/pages/Product.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomePage,
    },
    {
      path: '/products/create',
      name: 'create',
      component: CreatePage,
    },
    {
      path: '/products/:id',
      name: 'product-detail',
      component: ProductPage,
      props: true
    },
    {
      path: '/products/:id/edit',
      name: 'product-edit',
      component: EditProductPage,
      props: true
    },
  ],
})

export default router
