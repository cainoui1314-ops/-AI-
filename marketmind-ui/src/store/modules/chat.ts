import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { Conversation, ChatMessage, Product } from '@/types'

const STORAGE_KEY = 'yueji_conversations'

function loadConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveConversations(convs: Conversation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(convs))
}

export const useChatStore = defineStore('chat', () => {
  const conversations = ref<Conversation[]>(loadConversations())
  const activeConversationId = ref<string | null>(null)
  const activeConversation = ref<Conversation | null>(null)

  watch(conversations, (val) => saveConversations(val), { deep: true })

  const trendingProducts: Product[] = [
    {
      id: 'tp1', name: '冰袖防晒袖套', price: 29.9, image: '', score: 92,
      tag: '短期爆品', sales: '日销3,500+', platform: '抖音',
      detail: { category: '服饰配件', trend: '上升趋势', competition: '中等', profitMargin: '45%' },
      actionOptions: ['查看类似商品', '分析ROI', '立即上架'],
    },
    {
      id: 'tp2', name: '夏季冰丝凉感T恤', price: 49.9, image: '', score: 88,
      tag: '趋势品', sales: '日销2,100+', platform: '抖音',
      detail: { category: '男装', trend: '快速上升', competition: '较高', profitMargin: '38%' },
      actionOptions: ['查看类似商品', '分析ROI', '立即上架'],
    },
    {
      id: 'tp3', name: '便携挂脖风扇', price: 39.9, image: '', score: 85,
      tag: '应季品', sales: '日销1,800+', platform: '抖音',
      detail: { category: '数码配件', trend: '季节性上升', competition: '中等', profitMargin: '42%' },
      actionOptions: ['查看类似商品', '分析ROI', '立即上架'],
    },
    {
      id: 'tp4', name: '防晒霜SPF50+', price: 59.9, image: '', score: 90,
      tag: '长周期品', sales: '日销5,200+', platform: '抖音',
      detail: { category: '美妆护肤', trend: '稳定高位', competition: '激烈', profitMargin: '35%' },
      actionOptions: ['查看类似商品', '分析ROI', '立即上架'],
    },
  ]

  function createConversation(): Conversation {
    const conv: Conversation = {
      id: `conv-${Date.now()}`,
      title: '新对话',
      messages: [],
      activeSkill: null,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    conversations.value.unshift(conv)
    activeConversationId.value = conv.id
    activeConversation.value = conv

    conv.messages.push({
      id: `ai-greet-${Date.now()}`,
      role: 'ai',
      content: '你好！我是悦己AI，你的抖音电商运营智能体 🤖\n\n我可以帮你找爆品、分析数据、优化商品、一键上架。\n\n以下是今天为你推荐的热门爆品，点击感兴趣的商品开始探索 👇',
      timestamp: Date.now(),
      products: trendingProducts,
      guidedOptions: undefined,
    })

    return conv
  }

  function selectConversation(id: string) {
    const conv = conversations.value.find(c => c.id === id)
    if (conv) {
      activeConversationId.value = conv.id
      activeConversation.value = conv
    }
  }

  function deleteConversation(id: string) {
    conversations.value = conversations.value.filter(c => c.id !== id)
    if (activeConversationId.value === id) {
      const first = conversations.value[0]
      if (first) {
        selectConversation(first.id)
      } else {
        activeConversationId.value = null
        activeConversation.value = null
      }
    }
  }

  function addMessage(msg: ChatMessage) {
    if (!activeConversation.value) {
      createConversation()
    }
    activeConversation.value!.messages.push(msg)
    activeConversation.value!.updatedAt = Date.now()
    if (activeConversation.value!.title === '新对话' && msg.role === 'user') {
      activeConversation.value!.title = msg.content.slice(0, 20)
    }
  }

  function addAiMessage(content: string, products?: Product[], guidedOptions?: string[]) {
    addMessage({
      id: `ai-${Date.now()}`,
      role: 'ai',
      content,
      timestamp: Date.now(),
      products,
      guidedOptions,
    })
  }

  function startStreamingMessage(): string {
    if (!activeConversation.value) createConversation()
    const id = `ai-${Date.now()}`
    const msg: ChatMessage = {
      id,
      role: 'ai',
      content: '',
      timestamp: Date.now(),
      thinking: '',
      isStreaming: true,
    }
    activeConversation.value!.messages.push(msg)
    activeConversation.value!.updatedAt = Date.now()
    return id
  }

  function appendStreamContent(msgId: string, chunk: string, field: 'thinking' | 'content' = 'content') {
    if (!activeConversation.value) return
    const msg = activeConversation.value.messages.find(m => m.id === msgId)
    if (!msg) return
    if (field === 'thinking') {
      msg.thinking = (msg.thinking ?? '') + chunk
    } else {
      msg.content += chunk
    }
  }

  function finishStreaming(msgId: string, products?: Product[], guidedOptions?: string[]) {
    if (!activeConversation.value) return
    const msg = activeConversation.value.messages.find(m => m.id === msgId)
    if (!msg) return
    msg.isStreaming = false
    if (products) msg.products = products
    if (guidedOptions) msg.guidedOptions = guidedOptions
    if (activeConversation.value.title === '新对话') {
      activeConversation.value.title = msg.content.slice(0, 20)
    }
  }

  function addUserMessage(content: string) {
    addMessage({
      id: `user-${Date.now()}`,
      role: 'user',
      content,
      timestamp: Date.now(),
    })
  }

  function setActiveSkill(skillId: string | null) {
    if (activeConversation.value) {
      activeConversation.value.activeSkill = skillId
    }
  }

  function ensureConversation() {
    if (!activeConversation.value) {
      if (conversations.value.length > 0) {
        selectConversation(conversations.value[0].id)
      } else {
        createConversation()
      }
    }
  }

  function getDerivedQuestions(productName: string): string[] {
    const questionBank: Record<string, string[]> = {
      '冰袖': [`分析「冰袖」的ROI和利润空间`, `查看「冰袖」的竞品数据`, `找类似「冰袖」的应季商品`],
      'T恤': [`分析「凉感T恤」的市场趋势`, `优化「凉感T恤」的标题和主图`, `查看「凉感T恤」的竞品定价`],
      '风扇': [`分析「挂脖风扇」的季节性窗口`, `查看「挂脖风扇」的供应链`, `找类似「挂脖风扇」的数码爆品`],
      '防晒霜': [`分析「防晒霜」的品牌竞争格局`, `查看「防晒霜」的用户评价关键词`, `制定「防晒霜」的投放策略`],
    }
    for (const [keyword, questions] of Object.entries(questionBank)) {
      if (productName.includes(keyword)) return questions
    }
    return [`分析「${productName}」的ROI`, `查看「${productName}」的竞品`, `找类似「${productName}」的商品`]
  }

  return {
    conversations,
    activeConversationId,
    activeConversation,
    trendingProducts,
    createConversation,
    selectConversation,
    deleteConversation,
    addMessage,
    addAiMessage,
    addUserMessage,
    setActiveSkill,
    ensureConversation,
    getDerivedQuestions,
    startStreamingMessage,
    appendStreamContent,
    finishStreaming,
  }
})
