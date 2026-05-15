import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product, OptimizationResult } from '@/types'

export const useOptimizeStore = defineStore('nova-optimize', () => {
  const products = ref<Product[]>([
    { id: 'o1', name: '夏季凉感透气凉鞋', price: 79, score: 85, type: 'short-trend', image: '', description: '透气凉感材质', selected: false, status: 'pending' },
    { id: 'o2', name: '便携式车载小风扇', price: 49, score: 92, type: 'short-hot', image: '', description: 'USB充电便携', selected: false, status: 'pending' },
    { id: 'o3', name: '防晒冰丝袖套', price: 19, score: 95, type: 'short-hot', image: '', description: '冰丝材质', selected: false, status: 'pending' },
    { id: 'o4', name: '蓝牙无线耳机', price: 89, score: 90, type: 'short-hot', image: '', description: '蓝牙5.0', selected: false, status: 'pending' },
    { id: 'o5', name: '迷你加湿器', price: 39, score: 87, type: 'short-hot', image: '', description: 'USB供电', selected: false, status: 'pending' },
  ])

  const optimizationResults = ref<Record<string, OptimizationResult>>({})
  const generatedImages = ref<Record<string, string[]>>({})
  const selectedImages = ref<Record<string, number>>({})
  const applyProgress = ref(0)

  function generateOptimization() {
    const results: Record<string, OptimizationResult> = {}
    products.value.forEach(p => {
      results[p.id] = {
        productId: p.id,
        title: { original: p.name, optimized: `【爆款推荐】${p.name} 厂家直发 限时特惠` },
        image: { original: p.image, optimized: '' },
        detail: { original: p.description, optimized: `${p.description}，品质保证，7天无理由退换，全国包邮。月销10万+，好评率99.2%。` },
      }
    })
    optimizationResults.value = results
  }

  function generateImages(productId: string) {
    generatedImages.value[productId] = [
      'https://placehold.co/400x400/e8f0ff/246bfe?text=AI+Gen+1',
      'https://placehold.co/400x400/e7f6ee/138a5b?text=AI+Gen+2',
      'https://placehold.co/400x400/fff3d6/b86b00?text=AI+Gen+3',
      'https://placehold.co/400x400/ffe9e8/c43d3d?text=AI+Gen+4',
    ]
  }

  function selectImage(productId: string, index: number) {
    selectedImages.value[productId] = index
  }

  async function applyOptimization() {
    applyProgress.value = 0
    for (let i = 0; i <= 100; i += 10) {
      applyProgress.value = i
      await new Promise(r => setTimeout(r, 200))
    }
    applyProgress.value = 100
  }

  return { products, optimizationResults, generatedImages, selectedImages, applyProgress, generateOptimization, generateImages, selectImage, applyOptimization }
})
