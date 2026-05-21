import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserProfile } from '@/types'

const STORAGE_KEY = 'yueji_auth'

function loadAuth(): { token: string | null; user: UserProfile | null } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* empty */ }
  return { token: null, user: null }
}

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(loadAuth().token)
  const user = ref<UserProfile | null>(loadAuth().user)

  const isAuthenticated = computed(() => !!token.value)
  const isDouyinBound = computed(() => user.value?.douyinBound ?? false)
  const userPlan = computed(() => user.value?.plan ?? 'free')

  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: token.value, user: user.value }))
  }

  async function login(phone: string, _password: string): Promise<boolean> {
    try {
      const mockUser: UserProfile = {
        id: `user-${Date.now()}`,
        phone,
        businessMode: '有货源',
        avatar: null,
        plan: 'free',
        douyinBound: false,
        douyinShopId: null,
        douyinShopName: null,
        douyinMainCategory: null,
        douyinAuthorizedAt: null,
      }
      token.value = `mock-token-${Date.now()}`
      user.value = mockUser
      saveToStorage()
      return true
    } catch {
      return false
    }
  }

  async function register(phone: string, _password: string, businessMode: string): Promise<boolean> {
    try {
      const mockUser: UserProfile = {
        id: `user-${Date.now()}`,
        phone,
        businessMode: businessMode as '有货源' | '无货源',
        avatar: null,
        plan: 'free',
        douyinBound: false,
        douyinShopId: null,
        douyinShopName: null,
        douyinMainCategory: null,
        douyinAuthorizedAt: null,
      }
      token.value = `mock-token-${Date.now()}`
      user.value = mockUser
      saveToStorage()
      return true
    } catch {
      return false
    }
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  function checkAuth() {
    const auth = loadAuth()
    token.value = auth.token
    user.value = auth.user
  }

  async function bindDouyin(_code: string) {
    if (user.value) {
      user.value.douyinBound = true
      user.value.douyinShopId = `shop-${Date.now()}`
      user.value.douyinShopName = '抖音示范店'
      user.value.douyinMainCategory = '女装/女士精品'
      user.value.douyinAuthorizedAt = new Date().toISOString().slice(0, 10)
      saveToStorage()
    }
  }

  function unbindDouyin() {
    if (user.value) {
      user.value.douyinBound = false
      user.value.douyinShopId = null
      user.value.douyinShopName = null
      user.value.douyinMainCategory = null
      user.value.douyinAuthorizedAt = null
      saveToStorage()
    }
  }

  return {
    token,
    user,
    isAuthenticated,
    isDouyinBound,
    userPlan,
    login,
    register,
    logout,
    checkAuth,
    bindDouyin,
    unbindDouyin,
  }
})
