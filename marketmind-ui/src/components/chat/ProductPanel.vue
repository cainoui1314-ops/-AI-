<script setup lang="ts">
import { useProductStore } from '@/store/modules/product'
import { useChatStore } from '@/store/modules/chat'
import { storeToRefs } from 'pinia'
import { ref, computed } from 'vue'

const productStore = useProductStore()
const chatStore = useChatStore()
const { selectedProduct, showPanel } = storeToRefs(productStore)

const activeTab = ref('overview')
const toastMsg = ref('')
const showToast = ref(false)

const isNewProduct = computed(() => selectedProduct.value?.sales === '新品首发')

function scoreColor(score: number, max: number = 100): string {
  const pct = (score / max) * 100
  if (pct >= 90) return '#22c55e'
  if (pct >= 70) return '#4f6ef7'
  if (pct >= 50) return '#f97316'
  return '#ef4444'
}

function trendIcon(t: string) {
  return t === 'up' ? '↑' : t === 'down' ? '↓' : '→'
}

const tabs = [
  { id: 'overview', label: '概览' },
  { id: 'competitor', label: '竞品对标' },
  { id: 'traffic', label: '流量成本' },
  { id: 'optimize', label: '优化建议' },
]

function flashToast(msg: string) {
  toastMsg.value = msg
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 3000)
}

function viewMoreCompetitors() {
  if (!selectedProduct.value) return
  const p = selectedProduct.value
  chatStore.ensureConversation()
  chatStore.addUserMessage('查看更多竞品：' + p.name)
  const msgId = chatStore.startStreamingMessage()
  const thinkChunks = ['分析竞品市场格局...', '正在比对同类商品...', '筛选Top竞品...']
  let i = 0
  const timer = setInterval(() => {
    if (i < thinkChunks.length) {
      chatStore.appendStreamContent(msgId, thinkChunks[i], 'thinking')
      i++
    } else {
      clearInterval(timer)
      const competitors = [
        { name: '竞品A - ' + p.detail.category + '领军品牌', price: (p.price * 0.95).toFixed(1), sales: '日销' + Math.floor(Math.random() * 5000 + 2000) + '+' },
        { name: '竞品B - 性价比之王', price: (p.price * 0.85).toFixed(1), sales: '日销' + Math.floor(Math.random() * 3000 + 1000) + '+' },
        { name: '竞品C - 新锐品牌', price: (p.price * 1.1).toFixed(1), sales: '日销' + Math.floor(Math.random() * 1500 + 500) + '+' },
      ]
      let content = '已为你找到 ' + p.name + ' 的主要竞品：\n\n'
      competitors.forEach((c, idx) => {
        content += (idx + 1) + '. ' + c.name + '\n   价格：¥' + c.price + ' | ' + c.sales + '\n\n'
      })
      content += '\n建议关注竞品的定价策略和主图差异化，找到竞争空间。'
      chatStore.appendStreamContent(msgId, content)
      chatStore.finishStreaming(msgId, undefined, ['详细对比第一竞品', '查看竞品流量来源', '分析竞品定价策略'])
    }
  }, 400)
  flashToast('已为你分析更多竞品，请在对话中查看')
}

function viewOptimizePlan() {
  if (!selectedProduct.value) return
  const p = selectedProduct.value
  chatStore.ensureConversation()
  chatStore.addUserMessage('优化方案：' + p.name)
  const msgId = chatStore.startStreamingMessage()
  const thinkChunks = ['正在分析商品各维度...', '识别优化空间...', '生成优化方案...']
  let i = 0
  const timer = setInterval(() => {
    if (i < thinkChunks.length) {
      chatStore.appendStreamContent(msgId, thinkChunks[i], 'thinking')
      i++
    } else {
      clearInterval(timer)
      const gaps = p.detail.experience?.gaps ?? []
      let content = '针对 ' + p.name + ' 的优化方案：\n\n'
      if (gaps.length === 0) {
        content += '该商品各维度表现优秀，暂无紧迫优化点。\n\n建议：\n1. 保持当前策略，持续监控竞品动态\n2. 可尝试扩大投放规模以获取更多流量'
      } else {
        gaps.forEach((g, idx) => {
          content += (idx + 1) + '. ' + g.dimension + '\n   现状：' + g.myScore + ' vs 竞品 ' + g.competitorScore + '\n   建议：' + g.suggestion + '\n\n'
        })
        content += '预计优化后综合评分可提升 ' + (gaps.length * 2) + '-3分。'
      }
      chatStore.appendStreamContent(msgId, content)
      chatStore.finishStreaming(msgId, undefined, ['立即执行优化', '查看优化案例', '自定义优化方案'])
    }
  }, 400)
  flashToast('优化方案已生成，请在对话中查看')
}
</script>

