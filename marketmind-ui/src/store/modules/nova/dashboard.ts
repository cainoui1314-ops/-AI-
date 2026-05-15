import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { TodayStats, Product } from '@/types'

export const useDashboardStore = defineStore('nova-dashboard', () => {
  const todayStats = ref<TodayStats>({
    selectionCount: 38,
    supplyCount: 25,
    optimizeCount: 42,
    revenue: 1200,
    revenueGrowth: 18,
  })

  const recommendations = ref<Product[]>([
    { id: '1', name: '夏季凉感透气凉鞋', price: 79, score: 85, type: 'short-trend', image: '', description: '透气凉感材质，夏季爆款', selected: false, status: 'pending' },
    { id: '2', name: '便携式车载小风扇', price: 49, score: 92, type: 'short-hot', image: '', description: 'USB充电便携风扇', selected: false, status: 'pending' },
    { id: '3', name: '日式简约陶瓷杯', price: 35, score: 78, type: 'long-cycle', image: '', description: '简约设计，品质生活', selected: false, status: 'pending' },
    { id: '4', name: '儿童益智积木套装', price: 128, score: 88, type: 'long-cycle', image: '', description: '多年龄段适用', selected: false, status: 'pending' },
    { id: '5', name: '防晒冰丝袖套', price: 19, score: 95, type: 'short-hot', image: '', description: '冰丝材质，防晒降温', selected: false, status: 'pending' },
    { id: '6', name: '多功能桌面收纳盒', price: 42, score: 72, type: 'long-cycle', image: '', description: '桌面整理神器', selected: false, status: 'pending' },
  ])

  return { todayStats, recommendations }
})
