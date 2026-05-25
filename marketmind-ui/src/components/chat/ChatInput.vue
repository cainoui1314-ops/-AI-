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
      '⚠️ 额度用完了，去设置里升级一下套餐吧。',
      undefined,
      ['前往设置', '查看额度']
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

  const ctx = {
    msgCount,
    history,
    skill,
    persona,
    lastAiMsg: lastAiMsg?.content ?? '',
    lastUserMsg: lastUserMsg?.content ?? '',
  }

  const msgId = chatStore.startStreamingMessage()

  const thinkingSteps = generateThinkingSteps(text, ctx)
  streamThinking(msgId, thinkingSteps, () => {
    const reply = generateSmartReply(text, ctx)
    streamContent(msgId, reply.content, () => {
      chatStore.finishStreaming(msgId, reply.products, reply.options)
    })
  })
}

function generateThinkingSteps(text: string, ctx: {
  msgCount: number
  skill: ReturnType<typeof skillsStore.getActiveSkill>
  persona: ReturnType<typeof skillsStore.getActivePersona>
  lastAiMsg: string
  lastUserMsg: string
}): string[] {
  const isSelection = /找|推荐|爆|品|蓝海|选品/.test(text)
  const isOptimize = /优化|标题|主图|关键词/.test(text)
  const isListing = /上架|铺货|发布/.test(text)
  const isData = /数据|分析|诊断|流量|ROI|转化/.test(text)

  if (isSelection) {
    return [
      '先看看你问的关键词最近的搜索热度...',
      '对比了一下类目下 Top 20 商品的走势',
      '结合你的店铺定位筛选了几个方向',
      '嗯，利润空间和竞争度都考虑进去了',
    ]
  }
  if (isOptimize) {
    return [
      '看了一下你提到的商品当前数据...',
      '拉了同类目 Top 5 的标题结构做对比',
      '分析了一下搜索词的热度变化',
      '有个发现，可能是影响点击率的关键点',
    ]
  }
  if (isListing) {
    return [
      '先确认一下平台最新的类目规则...',
      '看了一下素材准备情况',
      '对比了几个上架策略的成功率',
      '好了，有思路了',
    ]
  }
  if (isData) {
    return [
      '拉了一下你店铺最近的数据...',
      '对比了行业均值和你店铺的差距',
      '发现一个有意思的趋势',
      '整理一下思路，给你说清楚',
    ]
  }
  return [
    `理解一下你的问题——"${text.slice(0, 20)}"`,
    '翻了一下相关数据和案例',
    '结合行业经验想想怎么帮你',
    ctx.msgCount > 3 ? '结合我们之前聊的内容...' : '好了，有想法了',
  ]
}

function streamThinking(msgId: string, steps: string[], onDone: () => void) {
  let i = 0
  const interval = setInterval(() => {
    if (i >= steps.length) {
      clearInterval(interval)
      setTimeout(onDone, 300)
      return
    }
    chatStore.appendStreamContent(msgId, (i === 0 ? '' : '\n') + steps[i], 'thinking')
    i++
  }, 250 + Math.random() * 200)
}

