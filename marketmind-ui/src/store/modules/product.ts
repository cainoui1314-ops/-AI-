import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product, ProductDetail, ProductScores, NewProductFilter } from '@/types'

function makeScores(
  title: number, mainImage: number, video: number, reviews: number,
  sales: number, cs: number, logistics: number, exp: number
): ProductScores {
  return {
    title: { label: '标题质量', score: title, maxScore: 15 },
    mainImage: { label: '主图质量', score: mainImage, maxScore: 15 },
    video: { label: '视频质量', score: video, maxScore: 10 },
    reviews: { label: '评价表现', score: reviews, maxScore: 15 },
    sales: { label: '销量数据', score: sales, maxScore: 15 },
    customerService: { label: '客服服务', score: cs, maxScore: 10 },
    logistics: { label: '物流履约', score: logistics, maxScore: 10 },
    experience: { label: '综合体验', score: exp, maxScore: 10 },
  }
}

const sampleProducts: Product[] = [
  {
    id: 'p1', name: '冰袖防晒袖套', price: 29.9, image: '', score: 92,
    tag: '短期爆品', sales: '日销3,500+', platform: '抖音',
    detail: {
      category: '服饰配件', trend: '上升趋势', competition: '中等', profitMargin: '45%',
      scores: makeScores(13, 14, 9, 13, 14, 9, 10, 10),
      traffic: [
        { channel: '商品卡', percent: 32, trend: 'up' },
        { channel: '短视频', percent: 28, trend: 'up' },
        { channel: '推荐流量', percent: 22, trend: 'stable' },
        { channel: '搜索', percent: 12, trend: 'up' },
        { channel: '付费投放', percent: 6, trend: 'down' },
      ],
      costs: [
        { label: '采购成本', mine: 12, competitor: 10, unit: '元' },
        { label: '物流费用', mine: 3.5, competitor: 3.2, unit: '元' },
        { label: '平台扣点', mine: 1.5, competitor: 1.5, unit: '元' },
        { label: '投放成本', mine: 2.8, competitor: 3.5, unit: '元/单' },
      ],
      experience: {
        product: 4.8, logistics: 4.7, service: 4.9, overall: 4.8, competitorOverall: 4.75,
        gaps: [
          { dimension: '商品描述', myScore: 4.8, competitorScore: 4.9, suggestion: '主图第3张缺少使用场景，建议增加户外佩戴效果图' },
          { dimension: '物流时效', myScore: 4.5, competitorScore: 4.8, suggestion: '发货时效比竞品慢0.5天，建议切换至更快的快递服务商' },
        ],
      },
      competitor: {
        name: 'UV冰袖-防晒专家', price: 27.9, dailySales: '日销4,200+', score: 94,
        scores: makeScores(14, 13, 8, 14, 15, 9, 10, 10),
        experience: {
          product: 4.9, logistics: 4.8, service: 4.7, overall: 4.75, competitorOverall: 4.8,
          gaps: [],
        },
      },
    },
    actionOptions: ['查看竞品对比', '优化标题主图', '一键上架'],
  },
  {
    id: 'p2', name: '夏季冰丝凉感T恤', price: 49.9, image: '', score: 88,
    tag: '趋势品', sales: '日销2,100+', platform: '抖音',
    detail: {
      category: '男装', trend: '快速上升', competition: '较高', profitMargin: '38%',
      scores: makeScores(12, 13, 7, 12, 13, 8, 9, 9),
      traffic: [
        { channel: '短视频', percent: 38, trend: 'up' },
        { channel: '推荐流量', percent: 25, trend: 'up' },
        { channel: '搜索', percent: 18, trend: 'stable' },
        { channel: '商品卡', percent: 12, trend: 'stable' },
        { channel: '付费投放', percent: 7, trend: 'up' },
      ],
      costs: [
        { label: '采购成本', mine: 22, competitor: 20, unit: '元' },
        { label: '物流费用', mine: 4, competitor: 3.8, unit: '元' },
        { label: '平台扣点', mine: 2.5, competitor: 2.5, unit: '元' },
        { label: '投放成本', mine: 4.2, competitor: 5.1, unit: '元/单' },
      ],
      experience: {
        product: 4.6, logistics: 4.5, service: 4.7, overall: 4.6, competitorOverall: 4.7,
        gaps: [
          { dimension: '商品描述', myScore: 4.5, competitorScore: 4.8, suggestion: '详情页缺少尺码对比图，建议增加真人上身尺码参考' },
          { dimension: '物流时效', myScore: 4.3, competitorScore: 4.7, suggestion: '48小时发货率偏低，建议优化仓库分拣流程' },
          { dimension: '售后服务', myScore: 4.5, competitorScore: 4.8, suggestion: '退款响应时间偏长，建议设置自动退款规则' },
        ],
      },
      competitor: {
        name: '冰感科技T恤旗舰店', price: 45.9, dailySales: '日销3,800+', score: 91,
        scores: makeScores(14, 14, 9, 13, 14, 9, 9, 9),
        experience: {
          product: 4.8, logistics: 4.7, service: 4.8, overall: 4.7, competitorOverall: 4.6,
          gaps: [],
        },
      },
    },
    actionOptions: ['查看竞品对比', '优化标题主图', '一键上架'],
  },
  {
    id: 'p3', name: '便携挂脖风扇', price: 39.9, image: '', score: 85,
    tag: '应季品', sales: '日销1,800+', platform: '抖音',
    detail: {
      category: '数码配件', trend: '季节性上升', competition: '中等', profitMargin: '42%',
      scores: makeScores(11, 12, 8, 11, 12, 7, 8, 8),
      traffic: [
        { channel: '商品卡', percent: 25, trend: 'stable' },
        { channel: '搜索', percent: 30, trend: 'up' },
        { channel: '短视频', percent: 20, trend: 'stable' },
        { channel: '推荐流量', percent: 15, trend: 'down' },
        { channel: '付费投放', percent: 10, trend: 'up' },
      ],
      costs: [
        { label: '采购成本', mine: 15, competitor: 13, unit: '元' },
        { label: '物流费用', mine: 4.5, competitor: 4, unit: '元' },
        { label: '平台扣点', mine: 2, competitor: 2, unit: '元' },
        { label: '投放成本', mine: 3.5, competitor: 4.2, unit: '元/单' },
      ],
      experience: {
        product: 4.4, logistics: 4.3, service: 4.5, overall: 4.4, competitorOverall: 4.6,
        gaps: [
          { dimension: '商品描述', myScore: 4.3, competitorScore: 4.7, suggestion: '主图缺少产品尺寸参照物，建议加入手掌对比图' },
          { dimension: '客服响应', myScore: 4.2, competitorScore: 4.8, suggestion: '平均响应时间48秒，建议增加快捷回复话术' },
          { dimension: '物流时效', myScore: 4.1, competitorScore: 4.6, suggestion: '偏远地区发货慢，建议增设华中仓库' },
        ],
      },
      competitor: {
        name: '酷风数码专营', price: 35.9, dailySales: '日销2,500+', score: 89,
        scores: makeScores(13, 13, 9, 12, 13, 9, 9, 8),
        experience: {
          product: 4.7, logistics: 4.6, service: 4.8, overall: 4.6, competitorOverall: 4.4,
          gaps: [],
        },
      },
    },
    actionOptions: ['查看竞品对比', '优化标题主图', '一键上架'],
  },
  {
    id: 'p4', name: '防晒霜SPF50+', price: 59.9, image: '', score: 90,
    tag: '长周期品', sales: '日销5,200+', platform: '抖音',
    detail: {
      category: '美妆护肤', trend: '稳定高位', competition: '激烈', profitMargin: '35%',
      scores: makeScores(14, 13, 9, 14, 14, 8, 9, 9),
      traffic: [
        { channel: '推荐流量', percent: 35, trend: 'stable' },
        { channel: '短视频', percent: 25, trend: 'up' },
        { channel: '搜索', percent: 20, trend: 'stable' },
        { channel: '商品卡', percent: 10, trend: 'stable' },
        { channel: '付费投放', percent: 10, trend: 'stable' },
      ],
      costs: [
        { label: '采购成本', mine: 28, competitor: 25, unit: '元' },
        { label: '物流费用', mine: 3, competitor: 3, unit: '元' },
        { label: '平台扣点', mine: 3, competitor: 3, unit: '元' },
        { label: '投放成本', mine: 5.5, competitor: 6.8, unit: '元/单' },
      ],
      experience: {
        product: 4.7, logistics: 4.8, service: 4.6, overall: 4.7, competitorOverall: 4.65,
        gaps: [
          { dimension: '售后服务', myScore: 4.4, competitorScore: 4.7, suggestion: '退货处理周期偏长，建议48小时内完成退款审核' },
        ],
      },
      competitor: {
        name: '美肌日记旗舰店', price: 55.9, dailySales: '日销6,100+', score: 92,
        scores: makeScores(14, 14, 8, 14, 15, 9, 9, 9),
        experience: {
          product: 4.8, logistics: 4.7, service: 4.7, overall: 4.65, competitorOverall: 4.7,
          gaps: [],
        },
      },
    },
    actionOptions: ['查看竞品对比', '优化标题主图', '一键上架'],
  },
]

