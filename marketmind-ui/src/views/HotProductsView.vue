<script setup lang="ts">
import { useProductStore } from '@/store/modules/product'
import { computed } from 'vue'

const productStore = useProductStore()
const products = computed(() => productStore.getSampleProducts())

function scoreColor(score: number) {
  if (score >= 90) return 'var(--green)'
  if (score >= 70) return 'var(--blue)'
  if (score >= 50) return 'var(--amber)'
  return 'var(--red)'
}

const gradients = [
  ['#667eea', '#764ba2'], ['#f093fb', '#f5576c'], ['#4facfe', '#00f2fe'],
  ['#43e97b', '#38f9d7'], ['#fa709a', '#fee140'], ['#a18cd1', '#fbc2eb'],
  ['#fccb90', '#d57eeb'], ['#e0c3fc', '#8ec5fc'], ['#f5576c', '#ff6a88'],
  ['#667eea', '#48c6ef'],
]

function productGradient(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  const idx = Math.abs(hash) % gradients.length
  return gradients[idx]
}

function selectProduct(product: any) {
  productStore.selectProduct(product)
}
</script>

<template>
  <div class="hot-products-page">
    <div class="page-header">
      <h2>爆款列表</h2>
      <p class="page-desc">类目热销品，分析流量结构，跟品或差异化竞争</p>
    </div>

    <div class="search-placeholder">
      <input class="search-input" placeholder="搜索商品名称..." disabled />
    </div>

    <div class="product-grid">
      <div
        v-for="product in products"
        :key="product.id"
        class="product-card"
        @click="selectProduct(product)"
      >
        <div class="card-image" :style="{ background: `linear-gradient(135deg, ${productGradient(product.name)[0]}, ${productGradient(product.name)[1]})` }">
          <span class="img-text">{{ product.name.slice(0, 2) }}</span>
          <span class="img-category">{{ product.detail.category }}</span>
          <div class="card-score-badge" :style="{ color: scoreColor(product.score) }">{{ product.score }}分</div>
        </div>
        <div class="card-body">
          <div class="card-title-row">
            <span class="card-tag">{{ product.tag }}</span>
          </div>
          <div class="card-name">{{ product.name }}</div>
          <div class="card-price">¥{{ product.price }}</div>
          <div class="card-stats">
            <span class="stat">{{ product.sales }}</span>
            <span class="stat">{{ product.detail.profitMargin }} 利润</span>
            <span class="stat trend">{{ product.detail.trend }}</span>
          </div>
          <div v-if="product.detail.traffic" class="card-traffic">
            <span class="traffic-main">主力：{{ product.detail.traffic[0].channel }} {{ product.detail.traffic[0].percent }}%</span>
          </div>
          <div class="card-hint">点击查看完整分析 →</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hot-products-page {
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
  max-width: 960px;
  margin: 0 auto;
  width: 100%;
}

.page-header { margin-bottom: 24px; }
.page-header h2 { font-size: 20px; font-weight: 700; color: var(--text); margin: 0 0 4px; }
.page-desc { font-size: 14px; color: var(--muted); margin: 0; }

.search-placeholder { margin-bottom: 20px; }
.search-input {
  width: 100%;
  max-width: 400px;
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid var(--line);
  background: var(--surface-2);
  font-size: 14px;
  color: var(--text);
  outline: none;
}
.search-input::placeholder { color: var(--soft); }

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 16px;
}

.product-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.15s;
  overflow: hidden;
}
.product-card:hover {
  border-color: var(--blue);
  box-shadow: 0 4px 12px rgba(79,110,247,0.1);
  transform: translateY(-2px);
}

.card-image {
  position: relative;
  width: 100%;
  height: 140px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 4px;
}
.img-text {
  font-size: 36px;
  font-weight: 700;
  color: rgba(255,255,255,0.9);
  text-shadow: 0 2px 8px rgba(0,0,0,0.15);
}
.img-category {
  font-size: 12px;
  color: rgba(255,255,255,0.7);
  font-weight: 500;
}
.card-score-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(255,255,255,0.95);
  padding: 2px 10px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 700;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.card-body {
  padding: 14px 16px 16px;
}

.card-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}
.card-tag {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  background: var(--blue-soft);
  color: var(--blue);
  font-weight: 500;
}

.card-name { font-size: 15px; font-weight: 600; color: var(--text); margin-bottom: 4px; }
.card-price { font-size: 18px; font-weight: 700; color: var(--red); margin-bottom: 8px; }

.card-stats {
  display: flex;
  gap: 12px;
  margin-bottom: 6px;
}
.stat { font-size: 12px; color: var(--muted); }
.stat.trend { color: var(--green); }

.card-traffic { margin-bottom: 6px; }
.traffic-main { font-size: 12px; color: var(--blue); font-weight: 500; }

.card-hint {
  font-size: 11px;
  color: var(--blue);
  opacity: 0;
  transition: opacity 0.15s;
}
.product-card:hover .card-hint { opacity: 1; }
</style>
