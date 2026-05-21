import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ModelProvider, QuotaInfo, AppSettings } from '@/types'

const STORAGE_KEY = 'yueji_settings'

const builtinProviders: ModelProvider[] = [
  {
    id: 'builtin-deepseek',
    name: 'DeepSeek (免费)',
    type: 'builtin',
    baseUrl: 'https://api.deepseek.com/v1',
    apiKey: '',
    models: [
      { id: 'deepseek-chat', name: 'DeepSeek Chat', description: '通用对话模型' },
      { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner', description: '深度推理模型' },
    ],
  },
  {
    id: 'builtin-glm',
    name: '智谱GLM (免费)',
    type: 'builtin',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    apiKey: '',
    models: [
      { id: 'glm-4-flash', name: 'GLM-4 Flash', description: '快速响应' },
      { id: 'glm-4-plus', name: 'GLM-4 Plus', description: '增强推理' },
    ],
  },
  {
    id: 'builtin-qwen',
    name: '通义千问 (免费)',
    type: 'builtin',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    apiKey: '',
    models: [
      { id: 'qwen-plus', name: 'Qwen Plus', description: '通用对话' },
      { id: 'qwen-turbo', name: 'Qwen Turbo', description: '快速响应' },
    ],
  },
]

function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* empty */ }
  return {
    activeProviderId: 'builtin-deepseek',
    activeModelId: 'deepseek-chat',
    providers: builtinProviders,
    quota: { total: 100, used: 0, resetDate: getNextResetDate() },
    userName: '张店主',
    shopName: '抖音小店',
  }
}

function getNextResetDate(): string {
  const d = new Date()
  d.setMonth(d.getMonth() + 1)
  d.setDate(1)
  return d.toISOString().slice(0, 10)
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<AppSettings>(loadSettings())

  const quota = computed(() => settings.value.quota)
  const remaining = computed(() => settings.value.quota.total - settings.value.quota.used)
  const activeProvider = computed(() =>
    settings.value.providers.find(p => p.id === settings.value.activeProviderId)
  )
  const activeModel = computed(() =>
    activeProvider.value?.models.find(m => m.id === settings.value.activeModelId)
  )

  function useQuota() {
    settings.value.quota.used++
    saveToStorage()
  }

  function canUse(): boolean {
    if (settings.value.quota.used >= settings.value.quota.total) return false
    return true
  }

  function setActiveModel(providerId: string, modelId: string) {
    settings.value.activeProviderId = providerId
    settings.value.activeModelId = modelId
    saveToStorage()
  }

  function addCustomProvider(provider: ModelProvider) {
    settings.value.providers.push(provider)
    saveToStorage()
  }

  function removeCustomProvider(id: string) {
    settings.value.providers = settings.value.providers.filter(p => p.id !== id)
    if (settings.value.activeProviderId === id) {
      settings.value.activeProviderId = 'builtin-deepseek'
      settings.value.activeModelId = 'deepseek-chat'
    }
    saveToStorage()
  }

  function updateProfile(userName: string, shopName: string) {
    settings.value.userName = userName
    settings.value.shopName = shopName
    saveToStorage()
  }

  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings.value))
  }

  return {
    settings,
    quota,
    remaining,
    activeProvider,
    activeModel,
    useQuota,
    canUse,
    setActiveModel,
    addCustomProvider,
    removeCustomProvider,
    updateProfile,
  }
})
