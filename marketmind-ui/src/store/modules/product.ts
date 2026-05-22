import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product, ProductScores, NewProductFilter } from '@/types'

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
        experience: { product: 4.9, logistics: 4.8, service: 4.7, overall: 4.75, competitorOverall: 4.8, gaps: [] },
      },
    },
    actionOptions: ['查看竞品对比', '优化标题主图', '分析上架策略'],
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
        experience: { product: 4.8, logistics: 4.7, service: 4.8, overall: 4.7, competitorOverall: 4.6, gaps: [] },
      },
    },
    actionOptions: ['查看竞品对比', '优化标题主图', '分析上架策略'],
  },
  {
    id: 'p3', name: '便携挂脖风扇', price: 39.9, image: '', score: 85,
    tag: '应季品', sales: '日销1,800+', platform: '抖音',
    detail: {
      category: '数码配件', trend: '季节性上升', competition: '中等', profitMargin: '42%',
      scores: makeScores(11, 12, 8, 11, 12, 7, 8, 8),
      traffic: [
        { channel: '搜索', percent: 30, trend: 'up' },
        { channel: '商品卡', percent: 25, trend: 'stable' },
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
        experience: { product: 4.7, logistics: 4.6, service: 4.8, overall: 4.6, competitorOverall: 4.4, gaps: [] },
      },
    },
    actionOptions: ['查看竞品对比', '优化标题主图', '分析上架策略'],
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
        experience: { product: 4.8, logistics: 4.7, service: 4.7, overall: 4.65, competitorOverall: 4.7, gaps: [] },
      },
    },
    actionOptions: ['查看竞品对比', '优化标题主图', '分析上架策略'],
  },
  {
    id: 'p5', name: '智能家居香薰机', price: 79.9, image: '', score: 86,
    tag: '趋势品', sales: '日销980+', platform: '抖音',
    detail: {
      category: '家居用品', trend: '稳定上升', competition: '中等', profitMargin: '48%',
      scores: makeScores(12, 13, 8, 12, 11, 8, 9, 8),
      traffic: [
        { channel: '推荐流量', percent: 40, trend: 'up' },
        { channel: '短视频', percent: 22, trend: 'up' },
        { channel: '搜索', percent: 18, trend: 'stable' },
        { channel: '商品卡', percent: 12, trend: 'stable' },
        { channel: '付费投放', percent: 8, trend: 'stable' },
      ],
      costs: [
        { label: '采购成本', mine: 32, competitor: 28, unit: '元' },
        { label: '物流费用', mine: 5, competitor: 4.5, unit: '元' },
        { label: '平台扣点', mine: 4, competitor: 4, unit: '元' },
        { label: '投放成本', mine: 3.8, competitor: 4.5, unit: '元/单' },
      ],
      experience: {
        product: 4.5, logistics: 4.6, service: 4.7, overall: 4.55, competitorOverall: 4.6,
        gaps: [
          { dimension: '商品描述', myScore: 4.4, competitorScore: 4.8, suggestion: '详情页缺少使用场景动图，建议增加卧室/客厅氛围效果展示' },
          { dimension: '物流时效', myScore: 4.3, competitorScore: 4.7, suggestion: '包裹体积偏大导致物流费高，建议优化包装尺寸' },
        ],
      },
      competitor: {
        name: '舒享家居旗舰店', price: 69.9, dailySales: '日销1,500+', score: 88,
        scores: makeScores(13, 14, 9, 12, 12, 9, 9, 8),
        experience: { product: 4.8, logistics: 4.7, service: 4.7, overall: 4.6, competitorOverall: 4.55, gaps: [] },
      },
    },
    actionOptions: ['查看竞品对比', '优化标题主图', '分析上架策略'],
  },
  {
    id: 'p6', name: '儿童益智积木桌', price: 159, image: '', score: 87,
    tag: '长周期品', sales: '日销620+', platform: '抖音',
    detail: {
      category: '母婴玩具', trend: '稳定', competition: '中等', profitMargin: '40%',
      scores: makeScores(13, 14, 8, 13, 11, 9, 8, 8),
      traffic: [
        { channel: '搜索', percent: 35, trend: 'stable' },
        { channel: '商品卡', percent: 25, trend: 'up' },
        { channel: '推荐流量', percent: 20, trend: 'stable' },
        { channel: '短视频', percent: 15, trend: 'up' },
        { channel: '付费投放', percent: 5, trend: 'down' },
      ],
      costs: [
        { label: '采购成本', mine: 65, competitor: 58, unit: '元' },
        { label: '物流费用', mine: 12, competitor: 10, unit: '元' },
        { label: '平台扣点', mine: 8, competitor: 8, unit: '元' },
        { label: '投放成本', mine: 5, competitor: 6.2, unit: '元/单' },
      ],
      experience: {
        product: 4.6, logistics: 4.4, service: 4.8, overall: 4.6, competitorOverall: 4.65,
        gaps: [
          { dimension: '物流时效', myScore: 4.2, competitorScore: 4.7, suggestion: '大件物流配送周期长，建议切换京东物流或德邦' },
        ],
      },
      competitor: {
        name: '贝乐星玩具专营', price: 149, dailySales: '日销850+', score: 89,
        scores: makeScores(13, 14, 9, 13, 12, 9, 9, 8),
        experience: { product: 4.7, logistics: 4.7, service: 4.6, overall: 4.65, competitorOverall: 4.6, gaps: [] },
      },
    },
    actionOptions: ['查看竞品对比', '优化标题主图', '分析上架策略'],
  },
  {
    id: 'p7', name: '真空保鲜盒套装', price: 45.9, image: '', score: 84,
    tag: '趋势品', sales: '日销1,200+', platform: '抖音',
    detail: {
      category: '厨房用品', trend: '上升趋势', competition: '较高', profitMargin: '36%',
      scores: makeScores(11, 12, 7, 12, 11, 8, 9, 8),
      traffic: [
        { channel: '短视频', percent: 35, trend: 'up' },
        { channel: '推荐流量', percent: 28, trend: 'up' },
        { channel: '搜索', percent: 20, trend: 'stable' },
        { channel: '商品卡', percent: 10, trend: 'stable' },
        { channel: '付费投放', percent: 7, trend: 'up' },
      ],
      costs: [
        { label: '采购成本', mine: 18, competitor: 15, unit: '元' },
        { label: '物流费用', mine: 4, competitor: 3.5, unit: '元' },
        { label: '平台扣点', mine: 2.3, competitor: 2.3, unit: '元' },
        { label: '投放成本', mine: 4.5, competitor: 5.8, unit: '元/单' },
      ],
      experience: {
        product: 4.4, logistics: 4.6, service: 4.5, overall: 4.5, competitorOverall: 4.55,
        gaps: [
          { dimension: '商品描述', myScore: 4.3, competitorScore: 4.7, suggestion: '主图未展示真空密封效果，建议增加密封测试对比图' },
          { dimension: '售后服务', myScore: 4.3, competitorScore: 4.7, suggestion: '破损补发流程太慢，建议预包装备用库存' },
        ],
      },
      competitor: {
        name: '鲜纳保鲜旗舰', price: 42.9, dailySales: '日销1,800+', score: 87,
        scores: makeScores(13, 14, 8, 13, 12, 9, 9, 8),
        experience: { product: 4.7, logistics: 4.6, service: 4.7, overall: 4.55, competitorOverall: 4.5, gaps: [] },
      },
    },
    actionOptions: ['查看竞品对比', '优化标题主图', '分析上架策略'],
  },
  {
    id: 'p8', name: '宠物自动喂食器', price: 128, image: '', score: 89,
    tag: '长周期品', sales: '日销760+', platform: '抖音',
    detail: {
      category: '宠物用品', trend: '稳定上升', competition: '中等', profitMargin: '44%',
      scores: makeScores(13, 14, 9, 13, 12, 9, 9, 9),
      traffic: [
        { channel: '推荐流量', percent: 30, trend: 'up' },
        { channel: '短视频', percent: 30, trend: 'up' },
        { channel: '搜索', percent: 22, trend: 'stable' },
        { channel: '商品卡', percent: 12, trend: 'stable' },
        { channel: '付费投放', percent: 6, trend: 'down' },
      ],
      costs: [
        { label: '采购成本', mine: 52, competitor: 48, unit: '元' },
        { label: '物流费用', mine: 6, competitor: 5.5, unit: '元' },
        { label: '平台扣点', mine: 6.4, competitor: 6.4, unit: '元' },
        { label: '投放成本', mine: 4, competitor: 5.5, unit: '元/单' },
      ],
      experience: {
        product: 4.7, logistics: 4.6, service: 4.7, overall: 4.65, competitorOverall: 4.7,
        gaps: [
          { dimension: '客服响应', myScore: 4.5, competitorScore: 4.8, suggestion: '宠物类目咨询量大，建议配置专属客服话术库' },
        ],
      },
      competitor: {
        name: '萌宠智能生活馆', price: 118, dailySales: '日销950+', score: 91,
        scores: makeScores(14, 14, 9, 14, 13, 10, 9, 9),
        experience: { product: 4.8, logistics: 4.7, service: 4.8, overall: 4.7, competitorOverall: 4.65, gaps: [] },
      },
    },
    actionOptions: ['查看竞品对比', '优化标题主图', '分析上架策略'],
  },
  {
    id: 'p9', name: '筋膜枪（迷你款）', price: 89.9, image: '', score: 91,
    tag: '短期爆品', sales: '日销2,800+', platform: '抖音',
    detail: {
      category: '运动健康', trend: '快速上升', competition: '中等', profitMargin: '50%',
      scores: makeScores(14, 14, 9, 14, 14, 8, 9, 9),
      traffic: [
        { channel: '短视频', percent: 42, trend: 'up' },
        { channel: '推荐流量', percent: 25, trend: 'up' },
        { channel: '搜索', percent: 15, trend: 'up' },
        { channel: '商品卡', percent: 10, trend: 'stable' },
        { channel: '付费投放', percent: 8, trend: 'up' },
      ],
      costs: [
        { label: '采购成本', mine: 35, competitor: 30, unit: '元' },
        { label: '物流费用', mine: 4.5, competitor: 4, unit: '元' },
        { label: '平台扣点', mine: 4.5, competitor: 4.5, unit: '元' },
        { label: '投放成本', mine: 3.5, competitor: 5, unit: '元/单' },
      ],
      experience: {
        product: 4.7, logistics: 4.7, service: 4.6, overall: 4.65, competitorOverall: 4.6,
        gaps: [
          { dimension: '售后服务', myScore: 4.4, competitorScore: 4.7, suggestion: '电机质保描述不够清晰，建议在详情页醒目位置标注质保条款' },
        ],
      },
      competitor: {
        name: '力健运动旗舰店', price: 79.9, dailySales: '日销3,200+', score: 90,
        scores: makeScores(13, 14, 9, 14, 14, 9, 9, 9),
        experience: { product: 4.7, logistics: 4.7, service: 4.7, overall: 4.6, competitorOverall: 4.65, gaps: [] },
      },
    },
    actionOptions: ['查看竞品对比', '优化标题主图', '分析上架策略'],
  },
  {
    id: 'p10', name: '免洗洗手液（便携装10支）', price: 19.9, image: '', score: 93,
    tag: '短期爆品', sales: '日销8,500+', platform: '抖音',
    detail: {
      category: '日用清洁', trend: '稳定高位', competition: '激烈', profitMargin: '55%',
      scores: makeScores(13, 14, 8, 14, 15, 9, 10, 10),
      traffic: [
        { channel: '商品卡', percent: 38, trend: 'up' },
        { channel: '推荐流量', percent: 28, trend: 'stable' },
        { channel: '搜索', percent: 18, trend: 'up' },
        { channel: '短视频', percent: 10, trend: 'stable' },
        { channel: '付费投放', percent: 6, trend: 'down' },
      ],
      costs: [
        { label: '采购成本', mine: 5, competitor: 4.2, unit: '元' },
        { label: '物流费用', mine: 2, competitor: 1.8, unit: '元' },
        { label: '平台扣点', mine: 1, competitor: 1, unit: '元' },
        { label: '投放成本', mine: 1.5, competitor: 2.2, unit: '元/单' },
      ],
      experience: {
        product: 4.9, logistics: 4.8, service: 4.8, overall: 4.85, competitorOverall: 4.8,
        gaps: [],
      },
      competitor: {
        name: '净护旗舰店', price: 18.9, dailySales: '日销9,200+', score: 94,
        scores: makeScores(14, 14, 9, 14, 15, 9, 10, 10),
        experience: { product: 4.9, logistics: 4.8, service: 4.9, overall: 4.8, competitorOverall: 4.85, gaps: [] },
      },
    },
    actionOptions: ['查看竞品对比', '优化标题主图', '分析上架策略'],
  },
]

