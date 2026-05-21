<script setup lang="ts">
import { useChatStore } from '@/store/modules/chat'
import { useSkillsStore } from '@/store/modules/skills'
import { useSettingsStore } from '@/store/modules/settings'
import { useProductStore } from '@/store/modules/product'
import { storeToRefs } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const chatStore = useChatStore()
const skillsStore = useSkillsStore()
const settingsStore = useSettingsStore()
const productStore = useProductStore()
const router = useRouter()

const inputText = ref('')
const showSlashMenu = ref(false)
const showModelMenu = ref(false)

const { activeModel, remaining } = storeToRefs(settingsStore)

const allModels = computed(() => {
  const result: { providerId: string; providerName: string; modelId: string; modelName: string }[] = []
  for (const p of settingsStore.settings.providers) {
    for (const m of p.models) {
      result.push({ providerId: p.id, providerName: p.name, modelId: m.id, modelName: m.name })
    }
  }
  return result
})

const slashFilter = computed(() => {
  if (!inputText.value.startsWith('/')) return ''
  return inputText.value.slice(1).toLowerCase()
})

const filteredSkills = computed(() => {
  if (!showSlashMenu.value) return []
  const all = skillsStore.getAllEnabled()
  if (!slashFilter.value) return all
  return all.filter(s =>
    s.slashCommand.toLowerCase().includes(slashFilter.value) ||
    s.name.toLowerCase().includes(slashFilter.value)
  )
})

function onInput() {
  showSlashMenu.value = inputText.value.startsWith('/')
}

function selectSlashSkill(skillId: string) {
  const skill = skillsStore.getAllEnabled().find(s => s.id === skillId)
  if (skill) {
    inputText.value = skill.presetPrompt
    showSlashMenu.value = false
  }
}

function selectModel(providerId: string, modelId: string) {
  settingsStore.setActiveModel(providerId, modelId)
  showModelMenu.value = false
}

function sendMessage() {
  const text = inputText.value.trim()
  if (!text) return

  if (!settingsStore.canUse()) {
    chatStore.addAiMessage(
      '⚠️ 你的免费额度已用完（100次/月）。\n\n请前往设置页面升级套餐，或等待下月额度重置。',
      undefined,
      ['前往设置', '查看额度详情']
    )
    inputText.value = ''
    return
  }

  chatStore.addUserMessage(text)
  settingsStore.useQuota()
  inputText.value = ''
  showSlashMenu.value = false

  setTimeout(() => {
    if (text.includes('找') || text.includes('推荐') || text.includes('爆') || text.includes('品') || text.includes('蓝海')) {
      const products = productStore.getSampleProducts()
      chatStore.addAiMessage(
        `已为你分析「${text}」相关商品，以下是 4 个推荐：\n\n点击商品查看详情，或选择下方选项继续对话。`,
        products,
        ['查看更多类似商品', '分析推荐商品ROI', '制定选品策略']
      )
    } else if (text.includes('优化') || text.includes('标题') || text.includes('主图')) {
      chatStore.addAiMessage(
        '好的，我来帮你优化。\n\n请提供需要优化的商品名称或ID，我将为你：\n1. 分析当前标题关键词\n2. 生成优化方案\n3. 提供A/B测试建议',
        undefined,
        ['优化商品标题', '生成新主图方案', '查看优化案例']
      )
    } else if (text.includes('上架') || text.includes('铺货')) {
      chatStore.addAiMessage(
        '收到上架需求。\n\n请确认：\n1. 目标平台（抖音/快手/淘宝）\n2. 商品数量\n3. 是否需要自动类目映射',
        undefined,
        ['批量上架到抖音', '跨平台铺货', '设置上架模板']
      )
    } else {
      chatStore.addAiMessage(
        `我理解你的需求：「${text}」\n\n让我为你分析...\n\n基于当前数据，我有以下建议：\n1. 建议先做市场调研\n2. 关注竞品动态\n3. 选择合适时机操作\n\n你想从哪个方面开始？`,
        undefined,
        ['详细分析数据', '查看市场趋势', '获取操作建议']
      )
    }
  }, 600)
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    if (showSlashMenu.value) {
      e.preventDefault()
      if (filteredSkills.value.length === 1) selectSlashSkill(filteredSkills.value[0].id)
    }
  }
  if (e.key === 'Escape') {
    showSlashMenu.value = false
    showModelMenu.value = false
  }
}
</script>

