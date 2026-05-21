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

watch(
  () => activeConversation.value?.messages.map(m => m.content + (m.thinking ?? '') + (m.isStreaming ? '1' : '0')),
  () => {
    nextTick(() => {
      if (!scrollContainer.value) return
      const el = scrollContainer.value
      const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 180
      if (nearBottom) {
        el.scrollTop = el.scrollHeight
      }
    })
  },
  { deep: true }
)

function formatContent(content: string) {
  return content.replace(/\n/g, '<br>')
}

function onProductClick(product: Product) {
  productStore.selectProduct(product)
  chatStore.addUserMessage(`我想了解「${product.name}」`)
  const derivedQuestions = chatStore.getDerivedQuestions(product.name)

  const msgId = chatStore.startStreamingMessage()
  const thinkingSteps = [
    `看了一下「${product.name}」的数据...`,
    '拉了爆品指数和同类对比',
    '利润空间和趋势都看了一遍',
    '整理好了',
  ]
  let i = 0
  const interval = setInterval(() => {
    if (i >= thinkingSteps.length) {
      clearInterval(interval)
      setTimeout(() => {
        const content = `嗯，「${product.name}」确实值得关注 🔥\n\n📊 快速数据\n• 爆品指数：${product.score}/100\n• 日销量：${product.sales}\n• 利润率：${product.detail.profitMargin}\n• 趋势：${product.detail.trend}\n\n点击右侧面板看完整详情，或者选个方向继续聊。`
        const chars = [...content]
        let j = 0
        const contentInterval = setInterval(() => {
          if (j >= chars.length) {
            clearInterval(contentInterval)
            chatStore.finishStreaming(msgId, undefined, derivedQuestions)
            return
          }
          const chunkSize = Math.random() > 0.85 ? 3 : Math.random() > 0.5 ? 2 : 1
          chatStore.appendStreamContent(msgId, chars.slice(j, j + chunkSize).join(''), 'content')
          j += chunkSize
        }, 20 + Math.random() * 25)
      }, 300)
      return
    }
    chatStore.appendStreamContent(msgId, (i === 0 ? '' : '\n') + thinkingSteps[i], 'thinking')
    i++
  }, 250 + Math.random() * 200)
}
</script>

<template>
  <div class="chat-messages" ref="scrollContainer">
    <template v-if="activeConversation" v-for="msg in activeConversation.messages" :key="msg.id">
      <div class="bubble-row" :class="msg.role">
        <div class="bubble-avatar">{{ msg.role === 'ai' ? '🤖' : '👤' }}</div>
        <div class="bubble-body">
          <div v-if="msg.thinking" class="thinking-block" :class="{ collapsed: !msg.isStreaming && msg.content }">
            <div class="thinking-header">
              <span class="thinking-icon">{{ msg.isStreaming ? '🧠' : '💭' }}</span>
              <span class="thinking-label">深度思考</span>
              <span v-if="msg.isStreaming" class="thinking-dots"><span>.</span><span>.</span><span>.</span></span>
            </div>
            <div class="thinking-text" v-html="formatContent(msg.thinking)"></div>
          </div>

          <div v-if="msg.content || msg.isStreaming" class="bubble-content" :class="msg.role">
            <span v-if="msg.content" v-html="formatContent(msg.content)"></span>
            <span v-if="msg.isStreaming && !msg.content" class="thinking-label" style="color: var(--muted);">正在组织回复...</span>
            <span v-if="msg.isStreaming" class="streaming-cursor">▌</span>
          </div>

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

.thinking-block {
  padding: 10px 14px;
  margin-bottom: 8px;
  border-radius: 10px;
  background: var(--surface-2);
  border: 1px solid var(--line);
  transition: all 0.3s ease;
}
.thinking-block.collapsed {
  max-height: 32px;
  overflow: hidden;
  opacity: 0.6;
  cursor: pointer;
}
.thinking-block.collapsed:hover {
  max-height: 500px;
  opacity: 1;
}
.thinking-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--muted);
  font-weight: 500;
}
.thinking-icon { font-size: 13px; }
.thinking-label { letter-spacing: 0.3px; }
.thinking-dots span {
  animation: dotPulse 1.4s infinite;
  opacity: 0;
}
.thinking-dots span:nth-child(1) { animation-delay: 0s; }
.thinking-dots span:nth-child(2) { animation-delay: 0.2s; }
.thinking-dots span:nth-child(3) { animation-delay: 0.4s; }
@keyframes dotPulse {
  0%, 60%, 100% { opacity: 0; }
  30% { opacity: 1; }
}
.thinking-text {
  font-size: 12px;
  color: var(--muted);
  line-height: 1.6;
  margin-top: 6px;
}

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

.streaming-cursor {
  color: var(--blue);
  animation: cursorBlink 0.8s step-end infinite;
  font-weight: 300;
  margin-left: 1px;
}
@keyframes cursorBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
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
