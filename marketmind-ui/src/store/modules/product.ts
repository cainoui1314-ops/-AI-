import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product } from '@/types'

const sampleProducts: Product[] = [
  {
    id: 'p1', name: '冰袖防晒袖套', price: 29.9, image: '', score: 92,
    tag: '短期爆品', sales: '日销3,500+', platform: '抖音',
    detail: { category: '服饰配件', trend: '上升趋势', competition: '中等', profitMargin: '45%' },
    actionOptions: ['查看类似商品', '分析ROI', '立即上架'],
  },
  {
    id: 'p2', name: '夏季冰丝凉感T恤', price: 49.9, image: '', score: 88,
    tag: '趋势品', sales: '日销2,100+', platform: '抖音',
    detail: { category: '男装', trend: '快速上升', competition: '较高', profitMargin: '38%' },
    actionOptions: ['查看类似商品', '分析ROI', '立即上架'],
  },
  {
    id: 'p3', name: '便携挂脖风扇', price: 39.9, image: '', score: 85,
    tag: '应季品', sales: '日销1,800+', platform: '抖音',
    detail: { category: '数码配件', trend: '季节性上升', competition: '中等', profitMargin: '42%' },
    actionOptions: ['查看类似商品', '分析ROI', '立即上架'],
  },
  {
    id: 'p4', name: '防晒霜SPF50+', price: 59.9, image: '', score: 90,
    tag: '长周期品', sales: '日销5,200+', platform: '抖音',
    detail: { category: '美妆护肤', trend: '稳定高位', competition: '激烈', profitMargin: '35%' },
    actionOptions: ['查看类似商品', '分析ROI', '立即上架'],
  },
]

export const useProductStore = defineStore('product', () => {
  const selectedProduct = ref<Product | null>(null)
  const showPanel = ref(false)

  function selectProduct(product: Product) {
    selectedProduct.value = product
    showPanel.value = true
  }

  function closePanel() {
    showPanel.value = false
    selectedProduct.value = null
  }

  function getSampleProducts(): Product[] {
    return sampleProducts
  }

  return {
    selectedProduct,
    showPanel,
    selectProduct,
    closePanel,
    getSampleProducts,
  }
})
