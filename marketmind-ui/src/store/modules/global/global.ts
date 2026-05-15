import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AppMode } from '@/types'

export const useGlobalStore = defineStore('global', () => {
  const currentMode = ref<AppMode>('nova')
  const sidebarCollapsed = ref(false)

  function switchMode(mode: AppMode) {
    currentMode.value = mode
  }

  function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
  }

  return {
    currentMode,
    sidebarCollapsed,
    switchMode,
    toggleSidebar
  }
})
