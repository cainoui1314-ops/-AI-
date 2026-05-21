import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Skill } from '@/types'

const defaultSkills: Skill[] = [
  {
    id: 'selection',
    name: '选品策略师',
    icon: '🎯',
    description: '分析爆款、趋势品、应季品、蓝海机会',
    greeting: '你好！我是选品策略师，专注于帮你找到最有潜力的商品。你想找哪种类型的品？',
    initialOptions: ['帮我找当前平台爆款', '推荐未来趋势品', '搜索应季商品'],
    slashCommand: '/选品',
    presetPrompt: '/选品 ',
    enabled: true,
    children: [
      {
        id: 'selection-hot',
        name: '当前爆款分析',
        icon: '🔥',
        description: '分析当前平台高GMV高销量商品',
        greeting: '你好！我是爆款分析师，帮你找到当前最火的商品。你想看哪个类目的爆款？',
        initialOptions: ['查看全平台Top10爆款', '按我的类目筛选爆款', '分析爆款成功要素'],
        slashCommand: '/爆款',
        presetPrompt: '/爆款分析 ',
        enabled: true,
      },
      {
        id: 'selection-trend',
        name: '未来趋势品洞察',
        icon: '📈',
        description: '发现高增速腰部商品，预判下一波增长',
        greeting: '你好！我是趋势品洞察师，帮你发现未来的爆品。你关注哪个方向？',
        initialOptions: ['查看7天增速最快的品', '分析即将爆发的品类', '对比趋势品与爆品差异'],
        slashCommand: '/趋势',
        presetPrompt: '/趋势洞察 ',
        enabled: true,
      },
      {
        id: 'selection-seasonal',
        name: '应季商品规划',
        icon: '🌸',
        description: '提前1-2季度布局季节性商品',
        greeting: '你好！我是应季规划师，帮你提前布局季节性爆品。你想布局哪个季节？',
        initialOptions: ['查看夏季应季品推荐', '查看Q3季节性机会', '分析去年同期爆品'],
        slashCommand: '/应季',
        presetPrompt: '/应季规划 ',
        enabled: true,
      },
      {
        id: 'selection-blueocean',
        name: '蓝海机会挖掘',
        icon: '💎',
        description: '发现低竞争高需求的蓝海市场',
        greeting: '你好！我是蓝海机会挖掘师，帮你找到竞争小但需求大的品类。这是选品中最有价值的能力！',
        initialOptions: ['搜索低竞争高需求品类', '分析我店铺的蓝海机会', '查看本周新出现的蓝海'],
        slashCommand: '/蓝海',
        presetPrompt: '/蓝海挖掘 ',
        enabled: true,
      },
    ],
  },
  {
    id: 'material',
    name: '素材优化师',
    icon: '🎨',
    description: '生成/优化主图、视频脚本、详情页',
    greeting: '你好！我是素材优化师，可以帮你优化商品主图、生成视频脚本、优化详情页。你想优化哪个商品的素材？',
    initialOptions: ['优化我的商品主图', '生成视频脚本', '优化详情页'],
    slashCommand: '/素材',
    presetPrompt: '/素材优化 ',
    enabled: true,
  },
  {
    id: 'seo',
    name: '标题SEO',
    icon: '✏️',
    description: '优化商品标题、关键词、卖点提炼',
    greeting: '你好！我是标题SEO优化师，帮你优化商品标题和关键词，提升搜索排名。给我一个商品名称或ID吧？',
    initialOptions: ['优化商品标题', '分析关键词热度', '生成新标题方案'],
    slashCommand: '/标题',
    presetPrompt: '/标题优化 ',
    enabled: true,
  },
  {
    id: 'listing',
    name: '一键上架',
    icon: '📦',
    description: '类目映射、属性填充、跨平台铺货',
    greeting: '你好！我是上架专家，帮你快速完成商品上架、类目映射和跨平台铺货。你有哪些商品需要上架？',
    initialOptions: ['批量上架商品', '跨平台铺货', '设置商品属性'],
    slashCommand: '/上架',
    presetPrompt: '/一键上架 ',
    enabled: true,
  },
  {
    id: 'traffic',
    name: '流量运营',
    icon: '📈',
    description: '千川投放策略、ROI优化',
    greeting: '你好！我是流量运营官，帮你制定千川投放策略、优化ROI。你想优化哪个商品的流量？',
    initialOptions: ['制定投放策略', '优化ROI', '分析流量来源'],
    slashCommand: '/流量',
    presetPrompt: '/流量运营 ',
    enabled: true,
  },
  {
    id: 'analyst',
    name: '数据诊断师',
    icon: '📊',
    description: '店铺数据诊断、转化率分析、运营建议',
    greeting: '你好！我是数据诊断师，可以帮你诊断店铺问题、提供数据化运营建议。你想从哪个维度开始分析？',
    initialOptions: ['全店运营诊断', '转化率分析', '六维经营体检'],
    slashCommand: '/诊断',
    presetPrompt: '/数据诊断 ',
    enabled: true,
  },
]

const STORAGE_KEY = 'marketmind_skills'

function loadSkills(): Skill[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : defaultSkills
  } catch {
    return defaultSkills
  }
}

export const useSkillsStore = defineStore('skills', () => {
  const skills = ref<Skill[]>(loadSkills())
  const activeSkillId = ref<string | null>(null)

  function setActiveSkill(id: string | null) {
    activeSkillId.value = id
  }

  function getActiveSkill(): Skill | undefined {
    if (!activeSkillId.value) return undefined
    for (const s of skills.value) {
      if (s.id === activeSkillId.value) return s
      if (s.children) {
        const child = s.children.find(c => c.id === activeSkillId.value)
        if (child) return child
      }
    }
    return skills.value.find(s => s.id === activeSkillId.value)
  }

  function toggleSkill(id: string) {
    for (const s of skills.value) {
      if (s.id === id) { s.enabled = !s.enabled; saveToStorage(); return }
      if (s.children) {
        const child = s.children.find(c => c.id === id)
        if (child) { child.enabled = !child.enabled; saveToStorage(); return }
      }
    }
  }

  function getAllEnabled(): Skill[] {
    const result: Skill[] = []
    for (const s of skills.value) {
      if (s.enabled) result.push(s)
      if (s.children) {
        for (const c of s.children) {
          if (c.enabled) result.push(c)
        }
      }
    }
    return result
  }

  function findBySlashCommand(cmd: string): Skill | undefined {
    const all = getAllEnabled()
    return all.find(s => s.slashCommand === cmd)
  }

  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(skills.value))
  }

  return {
    skills,
    activeSkillId,
    setActiveSkill,
    getActiveSkill,
    toggleSkill,
    getAllEnabled,
    findBySlashCommand,
  }
})
