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
        <div class="card-top">
          <div class="card-score" :style="{ color: scoreColor(product.score) }">{{ product.score }}</div>
          <span class="card-tag">{{ product.tag }}</span>
        </div>
        <div class="card-body">
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
  padding: 16px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.15s;
}
.product-card:hover {
  border-color: var(--blue);
  box-shadow: 0 4px 12px rgba(79,110,247,0.1);
  transform: translateY(-2px);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.card-score { font-size: 24px; font-weight: 700; }
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