const newProductFilters: NewProductFilter[] = [
  { label: '功能特性', options: ['透气', '速干', '夜光条', '防水', '防紫外线', '抗菌', '加绒', '凉感'] },
  { label: '运动类型', options: ['跑步', '瑜伽', '健身', '篮球', '户外', '骑行', '游泳'] },
  { label: '面料', options: ['冰丝', '棉质', '尼龙', '弹力纤维', '竹纤维', '莫代尔'] },
  { label: '版型', options: ['修身', '宽松', 'oversize', '短款', '连体'] },
  { label: '设计风格', options: ['极简', '印花', '拼接', '渐变', '国潮', 'IP联名'] },
]

const newProducts: Product[] = [
  {
    id: 'np1', name: '夜光跑步背心', price: 69.9, image: '', score: 87,
    tag: '新奇特', sales: '新品首发', platform: '抖音',
    detail: {
      category: '运动服饰', trend: '快速上升', competition: '低', profitMargin: '52%',
      scores: makeScores(12, 14, 9, 10, 8, 8, 8, 8),
      newProductTags: ['夜光条', '跑步', '透气', '速干', '修身'],
      traffic: [
        { channel: '搜索', percent: 35, trend: 'up' },
        { channel: '短视频', percent: 30, trend: 'up' },
        { channel: '推荐流量', percent: 20, trend: 'stable' },
        { channel: '商品卡', percent: 10, trend: 'stable' },
        { channel: '付费投放', percent: 5, trend: 'stable' },
      ],
      costs: [
        { label: '采购成本', mine: 25, competitor: 22, unit: '元' },
        { label: '物流费用', mine: 3.5, competitor: 3.5, unit: '元' },
        { label: '平台扣点', mine: 3.5, competitor: 3.5, unit: '元' },
        { label: '投放成本', mine: 2, competitor: 3, unit: '元/单' },
      ],
      experience: {
        product: 4.5, logistics: 4.6, service: 4.7, overall: 4.6, competitorOverall: 4.55,
        gaps: [
          { dimension: '商品描述', myScore: 4.4, competitorScore: 4.7, suggestion: '夜光效果在主图中不够明显，建议增加暗光环境实拍图' },
        ],
      },
      competitor: {
        name: '跑者之光专营', price: 59.9, dailySales: '日销600+', score: 84,
        scores: makeScores(11, 12, 8, 10, 9, 8, 8, 7),
        experience: { product: 4.7, logistics: 4.5, service: 4.6, overall: 4.55, competitorOverall: 4.6, gaps: [] },
      },
    },
    actionOptions: ['分析新品潜力', '查看同类爆品', '分析上架策略'],
  },
  {
    id: 'np2', name: '磁吸瑜伽裤（隐形口袋）', price: 89.9, image: '', score: 91,
    tag: '新奇特', sales: '新品首发', platform: '抖音',
    detail: {
      category: '运动服饰', trend: '上升趋势', competition: '低', profitMargin: '48%',
      scores: makeScores(13, 14, 10, 11, 9, 8, 8, 9),
      newProductTags: ['瑜伽', '弹力纤维', '修身', '防水', '极简'],
      traffic: [
        { channel: '推荐流量', percent: 38, trend: 'up' },
        { channel: '短视频', percent: 28, trend: 'up' },
        { channel: '搜索', percent: 18, trend: 'up' },
        { channel: '商品卡', percent: 10, trend: 'stable' },
        { channel: '付费投放', percent: 6, trend: 'stable' },
      ],
      costs: [
        { label: '采购成本', mine: 35, competitor: 32, unit: '元' },
        { label: '物流费用', mine: 3.5, competitor: 3.5, unit: '元' },
        { label: '平台扣点', mine: 4.5, competitor: 4.5, unit: '元' },
        { label: '投放成本', mine: 3, competitor: 4, unit: '元/单' },
      ],
      experience: {
        product: 4.7, logistics: 4.6, service: 4.8, overall: 4.7, competitorOverall: 4.6,
        gaps: [],
      },
      competitor: {
        name: '瑜伽生活馆', price: 79.9, dailySales: '日销900+', score: 86,
        scores: makeScores(12, 13, 8, 10, 10, 8, 8, 8),
        experience: { product: 4.5, logistics: 4.5, service: 4.6, overall: 4.6, competitorOverall: 4.7, gaps: [] },
      },
    },
    actionOptions: ['分析新品潜力', '查看同类爆品', '分析上架策略'],
  },
  {
    id: 'np3', name: 'IP联名篮球袜（国潮风）', price: 39.9, image: '', score: 83,
    tag: '新奇特', sales: '新品首发', platform: '抖音',
    detail: {
      category: '运动配件', trend: '上升趋势', competition: '中等', profitMargin: '55%',
      scores: makeScores(11, 13, 8, 9, 7, 7, 8, 7),
      newProductTags: ['IP联名', '国潮', '篮球', '棉质', '印花'],
      traffic: [
        { channel: '短视频', percent: 42, trend: 'up' },
        { channel: '推荐流量', percent: 25, trend: 'up' },
        { channel: '搜索', percent: 18, trend: 'stable' },
        { channel: '商品卡', percent: 10, trend: 'stable' },
        { channel: '付费投放', percent: 5, trend: 'stable' },
      ],
      costs: [
        { label: '采购成本', mine: 10, competitor: 8, unit: '元' },
        { label: '物流费用', mine: 2.5, competitor: 2.5, unit: '元' },
        { label: '平台扣点', mine: 2, competitor: 2, unit: '元' },
        { label: '投放成本', mine: 3, competitor: 4, unit: '元/单' },
      ],
      experience: {
        product: 4.3, logistics: 4.5, service: 4.4, overall: 4.4, competitorOverall: 4.5,
        gaps: [
          { dimension: '商品描述', myScore: 4.2, competitorScore: 4.6, suggestion: 'IP联名元素展示不够突出，建议在首图放大IP角色形象' },
          { dimension: '客服响应', myScore: 4.2, competitorScore: 4.7, suggestion: '尺码咨询较多，建议在详情页加尺码对照表' },
        ],
      },
      competitor: {
        name: '国潮运动坊', price: 35.9, dailySales: '日销1,200+', score: 85,
        scores: makeScores(12, 13, 8, 10, 9, 8, 8, 8),
        experience: { product: 4.6, logistics: 4.5, service: 4.7, overall: 4.5, competitorOverall: 4.4, gaps: [] },
      },
    },
    actionOptions: ['分析新品潜力', '查看同类爆品', '分析上架策略'],
  },
  {
    id: 'np4', name: '竹纤维速干毛巾（户外折叠款）', price: 25.9, image: '', score: 85,
    tag: '新奇特', sales: '新品首发', platform: '抖音',
    detail: {
      category: '户外用品', trend: '季节性上升', competition: '低', profitMargin: '58%',
      scores: makeScores(12, 13, 8, 10, 8, 8, 9, 8),
      newProductTags: ['速干', '户外', '竹纤维', '防水', '跑步'],
      traffic: [
        { channel: '搜索', percent: 38, trend: 'up' },
        { channel: '商品卡', percent: 25, trend: 'up' },
        { channel: '推荐流量', percent: 20, trend: 'stable' },
        { channel: '短视频', percent: 12, trend: 'up' },
        { channel: '付费投放', percent: 5, trend: 'stable' },
      ],
      costs: [
        { label: '采购成本', mine: 6, competitor: 5, unit: '元' },
        { label: '物流费用', mine: 2, competitor: 1.8, unit: '元' },
        { label: '平台扣点', mine: 1.3, competitor: 1.3, unit: '元' },
        { label: '投放成本', mine: 1.5, competitor: 2, unit: '元/单' },
      ],
      experience: {
        product: 4.5, logistics: 4.7, service: 4.6, overall: 4.6, competitorOverall: 4.5,
        gaps: [],
      },
      competitor: {
        name: '户外达人精选', price: 22.9, dailySales: '日销800+', score: 82,
        scores: makeScores(11, 12, 7, 9, 8, 7, 8, 7),
        experience: { product: 4.4, logistics: 4.6, service: 4.5, overall: 4.5, competitorOverall: 4.6, gaps: [] },
      },
    },
    actionOptions: ['分析新品潜力', '查看同类爆品', '分析上架策略'],
  },
  {
    id: 'np5', name: '骑行防风夹克（渐变拼接）', price: 129.9, image: '', score: 88,
    tag: '新奇特', sales: '新品首发', platform: '抖音',
    detail: {
      category: '运动服饰', trend: '快速上升', competition: '低', profitMargin: '42%',
      scores: makeScores(13, 15, 9, 10, 8, 8, 8, 9),
      newProductTags: ['骑行', '防紫外线', '渐变', '拼接', '尼龙'],
      traffic: [
        { channel: '短视频', percent: 35, trend: 'up' },
        { channel: '推荐流量', percent: 30, trend: 'up' },
        { channel: '搜索', percent: 20, trend: 'up' },
        { channel: '商品卡', percent: 10, trend: 'stable' },
        { channel: '付费投放', percent: 5, trend: 'stable' },
      ],
      costs: [
        { label: '采购成本', mine: 55, competitor: 50, unit: '元' },
        { label: '物流费用', mine: 4, competitor: 4, unit: '元' },
        { label: '平台扣点', mine: 6.5, competitor: 6.5, unit: '元' },
        { label: '投放成本', mine: 4, competitor: 5.5, unit: '元/单' },
      ],
      experience: {
        product: 4.6, logistics: 4.7, service: 4.7, overall: 4.65, competitorOverall: 4.6,
        gaps: [],
      },
      competitor: {
        name: '风行运动旗舰', price: 119, dailySales: '日销450+', score: 85,
        scores: makeScores(12, 13, 8, 10, 9, 8, 8, 8),
        experience: { product: 4.5, logistics: 4.6, service: 4.6, overall: 4.6, competitorOverall: 4.65, gaps: [] },
      },
    },
    actionOptions: ['分析新品潜力', '查看同类爆品', '分析上架策略'],
  },
  {
    id: 'np6', name: '纳米海绵擦（厨房专用）', price: 12.9, image: '', score: 82,
    tag: '新奇特', sales: '新品首发', platform: '抖音',
    detail: {
      category: '厨房清洁', trend: '稳定', competition: '中等', profitMargin: '65%',
      scores: makeScores(11, 12, 7, 9, 7, 7, 8, 8),
      newProductTags: ['极简', '棉质'],
      traffic: [
        { channel: '商品卡', percent: 40, trend: 'stable' },
        { channel: '搜索', percent: 30, trend: 'up' },
        { channel: '推荐流量', percent: 18, trend: 'stable' },
        { channel: '短视频', percent: 8, trend: 'up' },
        { channel: '付费投放', percent: 4, trend: 'stable' },
      ],
      costs: [
        { label: '采购成本', mine: 2.5, competitor: 2, unit: '元' },
        { label: '物流费用', mine: 1.5, competitor: 1.2, unit: '元' },
        { label: '平台扣点', mine: 0.6, competitor: 0.6, unit: '元' },
        { label: '投放成本', mine: 1, competitor: 1.5, unit: '元/单' },
      ],
      experience: {
        product: 4.3, logistics: 4.5, service: 4.4, overall: 4.4, competitorOverall: 4.45,
        gaps: [
          { dimension: '商品描述', myScore: 4.2, competitorScore: 4.5, suggestion: '缺少使用前后对比图，建议增加去污效果实拍' },
        ],
      },
      competitor: {
        name: '洁净之家旗舰店', price: 11.9, dailySales: '日销2,500+', score: 84,
        scores: makeScores(12, 13, 7, 10, 9, 8, 8, 8),
        experience: { product: 4.5, logistics: 4.5, service: 4.5, overall: 4.45, competitorOverall: 4.4, gaps: [] },
      },
    },
    actionOptions: ['分析新品潜力', '查看同类爆品', '分析上架策略'],
  },
  {
    id: 'np7', name: '益生菌软糖（便携装）', price: 34.9, image: '', score: 86,
    tag: '新奇特', sales: '新品首发', platform: '抖音',
    detail: {
      category: '食品保健', trend: '快速上升', competition: '低', profitMargin: '60%',
      scores: makeScores(12, 14, 8, 10, 8, 8, 8, 8),
      newProductTags: ['极简', '修身'],
      traffic: [
        { channel: '推荐流量', percent: 35, trend: 'up' },
        { channel: '短视频', percent: 32, trend: 'up' },
        { channel: '搜索', percent: 18, trend: 'up' },
        { channel: '商品卡', percent: 10, trend: 'stable' },
        { channel: '付费投放', percent: 5, trend: 'stable' },
      ],
      costs: [
        { label: '采购成本', mine: 8, competitor: 7, unit: '元' },
        { label: '物流费用', mine: 2.5, competitor: 2.5, unit: '元' },
        { label: '平台扣点', mine: 1.7, competitor: 1.7, unit: '元' },
        { label: '投放成本', mine: 3, competitor: 4.5, unit: '元/单' },
      ],
      experience: {
        product: 4.5, logistics: 4.6, service: 4.7, overall: 4.6, competitorOverall: 4.55,
        gaps: [],
      },
      competitor: {
        name: '肠道健康专营', price: 32.9, dailySales: '日销1,100+', score: 84,
        scores: makeScores(11, 13, 8, 10, 9, 8, 8, 8),
        experience: { product: 4.4, logistics: 4.6, service: 4.6, overall: 4.55, competitorOverall: 4.6, gaps: [] },
      },
    },
    actionOptions: ['分析新品潜力', '查看同类爆品', '分析上架策略'],
  },
  {
    id: 'np8', name: '莫代尔Oversize运动套装', price: 99.9, image: '', score: 86,
    tag: '新奇特', sales: '新品首发', platform: '抖音',
    detail: {
      category: '运动服饰', trend: '快速上升', competition: '低', profitMargin: '45%',
      scores: makeScores(12, 14, 9, 10, 8, 8, 8, 9),
      newProductTags: ['oversize', '莫代尔', '透气', '极简', '健身'],
      traffic: [
        { channel: '短视频', percent: 38, trend: 'up' },
        { channel: '推荐流量', percent: 28, trend: 'up' },
        { channel: '搜索', percent: 18, trend: 'stable' },
        { channel: '商品卡', percent: 10, trend: 'stable' },
        { channel: '付费投放', percent: 6, trend: 'up' },
      ],
      costs: [
        { label: '采购成本', mine: 40, competitor: 38, unit: '元' },
        { label: '物流费用', mine: 4, competitor: 3.5, unit: '元' },
        { label: '平台扣点', mine: 5, competitor: 5, unit: '元' },
        { label: '投放成本', mine: 3.5, competitor: 4.8, unit: '元/单' },
      ],
      experience: {
        product: 4.5, logistics: 4.5, service: 4.6, overall: 4.55, competitorOverall: 4.5,
        gaps: [
          { dimension: '物流时效', myScore: 4.3, competitorScore: 4.6, suggestion: '套装发货体积大，建议使用压缩包装' },
        ],
      },
      competitor: {
        name: '舒适运动旗舰店', price: 89.9, dailySales: '日销700+', score: 84,
        scores: makeScores(11, 13, 8, 10, 9, 8, 8, 8),
        experience: { product: 4.4, logistics: 4.6, service: 4.5, overall: 4.5, competitorOverall: 4.55, gaps: [] },
      },
    },
    actionOptions: ['分析新品潜力', '查看同类爆品', '分析上架策略'],
  },
  {
    id: 'np9', name: '硅胶折叠水杯（户外便携）', price: 22.9, image: '', score: 84,
    tag: '新奇特', sales: '新品首发', platform: '抖音',
    detail: {
      category: '户外用品', trend: '季节性上升', competition: '低', profitMargin: '56%',
      scores: makeScores(11, 13, 8, 10, 8, 8, 8, 8),
      newProductTags: ['户外', '防水', '跑步', '速干'],
      traffic: [
        { channel: '搜索', percent: 32, trend: 'up' },
        { channel: '推荐流量', percent: 28, trend: 'up' },
        { channel: '短视频', percent: 22, trend: 'up' },
        { channel: '商品卡', percent: 12, trend: 'stable' },
        { channel: '付费投放', percent: 6, trend: 'stable' },
      ],
      costs: [
        { label: '采购成本', mine: 5.5, competitor: 4.8, unit: '元' },
        { label: '物流费用', mine: 2, competitor: 1.8, unit: '元' },
        { label: '平台扣点', mine: 1.1, competitor: 1.1, unit: '元' },
        { label: '投放成本', mine: 1.8, competitor: 2.5, unit: '元/单' },
      ],
      experience: {
        product: 4.4, logistics: 4.6, service: 4.5, overall: 4.5, competitorOverall: 4.45,
        gaps: [],
      },
      competitor: {
        name: '户外精选店', price: 19.9, dailySales: '日销1,300+', score: 81,
        scores: makeScores(10, 12, 7, 9, 8, 7, 8, 7),
        experience: { product: 4.3, logistics: 4.5, service: 4.4, overall: 4.45, competitorOverall: 4.5, gaps: [] },
      },
    },
    actionOptions: ['分析新品潜力', '查看同类爆品', '分析上架策略'],
  },
  {
    id: 'np10', name: '宠物自动饮水机（陶瓷款）', price: 68, image: '', score: 89,
    tag: '新奇特', sales: '新品首发', platform: '抖音',
    detail: {
      category: '宠物用品', trend: '快速上升', competition: '低', profitMargin: '47%',
      scores: makeScores(13, 14, 9, 11, 8, 8, 9, 9),
      newProductTags: ['极简', '印花'],
      traffic: [
        { channel: '推荐流量', percent: 35, trend: 'up' },
        { channel: '短视频', percent: 30, trend: 'up' },
        { channel: '搜索', percent: 20, trend: 'up' },
        { channel: '商品卡', percent: 10, trend: 'stable' },
        { channel: '付费投放', percent: 5, trend: 'stable' },
      ],
      costs: [
        { label: '采购成本', mine: 28, competitor: 25, unit: '元' },
        { label: '物流费用', mine: 5, competitor: 4.5, unit: '元' },
        { label: '平台扣点', mine: 3.4, competitor: 3.4, unit: '元' },
        { label: '投放成本', mine: 3, competitor: 4.2, unit: '元/单' },
      ],
      experience: {
        product: 4.6, logistics: 4.7, service: 4.8, overall: 4.7, competitorOverall: 4.65,
        gaps: [],
      },
      competitor: {
        name: '萌宠优选', price: 59, dailySales: '日销550+', score: 85,
        scores: makeScores(12, 13, 8, 10, 9, 8, 8, 8),
        experience: { product: 4.5, logistics: 4.6, service: 4.6, overall: 4.65, competitorOverall: 4.7, gaps: [] },
      },
    },
    actionOptions: ['分析新品潜力', '查看同类爆品', '分析上架策略'],
  },
]

