<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import type { FavoriteItem } from '@/types'

const router = useRouter()

const STORAGE_KEY = 'marketmind_favorites'

function loadFavorites(): FavoriteItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : defaultFavorites()
  } catch {
    return defaultFavorites()
  }
}

function defaultFavorites(): FavoriteItem[] {
  return [
    {
      id: 'fav-1',
      type: 'report',
      title: '冰袖品类选品分析报告',
      summary: '分析了冰袖品类近30天趋势，推荐3个高潜力SKU，预估利润率35%+',
      createdAt: Date.now() - 86400000 * 3,
      conversationId: 'conv-1',
      tags: ['选品', '冰袖', '爆款分析'],
    },
    {
      id: 'fav-2',
      type: 'product',
      title: '夏季防晒冰袖 - 高弹力款',
      summary: 'GMV: ¥28.5万 | 销量: 1.2万件 | 评分: 4.8 | 趋势: ↑ 32%',
      createdAt: Date.now() - 86400000 * 2,
      tags: ['商品', '冰袖', '趋势品'],
    },
    {
      id: 'fav-3',
      type: 'conversation',
      title: '关于夏季选品策略的深度对话',
      summary: '讨论了夏季应季品布局方案，包含防晒、清凉、户外三个方向',
      createdAt: Date.now() - 86400000,
      conversationId: 'conv-2',
      tags: ['对话', '选品策略'],
    },
  ]
}

const favorites = ref<FavoriteItem[]>(loadFavorites())
const filterType = ref<string>('all')
const searchQuery = ref('')

const typeOptions = [
  { id: 'all', label: '全部', icon: '📦' },
  { id: 'conversation', label: '对话', icon: '💬' },
  { id: 'report', label: '报告', icon: '📊' },
  { id: 'product', label: '商品', icon: '🛍️' },
]

const filtered = computed(() => {
  let list = favorites.value
  if (filterType.value !== 'all') {
    list = list.filter(f => f.type === filterType.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(f =>
      f.title.toLowerCase().includes(q) ||
      f.summary.toLowerCase().includes(q) ||
      f.tags.some(t => t.toLowerCase().includes(q))
    )
  }
  return list.sort((a, b) => b.createdAt - a.createdAt)
})

function removeFavorite(id: string) {
  favorites.value = favorites.value.filter(f => f.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites.value))
}

