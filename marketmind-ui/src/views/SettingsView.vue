<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useSettingsStore } from '@/store/modules/settings'
import { storeToRefs } from 'pinia'
import { ref } from 'vue'
import type { ModelProvider } from '@/types'

const router = useRouter()
const settingsStore = useSettingsStore()
const { settings, remaining, activeProvider, activeModel } = storeToRefs(settingsStore)

const tab = ref('general')
const newProviderName = ref('')
const newProviderUrl = ref('')
const newProviderKey = ref('')

function goBack() {
  router.push('/')
}

function addProvider() {
  if (!newProviderName.value || !newProviderUrl.value) return
  const provider: ModelProvider = {
    id: `custom-${Date.now()}`,
    name: newProviderName.value,
    type: 'custom',
    baseUrl: newProviderUrl.value,
    apiKey: newProviderKey.value,
    models: [{ id: 'default', name: '默认模型', description: '自定义模型' }],
  }
  settingsStore.addCustomProvider(provider)
  newProviderName.value = ''
  newProviderUrl.value = ''
  newProviderKey.value = ''
}

function removeProvider(id: string) {
  settingsStore.removeCustomProvider(id)
}

function selectModel(providerId: string, modelId: string) {
  settingsStore.setActiveModel(providerId, modelId)
}

