import type { UserProfile, TokenUsage } from '@/types'

const API_BASE = '/api'

function getToken(): string | null {
  try {
    const raw = localStorage.getItem('yueji_auth')
    if (raw) {
      const parsed = JSON.parse(raw)
      return parsed.token || null
    }
  } catch { /* empty */ }
  return null
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers })

  if (res.status === 401) {
    localStorage.removeItem('yueji_auth')
    window.location.href = '/login'
    throw new Error('Unauthorized')
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message || `Request failed: ${res.status}`)
  }

  return res.json()
}

function get<T>(path: string): Promise<T> {
  return request<T>(path, { method: 'GET' })
}

function post<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined })
}

export interface LoginResponse {
  token: string
  user: UserProfile
}

export interface RegisterResponse {
  token: string
  user: UserProfile
}

export interface DouyinUrlResponse {
  url: string
}

export interface BindDouyinResponse {
  shopId: string
  shopName: string
  mainCategory: string
}

export interface ChatResponse {
  reply: string
  products?: unknown[]
  guidedOptions?: string[]
  usage: TokenUsage
}

export interface QuotaResponse {
  plan: 'free' | 'pro' | 'enterprise'
  quotaType: 'count' | 'token'
  used: number
  total: number
  unit: string
}

export interface PurchaseTokenResponse {
  success: boolean
  newBalance: number
}

export const api = {
  auth: {
    login: (phone: string, password: string) =>
      post<LoginResponse>('/auth/login', { phone, password }),

    register: (phone: string, password: string, businessMode: string) =>
      post<RegisterResponse>('/auth/register', { phone, password, businessMode }),

    getMe: () =>
      get<{ user: UserProfile }>('/auth/me'),

    getDouyinUrl: () =>
      get<DouyinUrlResponse>('/auth/douyin-url'),

    bindDouyin: (code: string) =>
      post<BindDouyinResponse>('/auth/bind-douyin', { code }),

    unbindDouyin: () =>
      post<{ success: boolean }>('/auth/unbind-douyin'),
  },

  chat: {
    send: (messages: unknown[], model: string, skill: string, persona: string, stream = false) =>
      post<ChatResponse>('/chat', { messages, model, skill, persona, stream }),
  },

  user: {
    getQuota: () =>
      get<QuotaResponse>('/user/quota'),

    purchaseToken: (pkg: string) =>
      post<PurchaseTokenResponse>('/user/purchase-token', { package: pkg }),
  },
}

export function useApi() {
  return api
}
