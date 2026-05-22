<script setup lang="ts">
import { useChatStore } from '@/store/modules/chat'
import { useSettingsStore } from '@/store/modules/settings'
import { useProductStore } from '@/store/modules/product'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const chatStore = useChatStore()
const settingsStore = useSettingsStore()
const productStore = useProductStore()
const { conversations, activeConversationId } = storeToRefs(chatStore)
const { data: settings, remaining, quotaLabel } = storeToRefs(settingsStore)

const hoverId = ref<string | null>(null)

function formatTime(ts: number): string {
  const d = new Date(ts)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  }
  return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

const navItems = [
  { icon: '🎯', label: '我的技能', path: '/skills' },
  { icon: '⭐', label: '工具箱', path: '/favorites' },
  { icon: '🏪', label: 'Skills广场', path: '/store' },
]

const productNavItems = [
  { icon: '🆕', label: '新品发现', sublabel: '找蓝海机会品', path: '/new-products' },
  { icon: '🔥', label: '爆款列表', sublabel: '跟品热销爆款', path: '/hot-products' },
  { icon: '📦', label: '商品列表', sublabel: '管理店铺商品', path: '/my-products' },
]

function isActiveNav(path: string): boolean {
  return route.path === path
}

function goBackToChat() {
  router.push('/')
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <button class="new-chat-btn" @click="chatStore.createConversation(); router.push('/')">
        <span class="plus">+</span>
        <span>新对话</span>
      </button>
    </div>

    <div class="conversation-list">
      <div
        v-for="conv in conversations"
        :key="conv.id"
        class="conv-item"
        :class="{ active: conv.id === activeConversationId }"
        @click="chatStore.selectConversation(conv.id); router.push('/')"
        @mouseenter="hoverId = conv.id"
        @mouseleave="hoverId = null"
      >
        <span class="conv-icon">💬</span>
        <span class="conv-title">{{ conv.title }}</span>
        <span class="conv-time">{{ formatTime(conv.updatedAt) }}</span>
        <button
          v-show="hoverId === conv.id"
          class="conv-delete"
          @click.stop="chatStore.deleteConversation(conv.id)"
        >×</button>
      </div>
      <div v-if="conversations.length === 0" class="empty-hint">
        暂无对话记录
      </div>
    </div>

    <div class="product-nav">
      <button
        v-for="item in productNavItems"
        :key="item.path"
        class="product-nav-item"
        :class="{ active: isActiveNav(item.path) }"
        @click="productStore.closePanel(); router.push(item.path)"
      >
        <span class="product-nav-icon">{{ item.icon }}</span>
        <div class="product-nav-text">
          <span class="product-nav-label">{{ item.label }}</span>
          <span class="product-nav-sub">{{ item.sublabel }}</span>
        </div>
      </button>
    </div>

    <div class="sidebar-nav">
      <button
        v-for="item in navItems"
        :key="item.path"
        class="nav-item"
        :class="{ active: isActiveNav(item.path) }"
        @click="router.push(item.path)"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        <span class="nav-label">{{ item.label }}</span>
      </button>
    </div>

    <div class="sidebar-footer">
      <div class="quota-bar" @click="router.push('/settings')">
        <div class="quota-label">剩余额度</div>
        <div class="quota-progress">
          <div class="quota-fill" :style="{ width: `${settings.quotaType === 'token' ? Math.min((remaining / 500000) * 100, 100) : (remaining / settings.quota.total) * 100}%` }"></div>
        </div>
        <div class="quota-text">{{ remaining }} {{ quotaLabel }}</div>
        <span class="quota-link">管理 →</span>
      </div>
      <div class="user-card" @click="router.push('/settings')">
        <div class="user-avatar">{{ (settings.userName || '用').slice(0, 1) }}</div>
        <div class="user-info">
          <div class="user-name">{{ settings.userName || '未设置' }}</div>
          <div class="user-shop">{{ settings.shopName || '未绑定店铺' }}</div>
        </div>
        <span class="settings-icon">⚙️</span>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 260px;
  min-width: 260px;
  background: var(--sidebar-bg);
  display: flex;
  flex-direction: column;
  color: #fff;
  user-select: none;
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.new-chat-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: var(--radius-sm);
  background: rgba(255,255,255,0.1);
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  transition: background 0.15s;
}
.new-chat-btn:hover { background: rgba(255,255,255,0.16); }
.plus { font-size: 18px; font-weight: 300; line-height: 1; }