<template>
  <transition name="slide">
    <aside v-if="showPanel && selectedProduct" class="product-panel">
      <div v-if="showToast" class="panel-toast">{{ toastMsg }}</div>
      <div class="panel-header">
        <h3>{{ selectedProduct.name }}</h3>
        <button class="close-btn" @click="productStore.closePanel()">×</button>
      </div>
      <div class="tab-bar">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="['tab-item', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >{{ tab.label }}</button>
      </div>
      <div class="tab-content">
        <div v-if="activeTab === 'overview'" class="tab-pane">
          <div class="product-hero">
            <div class="hero-avatar">{{ selectedProduct.name.slice(0, 2) }}</div>
            <div class="hero-info">
              <div class="hero-name">{{ selectedProduct.name }}</div>
              <div class="hero-price">¥{{ selectedProduct.price }}</div>
              <div class="hero-meta">
                <span class="hero-tag">{{ selectedProduct.tag }}</span>
                <span class="hero-sales">{{ selectedProduct.sales }}</span>
              </div>
            </div>
            <div class="hero-score" :style="{ color: scoreColor(selectedProduct.score) }">
              <span class="score-num">{{ selectedProduct.score }}</span>
              <span class="score-label">总分</span>
            </div>
          </div>

          <div class="section-title">评分维度</div>
          <div class="score-bars">
            <div v-for="(dim, key) in (selectedProduct.detail.scores ?? {})" :key="key" class="score-bar-item">
              <div class="bar-header">
                <span class="bar-label">{{ dim.label }}</span>
                <span v-if="isNewProduct && dim.score < dim.maxScore * 0.6" class="bar-new-tag">—（新品首发）</span>
                <span v-else class="bar-value">{{ dim.score }}/{{ dim.maxScore }}</span>
              </div>
              <div v-if="!(isNewProduct && dim.score < dim.maxScore * 0.6)" class="bar-track">
                <div
                  class="bar-fill"
                  :style="{ width: (dim.score / dim.maxScore * 100) + '%', background: scoreColor(dim.score, dim.maxScore) }"
                ></div>
              </div>
              <div v-if="dim.score < dim.maxScore * 0.7 && !(isNewProduct && dim.score < dim.maxScore * 0.6)" class="bar-warning">⚠️</div>
            </div>
          </div>

          <div v-if="selectedProduct.detail.experience" class="section-title" style="margin-top:20px">体验分对比</div>
          <div v-if="selectedProduct.detail.experience" class="exp-compare">
            <div class="exp-item">
              <span class="exp-label">我的综合</span>
              <span class="exp-score" :style="{ color: scoreColor(selectedProduct.detail.experience.overall * 20) }">{{ selectedProduct.detail.experience.overall }}</span>
            </div>
            <div class="exp-vs">vs</div>
            <div class="exp-item">
              <span class="exp-label">竞品综合</span>
              <span class="exp-score" :style="{ color: scoreColor(selectedProduct.detail.experience.competitorOverall * 20) }">{{ selectedProduct.detail.experience.competitorOverall }}</span>
            </div>
            <div class="exp-gap" :class="selectedProduct.detail.experience.overall >= selectedProduct.detail.experience.competitorOverall ? 'gap-up' : 'gap-down'">
              {{ selectedProduct.detail.experience.overall >= selectedProduct.detail.experience.competitorOverall ? '↑' : '↓' }}
              {{ Math.abs(selectedProduct.detail.experience.overall - selectedProduct.detail.experience.competitorOverall).toFixed(1) }}
            </div>
          </div>

          <div v-if="Object.values(selectedProduct.detail.scores ?? {}).some(d => d.score < d.maxScore * 0.7)" class="section-title" style="margin-top:20px;color:#ef4444">红标预警</div>
          <div class="red-flags">
            <div v-for="(dim, key) in (selectedProduct.detail.scores ?? {})" :key="'rf-'+key">
              <div v-if="dim.score < dim.maxScore * 0.7 && !(isNewProduct && dim.score < dim.maxScore * 0.6)" class="red-flag-item">
                <span class="rf-dot"></span>
                <span class="rf-label">{{ dim.label }}</span>
                <span class="rf-score">{{ dim.score }}/{{ dim.maxScore }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="activeTab === 'competitor'" class="tab-pane">
          <div v-if="selectedProduct.detail.competitor" class="comp-section">
            <div class="section-title">主要竞品</div>
            <table class="comp-table">
              <thead>
                <tr><th></th><th>我的商品</th><th>{{ selectedProduct.detail.competitor.name }}</th></tr>
              </thead>
              <tbody>
                <tr>
                  <td>价格</td>
                  <td>¥{{ selectedProduct.price }}</td>
                  <td>¥{{ selectedProduct.detail.competitor.price }}</td>
                </tr>
                <tr>
                  <td>日销量</td>
                  <td>{{ selectedProduct.sales }}</td>
                  <td>{{ selectedProduct.detail.competitor.dailySales }}</td>
                </tr>
                <tr>
                  <td>总分</td>
                  <td :style="{ color: scoreColor(selectedProduct.score) }">{{ selectedProduct.score }}</td>
                  <td :style="{ color: scoreColor(selectedProduct.detail.competitor.score) }">{{ selectedProduct.detail.competitor.score }}</td>
                </tr>
              </tbody>
            </table>

            <div class="section-title" style="margin-top:20px">维度对比</div>
            <div class="dim-compare">
              <div v-for="(dim, key) in (selectedProduct.detail.scores ?? {})" :key="'comp-'+key" class="dim-compare-item">
                <div class="dim-label">{{ dim.label }}</div>
                <div class="dim-bars">
                  <div class="dim-bar-row">
                    <span class="dim-bar-val">{{ dim.score }}</span>
                    <div class="dim-bar-track">
                      <div class="dim-bar-fill mine" :style="{ width: (dim.score / dim.maxScore * 100) + '%' }"></div>
                    </div>
                  </div>
                  <div v-if="selectedProduct.detail.competitor!.scores[key as keyof typeof selectedProduct.detail.competitor.scores]" class="dim-bar-row">
                    <span class="dim-bar-val comp">{{ selectedProduct.detail.competitor!.scores[key as keyof typeof selectedProduct.detail.competitor.scores].score }}</span>
                    <div class="dim-bar-track">
                      <div class="dim-bar-fill comp-bar" :style="{ width: (selectedProduct.detail.competitor!.scores[key as keyof typeof selectedProduct.detail.competitor.scores].score / dim.maxScore * 100) + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">暂无竞品数据</div>
          <button class="action-btn" style="margin-top:20px" @click="viewMoreCompetitors">查看更多竞品</button>
        </div>

        <div v-if="activeTab === 'traffic'" class="tab-pane">
          <div class="section-title">流量结构</div>
          <table v-if="selectedProduct.detail.traffic?.length" class="data-table">
            <thead>
              <tr><th>渠道</th><th>占比</th><th>趋势</th></tr>
            </thead>
            <tbody>
              <tr v-for="item in selectedProduct.detail.traffic" :key="item.channel">
                <td>{{ item.channel }}</td>
                <td>
                  <div class="traffic-bar-cell">
                    <div class="traffic-bar" :style="{ width: item.percent + '%', background: 'var(--blue)' }"></div>
                    <span class="traffic-pct">{{ item.percent }}%</span>
                  </div>
                </td>
                <td :class="item.trend === 'up' ? 'trend-up' : item.trend === 'down' ? 'trend-down' : 'trend-stable'">{{ trendIcon(item.trend) }}</td>
              </tr>
            </tbody>
          </table>

          <div class="section-title" style="margin-top:24px">成本对比</div>
          <table v-if="selectedProduct.detail.costs?.length" class="data-table">
            <thead>
              <tr><th>项目</th><th>我方</th><th>竞品</th><th>单位</th></tr>
            </thead>
            <tbody>
              <tr v-for="item in selectedProduct.detail.costs" :key="item.label">
                <td>{{ item.label }}</td>
                <td :class="item.mine > item.competitor ? 'cost-bad' : 'cost-good'">{{ item.mine }}</td>
                <td>{{ item.competitor }}</td>
                <td>{{ item.unit }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="activeTab === 'optimize'" class="tab-pane">
          <div v-if="selectedProduct.detail.experience?.gaps?.length" class="gaps-list">
            <div v-for="gap in selectedProduct.detail.experience.gaps" :key="gap.dimension" class="gap-card">
              <div class="gap-header">
                <span class="gap-dim">{{ gap.dimension }}</span>
              </div>
              <div class="gap-scores">
                <div class="gap-score-item">
                  <span class="gap-score-label">我的</span>
                  <div class="gap-bar-track">
                    <div class="gap-bar-fill mine" :style="{ width: (gap.myScore / 5 * 100) + '%' }"></div>
                  </div>
                  <span class="gap-score-val">{{ gap.myScore }}</span>
                </div>
                <div class="gap-score-item">
                  <span class="gap-score-label">竞品</span>
                  <div class="gap-bar-track">
                    <div class="gap-bar-fill comp-bar" :style="{ width: (gap.competitorScore / 5 * 100) + '%' }"></div>
                  </div>
                  <span class="gap-score-val">{{ gap.competitorScore }}</span>
                </div>
              </div>
              <div class="gap-suggestion">{{ gap.suggestion }}</div>
            </div>
          </div>
          <div v-else class="empty-state">暂无优化建议，各维度表现优秀 👏</div>
          <button class="action-btn" style="margin-top:20px" @click="viewOptimizePlan">查看优化方案</button>
        </div>
      </div>
    </aside>
  </transition>
</template>

<style scoped>
.product-panel {
  position: fixed;
  right: 0;
  top: 0;
  width: 380px;
  height: 100vh;
  background: var(--surface);
  border-left: 1px solid var(--line);
  display: flex;
  flex-direction: column;
  z-index: 100;
  box-shadow: -4px 0 16px rgba(0,0,0,0.06);
}

.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from, .slide-leave-to {
  transform: translateX(100%);
}

.panel-toast {
  position: absolute;
  top: 12px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--blue);
  color: #fff;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 13px;
  z-index: 10;
  white-space: nowrap;
  animation: toast-fade 3s ease forwards;
}

@keyframes toast-fade {
  0%, 70% { opacity: 1; }
  100% { opacity: 0; }
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--line);
  flex-shrink: 0;
}
.panel-header h3 { font-size: 16px; font-weight: 600; margin: 0; color: var(--ink); }
.close-btn {
  width: 28px; height: 28px; border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; color: var(--muted);
}
.close-btn:hover { background: var(--surface-2); color: var(--text); }

