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

const { activeModel, remaining, quotaLabel } = storeToRefs(settingsStore)

const visibleModels = computed(() => {
  return settingsStore.yueModels.map(m => ({
    id: m.id,
    name: m.name,
    icon: m.icon,
    tag: m.tag,
    locked: m.requiredPlan !== 'free' && !settingsStore.isPro(),
  }))
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

function selectModel(modelId: string) {
  settingsStore.setActiveModel(modelId)
  showModelMenu.value = false
}

function sendMessage() {
  const text = inputText.value.trim()
  if (!text) return

  if (!settingsStore.canUse()) {
    chatStore.addAiMessage(
      '⚠️ 你的额度已用完。\n\n请前往设置页面升级套餐，或等待额度重置。',
      undefined,
      ['前往设置', '查看额度详情']
    )
    inputText.value = ''
    return
  }

  chatStore.addUserMessage(text)
  const modelMultiplier = activeModel.value?.tokenMultiplier ?? 1
  settingsStore.useQuota(Math.round(modelMultiplier * 100))
  inputText.value = ''
  showSlashMenu.value = false

  const conv = chatStore.activeConversation
  const history = conv?.messages ?? []
  const msgCount = history.length
  const skill = chatStore.activeConversation?.activeSkill
    ? skillsStore.getActiveSkill()
    : null
  const persona = skill
    ? skillsStore.getActivePersona(skill.id)
    : null
  const lastAiMsg = [...history].reverse().find(m => m.role === 'ai')
  const lastUserMsg = [...history].reverse().find(m => m.role === 'user')

  setTimeout(() => {
    const reply = generateSmartReply(text, {
      msgCount,
      history,
      skill,
      persona,
      lastAiMsg: lastAiMsg?.content ?? '',
      lastUserMsg: lastUserMsg?.content ?? '',
    })
    chatStore.addAiMessage(reply.content, reply.products, reply.options)
  }, 400 + Math.random() * 400)
}

function generateSmartReply(
  text: string,
  ctx: {
    msgCount: number
    history: { role: string; content: string }[]
    skill: ReturnType<typeof skillsStore.getActiveSkill>
    persona: ReturnType<typeof skillsStore.getActivePersona>
    lastAiMsg: string
    lastUserMsg: string
  }
): { content: string; products?: any[]; options: string[] } {
  const picks = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]

  const greetings = [
    '好的，我来帮你看看。',
    '没问题，马上分析。',
    '收到！这就处理。',
    '了解，我来分析一下。',
    '好的，基于目前的数据来看——',
  ]

  const followUps = [
    `关于「${text.slice(0, 15)}」，我继续深入分析：`,
    `顺着刚才的思路，针对「${text.slice(0, 15)}」：`,
    `结合之前的讨论，我补充几点：`,
    `在你提到的「${text.slice(0, 15)}」基础上：`,
    `基于我们已经聊过的内容：`,
  ]

  const personaTone = ctx.persona
    ? {
        analyst: { prefix: '📊 数据上看，', style: '具体数据' },
        consultant: { prefix: '💼 从行业经验来看，', style: '战略建议' },
        coach: { prefix: '👉 第一步，', style: '操作步骤' },
        boutique: { prefix: '✨ 精细化角度，', style: '细节优化' },
        batch: { prefix: '📦 效率优先，', style: '批量操作' },
      }[ctx.persona.id] ?? { prefix: '', style: '' }
    : { prefix: '', style: '' }

  const isSelection = text.includes('找') || text.includes('推荐') || text.includes('爆') || text.includes('品') || text.includes('蓝海') || text.includes('选品')
  const isOptimize = text.includes('优化') || text.includes('标题') || text.includes('主图') || text.includes('关键词')
  const isListing = text.includes('上架') || text.includes('铺货') || text.includes('发布')
  const isData = text.includes('数据') || text.includes('分析') || text.includes('诊断') || text.includes('流量') || text.includes('ROI') || text.includes('转化')
  const isContinuation = ctx.msgCount > 3 && (text.includes('继续') || text.includes('还有吗') || text.includes('然后呢') || text.includes('更多'))

  if (isContinuation) {
    return {
      content: `${picks(followUps)}\n\n${personaTone.prefix}我注意到我们之前讨论过「${ctx.lastUserMsg.slice(0, 20)}」，这里有几个延伸方向：\n\n1. ${picks(['深挖刚才提到的数据维度', '看看竞品在这块的策略', '调整参数再跑一轮分析', '关注下供应链侧的变化'])}\n2. ${picks(['对比你店铺和其他头部卖家的差距', '结合季节性因素做调整', '从用户评价里找灵感', '测试不同定价策略'])}\n3. ${picks(['关注下周的流量趋势', '做个小规模AB测试', '把这个品放到其他平台试试', '联系供应商谈成本优化'])}`,
      options: picks([
        ['深入分析第一个方向', '执行第二个方案', '先做AB测试'],
        ['给我更多数据支撑', '帮我制定执行计划', '看下竞品怎么做的'],
        ['换个角度分析', '给我具体的操作步骤', '这个方案的预期效果'],
      ]),
    }
  }

  if (isSelection) {
    const products = productStore.getSampleProducts()
    const contextNote = ctx.msgCount > 2
      ? `\n\n补充：结合你之前提到的「${ctx.lastUserMsg.slice(0, 15)}」，我调整了推荐权重。`
      : ''
    return {
      content: `${picks(greetings)}${contextNote}\n\n${personaTone.prefix}已分析「${text}」相关商品，以下是推荐：\n\n点击商品查看详情，或告诉我你更关注哪类。`,
      products,
      options: picks([
        ['查看更多类似商品', '分析推荐商品ROI', '制定选品策略'],
        ['这些品的利润空间如何', '有没有竞争更小的', '结合我的店铺推荐'],
        ['帮我对比这几个品', '先看第一个的详细数据', '这几个品的趋势能持续吗'],
      ]),
    }
  }

  if (isOptimize) {
    const prevContext = ctx.lastAiMsg ? `\n\n（我注意到我们之前聊过相关话题，这次我会结合之前的分析来优化。）` : ''
    return {
      content: `${picks(greetings)}${prevContext}\n\n${personaTone.prefix}关于「${text.slice(0, 20)}」的优化：\n\n1. ${picks(['当前标题缺少高搜索量关键词，建议加入"夏季""冰丝""凉感"等热词', '主图点击率偏低，建议突出使用场景和效果对比', '关键词布局不够，建议长尾词+核心词组合'])}\n2. ${picks(['可以试试A/B测试，同时跑两版标题看数据', '参考类目Top3的标题结构做优化', '加入季节性关键词提升时效流量'])}\n3. ${picks(['优化后预计搜索曝光提升20-30%', '建议同步优化主图形成组合效应', '先改标题观察3天数据再做下一步'])}`,
      options: picks([
        ['帮我生成优化后的标题', '看下竞品的标题怎么写的', '分析关键词热度'],
        ['直接执行这个优化方案', '还有其他优化建议吗', '给我看个案例'],
      ]),
    }
  }

  if (isListing) {
    return {
      content: `${picks(greetings)}\n\n${personaTone.prefix}关于上架需求：\n\n${ctx.msgCount > 2 ? '结合我们之前分析的选品方向，' : ''}我建议：\n\n1. ${picks(['先确认目标平台的类目映射规则', '准备好所有素材再批量操作', '检查下商品属性是否完整'])}\n2. ${picks(['建议用模板先跑一个小批量测试', '跨平台铺货建议先上抖音再做其他', '注意不同平台的定价策略差异'])}\n3. ${picks(['上架后48小时内关注流量数据', '同步开启基础流量投放', '做好客服话术准备'])}`,
      options: picks([
        ['批量上架到抖音', '跨平台铺货', '设置上架模板'],
        ['先帮我检查类目映射', '用什么模板比较好', '上架后怎么起量'],
      ]),
    }
  }

  if (isData) {
    const dataPoints = [
      `店铺整体转化率${(Math.random() * 3 + 1).toFixed(1)}%，${picks(['略低于行业均值', '处于中等水平', '有提升空间'])}`,
      `近7天流量${picks(['上涨12%', '下降5%', '基本持平'])}，${picks(['主要来自搜索', '推荐流量占大头', '付费占比偏高'])}`,
      `爆款品贡献了${Math.floor(Math.random() * 40 + 20)}%的GMV，${picks(['头部集中度偏高', '分布还算健康', '需要培育更多潜力款'])}`,
    ]
    return {
      content: `${picks(greetings)}\n\n${personaTone.prefix}关于「${text}」的数据分析：\n\n${dataPoints.join('\n')}\n\n${ctx.msgCount > 3 ? '结合你之前的操作和反馈，' : ''}我的建议：\n1. ${picks(['先优化转化率最低的3个商品', '加大高ROI品的投放', '调整低效品的定价策略'])}\n2. ${picks(['关注这周的数据变化趋势', '和上周做个对比分析', '制定一个7天优化计划'])}`,
      options: picks([
        ['详细分析数据', '制定优化计划', '看下竞品数据对比'],
        ['帮我深入诊断', '先从转化率入手', '给我具体的执行方案'],
      ]),
    }
  }

  const generalReplies = [
    `${picks(greetings)}\n\n${personaTone.prefix}关于「${text}」，我来分析：\n\n${ctx.msgCount > 3 ? `结合我们之前讨论的内容，` : ''}${picks(['从数据角度', '从运营经验来看', '从实操角度'])}，我有几个思路：\n\n1. ${picks(['先明确你的核心目标是什么', '从最可能见效的地方入手', '参考同行的成功案例'])}\n2. ${picks(['做一个快速的竞品调研', '看下你店铺的数据异常点', '结合当前的行业趋势'])}\n3. ${picks(['制定一个可执行的7天计划', '先跑一个小测试验证方向', '把这个拆解成具体步骤'])}\n\n你想从哪个方向开始？`,
    `${ctx.msgCount > 3 ? picks(followUps) : picks(greetings)}\n\n${personaTone.prefix}「${text}」是个好方向。\n\n${ctx.msgCount > 3 ? '基于我们之前的讨论，' : ''}${picks(['我的建议是分两步走', '这里有个关键决策点', '先理清优先级'])}：\n\n${picks(['第一步：做市场验证', '首先：确认你的差异化点', '关键：找到你的核心优势'])}\n→ ${picks(['通过小规模测试来验证', '分析头部卖家的策略', '从你的用户评价中找线索'])}\n\n你想先聊哪个方面？`,
  ]

  return {
    content: picks(generalReplies),
    options: picks([
      ['详细分析数据', '查看市场趋势', '获取操作建议'],
      ['给我具体的执行步骤', '先看竞品怎么做的', '帮我制定一个计划'],
      ['换个角度分析', '结合我的店铺情况', '这个方案的预期效果'],
    ]),
  }
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
        <div class="model-section-title">YUE 模型</div>
        <div
          v-for="m in settingsStore.yueModels.filter(x => !x.id.includes('deepseek') && !x.id.includes('glm') && !x.id.includes('qwen'))"
          :key="m.id"
          class="model-item"
          :class="{ active: settingsStore.data.activeModelId === m.id }"
          @click="selectModel(m.id)"
        >
          <span class="model-item-icon">{{ m.icon }}</span>
          <div class="model-item-info">
            <div class="model-item-name">{{ m.name }}</div>
            <div class="model-item-desc">{{ m.description }}</div>
          </div>
          <span v-if="settingsStore.data.activeModelId === m.id" class="model-check">✓</span>
        </div>
        <div class="model-section-title" style="margin-top: 6px;">免费模型</div>
        <div
          v-for="m in settingsStore.yueModels.filter(x => x.id.includes('deepseek') || x.id.includes('glm') || x.id.includes('qwen'))"
          :key="m.id"
          class="model-item"
          :class="{ active: settingsStore.data.activeModelId === m.id }"
          @click="selectModel(m.id)"
        >
          <span class="model-item-icon">{{ m.icon }}</span>
          <div class="model-item-info">
            <div class="model-item-name">{{ m.name }}</div>
            <div class="model-item-desc">{{ m.description }}</div>
          </div>
          <span v-if="settingsStore.data.activeModelId === m.id" class="model-check">✓</span>
        </div>
      </div>

      <div class="input-bar">
        <button class="model-btn" @click="showModelMenu = !showModelMenu; showSlashMenu = false">
          <span class="model-btn-icon">{{ activeModel?.icon }}</span>
          <span class="model-btn-name">{{ activeModel?.name || 'YUE Pro' }}</span>
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
          <button class="quota-badge" @click="router.push('/settings')">
            <span class="quota-dot"></span>
            {{ remaining }} {{ quotaLabel }}
          </button>
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
  position: absolute; bottom: 100%; right: 0; width: 280px;
  background: var(--surface); border: 1px solid var(--line);
  border-radius: var(--radius); box-shadow: 0 8px 24px rgba(15,23,42,0.12);
  z-index: 50; margin-bottom: 8px; padding: 8px;
}
.model-section-title { font-size: 11px; font-weight: 600; color: var(--muted); padding: 4px 8px; letter-spacing: 0.5px; }
.model-item { display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 6px; cursor: pointer; transition: background 0.1s; }
.model-item:hover { background: var(--surface-2); }
.model-item.active { background: var(--blue-soft); }
.model-item-icon { font-size: 18px; flex-shrink: 0; }
.model-item-info { flex: 1; }
.model-item-name { font-size: 13px; font-weight: 500; color: var(--text); }
.model-item-desc { font-size: 11px; color: var(--muted); }
.model-check { color: var(--blue); font-weight: 700; font-size: 14px; }

.input-bar {
  display: flex; align-items: center; gap: 0;
  background: var(--surface-2); border: 1px solid var(--line);
  border-radius: 24px; padding: 4px;
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
.model-btn-icon { font-size: 14px; }
.model-btn-name { font-size: 12px; }

.msg-input {
  flex: 1; border: none; background: transparent; outline: none;
  font-size: 14px; color: var(--text); padding: 8px 12px; min-width: 0;
}
.msg-input::placeholder { color: var(--soft); }

.input-actions { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }

.quota-badge {
  font-size: 11px; font-weight: 600; color: var(--muted);
  padding: 3px 10px; border-radius: 12px; background: var(--surface);
  cursor: pointer; transition: all 0.15s;
  display: flex; align-items: center; gap: 4px;
}
.quota-badge:hover { color: var(--blue); background: var(--blue-soft); }
.quota-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--green); flex-shrink: 0; }

.send-btn {
  width: 36px; height: 36px; border-radius: 50%;
  background: var(--blue); color: #fff;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s; flex-shrink: 0;
}
.send-btn:hover:not(:disabled) { background: #3d5ce0; transform: scale(1.05); }
.send-btn:disabled { background: var(--surface-3); color: var(--soft); cursor: default; }
</style>
