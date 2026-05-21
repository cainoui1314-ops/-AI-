<script setup lang="ts">
import { useChatStore } from '@/store/modules/chat'
import { useProductStore } from '@/store/modules/product'
import { storeToRefs } from 'pinia'
import { ref, nextTick, watch } from 'vue'
import type { Product } from '@/types'

const chatStore = useChatStore()
const productStore = useProductStore()
const { activeConversation } = storeToRefs(chatStore)
const scrollContainer = ref<HTMLElement | null>(null)

watch(
  () => activeConversation.value?.messages.length,
  () => {
    nextTick(() => {
      if (scrollContainer.value) {
        scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
      }
    })
  }
)

function formatContent(content: string) {
  return content.replace(/\n/g, '<br>')
}

function onProductClick(product: Product) {
  productStore.selectProduct(product)
  chatStore.addUserMessage(`我想了解「${product.name}」`)
  setTimeout(() => {
    const derivedQuestions = chatStore.getDerivedQuestions(product.name)
    chatStore.addAiMessage(
      `「${product.name}」是个不错的选择！🔥\n\n📊 快速数据\n• 爆品指数：${product.score}/100\n• 日销量：${product.sales}\n• 利润率：${product.detail.profitMargin}\n• 趋势：${product.detail.trend}\n\n点击右侧面板查看完整详情，或选择下方问题继续探索 👇`,
      undefined,
      derivedQuestions
    )
  }, 500)
}
</script>

<template>
  <div class="chat-messages" ref="scrollContainer">
    <template v-if="activeConversation" v-for="msg in activeConversation.messages" :key="msg.id">
      <div class="bubble-row" :class="msg.role">
        <div class="bubble-avatar">{{ msg.role === 'ai' ? '🤖' : '👤' }}</div>
        <div class="bubble-body">
          <div class="bubble-content" :class="msg.role" v-html="formatContent(msg.content)"></div>

          <div v-if="msg.products && msg.products.length" class="product-grid">
            <div
              v-for="product in msg.products"
              :key="product.id"
              class="product-card"
              @click="onProductClick(product)"
            >
              <div class="card-img">{{ product.name.slice(0, 2) }}</div>
              <div class="card-info">
                <div class="card-name">{{ product.name }}</div>
                <div class="card-meta">
                  <span class="card-price">¥{{ product.price }}</span>
                  <span class="card-score" :class="product.score >= 90 ? 'hot' : 'warm'">
                    {{ product.score }}分
                  </span>
                </div>
                <div class="card-bottom">
                  <span class="card-tag">{{ product.tag }}</span>
                  <span class="card-sales">{{ product.sales }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: var(--muted);
}
.welcome-icon { font-size: 56px; margin-bottom: 16px; }
.welcome h2 { font-size: 20px; color: var(--text); margin-bottom: 8px; font-weight: 600; }
.welcome p { font-size: 14px; }

.bubble-row {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  max-width: 720px;
}
.bubble-row.user { flex-direction: row-reverse; margin-left: auto; }
.bubble-row.ai { margin-right: auto; }

.bubble-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; flex-shrink: 0;
}
.bubble-row.ai .bubble-avatar { background: var(--blue-soft); }
.bubble-row.user .bubble-avatar { background: var(--blue); }

.bubble-body { max-width: calc(100% - 50px); }

.bubble-content {
  padding: 12px 16px;
  border-radius: var(--radius-lg);
  font-size: 14px;
  line-height: 1.7;
  word-break: break-word;
}
.bubble-content.ai {
  background: var(--surface);
  border: 1px solid var(--line);
  border-top-left-radius: 4px;
}
.bubble-content.user {
  background: var(--blue);
  color: #fff;
  border-top-right-radius: 4px;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 12px;
}

.product-card {
  display: flex;
  gap: 10px;
  padding: 12px;
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.15s;
}
.product-card:hover {
  border-color: var(--blue);
  box-shadow: 0 2px 8px rgba(79,110,247,0.12);
  transform: translateY(-1px);
}

.card-img {
  width: 52px; height: 52px; border-radius: 8px;
  background: var(--surface-2);
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; color: var(--soft); flex-shrink: 0;
}
.card-info { flex: 1; min-width: 0; }
.card-name {
  font-size: 13px; font-weight: 600; color: var(--text);
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.card-meta { display: flex; align-items: center; gap: 8px; margin: 4px 0; }
.card-price { font-size: 15px; font-weight: 700; color: var(--red); }
.card-score { font-size: 12px; font-weight: 600; }
.card-score.hot { color: var(--green); }
.card-score.warm { color: var(--amber); }
.card-bottom { display: flex; justify-content: space-between; align-items: center; }
.card-tag {
  font-size: 11px; padding: 1px 6px; border-radius: 4px;
  background: var(--blue-soft); color: var(--blue); font-weight: 500;
}
.card-sales { font-size: 11px; color: var(--muted); }
</style>