.tab-bar {
  display: flex;
  border-bottom: 1px solid var(--line);
  flex-shrink: 0;
}
.tab-item {
  flex: 1;
  padding: 10px 0;
  font-size: 13px;
  color: var(--muted);
  text-align: center;
  border-bottom: 2px solid transparent;
  transition: all 0.15s;
}
.tab-item:hover { color: var(--text); }
.tab-item.active {
  color: var(--blue);
  border-bottom-color: var(--blue);
  font-weight: 500;
}

.tab-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}
.tab-pane {
  display: flex;
  flex-direction: column;
}

.product-hero {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  align-items: center;
}
.hero-avatar {
  width: 56px; height: 56px; border-radius: var(--radius);
  background: var(--surface-2);
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; color: var(--soft); flex-shrink: 0;
}
.hero-info { flex: 1; }
.hero-name { font-size: 15px; font-weight: 600; color: var(--ink); margin-bottom: 4px; }
.hero-price { font-size: 20px; font-weight: 700; color: var(--red); margin-bottom: 4px; }
.hero-meta { display: flex; align-items: center; gap: 8px; }
.hero-tag {
  font-size: 11px; padding: 2px 8px; border-radius: 4px;
  background: var(--blue-soft); color: var(--blue); font-weight: 500;
}
.hero-sales { font-size: 12px; color: var(--muted); }
.hero-score {
  text-align: center;
  flex-shrink: 0;
}
.score-num { display: block; font-size: 32px; font-weight: 700; line-height: 1; }
.score-label { display: block; font-size: 11px; color: var(--muted); margin-top: 2px; }

