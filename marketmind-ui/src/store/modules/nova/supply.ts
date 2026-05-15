import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product, Supplier } from '@/types'

export const useSupplyStore = defineStore('nova-supply', () => {
  const products = ref<Product[]>([])
  const supplierMap = ref<Record<string, Supplier[]>>({})
  const selectedSuppliers = ref<Record<string, string>>({})
  const orderProgress = ref(0)

  function setProducts(items: Product[]) {
    products.value = items.filter(p => p.selected)
  }

  function matchSupply() {
    const suppliers: Record<string, Supplier[]> = {}
    products.value.forEach(p => {
      suppliers[p.id] = [
        { id: `${p.id}-sup1`, productId: p.id, platform: '1688', name: '广州优品供应链', price: Math.round(p.price * 0.35), rating: 4.8, deliveryTime: '2-3天', profit: Math.round(p.price * 0.55), quality: 'premium' },
        { id: `${p.id}-sup2`, productId: p.id, platform: '1688', name: '义乌批发中心', price: Math.round(p.price * 0.4), rating: 4.5, deliveryTime: '3-5天', profit: Math.round(p.price * 0.48), quality: 'standard' },
        { id: `${p.id}-sup3`, productId: p.id, platform: '拼多多', name: '华强数码直供', price: Math.round(p.price * 0.45), rating: 4.2, deliveryTime: '1-2天', profit: Math.round(p.price * 0.4), quality: 'basic' },
      ]
    })
    supplierMap.value = suppliers
  }

  function selectSupplier(productId: string, supplierId: string) {
    selectedSuppliers.value[productId] = supplierId
  }

  async function batchOrder() {
    orderProgress.value = 0
    for (let i = 0; i <= 100; i += 10) {
      orderProgress.value = i
      await new Promise(r => setTimeout(r, 200))
    }
    orderProgress.value = 100
  }

  return { products, supplierMap, selectedSuppliers, orderProgress, setProducts, matchSupply, selectSupplier, batchOrder }
})