function saveProfile() {
  settingsStore.updateProfile(settings.value.userName, settings.value.shopName)
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
        <button class="stab" :class="{ active: tab === 'api' }" @click="tab = 'api'">API 接口</button>
        <button class="stab" :class="{ active: tab === 'quota' }" @click="tab = 'quota'">额度管理</button>
      </div>

      <div v-if="tab === 'general'" class="settings-section">
        <h3>个人信息</h3>
        <div class="form-group">
          <label>用户名</label>
          <el-input v-model="settings.userName" @blur="saveProfile" />
        </div>
        <div class="form-group">
          <label>店铺名称</label>
          <el-input v-model="settings.shopName" @blur="saveProfile" />
        </div>

        <h3 style="margin-top:32px">当前模型</h3>
        <div class="current-model">
          <div class="model-badge">{{ activeModel?.name || '未选择' }}</div>
          <div class="model-provider">{{ activeProvider?.name || '' }}</div>
        </div>
      </div>

      <div v-if="tab === 'api'" class="settings-section">
        <h3>内置模型（免费）</h3>
        <div class="provider-list">
          <div
            v-for="provider in settings.providers.filter(p => p.type === 'builtin')"
            :key="provider.id"
            class="provider-card"
            :class="{ active: settings.activeProviderId === provider.id }"
          >
            <div class="provider-header">
              <span class="provider-name">{{ provider.name }}</span>
              <span class="provider-type free">免费</span>
            </div>
            <div class="model-options">
              <button
                v-for="model in provider.models"
                :key="model.id"
                class="model-option"
                :class="{ active: settings.activeModelId === model.id }"
                @click="selectModel(provider.id, model.id)"
              >
                <span class="model-name">{{ model.name }}</span>
                <span class="model-desc">{{ model.description }}</span>
              </button>
            </div>
          </div>
        </div>

        <h3 style="margin-top:32px">自定义 API</h3>
        <p class="hint">添加你自己的 API 接口，支持 OpenAI 兼容格式</p>

        <div class="custom-providers">
          <div
            v-for="provider in settings.providers.filter(p => p.type === 'custom')"
            :key="provider.id"
            class="provider-card custom"
          >
            <div class="provider-header">
              <span class="provider-name">{{ provider.name }}</span>
              <div class="provider-actions">
                <span class="provider-type custom-tag">自定义</span>
                <button class="remove-btn" @click="removeProvider(provider.id)">删除</button>
              </div>
            </div>
            <div class="provider-url">{{ provider.baseUrl }}</div>
            <div class="model-options">
              <button
                v-for="model in provider.models"
                :key="model.id"
                class="model-option"
                :class="{ active: settings.activeProviderId === provider.id && settings.activeModelId === model.id }"
                @click="selectModel(provider.id, model.id)"
              >{{ model.name }}</button>
            </div>
          </div>
        </div>

        <div class="add-provider-form">
          <div class="form-row">
            <el-input v-model="newProviderName" placeholder="名称（如：My GPT-4）" />
            <el-input v-model="newProviderUrl" placeholder="API Base URL" />
          </div>
          <div class="form-row">
            <el-input v-model="newProviderKey" placeholder="API Key（可选）" type="password" show-password />
            <el-button type="primary" @click="addProvider">添加</el-button>
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
                  :stroke-dasharray="`${(settings.quota.used / settings.quota.total) * 327} 327`"
                  stroke-linecap="round"
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div class="quota-center">
                <div class="quota-remaining">{{ remaining }}</div>
                <div class="quota-label">剩余次数</div>
              </div>
            </div>
          </div>
          <div class="quota-details">
            <div class="quota-row">
              <span>已使用</span>
              <span class="quota-val">{{ settings.quota.used }} 次</span>
            </div>
            <div class="quota-row">
              <span>总额度</span>
              <span class="quota-val">{{ settings.quota.total }} 次</span>
            </div>
            <div class="quota-row">
              <span>重置日期</span>
              <span class="quota-val">{{ settings.quota.resetDate }}</span>
            </div>
          </div>
        </div>

        <div class="quota-upgrade">
          <h4>💡 升级套餐</h4>
          <p>免费版每月 100 次对话。如需更多次数，后续可购买套餐：</p>
          <div class="plan-cards">
            <div class="plan-card">
              <div class="plan-name">基础版</div>
              <div class="plan-price">免费</div>
              <div class="plan-qty">100 次/月</div>
            </div>
            <div class="plan-card featured">
              <div class="plan-badge">推荐</div>
              <div class="plan-name">专业版</div>
              <div class="plan-price">¥29/月</div>
              <div class="plan-qty">1000 次/月</div>
            </div>
            <div class="plan-card">
              <div class="plan-name">企业版</div>
              <div class="plan-price">¥99/月</div>
              <div class="plan-qty">无限次</div>
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

.current-model { display: flex; align-items: center; gap: 12px; }
.model-badge { padding: 6px 14px; background: var(--blue-soft); color: var(--blue); border-radius: 8px; font-size: 14px; font-weight: 600; }
.model-provider { font-size: 13px; color: var(--muted); }

.provider-list { display: flex; flex-direction: column; gap: 12px; }
.provider-card { border: 1px solid var(--line); border-radius: var(--radius-sm); padding: 16px; }
.provider-card.active { border-color: var(--blue); background: var(--blue-soft); }
.provider-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
.provider-name { font-size: 14px; font-weight: 600; }
.provider-type { font-size: 11px; padding: 2px 8px; border-radius: 4px; font-weight: 500; }
.provider-type.free { background: var(--green-soft); color: var(--green); }
.provider-type.custom-tag { background: var(--amber-soft); color: var(--amber); }
.provider-actions { display: flex; align-items: center; gap: 8px; }
.provider-url { font-size: 12px; color: var(--muted); margin-bottom: 8px; word-break: break-all; }
.remove-btn { font-size: 12px; color: var(--red); }
.remove-btn:hover { text-decoration: underline; }

.model-options { display: flex; gap: 8px; flex-wrap: wrap; }
.model-option { padding: 6px 12px; border-radius: 6px; background: var(--surface); border: 1px solid var(--line); font-size: 13px; transition: all 0.15s; display: flex; flex-direction: column; gap: 2px; }
.model-option:hover { border-color: var(--blue); }
.model-option.active { background: var(--blue); color: #fff; border-color: var(--blue); }
.model-name { font-weight: 500; }
.model-desc { font-size: 11px; color: var(--muted); }
.model-option.active .model-desc { color: rgba(255,255,255,0.7); }

.hint { font-size: 13px; color: var(--muted); margin: 0 0 16px; }

.custom-providers { display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px; }

.add-provider-form { border: 1px dashed var(--line); border-radius: var(--radius-sm); padding: 16px; }
.form-row { display: flex; gap: 8px; margin-bottom: 8px; }
.form-row:last-child { margin-bottom: 0; }

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
.plan-badge { position: absolute; top: -8px; left: 50%; transform: translateX(-50%); background: var(--blue); color: #fff; padding: 2px 10px; border-radius: 10px; font-size: 11px; font-weight: 600; }
.plan-name { font-size: 14px; font-weight: 600; margin-bottom: 4px; }
.plan-price { font-size: 20px; font-weight: 700; color: var(--ink); margin-bottom: 4px; }
.plan-qty { font-size: 12px; color: var(--muted); }
</style>
