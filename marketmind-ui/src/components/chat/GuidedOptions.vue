<script setup lang="ts">
import { useChatStore } from '@/store/modules/chat'
import { useProductStore } from '@/store/modules/product'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const chatStore = useChatStore()
const productStore = useProductStore()
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

function selectOption(option: string) {
  if (option === '前往设置' || option === '查看额度详情') {
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
      chatStore.addAiMessage(
        'ROI分析报告：\n\n📊 利润率分析\n• 进货成本：约12-18元\n• 售价：29.9-59.9元\n• 平均利润率：35-45%\n• 日均ROI：2.8-3.5x\n\n💡 建议：利润空间充足，可以适度降价引流，预计转化率提升15%\n\n需要更详细的单商品分析吗？',
        undefined,
        ['查看具体商品的ROI', '制定定价策略', '导出利润分析报告']
      )
    } else if (option.includes('竞品') || option.includes('对比')) {
      chatStore.addAiMessage(
        '竞品分析结果：\n\n🔍 竞品概览\n• Top 3 竞品月销量：10万+ / 8万+ / 5万+\n• 主图风格：以场景图为主，元素丰富\n• 定价区间：25-65元\n\n⚠️ 我们的差距\n• 主图点击率偏低8%\n• 标题关键词覆盖不足\n• 详情页卖点提炼不够精准\n\n需要我生成优化方案吗？',
        undefined,
        ['生成标题优化方案', '生成主图优化方案', '一键应用到我的商品']
      )
    } else if (option.includes('类似') || option.includes('找')) {
      const products = productStore.getSampleProducts()
      chatStore.addAiMessage(
        '为你找到了类似商品：\n\n这些品和你的目标商品在类目、价格带、消费人群上高度重合。',
        products,
        ['分析这些品的利润空间', '批量上架这些商品', '查看更详细的数据']
      )
    } else if (option.includes('趋势') || option.includes('市场')) {
      chatStore.addAiMessage(
        '市场趋势分析：\n\n📈 近7天品类趋势\n• 防晒品类搜索量+40%\n• 冰感面料商品增速+55%\n• 便携小电器需求+30%\n\n🏆 机会品类\n1. 防晒冰袖 — 搜索飙升，竞争中等\n2. 凉感T恤 — 快速上升，窗口期3周\n3. 便携风扇 — 季节性爆发前夜\n\n你想深入哪个品类？',
        undefined,
        ['查看防晒品类爆品', '查看凉感面料爆品', '制定选品计划']
      )
    } else {
      chatStore.addAiMessage(
        `关于「${option}」，让我为你分析...\n\n基于当前市场数据：\n1. 该方向市场容量充足\n2. 竞争度中等，适合切入\n3. 预计利润率35-45%\n\n建议先小批量测试，观察数据后再决定是否加大投入。`,
        undefined,
        ['查看相关商品推荐', '分析ROI和利润', '制定执行计划']
      )
    }
  }, 600)
}

function handleProductFollowUp(option: string) {
  const productName = option.replace(/[「」]/g, '').replace(/分析|查看|找类似|的|和|利润空间|竞品数据|应季商品|市场趋势/g, '').trim()
  const derivedQuestions = chatStore.getDerivedQuestions(productName)

  chatStore.addAiMessage(
    `好的，让我聚焦「${productName}」来分析。\n\n📊 快速概览\n• 爆品指数：85-92分\n• 日销量趋势：持续上升\n• 利润空间：35-45%\n• 竞争程度：中等\n\n这是一个值得关注的商品，以下是你可以进一步探索的方向 👇`,
    undefined,
    derivedQuestions
  )
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
