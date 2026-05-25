<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSkillsStore } from '@/store/modules/skills'
import { storeToRefs } from 'pinia'
import { ref, computed } from 'vue'

const router = useRouter()
const skillsStore = useSkillsStore()
const { skills } = storeToRefs(skillsStore)

const searchQuery = ref('')
const activeCategory = ref('all')
const sortBy = ref<'popular' | 'newest' | 'rating'>('popular')

const storeCategories = [
  { id: 'all', label: '全部', icon: '🏪' },
  { id: 'selection', label: '选品分析', icon: '🎯' },
  { id: 'content', label: '内容创作', icon: '🎨' },
  { id: 'operation', label: '运营推广', icon: '📈' },
  { id: 'data', label: '数据分析', icon: '📊' },
  { id: 'listing', label: '商品管理', icon: '📦' },
]

interface StoreItem {
  id: string
  name: string
  icon: string
  description: string
  category: string
  author: string
  rating: number
  users: number
  isNew: boolean
  isInstalled: boolean
  price: string
  tags: string[]
}

const storeItems = ref<StoreItem[]>([
  { id: 'selection', name: '选品策略师', icon: '🎯', description: '分析爆款、趋势品、应季品、蓝海机会，覆盖全品类选品需求', category: 'selection', author: '官方', rating: 4.9, users: 12800, isNew: false, isInstalled: true, price: '免费', tags: ['爆款分析', '趋势洞察', '蓝海挖掘'] },
  { id: 'selection-hot', name: '当前爆款分析', icon: '🔥', description: '实时监控平台高GMV商品，智能推荐爆款机会', category: 'selection', author: '官方', rating: 4.8, users: 8500, isNew: false, isInstalled: true, price: '免费', tags: ['实时数据', 'GMV分析'] },
  { id: 'selection-blueocean', name: '蓝海机会挖掘', icon: '💎', description: '发现低竞争高需求的蓝海品类，提前布局蓝海市场', category: 'selection', author: '官方', rating: 4.9, users: 6200, isNew: false, isInstalled: true, price: '免费', tags: ['蓝海', '低竞争'] },
  { id: 'material', name: '素材优化师', icon: '🎨', description: 'AI生成主图、视频脚本、详情页，提升点击率', category: 'content', author: '官方', rating: 4.7, users: 9100, isNew: false, isInstalled: true, price: '免费', tags: ['主图生成', '视频脚本'] },
  { id: 'seo', name: '标题SEO', icon: '✏️', description: '优化商品标题关键词，提升搜索排名和曝光', category: 'operation', author: '官方', rating: 4.6, users: 7800, isNew: false, isInstalled: true, price: '免费', tags: ['关键词', '搜索优化'] },
  { id: 'listing', name: '一键上架', icon: '📦', description: '类目自动映射、属性智能填充、跨平台批量铺货', category: 'listing', author: '官方', rating: 4.5, users: 5400, isNew: false, isInstalled: true, price: '免费', tags: ['批量上架', '跨平台'] },
  { id: 'traffic', name: '流量运营', icon: '📈', description: '千川投放策略制定、ROI优化、流量来源分析', category: 'operation', author: '官方', rating: 4.7, users: 6800, isNew: false, isInstalled: true, price: '免费', tags: ['千川', 'ROI'] },
  { id: 'analyst', name: '数据诊断师', icon: '📊', description: '全店运营诊断、转化率分析、六维经营体检', category: 'data', author: '官方', rating: 4.8, users: 7300, isNew: false, isInstalled: true, price: '免费', tags: ['数据诊断', '转化分析'] },
  { id: 'live-assistant', name: '直播助手', icon: '🎬', description: '直播话术生成、实时互动回复、直播数据复盘', category: 'content', author: '官方', rating: 4.6, users: 3200, isNew: true, isInstalled: true, price: '免费', tags: ['直播', '话术'] },
  { id: 'competitor', name: '竞品监控', icon: '🔍', description: '实时追踪竞品价格、销量、活动策略变化', category: 'data', author: '官方', rating: 4.5, users: 4100, isNew: true, isInstalled: true, price: '免费', tags: ['竞品', '价格监控'] },
  { id: 'comment-analyzer', name: '评论分析', icon: '💬', description: '分析商品评论情感倾向，提炼用户痛点和需求', category: 'data', author: '官方', rating: 4.4, users: 2800, isNew: true, isInstalled: true, price: '免费', tags: ['评论', '情感分析'] },
  { id: 'pricing', name: '智能定价', icon: '💰', description: '基于市场数据和竞争分析，智能推荐最优定价策略', category: 'operation', author: '官方', rating: 4.3, users: 1900, isNew: true, isInstalled: true, price: '免费', tags: ['定价', '利润优化'] },
])

