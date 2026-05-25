<script setup lang="ts">
import { useProductStore } from '@/store/modules/product'
import { useChatStore } from '@/store/modules/chat'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { productGradient, scoreColor } from '@/utils/product'

const productStore = useProductStore()
const chatStore = useChatStore()
const router = useRouter()

const products = computed(() => productStore.getMyProducts())
const categories = productStore.getMyCategories()
const { selectedIds, batchMode } = productStore

const activeCategory = ref('全部')
const sortBy = ref('score-desc')
const onlyAlerts = ref(false)

function hasAlerts(p: any): boolean {
  if (!p.detail.scores) return false
  return Object.values(p.detail.scores).some((d: any) => d.score < d.maxScore * 0.7)
}

const filtered = computed(() => {
  let list = products.value
  if (activeCategory.value !== '全部') {
    list = list.filter(p => p.detail.category === activeCategory.value)
  }
  if (onlyAlerts.value) {
    list = list.filter(p => hasAlerts(p))
  }
  const sortFns: Record<string, (a: any, b: any) => number> = {
    'score-desc': (a, b) => b.score - a.score,
    'score-asc': (a, b) => a.score - b.score,
    'price-desc': (a, b) => b.price - a.price,
    'price-asc': (a, b) => a.price - b.price,
    'margin-desc': (a, b) => parseInt(b.detail.profitMargin) - parseInt(a.detail.profitMargin),
  }
  const fn = sortFns[sortBy.value]
  if (fn) list = [...list].sort(fn)
  return list
})

const stats = computed(() => {
  const all = products.value
  const total = all.length
  const avgScore = total ? Math.round(all.reduce((s, p) => s + p.score, 0) / total) : 0
  const alertCount = all.filter(p => hasAlerts(p)).length
  const avgMargin = total ? Math.round(all.reduce((s, p) => s + parseInt(p.detail.profitMargin), 0) / total) : 0
  const best = all.reduce((a, b) => a.score > b.score ? a : b, all[0])
  const yesterdayGMV = all.reduce((s, p) => {
    const salesNum = parseInt(p.sales.replace(/[^0-9]/g, '')) || 100
    return s + p.price * salesNum
  }, 0)
  return { total, avgScore, alertCount, avgMargin, best, yesterdayGMV }
})

function parseSalesNumber(sales: string): number {
  return parseInt(sales.replace(/[^0-9]/g, '')) || 100
}

function formatGMV(val: number): string {
  if (val >= 10000) return (val / 10000).toFixed(1) + '万'
  return val.toFixed(0)
}

function handleCardClick(product: any) {
  if (batchMode.value) {
    productStore.toggleSelect(product.id)
  } else {
    productStore.selectProduct(product)
  }
}

function handleBatchCompare() {
  const ids = Array.from(selectedIds.value)
  const selected = products.value.filter(p => ids.includes(p.id))
  if (selected.length < 2) return
  chatStore.ensureConversation()
  const names = selected.map(p => p.name).join('、')
  chatStore.addUserMessage('批量对比商品：' + names)
  const msgId = chatStore.startStreamingMessage()
  const thinkChunks = ['正在分析多商品数据...', '对比各维度表现...', '生成对比报告...']
  let i = 0
  const timer = setInterval(() => {
    if (i < thinkChunks.length) {
      chatStore.appendStreamContent(msgId, thinkChunks[i], 'thinking')
      i++
    } else {
      clearInterval(timer)
      let content = '商品对比报告：\n\n'
      selected.forEach((p, idx) => {
        content += (idx + 1) + '. ' + p.name + '\n   评分：' + p.score + ' | 价格：¥' + p.price + ' | 利润率：' + p.detail.profitMargin + '\n'
        if (hasAlerts(p)) {
          const lowDims = Object.entries(p.detail.scores ?? {}).filter(([, d]: [string, any]) => d.score < d.maxScore * 0.7).map(([, d]: [string, any]) => d.label)
          content += '   预警维度：' + lowDims.join('、') + '\n'
        }
        content += '\n'
      })
      content += '建议优先优化评分最低的商品，提升整体店铺健康度。'
      chatStore.appendStreamContent(msgId, content)
      chatStore.finishStreaming(msgId, undefined, ['详细对比评分', '生成优化优先级', '导出对比报告'])
    }
  }, 400)
  productStore.toggleBatchMode()
}
</script>

