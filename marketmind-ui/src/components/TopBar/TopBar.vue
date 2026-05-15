<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useGlobalStore } from '@/store/modules/global/global'

const route = useRoute()
const router = useRouter()
const globalStore = useGlobalStore()

function switchMode(mode: 'nova' | 'horizon') {
  globalStore.switchMode(mode)
  router.push(mode === 'nova' ? '/nova' : '/horizon')
}
</script>

<template>
  <header class="topbar">
    <div>
      <div class="crumb">MarketMind AI / {{ route.meta.title || '首页' }}</div>
      <h1>{{ route.meta.title || 'MarketMind AI' }}</h1>
    </div>
    <div class="top-actions">
      <div class="mode-switch">
        <span class="mode-label" style="font-size:12px;color:var(--muted);margin-right:4px;">模式</span>
        <button class="switch-button" :class="{ active: globalStore.currentMode === 'nova' }" @click="switchMode('nova')">
          ⚡ Nova
        </button>
        <button class="switch-button" :class="{ active: globalStore.currentMode === 'horizon' }" @click="switchMode('horizon')">
          🌅 Horizon
        </button>
      </div>
      <div class="status-pill">
        <span class="dot"></span>
        系统正常运行
      </div>
    </div>
  </header>
</template>
