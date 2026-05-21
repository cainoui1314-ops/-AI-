import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { YUEModel } from '@/types'

const STORAGE_KEY = 'yueji_settings'

const YUE_MODELS: YUEModel[] = [
  {
    id: 'yue-pro',
    name: 'YUE Pro',
    description: '深度推理·推荐',
    tag: '推荐',
    tokenMultiplier: 1.0,
    requiredPlan: 'free',
    icon: '🧠',
  },
  {
    id: 'yue-fast',
    name: 'YUE Fast',
    description: '快速响应',
    tag: '快速',
    tokenMultiplier: 0.5,
    requiredPlan: 'free',
    icon: '⚡',
  },
  {
    id: 'yue-ultra',
    name: 'YUE Ultra',
    description: '旗舰推理·专业版',
    tag: '旗舰',
    tokenMultiplier: 2.0,
    requiredPlan: 'pro',
    icon: '💎',
  },
  {
    id: 'yue-auto',
    name: 'YUE Auto',
    description: '智能调度·专业版',
    tag: '智能',
    tokenMultiplier: 1.5,
    requiredPlan: 'pro',
    icon: '🎯',
  },
  {
    id: 'deepseek-chat',
    name: 'DeepSeek Chat',
    description: '免费·通用对话',
    tag: '免费',
    tokenMultiplier: 1.0,
    requiredPlan: 'free',
    icon: '🔮',
  },
  {
    id: 'deepseek-reasoner',
    name: 'DeepSeek Reasoner',
    description: '免费·深度推理',
    tag: '免费',
    tokenMultiplier: 1.5,
    requiredPlan: 'free',
    icon: '🔍',
  },
  {
    id: 'glm-4-flash',
    name: 'GLM-4 Flash',
    description: '免费·快速响应',
    tag: '免费',
    tokenMultiplier: 0.5,
    requiredPlan: 'free',
    icon: '💬',
  },
  {
    id: 'qwen-plus',
    name: 'Qwen Plus',
    description: '免费·通用对话',
    tag: '免费',
    tokenMultiplier: 1.0,
    requiredPlan: 'free',
    icon: '🌐',
  },
]

interface SettingsData {
  activeModelId: string
  quota: { total: number; used: number; resetDate: string }
  userName: string
  shopName: string
  plan: 'free' | 'pro' | 'enterprise'
  quotaType: 'count' | 'token'
  tokenBalance: number
}

function getDefaultSettings(): SettingsData {
  return {
    activeModelId: 'yue-pro',
    quota: { total: 100, used: 0, resetDate: getNextResetDate() },
    userName: '',
    shopName: '',
    plan: 'free',
    quotaType: 'count',
    tokenBalance: 0,
  }
}

function loadSettings(): SettingsData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      return { ...getDefaultSettings(), ...parsed }
    }
  } catch { /* empty */ }
  return getDefaultSettings()
}

function getNextResetDate(): string {
  const d = new Date()
  d.setMonth(d.getMonth() + 1)
  d.setDate(1)
  return d.toISOString().slice(0, 10)
}

export const useSettingsStore = defineStore('settings', () => {
  const data = ref<SettingsData>(loadSettings())

  const yueModels = computed(() => YUE_MODELS)
  const activeModel = computed(() => YUE_MODELS.find(m => m.id === data.value.activeModelId) || YUE_MODELS[0])
  const availableModels = computed(() => YUE_MODELS.filter(m => {
    const planLevel = { free: 0, pro: 1, enterprise: 2 }
    return planLevel[data.value.plan] >= planLevel[m.requiredPlan]
  }))
  const remaining = computed(() => {
    if (data.value.quotaType === 'token') {
      return data.value.tokenBalance
    }
    return data.value.quota.total - data.value.quota.used
  })
  const quotaLabel = computed(() => data.value.quotaType === 'token' ? 'Token' : '次')

  function setActiveModel(modelId: string) {
    const model = YUE_MODELS.find(m => m.id === modelId)
    if (model) {
      data.value.activeModelId = modelId
      saveToStorage()
    }
  }

  function useQuota(tokens?: number) {
    if (data.value.quotaType === 'token' && tokens) {
      data.value.tokenBalance = Math.max(0, data.value.tokenBalance - tokens)
    } else {
      data.value.quota.used++
    }
    saveToStorage()
  }

  function canUse(): boolean {
    if (data.value.quotaType === 'token') {
      return data.value.tokenBalance > 0
    }
    return data.value.quota.used < data.value.quota.total
  }

  function isPro(): boolean {
    return data.value.plan === 'pro' || data.value.plan === 'enterprise'
  }

  function updateProfile(userName: string, shopName: string) {
    data.value.userName = userName
    data.value.shopName = shopName
    saveToStorage()
  }

  function setPlan(plan: 'free' | 'pro' | 'enterprise') {
    data.value.plan = plan
    if (plan === 'pro' || plan === 'enterprise') {
      data.value.quotaType = 'token'
      data.value.tokenBalance = 500000
    } else {
      data.value.quotaType = 'count'
      data.value.quota = { total: 100, used: 0, resetDate: getNextResetDate() }
    }
    saveToStorage()
  }

  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data.value))
  }

  return {
    data,
    yueModels,
    activeModel,
    availableModels,
    remaining,
    quotaLabel,
    setActiveModel,
    useQuota,
    canUse,
    isPro,
    updateProfile,
    setPlan,
  }
})