<template>
  <div class="my-products-page">
    <div class="page-header">
      <div class="header-row">
        <div>
          <h2>商品列表</h2>
          <p class="page-desc">管理店铺商品，多维度分析，批量对比优化</p>
        </div>
        <div class="header-actions">
          <button class="back-btn" @click="router.push('/')">← 返回对话</button>
          <button class="batch-btn" :class="{ active: batchMode }" @click="productStore.toggleBatchMode()">
            {{ batchMode ? '退出多选' : '批量选择' }}
          </button>
        </div>
      </div>
    </div>

    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-value">{{ stats.total }}</div>
        <div class="stat-label">在售商品</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" :style="{ color: scoreColor(stats.avgScore) }">{{ stats.avgScore }}</div>
        <div class="stat-label">平均评分</div>
      </div>
      <div class="stat-card alert">
        <div class="stat-value">{{ stats.alertCount }}</div>
        <div class="stat-label">待优化</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ stats.avgMargin }}%</div>
        <div class="stat-label">平均利润率</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">¥{{ formatGMV(stats.yesterdayGMV) }}</div>
        <div class="stat-label">昨日GMV(估)</div>
      </div>
      <div class="stat-card">
        <div class="stat-value" :style="{ color: scoreColor(stats.best?.score ?? 0) }">{{ stats.best?.score ?? '-' }}</div>
        <div class="stat-label">最佳商品</div>
      </div>
    </div>

    <div class="filter-bar">
      <div class="filter-categories">
        <button
          v-for="cat in categories"
          :key="cat"
          :class="['cat-chip', { active: activeCategory === cat }]"
          @click="activeCategory = cat"
        >{{ cat }}</button>
      </div>
      <div class="filter-actions">
        <select v-model="sortBy" class="sort-select">
          <option value="score-desc">评分 高→低</option>
          <option value="score-asc">评分 低→高</option>
          <option value="price-desc">价格 高→低</option>
          <option value="price-asc">价格 低→高</option>
          <option value="margin-desc">利润率 高→低</option>
        </select>
        <button :class="['alert-toggle', { active: onlyAlerts }]" @click="onlyAlerts = !onlyAlerts">
          只看预警
        </button>
      </div>
    </div>

    <div v-if="batchMode && selectedIds.size > 0" class="batch-bar">
      <span class="batch-info">已选 {{ selectedIds.size }} 件商品</span>
      <button class="batch-action" @click="productStore.selectAll(filtered.map(p => p.id))">
        {{ filtered.every(p => selectedIds.has(p.id)) ? '取消全选' : '全选当前' }}
      </button>
      <button v-if="selectedIds.size >= 2" class="batch-action primary" @click="handleBatchCompare">
        对比分析
      </button>
      <button class="batch-action" @click="productStore.clearSelection()">清空</button>
    </div>

    <div class="product-grid">
      <div
        v-for="product in filtered"
        :key="product.id"
        class="product-card"
        :class="{ selected: selectedIds.has(product.id), 'has-alerts': hasAlerts(product) }"
        @click="handleCardClick(product)"
      >
        <div class="card-image" :style="{ background: `linear-gradient(135deg, ${productGradient(product.name)[0]}, ${productGradient(product.name)[1]})` }">
          <span class="img-text">{{ product.name.slice(0, 2) }}</span>
          <span class="img-category">{{ product.detail.category }}</span>
          <div class="card-score-badge" :style="{ color: scoreColor(product.score) }">{{ product.score }}分</div>
          <div v-if="hasAlerts(product) && !batchMode" class="alert-dot"></div>
          <div v-if="batchMode" class="checkbox" :class="{ checked: selectedIds.has(product.id) }">
            <span v-if="selectedIds.has(product.id)">✓</span>
          </div>
        </div>
        <div class="card-body">
          <div class="card-name">{{ product.name }}</div>
          <div class="card-meta">
            <span class="card-price">¥{{ product.price }}</span>
            <span class="card-tag">{{ product.tag }}</span>
          </div>
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
      <div v-if="filtered.length === 0" class="empty-state">
        没有匹配的商品，试试调整筛选条件
      </div>
    </div>
  </div>
</template>

<style scoped>
.my-products-page {
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
}