function streamContent(msgId: string, fullContent: string, onDone: () => void) {
  const chars = [...fullContent]
  let i = 0
  const interval = setInterval(() => {
    if (i >= chars.length) {
      clearInterval(interval)
      onDone()
      return
    }
    const chunkSize = Math.random() > 0.85 ? 3 : Math.random() > 0.5 ? 2 : 1
    const chunk = chars.slice(i, i + chunkSize).join('')
    chatStore.appendStreamContent(msgId, chunk, 'content')
    i += chunkSize
  }, 20 + Math.random() * 25)
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

  const openings = [
    '嗯，我看了一下。',
    '说实话，这个挺有意思的。',
    '好，说下我的看法。',
    '了解，我来分析下。',
    '对，我注意到一个点——',
  ]

  const followOpenings = [
    `关于「${text.slice(0, 15)}」，我接着刚才的说——`,
    `嗯，顺着我们的思路继续——`,
    `结合我们之前聊的，再补充几个点：`,
    `你提到的「${text.slice(0, 15)}」，我想了下——`,
  ]

  const personaVoice = ctx.persona
    ? {
        analyst: { say: '数据上看,', feel: '从数字里能看到不少东西' },
        consultant: { say: '从行业角度来看,', feel: '我在几个客户那里见过类似情况' },
        coach: { say: '来，跟着我,', feel: '一步一步来，不急' },
        boutique: { say: '细节决定成败,', feel: '这个地方很多人会忽略' },
        batch: { say: '效率第一,', feel: '批量操作的关键在于标准化' },
      }[ctx.persona.id] ?? { say: '', feel: '' }
    : { say: '', feel: '' }

  const isSelection = /找|推荐|爆|品|蓝海|选品/.test(text)
  const isOptimize = /优化|标题|主图|关键词/.test(text)
  const isListing = /上架|铺货|发布/.test(text)
  const isData = /数据|分析|诊断|流量|ROI|转化/.test(text)
  const isContinuation = ctx.msgCount > 4 && /继续|还有吗|然后呢|更多/.test(text)

  const contextRef = ctx.msgCount > 3
    ? `\n\n（ps，结合你之前说的「${ctx.lastUserMsg.slice(0, 15)}」）`
    : ''

  if (isContinuation) {
    return {
      content: `${picks(followOpenings)}\n\n${personaVoice.say} 还有几个方向你可以看看：\n\n1. ${picks(['深挖一下刚才的数据维度，看看有没有被忽略的', '看下竞品最近在这块的动态', '换个参数跑一轮新分析', '供应链那边可能有变化'])}\n2. ${picks(['对比一下你和头部卖家的差距到底在哪', '结合季节因素做点调整', '从用户差评里找找灵感，有时候比好评管用', '试个不同的定价策略'])}\n3. ${picks(['关注下下周的趋势预测', '做个小规模AB测试', '放到另一个平台试试水', '跟供应商聊聊降成本的事'])}${contextRef}`,
      options: picks([
        ['第一个方向展开说说', '直接给我操作步骤', '先做个AB测试'],
        ['给我看数据支撑', '帮我定个执行计划', '竞品怎么做的'],
        ['换个角度看看', '这个方案的预期效果', '有风险吗'],
      ]),
    }
  }

  if (isSelection) {
    const products = productStore.getSampleProducts()
    return {
      content: `${picks(openings)}${contextRef}\n\n${personaVoice.say} 我帮你筛了几个品，${personaVoice.feel}。\n\n你看看这几个，有感兴趣的我们细聊。`,
      products,
      options: picks([
        ['利润空间怎么样', '有没有竞争小一点的', '结合我店铺情况再推'],
        ['帮我对比下这几个', '先看第一个的数据', '这趋势能持续多久'],
        ['再看看其他的', '选品的逻辑是什么', '这几个品的风险'],
      ]),
    }
  }

  if (isOptimize) {
    return {
      content: `${picks(openings)}${contextRef}\n\n${personaVoice.say} 关于「${text.slice(0, 20)}」——\n\n${personaVoice.feel}。\n\n1. ${picks(['当前标题缺了几个高搜索量的词，加上"夏季""冰丝""凉感"试试', '主图的问题可能不在设计，在于没突出使用场景', '关键词布局太散了，集中一下效果会好很多'])}\n2. ${picks(['建议A/B测试，同时跑两版看数据', '看看类目前3的标题结构，有规律可循', '加点时效性的词，流量会明显上来'])}\n3. ${picks(['改完预计搜索曝光能提20-30%', '建议标题和主图一起改，别单改一个', '先改一个观察3天，别一口气全改了'])}`,
      options: picks([
        ['帮我直接改一版标题', '看下竞品的标题', '关键词热度排个序'],
        ['就按这个方案来', '还有别的建议吗', '给我看个案例'],
      ]),
    }
  }

  if (isListing) {
    return {
      content: `${picks(openings)}${contextRef}\n\n${personaVoice.say} 上架这块，${ctx.msgCount > 3 ? '按我们之前定的方向' : '先说几个关键点'}：\n\n1. ${picks(['类目映射规则最近有变化，先确认下', '素材准备好了再批量搞，不然容易翻车', '商品属性填完整，不然后面影响搜索权重'])}\n2. ${picks(['先小批量测试，别一上来就全铺', '抖音优先，其他平台可以缓一缓', '不同平台定价要有差异，别一刀切'])}\n3. ${picks(['上架后48小时内盯紧流量', '同步开基础投放，别等自然流量', '客服话术提前准备好'])}`,
      options: picks([
        ['批量上架到抖音', '跨平台铺货方案', '帮我设个上架模板'],
        ['先检查类目映射', '用什么模板好', '上架完怎么起量'],
      ]),
    }
  }

  if (isData) {
    const dataPoints = [
      `你店铺整体转化率${(Math.random() * 3 + 1).toFixed(1)}%，${picks(['比行业均值低一点', '中等水平', '但还有提升空间'])}`,
      `最近7天流量${picks(['涨了12%', '掉了5%', '基本没动'])}，${picks(['主要来自搜索', '推荐流量是大头', '付费占比有点高了'])}`,
      `爆款贡献了${Math.floor(Math.random() * 40 + 20)}%的GMV，${picks(['太依赖单品了', '分布还行', '得再养几个潜力款'])}`,
    ]
    return {
      content: `${picks(openings)}${contextRef}\n\n${personaVoice.say}\n\n${dataPoints.join('\n')}\n\n${ctx.msgCount > 3 ? '结合你之前的调整，' : ''}我的看法：\n1. ${picks(['先把转化最差的3个品拉出来看', '高ROI的品可以加大投放', '几个低效品该调价了'])}\n2. ${picks(['这周数据走势值得关注', '和上周对比一下更清楚', '我帮你做个7天优化计划'])}`,
      options: picks([
        ['深入分析一下', '帮我定个优化计划', '和竞品对比下'],
        ['从转化率开始', '给我具体怎么操作', '风险大吗'],
      ]),
    }
  }

  const generalReplies = [
    `${picks(openings)}${contextRef}\n\n${personaVoice.say} 关于「${text}」——\n\n${personaVoice.feel}。${ctx.msgCount > 3 ? '我们之前聊的那些我记着呢，' : ''}${picks(['几个思路：', '我的建议：', '先理一下：'])}\n\n1. ${picks(['先想清楚你核心要解决什么', '从最容易见效的地方入手', '看看同行怎么做的'])}\n2. ${picks(['做个快速调研', '看下数据里有没有异常', '关注下最近的行业变化'])}\n3. ${picks(['定个7天计划，别想太多先动起来', '先小范围测试一下', '拆成小步骤一步步来'])}\n\n你想先聊哪个？`,
    `${ctx.msgCount > 3 ? picks(followOpenings) : picks(openings)}\n\n${personaVoice.say}「${text}」这个方向不错。\n\n${personaVoice.feel}。${picks(['分两步走：', '有个关键点要注意：', '先排个优先级：'])}\n\n${picks(['先做市场验证', '确认你的差异化在哪', '找到你的核心优势'])}\n→ ${picks(['小规模测试验证', '研究头部卖家的策略', '从用户反馈里找线索'])}\n\n你想先从哪开始？`,
  ]

  return {
    content: picks(generalReplies),
    options: picks([
      ['详细分析数据', '看下市场趋势', '给我操作建议'],
      ['具体怎么操作', '先看竞品', '帮我定个计划'],
      ['换个角度看', '结合我店铺来', '这个方案的预期'],
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
        <div class="model-section-title">悦己模型</div>
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
