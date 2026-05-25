<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSettingsStore } from '@/store/modules/settings'
import { useAuthStore } from '@/store/modules/auth'
import { storeToRefs } from 'pinia'
import { ref, computed } from 'vue'

const router = useRouter()
const settingsStore = useSettingsStore()
const authStore = useAuthStore()
const { data: settings, activeModel, availableModels, remaining, quotaLabel } = storeToRefs(settingsStore)
const { user, isDouyinBound, userPlan } = storeToRefs(authStore)

const tab = ref('general')
const showUnbindConfirm = ref(false)

const planName = computed(() => {
  const map: Record<string, string> = { free: '基础版', pro: '专业版', enterprise: '企业版' }
  return map[userPlan.value] || '基础版'
})

const quotaPercent = computed(() => {
  if (settings.value.quotaType === 'token') {
    return Math.min(100, (settings.value.tokenBalance / 500000) * 100)
  }
  return Math.min(100, (settings.value.quota.used / settings.value.quota.total) * 100)
})

function goBack() {
  router.push('/')
}

function saveProfile() {
  settingsStore.updateProfile(settings.value.userName, settings.value.shopName)
}

function handleBindDouyin() {
  window.open('#/auth/callback?mock=true', '_blank', 'width=600,height=500')
}

function handleUnbindDouyin() {
  authStore.unbindDouyin()
  showUnbindConfirm.value = false
}

function selectModel(modelId: string) {
  settingsStore.setActiveModel(modelId)
}

function switchPlan(plan: 'free' | 'pro' | 'enterprise') {
  settingsStore.setPlan(plan)
}
</script>