const myProducts: Product[] = [
  {
    id: 'mp1', name: '男士速干运动T恤', price: 59.9, image: '', score: 88,
    tag: '热销款', sales: '日销420+', platform: '抖音',
    detail: {
      category: '男装', trend: '稳定上升', competition: '中等', profitMargin: '42%',
      scores: makeScores(13, 14, 8, 13, 12, 9, 9, 10),
      traffic: [
        { channel: '短视频', percent: 40, trend: 'up' },
        { channel: '推荐流量', percent: 25, trend: 'stable' },
        { channel: '搜索', percent: 20, trend: 'up' },
        { channel: '商品卡', percent: 10, trend: 'stable' },
        { channel: '付费投放', percent: 5, trend: 'down' },
      ],
      costs: [
        { label: '采购成本', mine: 25, competitor: 22, unit: '元' },
        { label: '物流费用', mine: 4, competitor: 3.8, unit: '元' },
        { label: '平台扣点', mine: 3, competitor: 3, unit: '元' },
        { label: '投放成本', mine: 3.5, competitor: 4.2, unit: '元/单' },
      ],
      experience: {
        product: 4.7, logistics: 4.5, service: 4.8, overall: 4.65, competitorOverall: 4.6,
        gaps: [
          { dimension: '物流时效', myScore: 4.3, competitorScore: 4.7, suggestion: '部分地区发货偏慢，建议增加华南仓库' },
        ],
      },
      competitor: {
        name: '速干运动旗舰店', price: 54.9, dailySales: '日销650+', score: 86,
        scores: makeScores(12, 13, 9, 13, 13, 9, 9, 8),
        experience: { product: 4.6, logistics: 4.7, service: 4.7, overall: 4.6, competitorOverall: 4.65, gaps: [] },
      },
    },
    actionOptions: ['查看竞品对比', '优化标题主图', '分析上架策略'],
  },
  {
    id: 'mp2', name: '无线蓝牙耳机（运动款）', price: 89, image: '', score: 91,
    tag: '利润王', sales: '日销280+', platform: '抖音',
    detail: {
      category: '数码配件', trend: '快速上升', competition: '较高', profitMargin: '52%',
      scores: makeScores(14, 14, 9, 14, 13, 9, 9, 9),
      traffic: [
        { channel: '搜索', percent: 35, trend: 'up' },
        { channel: '推荐流量', percent: 28, trend: 'up' },
        { channel: '短视频', percent: 22, trend: 'up' },
        { channel: '商品卡', percent: 10, trend: 'stable' },
        { channel: '付费投放', percent: 5, trend: 'stable' },
      ],
      costs: [
        { label: '采购成本', mine: 32, competitor: 30, unit: '元' },
        { label: '物流费用', mine: 3, competitor: 3, unit: '元' },
        { label: '平台扣点', mine: 4.5, competitor: 4.5, unit: '元' },
        { label: '投放成本', mine: 3.2, competitor: 5, unit: '元/单' },
      ],
      experience: {
        product: 4.8, logistics: 4.7, service: 4.8, overall: 4.75, competitorOverall: 4.7,
        gaps: [],
      },
      competitor: {
        name: '声浪数码旗舰', price: 79, dailySales: '日销400+', score: 89,
        scores: makeScores(13, 14, 9, 14, 13, 9, 9, 8),
        experience: { product: 4.7, logistics: 4.7, service: 4.8, overall: 4.7, competitorOverall: 4.75, gaps: [] },
      },
    },
    actionOptions: ['查看竞品对比', '优化标题主图', '分析上架策略'],
  },
  {
    id: 'mp3', name: '玻尿酸保湿面膜（30片装）', price: 49.9, image: '', score: 72,
    tag: '待优化', sales: '日销150+', platform: '抖音',
    detail: {
      category: '美妆护肤', trend: '稳定', competition: '激烈', profitMargin: '38%',
      scores: makeScores(10, 11, 6, 10, 9, 8, 9, 9),
      traffic: [
        { channel: '付费投放', percent: 42, trend: 'up' },
        { channel: '推荐流量', percent: 22, trend: 'down' },
        { channel: '搜索', percent: 18, trend: 'stable' },
        { channel: '短视频', percent: 12, trend: 'down' },
        { channel: '商品卡', percent: 6, trend: 'stable' },
      ],
      costs: [
        { label: '采购成本', mine: 18, competitor: 14, unit: '元' },
        { label: '物流费用', mine: 3.5, competitor: 3, unit: '元' },
        { label: '平台扣点', mine: 2.5, competitor: 2.5, unit: '元' },
        { label: '投放成本', mine: 8.5, competitor: 5.2, unit: '元/单' },
      ],
      experience: {
        product: 4.2, logistics: 4.4, service: 4.5, overall: 4.35, competitorOverall: 4.6,
        gaps: [
          { dimension: '商品描述', myScore: 4.0, competitorScore: 4.7, suggestion: '详情页缺少成分检测报告，建议增加第三方检测证书' },
          { dimension: '视频质量', myScore: 3.8, competitorScore: 4.5, suggestion: '主视频时长仅8秒，建议拍摄15-30秒使用效果展示' },
          { dimension: '客服响应', myScore: 4.1, competitorScore: 4.7, suggestion: '平均响应时间超60秒，建议配置自动回复话术' },
        ],
      },
      competitor: {
        name: '润肌堂旗舰店', price: 44.9, dailySales: '日销800+', score: 88,
        scores: makeScores(14, 14, 9, 13, 14, 9, 8, 7),
        experience: { product: 4.7, logistics: 4.6, service: 4.7, overall: 4.6, competitorOverall: 4.35, gaps: [] },
      },
    },
    actionOptions: ['查看竞品对比', '优化标题主图', '分析上架策略'],
  },
  {
    id: 'mp4', name: '北欧风陶瓷花瓶', price: 35, image: '', score: 85,
    tag: '稳定款', sales: '日销200+', platform: '抖音',
    detail: {
      category: '家居用品', trend: '稳定', competition: '低', profitMargin: '55%',
      scores: makeScores(12, 13, 7, 13, 12, 9, 9, 8),
      traffic: [
        { channel: '推荐流量', percent: 38, trend: 'stable' },
        { channel: '搜索', percent: 28, trend: 'up' },
        { channel: '短视频', percent: 18, trend: 'up' },
        { channel: '商品卡', percent: 12, trend: 'stable' },
        { channel: '付费投放', percent: 4, trend: 'down' },
      ],
      costs: [
        { label: '采购成本', mine: 10, competitor: 9, unit: '元' },
        { label: '物流费用', mine: 5, competitor: 4.5, unit: '元' },
        { label: '平台扣点', mine: 1.8, competitor: 1.8, unit: '元' },
        { label: '投放成本', mine: 1.5, competitor: 2, unit: '元/单' },
      ],
      experience: {
        product: 4.6, logistics: 4.3, service: 4.7, overall: 4.55, competitorOverall: 4.5,
        gaps: [
          { dimension: '物流时效', myScore: 4.1, competitorScore: 4.5, suggestion: '易碎品破损率偏高，建议加强泡沫填充包装' },
        ],
      },
      competitor: {
        name: '简居家居专营', price: 32, dailySales: '日销350+', score: 83,
        scores: makeScores(12, 12, 7, 12, 12, 8, 9, 8),
        experience: { product: 4.5, logistics: 4.5, service: 4.5, overall: 4.5, competitorOverall: 4.55, gaps: [] },
      },
    },
    actionOptions: ['查看竞品对比', '优化标题主图', '分析上架策略'],
  },
  {
    id: 'mp5', name: '猫粮主食罐头（24罐装）', price: 128, image: '', score: 78,
    tag: '待优化', sales: '日销90+', platform: '抖音',
    detail: {
      category: '宠物用品', trend: '上升趋势', competition: '较高', profitMargin: '30%',
      scores: makeScores(10, 12, 7, 10, 10, 8, 9, 7),
      traffic: [
        { channel: '搜索', percent: 45, trend: 'stable' },
        { channel: '付费投放', percent: 22, trend: 'up' },
        { channel: '推荐流量', percent: 18, trend: 'down' },
        { channel: '短视频', percent: 10, trend: 'stable' },
        { channel: '商品卡', percent: 5, trend: 'stable' },
      ],
      costs: [
        { label: '采购成本', mine: 72, competitor: 65, unit: '元' },
        { label: '物流费用', mine: 8, competitor: 7, unit: '元' },
        { label: '平台扣点', mine: 6.4, competitor: 6.4, unit: '元' },
        { label: '投放成本', mine: 7.5, competitor: 5, unit: '元/单' },
      ],
      experience: {
        product: 4.3, logistics: 4.2, service: 4.4, overall: 4.3, competitorOverall: 4.55,
        gaps: [
          { dimension: '标题质量', myScore: 4.0, competitorScore: 4.6, suggestion: '标题缺少核心搜索词，建议加入"全阶段""无谷""高蛋白"等关键词' },
          { dimension: '销量数据', myScore: 3.8, competitorScore: 4.5, suggestion: '基础销量偏低，建议通过达人带货快速积累初始销量' },
        ],
      },
      competitor: {
        name: '萌宠优选旗舰店', price: 118, dailySales: '日销320+', score: 87,
        scores: makeScores(14, 13, 9, 13, 14, 9, 8, 7),
        experience: { product: 4.7, logistics: 4.5, service: 4.6, overall: 4.55, competitorOverall: 4.3, gaps: [] },
      },
    },
    actionOptions: ['查看竞品对比', '优化标题主图', '分析上架策略'],
  },
  {
    id: 'mp6', name: '瑜伽垫（加厚防滑款）', price: 69, image: '', score: 68,
    tag: '待优化', sales: '日销60+', platform: '抖音',
    detail: {
      category: '运动健康', trend: '季节性上升', competition: '激烈', profitMargin: '35%',
      scores: makeScores(9, 10, 5, 9, 8, 7, 8, 7),
      traffic: [
        { channel: '搜索', percent: 50, trend: 'stable' },
        { channel: '付费投放', percent: 25, trend: 'up' },
        { channel: '推荐流量', percent: 12, trend: 'down' },
        { channel: '短视频', percent: 8, trend: 'stable' },
        { channel: '商品卡', percent: 5, trend: 'stable' },
      ],
      costs: [
        { label: '采购成本', mine: 30, competitor: 24, unit: '元' },
        { label: '物流费用', mine: 6, competitor: 5, unit: '元' },
        { label: '平台扣点', mine: 3.5, competitor: 3.5, unit: '元' },
        { label: '投放成本', mine: 6.8, competitor: 4.5, unit: '元/单' },
      ],
      experience: {
        product: 4.0, logistics: 4.1, service: 4.3, overall: 4.15, competitorOverall: 4.5,
        gaps: [
          { dimension: '标题质量', myScore: 3.8, competitorScore: 4.5, suggestion: '标题未包含品牌词和厚度参数，建议优化为"品牌名 加厚15mm 防滑瑜伽垫"' },
          { dimension: '主图质量', myScore: 3.9, competitorScore: 4.6, suggestion: '主图缺少使用场景，建议增加瑜伽实拍图，展示防滑纹理细节' },
          { dimension: '视频质量', myScore: 3.2, competitorScore: 4.4, suggestion: '暂无主视频，建议拍摄防滑测试和材质回弹对比视频' },
          { dimension: '评价表现', myScore: 3.8, competitorScore: 4.5, suggestion: '好评率偏低，建议优化售后流程并主动引导满意客户评价' },
        ],
      },
      competitor: {
        name: '优体运动旗舰店', price: 59, dailySales: '日销450+', score: 90,
        scores: makeScores(14, 14, 9, 14, 14, 9, 8, 8),
        experience: { product: 4.6, logistics: 4.5, service: 4.6, overall: 4.5, competitorOverall: 4.15, gaps: [] },
      },
    },
    actionOptions: ['查看竞品对比', '优化标题主图', '分析上架策略'],
  },
  {
    id: 'mp7', name: '儿童纯棉短袖套装', price: 79, image: '', score: 82,
    tag: '稳定款', sales: '日销180+', platform: '抖音',
    detail: {
      category: '母婴玩具', trend: '稳定', competition: '中等', profitMargin: '40%',
      scores: makeScores(11, 13, 7, 12, 11, 9, 9, 8),
      traffic: [
        { channel: '推荐流量', percent: 35, trend: 'up' },
        { channel: '短视频', percent: 28, trend: 'up' },
        { channel: '搜索', percent: 20, trend: 'stable' },
        { channel: '商品卡', percent: 12, trend: 'stable' },
        { channel: '付费投放', percent: 5, trend: 'down' },
      ],
      costs: [
        { label: '采购成本', mine: 35, competitor: 32, unit: '元' },
        { label: '物流费用', mine: 4, competitor: 3.5, unit: '元' },
        { label: '平台扣点', mine: 4, competitor: 4, unit: '元' },
        { label: '投放成本', mine: 2.8, competitor: 3.5, unit: '元/单' },
      ],
      experience: {
        product: 4.5, logistics: 4.5, service: 4.6, overall: 4.5, competitorOverall: 4.5,
        gaps: [
          { dimension: '标题质量', myScore: 4.2, competitorScore: 4.6, suggestion: '标题缺少年龄段参数，建议加入"3-8岁"等尺码范围信息' },
        ],
      },
      competitor: {
        name: '贝乐星童装旗舰', price: 74, dailySales: '日销260+', score: 84,
        scores: makeScores(13, 13, 8, 12, 12, 9, 8, 8),
        experience: { product: 4.5, logistics: 4.6, service: 4.5, overall: 4.5, competitorOverall: 4.5, gaps: [] },
      },
    },
    actionOptions: ['查看竞品对比', '优化标题主图', '分析上架策略'],
  },
  {
    id: 'mp8', name: '坚果礼盒（混合8袋装）', price: 45, image: '', score: 90,
    tag: '利润王', sales: '日销520+', platform: '抖音',
    detail: {
      category: '食品保健', trend: '稳定高位', competition: '中等', profitMargin: '48%',
      scores: makeScores(13, 14, 8, 14, 14, 9, 9, 9),
      traffic: [
        { channel: '商品卡', percent: 35, trend: 'up' },
        { channel: '推荐流量', percent: 28, trend: 'stable' },
        { channel: '搜索', percent: 20, trend: 'up' },
        { channel: '短视频', percent: 12, trend: 'up' },
        { channel: '付费投放', percent: 5, trend: 'down' },
      ],
      costs: [
        { label: '采购成本', mine: 18, competitor: 16, unit: '元' },
        { label: '物流费用', mine: 3, competitor: 2.8, unit: '元' },
        { label: '平台扣点', mine: 2.3, competitor: 2.3, unit: '元' },
        { label: '投放成本', mine: 1.5, competitor: 2.8, unit: '元/单' },
      ],
      experience: {
        product: 4.8, logistics: 4.7, service: 4.7, overall: 4.7, competitorOverall: 4.65,
        gaps: [],
      },
      competitor: {
        name: '每日坚果旗舰店', price: 42, dailySales: '日销700+', score: 92,
        scores: makeScores(14, 14, 9, 14, 15, 9, 9, 9),
        experience: { product: 4.8, logistics: 4.8, service: 4.7, overall: 4.65, competitorOverall: 4.7, gaps: [] },
      },
    },
    actionOptions: ['查看竞品对比', '优化标题主图', '分析上架策略'],
  },
]