.section-title {
  font-size: 13px; font-weight: 600; color: var(--muted);
  letter-spacing: 0.3px; margin-bottom: 12px;
}

.score-bars {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.score-bar-item {
  position: relative;
}
.bar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}
.bar-label { font-size: 12px; color: var(--text); }
.bar-value { font-size: 12px; color: var(--muted); font-weight: 500; }
.bar-new-tag { font-size: 11px; color: var(--blue); }
.bar-track {
  height: 6px;
  background: var(--surface-2);
  border-radius: 3px;
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}
.bar-warning {
  position: absolute;
  right: -20px;
  top: 0;
  font-size: 12px;
}

.exp-compare {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--surface-2);
  border-radius: var(--radius);
}
.exp-item { text-align: center; }
.exp-label { display: block; font-size: 11px; color: var(--muted); margin-bottom: 2px; }
.exp-score { font-size: 18px; font-weight: 700; }
.exp-vs { font-size: 12px; color: var(--muted); }
.exp-gap { font-size: 13px; font-weight: 600; }
.gap-up { color: #22c55e; }
.gap-down { color: #ef4444; }

.red-flags {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.red-flag-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #fef2f2;
  border-radius: var(--radius-sm);
  border-left: 3px solid #ef4444;
}
.rf-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #ef4444; flex-shrink: 0;
}
.rf-label { font-size: 13px; color: var(--text); flex: 1; }
.rf-score { font-size: 12px; color: #ef4444; font-weight: 500; }

.comp-table, .data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.comp-table th, .data-table th {
  text-align: left;
  padding: 8px 10px;
  font-size: 11px;
  color: var(--muted);
  border-bottom: 1px solid var(--line);
  font-weight: 500;
}
.comp-table td, .data-table td {
  padding: 8px 10px;
  border-bottom: 1px solid var(--line);
  color: var(--text);
}

.dim-compare {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.dim-label { font-size: 12px; color: var(--text); margin-bottom: 4px; }
.dim-bars {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.dim-bar-row {
  display: flex;
  align-items: center;
  gap: 6px;
}
.dim-bar-val { font-size: 11px; color: var(--muted); width: 20px; text-align: right; }
.dim-bar-val.comp { color: #f97316; }
.dim-bar-track {
  flex: 1;
  height: 5px;
  background: var(--surface-2);
  border-radius: 3px;
  overflow: hidden;
}
.dim-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}
.dim-bar-fill.mine { background: var(--blue); }
.dim-bar-fill.comp-bar { background: #f97316; }

.traffic-bar-cell {
  display: flex;
  align-items: center;
  gap: 6px;
}
.traffic-bar {
  height: 6px;
  border-radius: 3px;
  max-width: 100px;
}
.traffic-pct { font-size: 12px; color: var(--text); }
.trend-up { color: #22c55e; }
.trend-down { color: #ef4444; }
.trend-stable { color: var(--muted); }

.cost-bad { color: #ef4444; font-weight: 500; }
.cost-good { color: #22c55e; font-weight: 500; }

.gaps-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.gap-card {
  padding: 14px;
  background: var(--surface-2);
  border-radius: var(--radius);
}
.gap-header { margin-bottom: 8px; }
.gap-dim { font-size: 14px; font-weight: 600; color: var(--ink); }
.gap-scores {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
}
.gap-score-item {
  display: flex;
  align-items: center;
  gap: 6px;
}
.gap-score-label { font-size: 11px; color: var(--muted); width: 30px; }
.gap-bar-track {
  flex: 1;
  height: 5px;
  background: var(--line);
  border-radius: 3px;
  overflow: hidden;
}
.gap-bar-fill { height: 100%; border-radius: 3px; }
.gap-bar-fill.mine { background: var(--blue); }
.gap-bar-fill.comp-bar { background: #f97316; }
.gap-score-val { font-size: 12px; color: var(--text); width: 20px; }
.gap-suggestion {
  font-size: 13px;
  color: var(--text);
  line-height: 1.5;
  padding-top: 8px;
  border-top: 1px solid var(--line);
}

.empty-state {
  text-align: center;
  padding: 40px 0;
  color: var(--muted);
  font-size: 14px;
}

.action-btn {
  width: 100%;
  padding: 10px 16px;
  border-radius: var(--radius-sm);
  background: var(--blue-soft);
  color: var(--blue);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.15s;
  border: 1px solid transparent;
}
.action-btn:hover {
  background: var(--blue);
  color: #fff;
}
</style>