<template>
  <div class="settings-page">
    <div class="settings-header">
      <button class="back-btn" @click="goBack">← 返回</button>
      <h2>设置</h2>
    </div>

    <div class="settings-body">
      <div class="settings-tabs">
        <button class="stab" :class="{ active: tab === 'general' }" @click="tab = 'general'">通用</button>
        <button class="stab" :class="{ active: tab === 'model' }" @click="tab = 'model'">模型</button>
        <button class="stab" :class="{ active: tab === 'quota' }" @click="tab = 'quota'">额度</button>
      </div>

      <div v-if="tab === 'general'" class="settings-section">
        <h3>个人信息</h3>
        <div class="form-group">
          <label>用户名</label>
          <input v-model="settings.userName" class="field-input" @blur="saveProfile" />
        </div>
        <div class="form-group">
          <label>手机号</label>
          <div class="static-field">{{ user?.phone || '未设置' }}</div>
        </div>
        <div class="form-group">
          <label>经营模式</label>
          <div class="static-field">{{ user?.businessMode || '未设置' }}</div>
        </div>
        <div class="form-group">
          <label>当前套餐</label>
          <div class="static-field">
            <span class="plan-tag" :class="userPlan">{{ planName }}</span>
          </div>
        </div>

        <h3 style="margin-top:32px">抖音小店绑定</h3>
        <div class="douyin-bind-card">
          <template v-if="isDouyinBound">
            <div class="bound-status">
              <span class="bound-icon">✅</span>
              <div class="bound-info">
                <div class="bound-name">{{ user?.douyinShopName || '抖音小店' }}</div>
                <div class="bound-meta">
                  <span>店铺ID: {{ user?.douyinShopId }}</span>
                  <span>主营类目: {{ user?.douyinMainCategory }}</span>
                  <span>授权时间: {{ user?.douyinAuthorizedAt }}</span>
                </div>
              </div>
            </div>
            <button v-if="!showUnbindConfirm" class="unbind-btn" @click="showUnbindConfirm = true">解除绑定</button>
            <div v-else class="unbind-confirm">
              <span>确认解除绑定？</span>
              <button class="confirm-yes" @click="handleUnbindDouyin">确认</button>
              <button class="confirm-no" @click="showUnbindConfirm = false">取消</button>
            </div>
          </template>
          <template v-else>
            <div class="unbound-status">
              <p class="unbound-text">尚未绑定抖音小店，绑定后可使用完整电商功能</p>
              <button class="bind-btn" @click="handleBindDouyin">
                <span>🎵</span> 绑定抖音小店
              </button>
            </div>
          </template>
        </div>
      </div>

      <div v-if="tab === 'model'" class="settings-section">
        <h3>YUE 模型体系</h3>
        <p class="hint">选择适合你当前任务的模型，不同模型的消耗不同</p>
        <div class="yue-model-list">
          <div
            v-for="model in settingsStore.yueModels"
            :key="model.id"
            class="yue-model-card"
            :class="{ active: settings.activeModelId === model.id, locked: model.requiredPlan !== 'free' && userPlan === 'free' }"
            @click="model.requiredPlan === 'free' || userPlan !== 'free' ? selectModel(model.id) : null"
          >
            <div class="yue-model-icon">{{ model.icon }}</div>
            <div class="yue-model-info">
              <div class="yue-model-name">
                {{ model.name }}
                <span class="info-tip" :data-tip="model.tipDescription">!</span>
              </div>
              <div class="yue-model-desc">{{ model.description }}</div>
            </div>
            <div class="yue-model-meta">
              <span class="yue-tag" :class="model.requiredPlan">{{ model.tag }}</span>
              <span class="yue-multiplier">×{{ model.tokenMultiplier }}</span>
            </div>
            <div v-if="model.requiredPlan !== 'free' && userPlan === 'free'" class="lock-overlay">
              <span>🔒 专业版</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="tab === 'quota'" class="settings-section">
        <h3>使用额度</h3>
        <div class="quota-card">
          <div class="quota-visual">
            <div class="quota-ring">
              <svg viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="52" fill="none" stroke="var(--surface-2)" stroke-width="10" />
                <circle
                  cx="60" cy="60" r="52" fill="none"
                  stroke="var(--blue)" stroke-width="10"
                  :stroke-dasharray="`${quotaPercent * 3.27} 327`"
                  stroke-linecap="round"
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div class="quota-center">
                <div class="quota-remaining">{{ remaining }}</div>
                <div class="quota-label">剩余{{ quotaLabel }}</div>
              </div>
            </div>
          </div>
          <div class="quota-details">
            <div class="quota-row">
              <span>计费方式</span>
              <span class="quota-val">{{ settings.quotaType === 'token' ? 'Token 计费' : '按次计费' }}</span>
            </div>
            <template v-if="settings.quotaType === 'count'">
              <div class="quota-row">
                <span>已使用</span>
                <span class="quota-val">{{ settings.quota.used }} 次</span>
              </div>
              <div class="quota-row">
                <span>总额度</span>
                <span class="quota-val">{{ settings.quota.total }} 次/月</span>
              </div>
              <div class="quota-row">
                <span>重置日期</span>
                <span class="quota-val">{{ settings.quota.resetDate }}</span>
              </div>
            </template>
            <template v-else>
              <div class="quota-row">
                <span>Token 余额</span>
                <span class="quota-val">{{ settings.tokenBalance.toLocaleString() }}</span>
              </div>
              <div class="quota-row">
                <span>当前模型</span>
                <span class="quota-val">{{ activeModel?.name }} (×{{ activeModel?.tokenMultiplier }})</span>
              </div>
            </template>
          </div>
        </div>

        <div class="quota-upgrade">
          <h4>升级套餐</h4>
          <p>升级后按 Token 计费，解锁全部模型和人设</p>
          <div class="plan-cards">
            <div class="plan-card" :class="{ current: userPlan === 'free' }">
              <div v-if="userPlan === 'free'" class="plan-current-tag">当前</div>
              <div class="plan-name">基础版</div>
              <div class="plan-price">免费</div>
              <div class="plan-qty">100 次/月</div>
              <div class="plan-feature">
                <div>✅ 100次/月</div>
                <div>✅ YUE Pro + YUE Fast</div>
                <div>✅ 基础数据分析</div>
              </div>
            </div>
            <div class="plan-card featured" :class="{ current: userPlan === 'pro' }">
              <div class="plan-badge">推荐</div>
              <div v-if="userPlan === 'pro'" class="plan-current-tag">当前</div>
              <div class="plan-name">专业版</div>
              <div class="plan-price">¥29/月</div>
              <div class="plan-qty">50万 Token</div>
              <div class="plan-feature">
                <div>✅ 50万Token/月</div>
                <div>✅ 全部模型解锁</div>
                <div>✅ 智能调度(YUE Auto)</div>
                <div>✅ 深度分析报告</div>
              </div>
              <button v-if="userPlan !== 'pro'" class="upgrade-btn" @click="switchPlan('pro')">升级</button>
            </div>
            <div class="plan-card" :class="{ current: userPlan === 'enterprise' }">
              <div v-if="userPlan === 'enterprise'" class="plan-current-tag">当前</div>
              <div class="plan-name">企业版</div>
              <div class="plan-price">¥99/月</div>
              <div class="plan-qty">无限 Token</div>
              <div class="plan-feature">
                <div>✅ 无限Token</div>
                <div>✅ 全部模型+优先推理</div>
                <div>✅ 专属顾问支持</div>
                <div>✅ API 接入权限</div>
              </div>
              <button v-if="userPlan !== 'enterprise'" class="upgrade-btn" @click="switchPlan('enterprise')">升级</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-page { min-height: 100vh; background: var(--bg); }

