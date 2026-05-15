import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Product } from '@/types'

export const useSelectionStore = defineStore('nova-selection', () => {
  const products = ref<Product[]>([])
  const isUploading = ref(false)
  const uploadProgress = ref(0)

  const selectedCount = computed(() => products.value.filter(p => p.selected).length)

  function toggleSelect(id: string) {
    const p = products.value.find(item => item.id === id)
    if (p) p.selected = !p.selected
  }

  function selectAll() {
    products.value.forEach(p => { p.selected = true })
  }

  function deselectAll() {
    products.value.forEach(p => { p.selected = false })
  }

  function matchProducts() {
    products.value = [
      { id: 's1', name: '夏季凉感透气凉鞋', price: 79, score: 85, type: 'short-trend', image: '', description: '透气凉感材质', selected: false, status: 'pending' },
      { id: 's2', name: '便携式车载小风扇', price: 49, score: 92, type: 'short-hot', image: '', description: 'USB充电便携', selected: false, status: 'pending' },
      { id: 's3', name: '日式简约陶瓷杯', price: 35, score: 78, type: 'long-cycle', image: '', description: '简约设计', selected: false, status: 'pending' },
      { id: 's4', name: '儿童益智积木套装', price: 128, score: 88, type: 'long-cycle', image: '', description: '多年龄段适用', selected: false, status: 'pending' },
      { id: 's5', name: '防晒冰丝袖套', price: 19, score: 95, type: 'short-hot', image: '', description: '冰丝材质', selected: false, status: 'pending' },
      { id: 's6', name: '多功能桌面收纳盒', price: 42, score: 72, type: 'long-cycle', image: '', description: '桌面整理', selected: false, status: 'pending' },
      { id: 's7', name: '蓝牙无线耳机', price: 89, score: 90, type: 'short-hot', image: '', description: '蓝牙5.0', selected: false, status: 'pending' },
      { id: 's8', name: '硅胶厨具五件套', price: 56, score: 82, type: 'long-cycle', image: '', description: '食品级硅胶', selected: false, status: 'pending' },
      { id: 's9', name: '运动速干T恤', price: 45, score: 76, type: 'short-trend', image: '', description: '速干透气', selected: false, status: 'pending' },
      { id: 's10', name: '智能体重秤', price: 68, score: 84, type: 'long-cycle', image: '', description: '精准称重', selected: false, status: 'pending' },
      { id: 's11', name: '迷你加湿器', price: 39, score: 87, type: 'short-hot', image: '', description: 'USB供电', selected: false, status: 'pending' },
      { id: 's12', name: '厨房置物架', price: 75, score: 73, type: 'long-cycle', image: '', description: '多层收纳', selected: false, status: 'pending' },
    ]
  }

  async function batchUpload() {
    isUploading.value = true
    uploadProgress.value = 0
    for (let i = 0; i <= 100; i += 10) {
      uploadProgress.value = i
      await new Promise(r => setTimeout(r, 200))
    }
    isUploading.value = false
    uploadProgress.value = 100
  }

  return { products, isUploading, uploadProgress, selectedCount, toggleSelect, selectAll, deselectAll, matchProducts, batchUpload }
})
