<script setup lang="ts">
import { ref } from 'vue'
import { ElNotification } from 'element-plus'
import { useSupplyStore } from '@/store/modules/nova/supply'
import { useSelectionStore } from '@/store/modules/nova/selection'
import { storeToRefs } from 'pinia'

const supplyStore = useSupplyStore()
const selectionStore = useSelectionStore()
const { products, supplierMap, selectedSuppliers, orderProgress } = storeToRefs(supplyStore)

const showProgress = ref(false)
const hasMatched = ref(false)
const filterRating = ref('')
const filterDelivery = ref('')

function matchSupply() {
  if (selectionStore.products.length === 0) {
    selectionStore.matchProducts()
    selectionStore.selectAll()
  }
  supplyStore.setProducts(selectionStore.products)
  supplyStore.matchSupply()
  hasMatched.value = true
}

function qualityLabel(q: string) {
  const map: Record<string, string> = { premium: '优质', standard: '标准', basic: '经济' }
  return map[q] || q
}

function qualityType(q: string) {
  const map: Record<string, string> = { premium: 'success', standard: '', basic: 'info' }
  return map[q] || 'info'
}

async function handleBatchOrder() {
  showProgress.value = true
  await supplyStore.batchOrder()
  showProgress.value = false
  ElNotification({ title: '下单完成', message: '已向供应商批量下单', type: 'success' })
}
</script>

<template>
  <div class="nova-supply">
    <div class="page-header">
      <h2>一键货源</h2>
      <p>自动匹配最优供应商，一键批量下单</p>
    </div>

    <div v-if="!hasMatched" class="match-section">
      <div class="match-card">
        <div class="match-icon">📦</div>
        <h3>匹配最优货源</h3>
        <p>基于已选商品自动匹配1688、拼多多等平台供应商</p>
        <el-button type="primary" size="large" @click="matchSupply">开始匹配货源</el-button>
      </div>
    </div>

    <template v-else>
      <div class="filter-bar">
        <el-select v-model="filterRating" placeholder="评分筛选" clearable style="width: 150px">
          <el-option label="4.5+" value="4.5" />
          <el-option label="4.0+" value="4.0" />
        </el-select>
        <el-select v-model="filterDelivery" placeholder="时效筛选" clearable style="width: 150px">
          <el-option label="1-2天" value="fast" />
          <el-option label="3-5天" value="normal" />
        </el-select>
        <el-button type="primary" style="margin-left: auto" :disabled="Object.keys(selectedSuppliers).length === 0" @click="handleBatchOrder">一键下单</el-button>
      </div>

      <div v-for="product in products" :key="product.id" class="supply-group">
        <h4 class="group-title">{{ product.name }} (¥{{ product.price }})</h4>
        <el-row :gutter="16">
          <el-col :span="8" v-for="sup in (supplierMap[product.id] || [])" :key="sup.id">
            <div class="supplier-card" :class="{ selected: selectedSuppliers[product.id] === sup.id }" @click="supplyStore.selectSupplier(product.id, sup.id)">
              <div class="sup-platform">
                <span class="platform-icon">🏪</span>
                <span>{{ sup.platform }}</span>
              </div>
              <h5>{{ sup.name }}</h5>
              <div class="sup-price">¥{{ sup.price }}</div>
              <div class="sup-meta">
                <el-rate :model-value="sup.rating" disabled :size="12" />
                <span class="sup-delivery">{{ sup.deliveryTime }}</span>
              </div>
              <div class="sup-profit">
                <span>利润</span>
                <span class="profit-value">+¥{{ sup.profit }}</span>
              </div>
              <el-tag :type="qualityType(sup.quality)" size="small">{{ qualityLabel(sup.quality) }}</el-tag>
              <el-button type="primary" size="small" class="sup-btn">选择</el-button>
            </div>
          </el-col>
        </el-row>
      </div>

      <el-dialog v-model="showProgress" title="正在下单..." width="400px" :close-on-click-modal="false" :show-close="false">
        <el-progress :percentage="orderProgress" :stroke-width="12" />
        <p style="text-align: center; margin-top: 12px; color: var(--muted)">正在向供应商提交订单...</p>
      </el-dialog>
    </template>
  </div>
</template>

<style scoped>
.nova-supply { padding: 24px; }
.page-header { margin-bottom: 24px; }
.page-header h2 { font-size: 24px; font-weight: 700; margin: 0 0 4px; }
.page-header p { color: var(--muted); margin: 0; }
.match-section { display: flex; justify-content: center; padding: 64px 0; }
.match-card {
  background: var(--surface); border: 1px solid var(--line); border-radius: 16px;
  padding: 48px; text-align: center; max-width: 400px;
}
.match-icon { font-size: 56px; margin-bottom: 16px; }
.match-card h3 { margin: 0 0 8px; }
.match-card p { color: var(--muted); margin: 0 0 24px; }
.filter-bar { display: flex; gap: 12px; margin-bottom: 24px; align-items: center; }
.supply-group { margin-bottom: 32px; }
.group-title { font-size: 16px; margin: 0 0 12px; padding-bottom: 8px; border-bottom: 1px solid var(--line); }
.supplier-card {
  background: var(--surface); border: 2px solid var(--line); border-radius: 12px;
  padding: 16px; cursor: pointer; transition: all 0.15s; margin-bottom: 12px;
}
.supplier-card.selected { border-color: var(--blue, #246bfe); background: var(--blue-soft, #e8f0ff); }
.sup-platform { display: flex; align-items: center; gap: 4px; font-size: 13px; color: var(--muted); margin-bottom: 8px; }
.platform-icon { font-size: 16px; }
.supplier-card h5 { margin: 0 0 8px; font-size: 15px; }
.sup-price { font-size: 20px; font-weight: 700; color: #c43d3d; margin-bottom: 8px; }
.sup-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.sup-delivery { font-size: 12px; color: var(--muted); }
.sup-profit { display: flex; justify-content: space-between; margin-bottom: 8px; }
.profit-value { font-weight: 600; color: #138a5b; }
.sup-btn { width: 100%; margin-top: 8px; }
</style>