const myCategories = ['全部', '男装', '数码配件', '美妆护肤', '家居用品', '宠物用品', '运动健康', '母婴玩具', '食品保健']

const scenes = [
  { id: 'summer', name: '夏季应季', icon: '☀️', matchTags: ['透气', '速干', '防水', '凉感', '冰丝', '防紫外线'] },
  { id: 'lowprice', name: '低价引流', icon: '💰', maxPrice: 35 },
  { id: 'profit', name: '高利润款', icon: '📈', minMargin: 45 },
  { id: 'novelty', name: '新奇特蓝海', icon: '✨', matchTags: ['夜光条', 'IP联名'], matchTag: '新奇特' },
]

export const useProductStore = defineStore('product', () => {
  const selectedProduct = ref<Product | null>(null)
  const showPanel = ref(false)
  const selectedIds = ref<Set<string>>(new Set())
  const batchMode = ref(false)

  function selectProduct(product: Product) {
    selectedProduct.value = product
    showPanel.value = true
  }

  function closePanel() {
    showPanel.value = false
    selectedProduct.value = null
  }

  function toggleSelect(id: string) {
    const s = new Set(selectedIds.value)
    if (s.has(id)) s.delete(id)
    else s.add(id)
    selectedIds.value = s
  }

  function selectAll(ids: string[]) {
    const s = new Set(selectedIds.value)
    if (ids.every(id => s.has(id))) {
      ids.forEach(id => s.delete(id))
    } else {
      ids.forEach(id => s.add(id))
    }
    selectedIds.value = s
  }

  function clearSelection() {
    selectedIds.value = new Set()
  }

  function toggleBatchMode() {
    batchMode.value = !batchMode.value
    if (!batchMode.value) clearSelection()
  }

  function getSampleProducts(): Product[] {
    return sampleProducts
  }

  function getNewProducts(): Product[] {
    return newProducts
  }

  function getMyProducts(): Product[] {
    return myProducts
  }

  function getMyCategories(): string[] {
    return myCategories
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

  function getScenes() {
    return scenes
  }

  function filterByScene(sceneId: string): Product[] {
    const scene = scenes.find(s => s.id === sceneId)
    if (!scene) return newProducts
    return newProducts.filter(p => {
      if (scene.maxPrice && p.price > scene.maxPrice) return false
      if (scene.minMargin) {
        const margin = parseInt(p.detail.profitMargin)
        if (margin < scene.minMargin) return false
      }
      if (scene.matchTags) {
        const tags = p.detail.newProductTags ?? []
        if (scene.matchTag && p.tag === scene.matchTag) return true
        if (!scene.matchTags.some(t => tags.includes(t))) return false
      }
      return true
    })
  }

  return {
    selectedProduct,
    showPanel,
    selectedIds,
    batchMode,
    selectProduct,
    closePanel,
    toggleSelect,
    selectAll,
    clearSelection,
    toggleBatchMode,
    getSampleProducts,
    getNewProducts,
    getMyProducts,
    getMyCategories,
    getFilters,
    filterNewProducts,
    getScenes,
    filterByScene,
  }
})
