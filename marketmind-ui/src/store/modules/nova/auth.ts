import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('nova-auth', () => {
  const isAuthorized = ref(false)
  const shopName = ref('')
  const shopCategory = ref('')

  async function checkAuth() {
    isAuthorized.value = true
    shopName.value = '我的店铺'
    shopCategory.value = '女装'
  }

  async function authorizeShop() {
    await checkAuth()
  }

  return { isAuthorized, shopName, shopCategory, checkAuth, authorizeShop }
})
