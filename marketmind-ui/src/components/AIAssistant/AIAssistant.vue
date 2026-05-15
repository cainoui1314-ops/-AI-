<script setup lang="ts">
import { ref, reactive } from 'vue'
import type { ChatMessage } from '@/types'

const isOpen = ref(false)
const inputText = ref('')
const messages = reactive<ChatMessage[]>([
  { id: '1', role: 'ai', content: '你好！我是 MarketMind AI 助手，有什么可以帮助你的吗？', timestamp: Date.now() },
])

const quickQuestions = [
  '今天有什么爆品推荐？',
  '帮我分析一下竞品情况',
  '哪些商品需要优化？',
  '全店维护建议',
]

function toggleChat() {
  isOpen.value = !isOpen.value
}

function sendMessage(text?: string) {
  const content = text || inputText.value.trim()
  if (!content) return

  messages.push({ id: String(Date.now()), role: 'user', content, timestamp: Date.now() })
  inputText.value = ''

  setTimeout(() => {
    const replies: Record<string, string> = {
      '爆品': '根据当前市场趋势，以下商品具有爆品潜力：\n1. 夏季凉感透气凉鞋 - 爆品分数95\n2. 防晒冰丝袖套 - 搜索量周增320%\n3. 便携式车载小风扇 - 好评率99.2%',
      '竞品': '竞品分析报告：\n• 同类商品平均价格 ¥65，您有价格优势\n• TOP3竞品均使用"冰丝"关键词\n• 建议优化主图突出材质差异',
      '优化': '以下商品需要优化：\n1. 日式简约陶瓷杯 - 标题缺少热搜词\n2. 便携式车载小风扇 - 价格偏高15%\n3. 儿童益智积木套装 - 投流ROI低于1.5',
      '维护': '全店维护建议：\n• 3个商品标题需要更新（优先级高）\n• 2个商品价格需调整\n• 1个商品投流策略需优化\n预计执行后增收 ¥1,200',
    }

    let reply = '收到你的问题，我正在分析中...'
    for (const [key, val] of Object.entries(replies)) {
      if (content.includes(key)) { reply = val; break }
    }

    messages.push({ id: String(Date.now() + 1), role: 'ai', content: reply, timestamp: Date.now() })
  }, 800)
}
</script>

<template>
  <div class="ai-assistant">
    <transition name="chat-fade">
      <div v-if="isOpen" class="chat-panel">
        <div class="chat-header">
          <div class="header-info">
            <span class="header-icon">🤖</span>
            <div>
              <h4>AI 智能助手</h4>
              <span class="header-status">在线</span>
            </div>
          </div>
          <button class="close-btn" @click="toggleChat">✕</button>
        </div>

        <div class="chat-messages">
          <div v-for="msg in messages" :key="msg.id" class="message" :class="msg.role">
            <div class="msg-avatar">{{ msg.role === 'ai' ? '🤖' : '👤' }}</div>
            <div class="msg-content">
              <p style="white-space: pre-line">{{ msg.content }}</p>
            </div>
          </div>
        </div>

        <div v-if="messages.length <= 1" class="quick-questions">
          <button v-for="q in quickQuestions" :key="q" class="quick-btn" @click="sendMessage(q)">{{ q }}</button>
        </div>

        <div class="chat-input">
          <input
            v-model="inputText"
            placeholder="输入你的问题..."
            @keyup.enter="sendMessage()"
          />
          <button class="send-btn" @click="sendMessage()">发送</button>
        </div>
      </div>
    </transition>

    <button class="fab-btn" :class="{ active: isOpen }" @click="toggleChat">
      <span v-if="!isOpen" class="fab-icon">💬</span>
      <span v-else class="fab-icon">✕</span>
    </button>
  </div>
</template>

<style scoped>
.ai-assistant {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
}
.chat-panel {
  position: absolute;
  bottom: 64px;
  right: 0;
  width: 380px;
  height: 520px;
  background: var(--surface, #fff);
  border: 1px solid var(--line, #d9e0e8);
  border-radius: 16px;
  box-shadow: 0 16px 48px rgba(15, 23, 42, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: #101820;
  color: #fff;
}
.header-info {
  display: flex;
  align-items: center;
  gap: 10px;
}
.header-icon { font-size: 24px; }
.chat-header h4 { margin: 0; font-size: 15px; }
.header-status { font-size: 12px; color: #34d399; }
.close-btn {
  background: none; border: none; color: #fff; font-size: 16px;
  cursor: pointer; padding: 4px 8px; border-radius: 4px;
}
.close-btn:hover { background: rgba(255,255,255,0.1); }
.chat-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.message {
  display: flex;
  gap: 8px;
  max-width: 85%;
}
.message.ai { align-self: flex-start; }
.message.user { align-self: flex-end; flex-direction: row-reverse; }
.msg-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; flex-shrink: 0;
}
.message.user .msg-avatar { background: var(--blue-soft, #e8f0ff); }
.message.ai .msg-avatar { background: var(--surface-2, #eef2f6); }
.msg-content {
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.5;
}
.message.ai .msg-content { background: var(--surface-2, #eef2f6); color: var(--text, #17202a); }
.message.user .msg-content { background: var(--blue, #246bfe); color: #fff; }
.quick-questions {
  padding: 0 16px 8px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.quick-btn {
  padding: 6px 12px;
  border: 1px solid var(--line, #d9e0e8);
  border-radius: 20px;
  background: var(--surface, #fff);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.15s;
}
.quick-btn:hover { background: var(--blue-soft, #e8f0ff); border-color: var(--blue, #246bfe); }
.chat-input {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--line, #d9e0e8);
}
.chat-input input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid var(--line, #d9e0e8);
  border-radius: 8px;
  font-size: 14px;
  outline: none;
}
.chat-input input:focus { border-color: var(--blue, #246bfe); }
.send-btn {
  padding: 8px 16px;
  background: var(--blue, #246bfe);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
}
.send-btn:hover { opacity: 0.9; }
.fab-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background: var(--blue, #246bfe);
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(36, 107, 254, 0.4);
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.fab-btn:hover { transform: scale(1.08); box-shadow: 0 6px 20px rgba(36, 107, 254, 0.5); }
.fab-btn.active { background: #c43d3d; }
.chat-fade-enter-active, .chat-fade-leave-active { transition: all 0.25s ease; }
.chat-fade-enter-from, .chat-fade-leave-to { opacity: 0; transform: translateY(20px) scale(0.95); }
</style>