.settings-header {
  display: flex; align-items: center; gap: 16px;
  padding: 16px 24px; background: var(--surface);
  border-bottom: 1px solid var(--line); position: sticky; top: 0; z-index: 10;
}
.settings-header h2 { font-size: 18px; font-weight: 700; margin: 0; }
.back-btn { padding: 6px 12px; border-radius: 6px; font-size: 14px; color: var(--muted); }
.back-btn:hover { background: var(--surface-2); color: var(--text); }

.settings-body { max-width: 680px; margin: 0 auto; padding: 24px; }

.settings-tabs { display: flex; gap: 4px; margin-bottom: 24px; background: var(--surface-2); border-radius: 8px; padding: 3px; }
.stab { flex: 1; padding: 8px; border-radius: 6px; font-size: 14px; font-weight: 500; color: var(--muted); transition: all 0.15s; text-align: center; }
.stab.active { background: var(--surface); color: var(--text); box-shadow: 0 1px 3px rgba(0,0,0,0.08); }
.stab:hover:not(.active) { color: var(--text); }

.settings-section { background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); padding: 24px; }
.settings-section h3 { font-size: 16px; font-weight: 600; margin: 0 0 16px; }

.form-group { margin-bottom: 16px; }
.form-group label { display: block; font-size: 13px; color: var(--muted); margin-bottom: 6px; }
.field-input {
  width: 100%; padding: 10px 14px; border: 1px solid var(--line);
  border-radius: var(--radius); font-size: 14px; outline: none;
  background: var(--surface); color: var(--text); transition: border-color 0.15s;
}
.field-input:focus { border-color: var(--blue); }
.static-field { padding: 10px 14px; background: var(--surface-2); border-radius: var(--radius); font-size: 14px; color: var(--text); }
.plan-tag { font-size: 12px; font-weight: 600; padding: 2px 10px; border-radius: 10px; }
.plan-tag.free { background: var(--green-soft); color: var(--green); }
.plan-tag.pro { background: var(--blue-soft); color: var(--blue); }
.plan-tag.enterprise { background: var(--amber-soft); color: var(--amber); }