.conversation-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.conv-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background 0.15s;
  position: relative;
}
.conv-item:hover { background: var(--sidebar-hover); }
.conv-item.active { background: var(--sidebar-active); }

.conv-icon { font-size: 14px; flex-shrink: 0; }
.conv-title { flex: 1; font-size: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.conv-time { font-size: 11px; color: rgba(255,255,255,0.4); flex-shrink: 0; }
.conv-delete {
  position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
  width: 20px; height: 20px; border-radius: 4px;
  display: flex; align-items: center; justify-content: center;
  color: rgba(255,255,255,0.5); font-size: 16px;
}
.conv-delete:hover { background: rgba(255,255,255,0.12); color: #fff; }

.empty-hint {
  text-align: center; padding: 40px 16px;
  color: rgba(255,255,255,0.3); font-size: 13px;
}

.sidebar-nav {
  padding: 8px 12px;
  border-top: 1px solid rgba(255,255,255,0.06);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.product-nav {
  padding: 8px 12px;
  border-top: 1px solid rgba(255,255,255,0.1);
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.product-nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: rgba(255,255,255,0.7);
  transition: all 0.15s;
}
.product-nav-item:hover {
  background: var(--sidebar-hover);
  color: #fff;
}
.product-nav-item.active {
  background: var(--sidebar-active);
  color: #fff;
}
.product-nav-icon { font-size: 14px; flex-shrink: 0; }
.product-nav-text { display: flex; flex-direction: column; }
.product-nav-label { font-weight: 500; font-size: 13px; }
.product-nav-sub { font-size: 10px; color: rgba(255,255,255,0.35); }
.product-nav-item:hover .product-nav-sub,
.product-nav-item.active .product-nav-sub { color: rgba(255,255,255,0.6); }

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: var(--radius-sm);
  font-size: 13px;
  color: rgba(255,255,255,0.6);
  transition: all 0.15s;
}
.nav-item:hover {
  background: var(--sidebar-hover);
  color: rgba(255,255,255,0.9);
}
.nav-item.active {
  background: var(--sidebar-active);
  color: #fff;
}
.nav-icon { font-size: 14px; }
.nav-label { font-weight: 500; }

.sidebar-footer {
  padding: 12px;
  border-top: 1px solid rgba(255,255,255,0.08);
}

.quota-bar {
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  background: rgba(255,255,255,0.06);
  margin-bottom: 8px;
  cursor: pointer;
  position: relative;
}
.quota-bar:hover { background: rgba(255,255,255,0.1); }
.quota-label { font-size: 11px; color: rgba(255,255,255,0.4); margin-bottom: 4px; }
.quota-progress { height: 4px; background: rgba(255,255,255,0.1); border-radius: 2px; overflow: hidden; margin-bottom: 4px; }
.quota-fill { height: 100%; background: var(--blue); border-radius: 2px; transition: width 0.3s; }
.quota-text { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.7); }
.quota-link {
  position: absolute;
  top: 8px;
  right: 12px;
  font-size: 11px;
  color: rgba(255,255,255,0.35);
  transition: color 0.15s;
}
.quota-bar:hover .quota-link { color: rgba(255,255,255,0.7); }

.user-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: var(--radius-sm);
  transition: background 0.15s;
  cursor: pointer;
}
.user-card:hover { background: var(--sidebar-hover); }
.settings-icon { margin-left: auto; font-size: 14px; opacity: 0.5; }

.user-avatar {
  width: 32px; height: 32px; border-radius: 50%;
  background: var(--blue); display: flex; align-items: center;
  justify-content: center; font-size: 13px; font-weight: 600; flex-shrink: 0;
}
.user-name { font-size: 13px; font-weight: 500; }
.user-shop { font-size: 11px; color: rgba(255,255,255,0.4); }
</style>
