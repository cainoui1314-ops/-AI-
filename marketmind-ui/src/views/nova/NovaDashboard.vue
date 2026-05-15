<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useDashboardStore } from '@/store/modules/nova/dashboard'
import { storeToRefs } from 'pinia'

const router = useRouter()
const store = useDashboardStore()
const { todayStats, recommendations } = storeToRefs(store)

const quickActions = [
  { icon: '🎯', title: '一键选品', desc: 'AI智能匹配爆品', route: '/nova/selection' },
  { icon: '📦', title: '一键货源', desc: '自动对接供应商', route: '/nova/supply' },
  { icon: '✨', title: '一键优化', desc: 'AI生成标题主图', route: '/nova/optimize' },
  { icon: '🔄', title: '一键维护', desc: '全店自动巡检', route: '/nova/maintain' },
]

function go(route: string) {
  router.push(route)
}

function typeLabel(type: string) {
  const map: Record<string, string> = { 'long-cycle': '长周期', 'short-hot': '短期爆品', 'short-trend': '短期趋势' }
  return map[type] || type
}

function typeTag(type: string) {
  const map: Record<string, string> = { 'long-cycle': 'success', 'short-hot': 'danger', 'short-trend': 'warning' }
  return map[type] || 'info'
}
</script>

<template>
  <div class="nova-dashboard">
    <div class="page-header">
      <h2>Nova 铺货管家</h2>
      <p>AI驱动的智能铺货系统，帮你高效管理多店铺运营</p>
    </div>

    <h3 class="section-title">快速操作</h3>
    <el-row :gutter="20" class="quick-actions">
      <el-col :span="6" v-for="action in quickActions" :key="action.route">
        <div class="action-card" @click="go(action.route)">
          <div class="action-icon">{{ action.icon }}</div>
          <h4>{{ action.title }}</h4>
          <p>{{ action.desc }}</p>
        </div>
      </el-col>
    </el-row>

    <h3 class="section-title">今日数据</h3>
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-number">{{ todayStats.selectionCount }}</div>
          <div class="stat-label">今日选品</div>
          <el-tag type="success" size="small">+15%↑</el-tag>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-number">{{ todayStats.supplyCount }}</div>
          <div class="stat-label">已对接货源</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-number">{{ todayStats.optimizeCount }}</div>
          <div class="stat-label">今日优化</div>
        </div>
      </el-col>
      <el-col :span="6">
        <div class="stat-card">
          <div class="stat-number">¥{{ todayStats.revenue.toLocaleString() }}</div>
          <div class="stat-label">今日增收</div>
          <el-tag type="success" size="small">+{{ todayStats.revenueGrowth }}%↑</el-tag>
        </div>
      </el-col>
    </el-row>

    <h3 class="section-title">推荐产品</h3>
    <el-row :gutter="16">
      <el-col :span="8" v-for="product in recommendations" :key="product.id">
        <div class="product-card">
          <div class="product-image">
            <span>{{ product.name.slice(0, 2) }}</span>
          </div>
          <h4 class="product-name">{{ product.name }}</h4>
          <div class="product-price">¥{{ product.price }}</div>
          <el-progress :percentage="product.score" :stroke-width="8" :color="product.score >= 90 ? '#138a5b' : product.score >= 80 ? '#246bfe' : '#b86b00'" />
          <div class="product-footer">
            <el-tag :type="typeTag(product.type)" size="small">{{ typeLabel(product.type) }}</el-tag>
            <el-button type="primary" size="small">一键选中</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.nova-dashboard { padding: 24px; }
.page-header { margin-bottom: 32px; }
.page-header h2 { font-size: 24px; font-weight: 700; margin: 0 0 4px; }
.page-header p { color: var(--muted); margin: 0; }
.section-title { font-size: 18px; font-weight: 600; margin: 24px 0 16px; }
.action-card {
  background: var(--surface); border: 1px solid var(--line); border-radius: 12px;
  padding: 20px; text-align: center; cursor: pointer; transition: all 0.2s;
}
.action-card:hover { transform: translateY(-4px); box-shadow: var(--shadow); }
.action-icon { font-size: 36px; margin-bottom: 8px; }
.action-card h4 { margin: 0 0 4px; font-size: 16px; }
.action-card p { margin: 0; font-size: 13px; color: var(--muted); }
.stat-card {
  background: var(--surface); border: 1px solid var(--line); border-radius: 12px;
  padding: 20px; text-align: center;
}
.stat-number { font-size: 28px; font-weight: 700; color: var(--ink); }
.stat-label { font-size: 13px; color: var(--muted); margin: 4px 0 8px; }
.product-card {
  background: var(--surface); border: 1px solid var(--line); border-radius: 12px;
  padding: 16px; margin-bottom: 16px;
}
.product-image {
  width: 100%; height: 160px; background: var(--surface-2, #eef2f6); border-radius: 8px;
  display: flex; align-items: center; justify-content: center; font-size: 32px; color: var(--soft);
  margin-bottom: 12px;
}
.product-name { font-size: 15px; margin: 0 0 4px; }
.product-price { font-size: 18px; font-weight: 700; color: #c43d3d; margin-bottom: 8px; }
.product-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 8px; }
</style>