.douyin-bind-card { border: 1px solid var(--line); border-radius: var(--radius-sm); padding: 16px; }
.bound-status { display: flex; align-items: flex-start; gap: 12px; }
.bound-icon { font-size: 20px; margin-top: 2px; }
.bound-name { font-size: 15px; font-weight: 600; }
.bound-meta { display: flex; flex-direction: column; gap: 2px; font-size: 12px; color: var(--muted); margin-top: 4px; }
.unbind-btn { margin-top: 12px; font-size: 13px; color: var(--red); padding: 4px 12px; border-radius: var(--radius-sm); border: 1px solid var(--red); }
.unbind-btn:hover { background: var(--red-soft); }
.unbind-confirm { margin-top: 12px; display: flex; align-items: center; gap: 8px; font-size: 13px; }
.confirm-yes { padding: 4px 12px; border-radius: var(--radius-sm); background: var(--red); color: #fff; font-size: 13px; }
.confirm-no { padding: 4px 12px; border-radius: var(--radius-sm); border: 1px solid var(--line); font-size: 13px; }

.unbound-text { font-size: 14px; color: var(--muted); margin: 0 0 12px; }
.bind-btn {
  padding: 8px 20px; border-radius: var(--radius); border: 1px solid var(--line);
  font-size: 14px; font-weight: 500; display: inline-flex; align-items: center; gap: 6px;
  transition: all 0.15s;
}
.bind-btn:hover { border-color: var(--blue); color: var(--blue); }

.hint { font-size: 13px; color: var(--muted); margin: 0 0 16px; }

.yue-model-list { display: flex; flex-direction: column; gap: 8px; }
.yue-model-card {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 16px; border: 1px solid var(--line); border-radius: var(--radius-sm);
  cursor: pointer; transition: all 0.15s; position: relative;
}
.yue-model-card:hover:not(.locked) { border-color: var(--blue); }
.yue-model-card.active { border-color: var(--blue); background: var(--blue-soft); }
.yue-model-card.locked { opacity: 0.6; cursor: not-allowed; }
.yue-model-icon { font-size: 24px; flex-shrink: 0; }
.yue-model-info { flex: 1; }
.yue-model-name { font-size: 14px; font-weight: 600; }
.yue-model-desc { font-size: 12px; color: var(--muted); }
.yue-model-meta { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
.yue-tag { font-size: 11px; padding: 2px 8px; border-radius: 4px; font-weight: 500; }
.yue-tag.free { background: var(--green-soft); color: var(--green); }
.yue-tag.pro { background: var(--blue-soft); color: var(--blue); }
.yue-tag.enterprise { background: var(--amber-soft); color: var(--amber); }
.yue-multiplier { font-size: 12px; color: var(--muted); font-weight: 600; }
.lock-overlay { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.5); border-radius: var(--radius-sm); }
.lock-overlay span { font-size: 13px; font-weight: 600; color: var(--muted); }

.quota-card { display: flex; gap: 32px; align-items: center; }
.quota-visual { flex-shrink: 0; }
.quota-ring { position: relative; width: 120px; height: 120px; }
.quota-ring svg { width: 100%; height: 100%; }
.quota-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.quota-remaining { font-size: 28px; font-weight: 700; color: var(--ink); }
.quota-label { font-size: 12px; color: var(--muted); }
.quota-details { flex: 1; display: flex; flex-direction: column; gap: 12px; }
.quota-row { display: flex; justify-content: space-between; font-size: 14px; }
.quota-val { font-weight: 600; color: var(--ink); }

.quota-upgrade { margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--line); }
.quota-upgrade h4 { font-size: 15px; margin: 0 0 8px; }
.quota-upgrade p { font-size: 13px; color: var(--muted); margin: 0 0 16px; }

.plan-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.plan-card { border: 1px solid var(--line); border-radius: var(--radius-sm); padding: 16px; text-align: center; position: relative; }
.plan-card.featured { border-color: var(--blue); background: var(--blue-soft); }
.plan-card.current { border-color: var(--green); }
.plan-badge { position: absolute; top: -8px; left: 50%; transform: translateX(-50%); background: var(--blue); color: #fff; padding: 2px 10px; border-radius: 10px; font-size: 11px; font-weight: 600; }
.plan-current-tag { font-size: 11px; color: var(--green); font-weight: 600; margin-bottom: 4px; }
.plan-name { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
.plan-price { font-size: 20px; font-weight: 700; color: var(--ink); margin-bottom: 4px; }
.plan-qty { font-size: 12px; color: var(--muted); margin-bottom: 4px; }
.plan-feature { font-size: 11px; color: var(--soft); line-height: 1.6; }
.plan-feature div { text-align: left; padding-left: 4px; }
.info-tip {
  display: inline-flex; align-items: center; justify-content: center;
  width: 16px; height: 16px; border-radius: 50%; background: var(--surface-2);
  color: var(--muted); font-size: 11px; font-weight: 700;
  margin-left: 6px; cursor: help; position: relative; vertical-align: middle;
}
.info-tip:hover::after {
  content: attr(data-tip); position: absolute; bottom: calc(100% + 8px);
  left: 50%; transform: translateX(-50%); padding: 6px 12px; border-radius: 6px;
  background: var(--ink); color: #fff; font-size: 12px; font-weight: 400;
  white-space: nowrap; z-index: 100; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.info-tip:hover::before {
  content: ''; position: absolute; bottom: calc(100% + 2px);
  left: 50%; transform: translateX(-50%); border: 5px solid transparent;
  border-top-color: var(--ink); z-index: 100;
}
.upgrade-btn {
  margin-top: 8px; padding: 4px 16px; border-radius: var(--radius-sm);
  background: var(--blue); color: #fff; font-size: 12px; font-weight: 600;
  transition: opacity 0.15s;
}
.upgrade-btn:hover { opacity: 0.85; }
</style>
