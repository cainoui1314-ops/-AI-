<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useGlobalStore } from '@/store/modules/global/global'

const route = useRoute()
const globalStore = useGlobalStore()

const navItems = [
  { path: '/', label: '商家类型', icon: '01' },
  { path: '/nova', label: 'Nova', icon: '⚡' },
  { path: '/horizon', label: 'Horizon', icon: '🌅', comingSoon: true },
]

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>

<template>
  <aside class="sidebar">
    <div class="brand">
      <div class="brand-mark">AI</div>
      <div>
        <div class="brand-name">MarketMind AI</div>
        <div class="brand-sub">智能铺货 · 深度分析</div>
      </div>
    </div>

    <nav class="nav-list">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ active: isActive(item.path) }"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        <span>{{ item.label }}</span>
        <span v-if="item.comingSoon" class="coming-soon-tag">敬请期待</span>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <div class="tenant-card">
        <div class="tenant-label">当前模式</div>
        <div class="tenant-name">{{ globalStore.currentMode === 'nova' ? 'Nova 铺货管家' : 'Horizon 深度分析' }}</div>
        <div class="tenant-meta">智能经营系统</div>
      </div>
      <div class="version-info">MarketMind AI v1.0</div>
    </div>
  </aside>
</template>