function formatTime(ts: number): string {
  const d = new Date(ts)
  return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function goBack() {
  router.push('/')
}
</script>

<template>
  <div class="favorites-page">
    <div class="page-header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h2>工具箱</h2>
      <span class="header-count">{{ favorites.length }} 个收藏</span>
    </div>

    <div class="page-body">
      <div class="filter-bar">
        <div class="type-filters">
          <button
            v-for="opt in typeOptions"
            :key="opt.id"
            class="type-btn"
            :class="{ active: filterType === opt.id }"
            @click="filterType = opt.id"
          >
            <span>{{ opt.icon }}</span>
            <span>{{ opt.label }}</span>
          </button>
        </div>
        <div class="search-box">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input v-model="searchQuery" placeholder="搜索收藏内容..." />
        </div>
      </div>

      <div class="favorites-list">
        <div
          v-for="item in filtered"
          :key="item.id"
          class="fav-card"
        >
          <div class="fav-type-badge" :class="item.type">
            {{ typeOptions.find(t => t.id === item.type)?.icon }}
          </div>
          <div class="fav-content">
            <div class="fav-header">
              <div class="fav-title">{{ item.title }}</div>
              <button class="fav-remove" @click="removeFavorite(item.id)">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div class="fav-summary">{{ item.summary }}</div>
            <div class="fav-meta">
              <div class="fav-tags">
                <span v-for="tag in item.tags" :key="tag" class="fav-tag">{{ tag }}</span>
              </div>
              <span class="fav-time">{{ formatTime(item.createdAt) }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filtered.length === 0" class="empty-state">
        <div class="empty-icon">⭐</div>
        <div class="empty-text">{{ searchQuery ? '未找到匹配的收藏' : '暂无收藏内容' }}</div>
        <div class="empty-hint">在对话中收藏有价值的报告、商品分析或对话记录</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.favorites-page { min-height: 100vh; background: var(--bg); }

.page-header {
  display: flex; align-items: center; gap: 16px;
  padding: 16px 24px; background: var(--surface);
  border-bottom: 1px solid var(--line); position: sticky; top: 0; z-index: 10;
}
.page-header h2 { font-size: 18px; font-weight: 700; margin: 0; }
.header-count { font-size: 13px; color: var(--muted); margin-left: auto; }
.back-btn { padding: 6px 12px; border-radius: 6px; font-size: 14px; color: var(--muted); }
.back-btn:hover { background: var(--surface-2); color: var(--text); }

.page-body { max-width: 800px; margin: 0 auto; padding: 24px; }

.filter-bar {
  display: flex; gap: 12px; margin-bottom: 24px; align-items: center;
  flex-wrap: wrap;
}
.type-filters { display: flex; gap: 6px; }
.type-btn {
  display: flex; align-items: center; gap: 5px;
  padding: 6px 14px; border-radius: 16px; font-size: 13px; font-weight: 500;
  color: var(--muted); background: var(--surface); border: 1px solid var(--line);
  transition: all 0.15s;
}
.type-btn:hover { color: var(--text); border-color: var(--soft); }
.type-btn.active { background: var(--blue); color: #fff; border-color: var(--blue); }

.search-box {
  flex: 1; min-width: 200px;
  display: flex; align-items: center; gap: 8px;
  padding: 7px 14px; border-radius: 20px;
  background: var(--surface); border: 1px solid var(--line);
}
.search-box svg { color: var(--muted); flex-shrink: 0; }
.search-box input {
  flex: 1; border: none; background: none; outline: none;
  font-size: 13px; color: var(--text);
}
.search-box input::placeholder { color: var(--soft); }

.favorites-list { display: flex; flex-direction: column; gap: 12px; }

.fav-card {
  display: flex; gap: 14px;
  background: var(--surface); border: 1px solid var(--line);
  border-radius: var(--radius); padding: 16px 20px;
  transition: border-color 0.15s;
}
.fav-card:hover { border-color: var(--soft); }

.fav-type-badge {
  width: 36px; height: 36px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; flex-shrink: 0; background: var(--surface-2);
}
.fav-type-badge.conversation { background: var(--blue-soft); }
.fav-type-badge.report { background: var(--green-soft); }
.fav-type-badge.product { background: var(--amber-soft); }

.fav-content { flex: 1; min-width: 0; }
.fav-header { display: flex; align-items: start; gap: 8px; margin-bottom: 6px; }
.fav-title { flex: 1; font-size: 14px; font-weight: 600; color: var(--ink); }
.fav-remove {
  color: var(--soft); transition: color 0.15s; padding: 2px;
}
.fav-remove:hover { color: var(--red); }

.fav-summary {
  font-size: 13px; color: var(--muted); line-height: 1.5; margin-bottom: 10px;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}

.fav-meta {
  display: flex; align-items: center; justify-content: space-between;
}
.fav-tags { display: flex; gap: 4px; flex-wrap: wrap; }
.fav-tag {
  font-size: 11px; padding: 2px 8px; border-radius: 4px;
  background: var(--surface-2); color: var(--muted);
}
.fav-time { font-size: 11px; color: var(--soft); flex-shrink: 0; }

.empty-state { text-align: center; padding: 60px 16px; }
.empty-icon { font-size: 48px; margin-bottom: 16px; }
.empty-text { font-size: 14px; color: var(--muted); margin-bottom: 8px; }
.empty-hint { font-size: 13px; color: var(--soft); }
</style>
