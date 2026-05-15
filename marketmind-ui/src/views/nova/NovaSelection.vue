<script setup lang="ts">
import { ref } from 'vue'
import { ElNotification } from 'element-plus'
import { useSelectionStore } from '@/store/modules/nova/selection'
import { useAuthStore } from '@/store/modules/nova/auth'
import { storeToRefs } from 'pinia'

const authStore = useAuthStore()
const selectionStore = useSelectionStore()
const { products, isUploading, uploadProgress, selectedCount } = storeToRefs(selectionStore)
const { isAuthorized } = storeToRefs(authStore)

const showProgress = ref(false)
const hasLoaded = ref(false)

function typeLabel(type: string) {
  const map: Record<string, string> = { 'long-cycle': '长周期', 'short-hot': '短期爆品', 'short-trend': '短期趋势' }
  return map[type] || type
}

function typeTag(type: string) {
  const map: Record<string, string> = { 'long-cycle': 'success', 'short-hot': 'danger', 'short-trend': 'warning' }
  return map[type] || 'info'
}

async function loadProducts() {
  await authStore.authorizeShop()
  selectionStore.matchProducts()
  hasLoaded.value = true
}

async function handleBatchUpload() {
  showProgress.value = true
  await selectionStore.batchUpload()
  showProgress.value = false
  ElNotification({ title: '上架完成', message: `已成功上架 ${selectedCount.value} 个商品`, type: 'success' })
}
</script>

<template>
  <div class="nova-selection">
    <div class="page-header">
      <h2>一键选品</h2>
      <p>AI智能匹配全网爆品，一键批量上架</p>
    </div>

    <div v-if="!isAuthorized || !hasLoaded" class="auth-section">
      <div class="auth-card">
        <div class="auth-icon">🏪</div>
        <h3>授权店铺后开始选品</h3>
        <p>授权后将自动匹配适合您店铺的爆品</p>
        <el-button type="primary" size="large" @click="loadProducts">授权店铺并开始选品</el-button>
      </div>
    </div>

    <template v-else>
      <div class="batch-bar">
        <span class="batch-info">已选 {{ selectedCount }}/{{ products.length }} 个商品</span>
        <el-button @click="selectionStore.selectAll()">全选</el-button>
        <el-button @click="selectionStore.deselectAll()">取消</el-button>
        <el-button type="primary" :disabled="selectedCount === 0" @click="handleBatchUpload">一键上架</el-button>
      </div>

      <el-row :gutter="16">
        <el-col :span="8" v-for="product in products" :key="product.id">
          <div class="product-card" :class="{ selected: product.selected }" @click="selectionStore.toggleSelect(product.id)">
            <div class="card-check">
              <el-checkbox :model-value="product.selected" @click.stop />
            </div>
            <div class="card-image">
              <span>{{ product.name.slice(0, 2) }}</span>
            </div>
            <h4 class="card-name">{{ product.name }}</h4>
            <div class="card-price">¥{{ product.price }}</div>
            <el-progress :percentage="product.score" :stroke-width="6" style="margin-bottom: 8px" />
            <el-tag :type="typeTag(product.type)" size="small">{{ typeLabel(product.type) }}</el-tag>
          </div>
        </el-col>
      </el-row>

      <el-dialog v-model="showProgress" title="正在上架..." width="400px" :close-on-click-modal="false" :show-close="false">
        <el-progress :percentage="uploadProgress" :stroke-width="12" />
        <p style="text-align: center; margin-top: 12px; color: var(--muted)">请稍候，正在批量上架商品...</p>
      </el-dialog>
    </template>
  </div>
</template>

<style scoped>
.nova-selection { padding: 24px; }
.page-header { margin-bottom: 24px; }
.page-header h2 { font-size: 24px; font-weight: 700; margin: 0 0 4px; }
.page-header p { color: var(--muted); margin: 0; }
.auth-section { display: flex; justify-content: center; padding: 64px 0; }
.auth-card {
  background: var(--surface); border: 1px solid var(--line); border-radius: 16px;
  padding: 48px; text-align: center; max-width: 400px;
}
.auth-icon { font-size: 56px; margin-bottom: 16px; }
.auth-card h3 { margin: 0 0 8px; }
.auth-card p { color: var(--muted); margin: 0 0 24px; }
.batch-bar {
  display: flex; align-items: center; gap: 12px; margin-bottom: 20px;
  padding: 12px 16px; background: var(--surface); border: 1px solid var(--line); border-radius: 8px;
}
.batch-info { font-weight: 600; margin-right: auto; }
.product-card {
  background: var(--surface); border: 2px solid var(--line); border-radius: 12px;
  padding: 16px; cursor: pointer; transition: all 0.15s; margin-bottom: 16px; position: relative;
}
.product-card.selected { border-color: var(--blue, #246bfe); background: var(--blue-soft, #e8f0ff); }
.product-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.06); }
.card-check { position: absolute; top: 8px; left: 8px; }
.card-image {
  width: 100%; height: 140px; background: var(--surface-2, #eef2f6); border-radius: 8px;
  display: flex; align-items: center; justify-content: center; font-size: 28px; color: var(--soft);
  margin: 8px 0 12px;
}
.card-name { font-size: 14px; margin: 0 0 4px; }
.card-price { font-size: 18px; font-weight: 700; color: #c43d3d; margin-bottom: 8px; }
</style>
