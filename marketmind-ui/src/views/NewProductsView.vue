<script setup lang="ts">
import { useProductStore } from '@/store/modules/product'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const productStore = useProductStore()
const router = useRouter()

const activeScene = ref<string | null>(null)
const activeFilters = ref<Record<string, string[]>>({})
const filters = productStore.getFilters()
const scenes = productStore.getScenes()

const products = computed(() => {
  let result = productStore.getNewProducts()
  if (activeScene.value) {
    result = productStore.filterByScene(activeScene.value)
  }
  const tagFilters = activeFilters.value
  for (const [, values] of Object.entries(tagFilters)) {
    if (values.length === 0) continue
    result = result.filter(p => {
      const tags = p.detail.newProductTags ?? []
      return values.some(v => tags.includes(v))
    })
  }
  return result
})

function toggleScene(id: string) {
  activeScene.value = activeScene.value === id ? null : id
}

function toggleTag(category: string, tag: string) {
  if (!activeFilters.value[category]) activeFilters.value[category] = []
  const arr = activeFilters.value[category]
  const idx = arr.indexOf(tag)
  if (idx >= 0) arr.splice(idx, 1)
  else arr.push(tag)
}

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
  <div class="new-products-page">
    <div class="page-header">
      <h2>新品发现</h2>
      <p class="page-desc">发现蓝海机会品，抢占市场先机</p>
    </div>

    <div class="scene-cards">
      <button
        v-for="scene in scenes"
        :key="scene.id"
        class="scene-card"
        :class="{ active: activeScene === scene.id }"
        @click="toggleScene(scene.id)"
      >
        <span class="scene-icon">{{ scene.icon }}</span>
        <span class="scene-name">{{ scene.name }}</span>
      </button>
    </div>

    <div class="filter-bar">
      <div v-for="filter in filters" :key="filter.label" class="filter-group">
        <span class="filter-label">{{ filter.label }}</span>
        <div class="filter-tags">
          <button
            v-for="opt in filter.options"
            :key="opt"
            class="filter-tag"
            :class="{ active: activeFilters[filter.label]?.includes(opt) }"
            @click="toggleTag(filter.label, opt)"
          >{{ opt }}</button>
        </div>
      </div>
    </div>

    <div class="product-grid">
      <div
        v-for="product in products"
        :key="product.id"
        class="product-card"
        @click="selectProduct(product)"
      >
        <div class="card-score" :style="{ color: scoreColor(product.score) }">{{ product.score }}</div>
        <div class="card-body">
          <div class="card-name">{{ product.name }}</div>
          <div class="card-meta">
            <span class="card-price">¥{{ product.price }}</span>
            <span class="card-tag">{{ product.tag }}</span>
          </div>
          <div class="card-tags" v-if="product.detail.newProductTags">
            <span v-for="t in product.detail.newProductTags!.slice(0, 3)" :key="t" class="card-mini-tag">{{ t }}</span>
          </div>
          <div class="card-hint">点击查看完整分析 →</div>
        </div>
      </div>
      <div v-if="products.length === 0" class="empty-state">
        没有匹配的商品，试试调整筛选条件
      </div>
    </div>
  </div>
</template>

<style scoped>
.new-products-page {
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

.scene-cards {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.scene-card {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border-radius: 20px;
  background: var(--surface-2);
  border: 1px solid var(--line);
  font-size: 13px;
  font-weight: 500;
  color: var(--text);
  transition: all 0.15s;
  white-space: nowrap;
}
.scene-card:hover { border-color: var(--blue); color: var(--blue); }
.scene-card.active { background: var(--blue-soft); border-color: var(--blue); color: var(--blue); }
.scene-icon { font-size: 15px; }

.filter-bar {
  margin-bottom: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}
.filter-group { display: flex; align-items: center; gap: 6px; }
.filter-label { font-size: 12px; color: var(--muted); font-weight: 500; white-space: nowrap; }
.filter-tags { display: flex; gap: 4px; flex-wrap: wrap; }
.filter-tag {
  padding: 3px 10px;
  border-radius: 12px;
  background: transparent;
  border: 1px solid var(--line);
  font-size: 12px;
  color: var(--muted);
  transition: all 0.15s;
}
.filter-tag:hover { border-color: var(--blue); color: var(--blue); }
.filter-tag.active { background: var(--blue-soft); border-color: var(--blue); color: var(--blue); }

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.product-card {
  position: relative;
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

.card-score {
  position: absolute;
  top: 12px;
  right: 14px;
  font-size: 22px;
  font-weight: 700;
}

.card-body { }
.card-name { font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 6px; padding-right: 40px; }
.card-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.card-price { font-size: 16px; font-weight: 700; color: var(--red); }
.card-tag {
  font-size: 11px;
  padding: 1px 8px;
  border-radius: 4px;
  background: var(--blue-soft);
  color: var(--blue);
  font-weight: 500;
}
.card-tags { display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 8px; }
.card-mini-tag {
  font-size: 11px;
  padding: 1px 6px;
  border-radius: 4px;
  background: var(--surface-2);
  color: var(--muted);
}
.card-hint {
  font-size: 11px;
  color: var(--blue);
  opacity: 0;
  transition: opacity 0.15s;
}
.product-card:hover .card-hint { opacity: 1; }

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  color: var(--muted);
  font-size: 14px;
}
</style>
