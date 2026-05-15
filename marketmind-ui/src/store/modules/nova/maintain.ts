import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { MaintenanceItem } from '@/types'

export const useMaintainStore = defineStore('nova-maintain', () => {
  const maintenanceItems = ref<MaintenanceItem[]>([])
  const executeProgress = ref(0)
  const schedule = ref({
    enabled: false,
    frequency: 'weekly' as 'daily' | 'weekly' | 'monthly',
    time: '10:00',
    contents: ['title', 'price', 'ad'] as string[],
  })

  const selectedCount = computed(() => maintenanceItems.value.filter(i => i.selected).length)
  const totalExpectedRevenue = computed(() => maintenanceItems.value.filter(i => i.selected).reduce((sum, i) => sum + i.expectedRevenue, 0))

  function toggleItem(id: string) {
    const item = maintenanceItems.value.find(i => i.id === id)
    if (item) item.selected = !item.selected
  }

  function selectAll() {
    maintenanceItems.value.forEach(i => { i.selected = true })
  }

  function selectByPriority(priority: 'high' | 'medium' | 'low') {
    maintenanceItems.value.forEach(i => { i.selected = i.priority === priority })
  }

  function diagnose() {
    maintenanceItems.value = [
      { id: 'm1', productId: '1', productName: '夏季凉感透气凉鞋', productImage: '', type: 'title', typeName: '标题优化', priority: 'high', expectedRevenue: 350, description: '标题缺少热搜词，建议添加"夏季""透气"等关键词', selected: true },
      { id: 'm2', productId: '2', productName: '便携式车载小风扇', productImage: '', type: 'price', typeName: '价格调整', priority: 'high', expectedRevenue: 280, description: '当前价格高于同类竞品15%，建议降价至¥42', selected: true },
      { id: 'm3', productId: '3', productName: '日式简约陶瓷杯', productImage: '', type: 'ad', typeName: '投流优化', priority: 'high', expectedRevenue: 420, description: 'ROI低于1.5，建议调整投放策略', selected: true },
      { id: 'm4', productId: '4', productName: '儿童益智积木套装', productImage: '', type: 'title', typeName: '标题优化', priority: 'medium', expectedRevenue: 180, description: '标题可添加年龄段标签', selected: false },
      { id: 'm5', productId: '5', productName: '防晒冰丝袖套', productImage: '', type: 'price', typeName: '价格调整', priority: 'medium', expectedRevenue: 150, description: '建议配合活动设置促销价', selected: false },
      { id: 'm6', productId: '1', productName: '夏季凉感透气凉鞋', productImage: '', type: 'ad', typeName: '投流优化', priority: 'medium', expectedRevenue: 200, description: '点击率偏低，建议优化主图', selected: false },
      { id: 'm7', productId: '2', productName: '便携式车载小风扇', productImage: '', type: 'title', typeName: '标题优化', priority: 'low', expectedRevenue: 90, description: '可补充场景化描述词', selected: false },
      { id: 'm8', productId: '3', productName: '日式简约陶瓷杯', productImage: '', type: 'price', typeName: '价格调整', priority: 'low', expectedRevenue: 60, description: '价格稳定，暂无调整必要', selected: false },
    ]
  }

  async function executeMaintenance() {
    executeProgress.value = 0
    for (let i = 0; i <= 100; i += 5) {
      executeProgress.value = i
      await new Promise(r => setTimeout(r, 150))
    }
    executeProgress.value = 100
  }

  return { maintenanceItems, executeProgress, schedule, selectedCount, totalExpectedRevenue, toggleItem, selectAll, selectByPriority, diagnose, executeMaintenance }
})