const newProductFilters: NewProductFilter[] = [
  { label: '功能特性', options: ['透气', '速干', '夜光条', '防水', '防紫外线', '抗菌', '加绒', '凉感'] },
  { label: '运动类型', options: ['跑步', '瑜伽', '健身', '篮球', '足球', '户外', '骑行', '游泳'] },
  { label: '面料', options: ['冰丝', '聚酯纤维', '棉质', '尼龙', '弹力纤维', '竹纤维', '莫代尔'] },
  { label: '版型', options: ['修身', '宽松', 'oversize', '短款', '长款', '连体'] },
  { label: '设计风格', options: ['极简', '印花', '拼接', '渐变', '国潮', 'IP联名', '街头'] },
]

const newProducts: Product[] = [
  {
    id: 'np1', name: '夜光跑步背心', price: 69.9, image: '', score: 87,
    tag: '新奇特', sales: '新品首发', platform: '抖音',
    detail: {
      category: '运动服饰', trend: '快速上升', competition: '低', profitMargin: '52%',
      scores: makeScores(12, 14, 9, 10, 8, 8, 8, 8),
      newProductTags: ['夜光条', '跑步', '透气', '速干', '修身'],
    },
    actionOptions: ['分析新品潜力', '查看同类爆品', '一键上架'],
  },
  {
    id: 'np2', name: '磁吸瑜伽裤（隐形口袋）', price: 89.9, image: '', score: 91,
    tag: '新奇特', sales: '新品首发', platform: '抖音',
    detail: {
      category: '运动服饰', trend: '上升趋势', competition: '低', profitMargin: '48%',
      scores: makeScores(13, 14, 10, 11, 9, 8, 8, 9),
      newProductTags: ['瑜伽', '弹力纤维', '修身', '防水', '极简'],
    },
    actionOptions: ['分析新品潜力', '查看同类爆品', '一键上架'],
  },
  {
    id: 'np3', name: 'IP联名篮球袜（国潮风）', price: 39.9, image: '', score: 83,
    tag: '新奇特', sales: '新品首发', platform: '抖音',
    detail: {
      category: '运动配件', trend: '上升趋势', competition: '中等', profitMargin: '55%',
      scores: makeScores(11, 13, 8, 9, 7, 7, 8, 7),
      newProductTags: ['IP联名', '国潮', '篮球', '棉质', '印花'],
    },
    actionOptions: ['分析新品潜力', '查看同类爆品', '一键上架'],
  },
  {
    id: 'np4', name: '竹纤维速干毛巾（户外折叠款）', price: 25.9, image: '', score: 85,
    tag: '新奇特', sales: '新品首发', platform: '抖音',
    detail: {
      category: '户外用品', trend: '季节性上升', competition: '低', profitMargin: '58%',
      scores: makeScores(12, 13, 8, 10, 8, 8, 9, 8),
      newProductTags: ['速干', '户外', '竹纤维', '防水', '折叠'],
    },
    actionOptions: ['分析新品潜力', '查看同类爆品', '一键上架'],
  },
  {
    id: 'np5', name: '骑行防风夹克（渐变拼接）', price: 129.9, image: '', score: 88,
    tag: '新奇特', sales: '新品首发', platform: '抖音',
    detail: {
      category: '运动服饰', trend: '快速上升', competition: '低', profitMargin: '42%',
      scores: makeScores(13, 15, 9, 10, 8, 8, 8, 9),
      newProductTags: ['骑行', '防紫外线', '渐变', '拼接', '尼龙'],
    },
    actionOptions: ['分析新品潜力', '查看同类爆品', '一键上架'],
  },
  {
    id: 'np6', name: '游泳专用防水手机袋（触屏款）', price: 19.9, image: '', score: 82,
    tag: '新奇特', sales: '新品首发', platform: '抖音',
    detail: {
      category: '数码配件', trend: '季节性上升', competition: '中等', profitMargin: '62%',
      scores: makeScores(11, 12, 7, 9, 7, 7, 8, 8),
      newProductTags: ['游泳', '防水', '极简', '聚酯纤维'],
    },
    actionOptions: ['分析新品潜力', '查看同类爆品', '一键上架'],
  },
  {
    id: 'np7', name: '加绒健身手套（防滑硅胶）', price: 34.9, image: '', score: 84,
    tag: '新奇特', sales: '新品首发', platform: '抖音',
    detail: {
      category: '运动配件', trend: '稳定', competition: '中等', profitMargin: '50%',
      scores: makeScores(11, 12, 8, 9, 7, 8, 8, 8),
      newProductTags: ['健身', '加绒', '防紫外线', '修身'],
    },
    actionOptions: ['分析新品潜力', '查看同类爆品', '一键上架'],
  },
  {
    id: 'np8', name: '莫代尔Oversize运动套装', price: 99.9, image: '', score: 86,
    tag: '新奇特', sales: '新品首发', platform: '抖音',
    detail: {
      category: '运动服饰', trend: '快速上升', competition: '低', profitMargin: '45%',
      scores: makeScores(12, 14, 9, 10, 8, 8, 8, 9),
      newProductTags: ['oversize', '莫代尔', '透气', '极简', '健身'],
    },
    actionOptions: ['分析新品潜力', '查看同类爆品', '一键上架'],
  },
]

export const useProductStore = defineStore('product', () => {
  const selectedProduct = ref<Product | null>(null)
  const showPanel = ref(false)

  function selectProduct(product: Product) {
    selectedProduct.value = product
    showPanel.value = true
  }

  function closePanel() {
    showPanel.value = false
    selectedProduct.value = null
  }

  function getSampleProducts(): Product[] {
    return sampleProducts
  }

  function getNewProducts(): Product[] {
    return newProducts
  }

  function getFilters(): NewProductFilter[] {
    return newProductFilters
  }

  function filterNewProducts(activeFilters: Record<string, string[]>): Product[] {
    return newProducts.filter(p => {
      const tags = p.detail.newProductTags ?? []
      for (const [, values] of Object.entries(activeFilters)) {
        if (values.length === 0) continue
        if (!values.some(v => tags.includes(v))) return false
      }
      return true
    })
  }

  return {
    selectedProduct,
    showPanel,
    selectProduct,
    closePanel,
    getSampleProducts,
    getNewProducts,
    getFilters,
    filterNewProducts,
  }
})
