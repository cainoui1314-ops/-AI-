export interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  content: string
  timestamp: number
  products?: Product[]
  guidedOptions?: string[]
  thinking?: string
  isStreaming?: boolean
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
  personas: SkillPersona[]
  activePersonaId: string
}

export interface ProductScoreDimension {
  label: string
  score: number
  maxScore: number
  tip?: string
}

export interface ProductScores {
  title: ProductScoreDimension
  mainImage: ProductScoreDimension
  video: ProductScoreDimension
  reviews: ProductScoreDimension
  sales: ProductScoreDimension
  customerService: ProductScoreDimension
  logistics: ProductScoreDimension
  experience: ProductScoreDimension
}

export interface TrafficItem {
  channel: string
  percent: number
  trend: 'up' | 'down' | 'stable'
}

export interface CostItem {
  label: string
  mine: number
  competitor: number
  unit: string
}

export interface ExperienceScore {
  product: number
  logistics: number
  service: number
  overall: number
  competitorOverall: number
  gaps: { dimension: string; myScore: number; competitorScore: number; suggestion: string }[]
}

export interface CompetitorSnapshot {
  name: string
  price: number
  dailySales: string
  score: number
  scores: ProductScores
  experience: ExperienceScore
}

export interface ProductDetail {
  category: string
  trend: string
  competition: string
  profitMargin: string
  scores?: ProductScores
  traffic?: TrafficItem[]
  costs?: CostItem[]
  experience?: ExperienceScore
  competitor?: CompetitorSnapshot
  newProductTags?: string[]
}

export interface NewProductFilter {
  label: string
  options: string[]
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
  detail: ProductDetail
  actionOptions: string[]
}

export interface UserProfile {
  id: string
  phone: string
  businessMode: '有货源' | '无货源'
  avatar: string | null
  plan: 'free' | 'pro' | 'enterprise'
  douyinBound: boolean
  douyinShopId: string | null
  douyinShopName: string | null
  douyinMainCategory: string | null
  douyinAuthorizedAt: string | null
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
  plan: 'free' | 'pro' | 'enterprise'
  quotaType: 'count' | 'token'
  tokenBalance: number
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

export interface SkillPersona {
  id: string
  name: string
  icon: string
  description: string
  systemPrompt: string
  isDefault: boolean
  isCustom: boolean
}

export interface YUEModel {
  id: string
  name: string
  description: string
  tag: string
  tokenMultiplier: number
  requiredPlan: 'free' | 'pro' | 'enterprise'
  icon: string
}

export interface TokenUsage {
  promptTokens: number
  completionTokens: number
  totalTokens: number
  actualModel?: string
}
