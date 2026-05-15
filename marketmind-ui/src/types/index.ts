// 商品类型
export interface Product {
  id: string
  name: string
  price: number
  score: number           // 爆品分数 0-100
  type: 'long-cycle' | 'short-hot' | 'short-trend'
  image: string
  description: string
  selected: boolean
  status: 'pending' | 'uploaded' | 'optimized'
}

// 供应商类型
export interface Supplier {
  id: string
  productId: string
  platform: string
  name: string
  price: number
  rating: number
  deliveryTime: string
  profit: number
  quality: 'premium' | 'standard' | 'basic'
}

// 优化结果类型
export interface OptimizationResult {
  productId: string
  title: { original: string; optimized: string }
  image: { original: string; optimized: string }
  detail: { original: string; optimized: string }
}

// 维护项类型
export interface MaintenanceItem {
  id: string
  productId: string
  productName: string
  productImage: string
  type: 'title' | 'price' | 'ad'
  typeName: string
  priority: 'high' | 'medium' | 'low'
  expectedRevenue: number
  description: string
  selected: boolean
}

// 今日统计类型
export interface TodayStats {
  selectionCount: number
  supplyCount: number
  optimizeCount: number
  revenue: number
  revenueGrowth: number
}

// AI消息类型
export interface ChatMessage {
  id: string
  role: 'user' | 'ai' | 'system'
  content: string
  timestamp: number
}

// 模式类型
export type AppMode = 'nova' | 'horizon'