.page-header { margin-bottom: 20px; }
.header-row { display: flex; justify-content: space-between; align-items: flex-start; }
.header-actions { display: flex; gap: 8px; }
.back-btn {
  padding: 7px 16px;
  border-radius: 16px;
  background: var(--surface-2);
  border: 1px solid var(--line);
  font-size: 13px;
  color: var(--text);
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.back-btn:hover { border-color: var(--blue); color: var(--blue); }
.page-header h2 { font-size: 20px; font-weight: 700; color: var(--text); margin: 0 0 4px; }
.page-desc { font-size: 14px; color: var(--muted); margin: 0; }

.batch-btn {
  padding: 7px 16px;
  border-radius: 16px;
  background: var(--surface-2);
  border: 1px solid var(--line);
  font-size: 13px;
  color: var(--text);
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.batch-btn:hover { border-color: var(--blue); color: var(--blue); }
.batch-btn.active { background: var(--blue-soft); border-color: var(--blue); color: var(--blue); }

.stats-row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}
.stat-card {
  padding: 14px 16px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  text-align: center;
}
.stat-value {
  font-size: 22px;
  font-weight: 700;
  color: var(--text);
  line-height: 1.2;
}
.stat-label {
  font-size: 11px;
  color: var(--muted);
  margin-top: 4px;
}
.stat-card.alert .stat-value {
  color: #ef4444;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 12px;
  flex-wrap: wrap;
}
.filter-categories {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}
.cat-chip {
  padding: 5px 14px;
  border-radius: 14px;
  background: transparent;
  border: 1px solid var(--line);
  font-size: 12px;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}
.cat-chip:hover { border-color: var(--blue); color: var(--blue); }
.cat-chip.active { background: var(--blue-soft); border-color: var(--blue); color: var(--blue); font-weight: 500; }

.filter-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}
.sort-select {
  padding: 5px 12px;
  border-radius: 14px;
  border: 1px solid var(--line);
  background: var(--surface);
  font-size: 12px;
  color: var(--text);
  cursor: pointer;
  outline: none;
}
.sort-select:focus { border-color: var(--blue); }
.alert-toggle {
  padding: 5px 14px;
  border-radius: 14px;
  background: transparent;
  border: 1px solid var(--line);
  font-size: 12px;
  color: var(--muted);
  cursor: pointer;
  transition: all 0.15s;
}
.alert-toggle:hover { border-color: #ef4444; color: #ef4444; }
.alert-toggle.active { background: #fef2f2; border-color: #ef4444; color: #ef4444; font-weight: 500; }

.batch-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  background: var(--blue-soft);
  border-radius: var(--radius);
  margin-bottom: 16px;
}
.batch-info { font-size: 13px; color: var(--blue); font-weight: 500; }
.batch-action {
  padding: 5px 14px;
  border-radius: 12px;
  background: var(--surface);
  border: 1px solid var(--line);
  font-size: 12px;
  color: var(--text);
  cursor: pointer;
  transition: all 0.15s;
}
.batch-action:hover { border-color: var(--blue); color: var(--blue); }
.batch-action.primary {
  background: var(--blue);
  color: #fff;
  border-color: var(--blue);
}
.batch-action.primary:hover { opacity: 0.9; }

.product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
}

.product-card {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all 0.15s;
  overflow: hidden;
  position: relative;
}
.product-card:hover {
  border-color: var(--blue);
  box-shadow: 0 4px 12px rgba(79,110,247,0.1);
  transform: translateY(-2px);
}
.product-card.selected {
  border-color: var(--blue);
  box-shadow: 0 0 0 2px var(--blue-soft);
}
.product-card.has-alerts {
  border-left: 3px solid #ef4444;
}

.card-image {
  position: relative;
  width: 100%;
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 4px;
}
.img-text {
  font-size: 32px;
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
.alert-dot {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #ef4444;
  box-shadow: 0 0 0 3px rgba(239,68,68,0.2);
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0%, 100% { box-shadow: 0 0 0 3px rgba(239,68,68,0.2); }
  50% { box-shadow: 0 0 0 6px rgba(239,68,68,0.1); }
}
.checkbox {
  position: absolute;
  top: 8px;
  left: 8px;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: rgba(255,255,255,0.8);
  border: 2px solid rgba(0,0,0,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #fff;
  transition: all 0.15s;
}
.checkbox.checked {
  background: var(--blue);
  border-color: var(--blue);
}

.card-body { padding: 14px 16px 16px; }
.card-name { font-size: 14px; font-weight: 600; color: var(--text); margin-bottom: 6px; }
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
.card-stats {
  display: flex;
  gap: 10px;
  margin-bottom: 6px;
}
.stat { font-size: 12px; color: var(--muted); }
.stat.trend { color: #22c55e; }
.card-traffic { margin-bottom: 4px; }
.traffic-main { font-size: 12px; color: var(--blue); font-weight: 500; }

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
