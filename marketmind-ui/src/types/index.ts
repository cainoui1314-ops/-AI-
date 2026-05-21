export interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  content: string
  timestamp: number
  products?: Product[]
  guidedOptions?: string[]
}

export interface Conversation {
  id: string
  title: string
  messages: ChatMessage[]
  activeSkill: string | null
  createdAt: number
  updatedAt: number
}

export interface Skill {
  id: string
  name: string
  icon: string
  description: string
  greeting: string
  initialOptions: string[]
  slashCommand: string
  presetPrompt: string
  enabled: boolean
  children?: Skill[]
}

export interface Product {
  id: string
  name: string
  price: number
  image: string
  score: number
  tag: string
  sales: string
  platform: string
  detail: {
    category: string
    trend: string
    competition: string
    profitMargin: string
  }
  actionOptions: string[]
}

export interface UserProfile {
  name: string
  avatar: string
  shopName: string
}

export interface ModelProvider {
  id: string
  name: string
  type: 'builtin' | 'custom'
  baseUrl: string
  apiKey: string
  models: ModelOption[]
}

export interface ModelOption {
  id: string
  name: string
  description: string
}

export interface QuotaInfo {
  total: number
  used: number
  resetDate: string
}

export interface AppSettings {
  activeModelId: string
  activeProviderId: string
  providers: ModelProvider[]
  quota: QuotaInfo
  userName: string
  shopName: string
}

export interface FavoriteItem {
  id: string
  type: 'conversation' | 'report' | 'product'
  title: string
  summary: string
  createdAt: number
  conversationId?: string
  tags: string[]
}