const filtered = computed(() => {
  let list = storeItems.value
  if (activeCategory.value !== 'all') {
    list = list.filter(i => i.category === activeCategory.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(i =>
      i.name.toLowerCase().includes(q) ||
      i.description.toLowerCase().includes(q) ||
      i.tags.some(t => t.toLowerCase().includes(q))
    )
  }
  if (sortBy.value === 'popular') {
    list = [...list].sort((a, b) => b.users - a.users)
  } else if (sortBy.value === 'rating') {
    list = [...list].sort((a, b) => b.rating - a.rating)
  } else {
    list = [...list].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0))
  }
  return list
})

function formatUsers(n: number): string {
  if (n >= 10000) return `${(n / 10000).toFixed(1)}万`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return `${n}`
}

function goBack() {
  router.push('/')
}
</script>

<template>
  <div class="store-page">
    <div class="page-header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h2>Skills 广场</h2>
      <span class="header-count">{{ storeItems.length }} 个技能</span>
    </div>

    <div class="page-body">
      <div class="store-hero">
        <div class="hero-text">
          <div class="hero-title">发现更强大的运营能力</div>
          <div class="hero-desc">每个 Skill 都是一个专业运营能力的模块，按需安装，即插即用</div>
        </div>
        <div class="search-box">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input v-model="searchQuery" placeholder="搜索技能、关键词..." />
        </div>
      </div>

      <div class="filter-row">
        <div class="cat-filters">
          <button
            v-for="cat in storeCategories"
            :key="cat.id"
            class="cat-btn"
            :class="{ active: activeCategory === cat.id }"
            @click="activeCategory = cat.id"
          >
            <span>{{ cat.icon }}</span>
            <span>{{ cat.label }}</span>
          </button>
        </div>
        <div class="sort-group">
          <button
            v-for="s in (['popular', 'newest', 'rating'] as const)"
            :key="s"
            class="sort-btn"
            :class="{ active: sortBy === s }"
            @click="sortBy = s"
          >
            {{ s === 'popular' ? '最热门' : s === 'newest' ? '最新' : '评分最高' }}
          </button>
        </div>
      </div>

      <div class="store-grid">
        <div
          v-for="item in filtered"
          :key="item.id"
          class="store-card"
          :class="{ installed: item.isInstalled }"
        >
          <div class="card-top">
            <div class="card-icon">{{ item.icon }}</div>
            <div class="card-info">
              <div class="card-name">{{ item.name }}</div>
              <div class="card-author">{{ item.author }}</div>
            </div>
            <span v-if="item.isNew" class="new-badge">NEW</span>
            <span v-if="item.isInstalled" class="installed-badge">已安装</span>
          </div>
          <div class="card-desc">{{ item.description }}</div>
          <div class="card-tags">
            <span v-for="tag in item.tags" :key="tag" class="card-tag">{{ tag }}</span>
          </div>
          <div class="card-bottom">
            <div class="card-stats">
              <span class="stat-rating">⭐ {{ item.rating }}</span>
              <span class="stat-users">{{ formatUsers(item.users) }} 人在用</span>
            </div>
            <div class="card-price-action">
              <span class="card-price" :class="{ free: item.price === '免费' }">{{ item.price }}</span>
              <button
                class="action-btn"
                :class="{ installed: item.isInstalled }"
                @click="!item.isInstalled && router.push('/')"
              >
                {{ item.isInstalled ? '已安装' : '安装' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="filtered.length === 0" class="empty-state">
        <div class="empty-icon">🔍</div>
        <div class="empty-text">未找到匹配的技能</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.store-page { flex: 1; overflow-y: auto; background: var(--bg); }

.page-header {
  display: flex; align-items: center; gap: 16px;
  padding: 16px 24px; background: var(--surface);
  border-bottom: 1px solid var(--line); position: sticky; top: 0; z-index: 10;
}
.page-header h2 { font-size: 18px; font-weight: 700; margin: 0; }
.header-count { font-size: 13px; color: var(--muted); margin-left: auto; }
.back-btn { padding: 6px 12px; border-radius: 6px; font-size: 14px; color: var(--muted); }
.back-btn:hover { background: var(--surface-2); color: var(--text); }

.page-body { max-width: 960px; margin: 0 auto; padding: 24px; }

.store-hero {
  background: linear-gradient(135deg, var(--blue), #7c3aed);
  border-radius: var(--radius-lg); padding: 28px 32px;
  color: #fff; margin-bottom: 24px;
  display: flex; align-items: center; justify-content: space-between; gap: 24px;
}
.hero-title { font-size: 20px; font-weight: 700; margin-bottom: 6px; }
.hero-desc { font-size: 13px; opacity: 0.8; }
.search-box {
  flex-shrink: 0; display: flex; align-items: center; gap: 8px;
  padding: 8px 16px; border-radius: 20px;
  background: rgba(255,255,255,0.2); backdrop-filter: blur(8px);
  width: 280px;
}
.search-box svg { color: rgba(255,255,255,0.7); flex-shrink: 0; }
.search-box input {
  flex: 1; border: none; background: none; outline: none;
  font-size: 13px; color: #fff;
}
.search-box input::placeholder { color: rgba(255,255,255,0.5); }

.filter-row {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 20px; flex-wrap: wrap; gap: 12px;
}
.cat-filters { display: flex; gap: 6px; flex-wrap: wrap; }
.cat-btn {
  display: flex; align-items: center; gap: 5px;
  padding: 6px 14px; border-radius: 16px; font-size: 13px; font-weight: 500;
  color: var(--muted); background: var(--surface); border: 1px solid var(--line);
  transition: all 0.15s;
}
.cat-btn:hover { color: var(--text); border-color: var(--soft); }
.cat-btn.active { background: var(--blue); color: #fff; border-color: var(--blue); }

.sort-group { display: flex; gap: 4px; background: var(--surface-2); border-radius: 6px; padding: 2px; }
.sort-btn {
  padding: 5px 12px; border-radius: 4px; font-size: 12px;
  color: var(--muted); transition: all 0.15s;
}
.sort-btn:hover { color: var(--text); }
.sort-btn.active { background: var(--surface); color: var(--text); box-shadow: 0 1px 2px rgba(0,0,0,0.06); }

.store-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.store-card {
  background: var(--surface); border: 1px solid var(--line);
  border-radius: var(--radius); padding: 20px;
  transition: all 0.15s; position: relative;
}
.store-card:hover {
  border-color: var(--soft); box-shadow: 0 4px 16px rgba(0,0,0,0.08);
}
.store-card.installed { border-color: var(--blue); }

.card-top { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
.card-icon { font-size: 28px; }
.card-info { flex: 1; }
.card-name { font-size: 14px; font-weight: 600; color: var(--ink); }
.card-author { font-size: 11px; color: var(--muted); }
.new-badge {
  font-size: 10px; padding: 2px 6px; border-radius: 4px;
  background: var(--amber); color: #fff; font-weight: 700;
}
.installed-badge {
  font-size: 10px; padding: 2px 8px; border-radius: 4px;
  background: var(--green-soft); color: var(--green); font-weight: 600;
}

.card-desc {
  font-size: 13px; color: var(--muted); line-height: 1.5; margin-bottom: 12px;
}

.card-tags { display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 14px; }
.card-tag {
  font-size: 11px; padding: 2px 8px; border-radius: 4px;
  background: var(--surface-2); color: var(--muted);
}

.card-bottom {
  display: flex; align-items: center; justify-content: space-between;
  padding-top: 12px; border-top: 1px solid var(--line);
}
.card-stats { display: flex; gap: 10px; }
.stat-rating { font-size: 12px; color: var(--amber); font-weight: 500; }
.stat-users { font-size: 12px; color: var(--muted); }

.card-price-action { display: flex; align-items: center; gap: 10px; }
.card-price { font-size: 13px; font-weight: 600; color: var(--ink); }
.card-price.free { color: var(--green); }
.action-btn {
  padding: 5px 16px; border-radius: 6px; font-size: 12px; font-weight: 500;
  background: var(--blue); color: #fff; transition: all 0.15s;
}
.action-btn:hover { opacity: 0.85; }
.action-btn.installed {
  background: var(--surface-2); color: var(--muted); cursor: default;
}

.empty-state { text-align: center; padding: 60px 16px; }
.empty-icon { font-size: 48px; margin-bottom: 16px; }
.empty-text { font-size: 14px; color: var(--muted); }
</style>
