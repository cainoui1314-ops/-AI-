<script setup lang="ts">
import { useChatStore } from '@/store/modules/chat'
import { useProductStore } from '@/store/modules/product'
import { useSkillsStore } from '@/store/modules/skills'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const chatStore = useChatStore()
const productStore = useProductStore()
const skillsStore = useSkillsStore()
const router = useRouter()
const { activeConversation } = storeToRefs(chatStore)

const lastOptions = computed(() => {
  if (!activeConversation.value) return null
  const msgs = activeConversation.value.messages
  for (let i = msgs.length - 1; i >= 0; i--) {
    if (msgs[i].guidedOptions && msgs[i].guidedOptions!.length > 0) {
      return msgs[i].guidedOptions
    }
  }
  return null
})

function streamReply(thinkingSteps: string[], content: string, products?: any[], options?: string[]) {
  const msgId = chatStore.startStreamingMessage()
  let i = 0
  const interval = setInterval(() => {
    if (i >= thinkingSteps.length) {
      clearInterval(interval)
      setTimeout(() => {
        const chars = [...content]
        let j = 0
        const contentInterval = setInterval(() => {
          if (j >= chars.length) {
            clearInterval(contentInterval)
            chatStore.finishStreaming(msgId, products, options)
            return
          }
          const chunkSize = Math.random() > 0.85 ? 3 : Math.random() > 0.5 ? 2 : 1
          chatStore.appendStreamContent(msgId, chars.slice(j, j + chunkSize).join(''), 'content')
          j += chunkSize
        }, 20 + Math.random() * 25)
      }, 300)
      return
    }
    chatStore.appendStreamContent(msgId, (i === 0 ? '' : '\n') + thinkingSteps[i], 'thinking')
    i++
  }, 250 + Math.random() * 200)
}

function selectOption(option: string) {
  if (option === '前往设置' || option === '查看额度详情' || option === '查看额度') {
    router.push('/settings')
    return
  }

  chatStore.addUserMessage(option)

  setTimeout(() => {
    const isProductClick = activeConversation.value!.messages.some(
      m => m.role === 'ai' && m.products?.some(p => option.includes(p.name))
    )

    if (isProductClick || option.includes('冰袖') || option.includes('T恤') || option.includes('风扇') || option.includes('防晒霜')) {
      handleProductFollowUp(option)
    } else if (option.includes('ROI') || option.includes('roi') || option.includes('利润')) {
      streamReply(
        ['看了一下你关注商品的利润数据...', '对比了同类目 Top 10 的定价策略', '嗯，利润空间还可以', '整理好了'],
        '嗯，我拉了一下利润数据——\n\n💰 利润率分析\n• 进货成本：约12-18元\n• 售价：29.9-59.9元\n• 平均利润率：35-45%\n• 日均ROI：2.8-3.5x\n\n说实话，这个利润空间不错。可以适度降价引流，转化率预计能提15%左右。\n\n要不要看具体哪个品？',
        undefined,
        ['查看具体商品的ROI', '帮我定个定价策略', '导出利润分析']
      )
    } else if (option.includes('竞品') || option.includes('对比')) {
      streamReply(
        ['拉了一下类目下的竞品数据...', '对比了 Top 3 的标题、主图和定价', '发现几个差距点', '整理完了'],
        '竞品这块我看了一下——\n\n🔍 Top 3 的情况\n• 月销量：10万+ / 8万+ / 5万+\n• 主图风格：场景图为主，元素很丰富\n• 定价区间：25-65元\n\n⚠️ 我们和他们的差距\n• 主图点击率低了大概8%\n• 标题关键词覆盖不够\n• 详情页卖点没提炼到位\n\n要我出个优化方案吗？',
        undefined,
        ['出个标题优化方案', '主图怎么改', '一键应用优化']
      )
    } else if (option.includes('类似') || option.includes('找')) {
      const products = productStore.getSampleProducts()
      streamReply(
        ['在同类目里筛了一下...', '匹配了价格带和人群画像', '挑了几个数据不错的', '排好序了'],
        '嗯，这几个和你关注的商品在类目、价格带、消费人群上高度重合。\n\n你看看有没有感兴趣的，我们细聊。',
        products,
        ['利润空间怎么样', '批量上架这些', '看更详细的数据']
      )
    } else if (option.includes('趋势') || option.includes('市场')) {
      streamReply(
        ['看了一下最近7天的搜索趋势...', '对比了几个热门品类的增速', '有几个品类在爆发前期', '数据整理好了'],
        '最近市场有个有意思的趋势——\n\n📈 近7天品类变化\n• 防晒品类搜索量+40%\n• 冰感面料商品增速+55%\n• 便携小电器需求+30%\n\n🏆 三个值得关注的方向\n1. 防晒冰袖 — 搜索飙升，竞争中等\n2. 凉感T恤 — 快速上升，窗口期大概3周\n3. 便携风扇 — 季节性爆发前夜\n\n你想看哪个？',
        undefined,
        ['看防晒品类爆品', '看凉感面料爆品', '帮我定个选品计划']
      )
    } else {
      const shortOpt = option.slice(0, 20)
      streamReply(
        ['理解一下你说的"' + shortOpt + '"...', '翻了一下相关数据', '结合行业经验想想', '好了，说下我的看法'],
        '嗯，关于\u300C' + option + '\u300D——\n\n从目前的数据来看：\n1. 市场容量是够的\n2. 竞争度中等，适合切入\n3. 利润率预计35-45%\n\n建议先小批量测试，看3天数据再决定要不要加量。别一上来就押太多。',
        undefined,
        ['看相关商品', '分析ROI', '定个执行计划']
      )
    }
  }, 200)
}

function handleProductFollowUp(option: string) {
  const productName = option.replace(/[\u300C\u300D]/g, '').replace(/分析|查看|找类似|的|和|利润空间|竞品数据|应季商品|市场趋势/g, '').trim()
  const derivedQuestions = chatStore.getDerivedQuestions(productName)

  const steps = [
    '聚焦看下' + productName + '的数据...',
    '拉了爆品指数和趋势',
    '对比了同类目的其他品',
    '整理好了',
  ]
  const content = '好，聚焦看下' + productName + '——\n\n📊 快速概览\n• 爆品指数：85-92分\n• 日销量趋势：持续上升\n• 利润空间：35-45%\n• 竞争程度：中等\n\n这个品值得关注。下面的方向你可以继续探索 👇'

  streamReply(steps, content, undefined, derivedQuestions)
}
</script>

<template>
  <div class="guided-options" v-if="lastOptions">
    <button
      v-for="(opt, i) in lastOptions"
      :key="i"
      class="option-btn"
      @click="selectOption(opt)"
    >{{ opt }}</button>
  </div>
</template>

<style scoped>
.guided-options {
  padding: 0 24px 12px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.option-btn {
  padding: 7px 16px;
  border-radius: 18px;
  background: var(--surface);
  border: 1px solid var(--line);
  color: var(--text);
  font-size: 13px;
  transition: all 0.15s;
  white-space: nowrap;
  cursor: pointer;
}
.option-btn:hover {
  border-color: var(--blue);
  color: var(--blue);
  background: var(--blue-soft);
}
</style>
