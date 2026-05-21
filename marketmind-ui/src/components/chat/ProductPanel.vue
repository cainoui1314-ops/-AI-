<script setup lang="ts">
import { useProductStore } from '@/store/modules/product'
import { useChatStore } from '@/store/modules/chat'
import { storeToRefs } from 'pinia'

const productStore = useProductStore()
const chatStore = useChatStore()
const { selectedProduct, showPanel } = storeToRefs(productStore)

function onAction(action: string) {
  if (!selectedProduct.value) return
  chatStore.addUserMessage(`${action}：${selectedProduct.value.name}`)
  setTimeout(() => {
    chatStore.addAiMessage(
      `关于「${selectedProduct.value!.name}」的${action}：\n\n正在分析中...\n\n初步结果：\n• 该商品市场表现良好\n• 建议关注竞品定价策略\n• 预计操作后收益提升15-20%\n\n需要我详细展开吗？`,
      undefined,
      ['查看详细数据', '立即执行', '对比其他商品']
    )
  }, 600)
}
</script>

<template>
  <transition name="slide">
    <aside v-if="showPanel && selectedProduct" class="product-panel">
      <div class="panel-header">
        <h3>商品详情</h3>
        <button class="close-btn" @click="productStore.closePanel()">×</button>
      </div>

      <div class="panel-body">
        <div class="product-hero">
          <div class="hero-img">{{ selectedProduct.name.slice(0, 2) }}</div>
          <div class="hero-info">
            <div class="hero-name">{{ selectedProduct.name }}</div>
            <div class="hero-price">¥{{ selectedProduct.price }}</div>
            <div class="hero-meta">
              <span class="hero-tag">{{ selectedProduct.tag }}</span>
              <span class="hero-sales">{{ selectedProduct.sales }}</span>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <h4>商品数据</h4>
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">平台</span>
              <span class="detail-value">{{ selectedProduct.platform }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">类目</span>
              <span class="detail-value">{{ selectedProduct.detail.category }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">趋势</span>
              <span class="detail-value green">{{ selectedProduct.detail.trend }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">竞争度</span>
              <span class="detail-value">{{ selectedProduct.detail.competition }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">利润率</span>
              <span class="detail-value highlight">{{ selectedProduct.detail.profitMargin }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">爆品分</span>
              <span class="detail-value highlight">{{ selectedProduct.score }}/100</span>
            </div>
          </div>
        </div>

        <div class="detail-section">
          <h4>快捷操作</h4>
          <div class="action-list">
            <button
              v-for="action in selectedProduct.actionOptions"
              :key="action"
              class="action-btn"
              @click="onAction(action)"
            >{{ action }}</button>
          </div>
        </div>
      </div>
    </aside>
  </transition>
</template>

<style scoped>
.product-panel {
  position: fixed;
  right: 0;
  top: 0;
  width: 380px;
  height: 100vh;
  background: var(--surface);
  border-left: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  z-index: 100;
  box-shadow: -4px 0 16px rgba(0,0,0,0.06);
}

.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from, .slide-leave-to {
  transform: translateX(100%);
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--line);
}
.panel-header h3 { font-size: 16px; font-weight: 600; margin: 0; }
.close-btn {
  width: 28px; height: 28px; border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; color: var(--muted);
}
.close-btn:hover { background: var(--surface-2); color: var(--text); }

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.product-hero {
  display: flex;
  gap: 14px;
  margin-bottom: 24px;
}
.hero-img {
  width: 80px; height: 80px; border-radius: var(--radius);
  background: var(--surface-2);
  display: flex; align-items: center; justify-content: center;
  font-size: 24px; color: var(--soft); flex-shrink: 0;
}
.hero-info { flex: 1; }
.hero-name { font-size: 15px; font-weight: 600; color: var(--ink); margin-bottom: 4px; }
.hero-price { font-size: 22px; font-weight: 700; color: var(--red); margin-bottom: 6px; }
.hero-meta { display: flex; align-items: center; gap: 8px; }
.hero-tag {
  font-size: 11px; padding: 2px 8px; border-radius: 4px;
  background: var(--blue-soft); color: var(--blue); font-weight: 500;
}
.hero-sales { font-size: 12px; color: var(--muted); }

.detail-section {
  margin-bottom: 24px;
}
.detail-section h4 {
  font-size: 13px; font-weight: 600; color: var(--muted);
  text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.detail-item {
  padding: 10px 12px;
  background: var(--surface-2);
  border-radius: var(--radius-sm);
}
.detail-label { display: block; font-size: 11px; color: var(--muted); margin-bottom: 2px; }
.detail-value { font-size: 14px; font-weight: 500; color: var(--text); }
.detail-value.green { color: var(--green); }
.detail-value.highlight { color: var(--blue); font-weight: 600; }

.action-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.action-btn {
  width: 100%;
  padding: 10px 16px;
  border-radius: var(--radius-sm);
  background: var(--blue-soft);
  color: var(--blue);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.15s;
  border: 1px solid transparent;
}
.action-btn:hover {
  background: var(--blue);
  color: #fff;
}
</style>