<template>
  <div class="chat-input">
    <div class="input-wrapper">
      <div class="slash-menu" v-if="showSlashMenu && filteredSkills.length">
        <div v-for="skill in filteredSkills" :key="skill.id" class="slash-item" @click="selectSlashSkill(skill.id)">
          <span class="slash-icon">{{ skill.icon }}</span>
          <div class="slash-info">
            <span class="slash-name">{{ skill.slashCommand }} {{ skill.name }}</span>
            <span class="slash-desc">{{ skill.description }}</span>
          </div>
        </div>
      </div>

      <div class="model-picker" v-if="showModelMenu" @click.stop>
        <div class="model-section-title">选择模型</div>
        <div
          v-for="m in allModels"
          :key="m.providerId + m.modelId"
          class="model-item"
          :class="{ active: settingsStore.settings.activeProviderId === m.providerId && settingsStore.settings.activeModelId === m.modelId }"
          @click="selectModel(m.providerId, m.modelId)"
        >
          <div class="model-item-name">{{ m.modelName }}</div>
          <div class="model-item-provider">{{ m.providerName }}</div>
          <span v-if="settingsStore.settings.activeProviderId === m.providerId && settingsStore.settings.activeModelId === m.modelId" class="model-check">✓</span>
        </div>
      </div>

      <div class="input-bar">
        <button class="model-btn" @click="showModelMenu = !showModelMenu; showSlashMenu = false">
          <span class="model-btn-dot"></span>
          <span class="model-btn-name">{{ activeModel?.name || '选择模型' }}</span>
        </button>

        <input
          v-model="inputText"
          class="msg-input"
          placeholder="输入消息，/ 调用技能..."
          @input="onInput"
          @keydown="handleKeydown"
          @keyup.enter="sendMessage"
        />

        <div class="input-actions">
          <button class="quota-badge" @click="router.push('/settings')">{{ remaining }}</button>
          <button class="send-btn" @click="sendMessage" :disabled="!inputText.trim()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chat-input {
  padding: 12px 24px 20px;
  background: var(--surface);
  position: relative;
}

.input-wrapper {
  max-width: 720px;
  margin: 0 auto;
  position: relative;
}

.slash-menu {
  position: absolute; bottom: 100%; left: 0; right: 0;
  background: var(--surface); border: 1px solid var(--line);
  border-radius: var(--radius); box-shadow: 0 8px 24px rgba(15,23,42,0.12);
  max-height: 280px; overflow-y: auto; z-index: 50; margin-bottom: 8px;
}
.slash-item { display: flex; align-items: center; gap: 10px; padding: 10px 14px; cursor: pointer; transition: background 0.1s; }
.slash-item:hover { background: var(--surface-2); }
.slash-icon { font-size: 20px; flex-shrink: 0; }
.slash-info { flex: 1; }
.slash-name { font-size: 13px; font-weight: 600; color: var(--text); }
.slash-desc { display: block; font-size: 12px; color: var(--muted); }

.model-picker {
  position: absolute; bottom: 100%; right: 0; width: 260px;
  background: var(--surface); border: 1px solid var(--line);
  border-radius: var(--radius); box-shadow: 0 8px 24px rgba(15,23,42,0.12);
  z-index: 50; margin-bottom: 8px; padding: 8px;
}
.model-section-title { font-size: 11px; font-weight: 600; color: var(--muted); padding: 4px 8px; text-transform: uppercase; letter-spacing: 0.5px; }
.model-item { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 6px; cursor: pointer; transition: background 0.1s; }
.model-item:hover { background: var(--surface-2); }
.model-item.active { background: var(--blue-soft); }
.model-item-name { flex: 1; font-size: 13px; font-weight: 500; color: var(--text); }
.model-item-provider { font-size: 11px; color: var(--muted); }
.model-check { color: var(--blue); font-weight: 700; font-size: 14px; }

.input-bar {
  display: flex; align-items: center; gap: 0;
  background: var(--surface-2); border: 1px solid var(--line);
  border-radius: 24px; padding: 4px 4px 4px 4px;
  transition: border-color 0.15s;
}
.input-bar:focus-within { border-color: var(--blue); }

.model-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 12px; border-radius: 20px; background: var(--surface);
  font-size: 12px; font-weight: 500; color: var(--text);
  white-space: nowrap; transition: background 0.15s; flex-shrink: 0;
}
.model-btn:hover { background: var(--surface-3); }
.model-btn-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--green); flex-shrink: 0; }
.model-btn-name { font-size: 12px; }

.msg-input {
  flex: 1; border: none; background: transparent; outline: none;
  font-size: 14px; color: var(--text); padding: 8px 12px; min-width: 0;
}
.msg-input::placeholder { color: var(--soft); }

.input-actions { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }

.quota-badge {
  font-size: 11px; font-weight: 600; color: var(--muted);
  padding: 2px 8px; border-radius: var(--radius); background: var(--surface);
  cursor: pointer; transition: all 0.15s;
}
.quota-badge:hover { color: var(--blue); background: var(--blue-soft); }

.send-btn {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--blue); color: #fff;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s; flex-shrink: 0;
}
.send-btn:hover:not(:disabled) { background: #3d5ce0; transform: scale(1.05); }
.send-btn:disabled { background: var(--surface-3); color: var(--soft); cursor: default; }
</style>
