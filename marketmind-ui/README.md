# 悦己 AI

AI 驱动的电商运营平台 — 为抖音电商卖家提供智能选品、数据分析、运营优化的一站式解决方案。

## 功能概览

### 💬 智能对话
- 多技能切换（选品策略师、素材优化师、标题SEO、流量运营、数据诊断师等）
- AI 流式回复，模拟真实思考过程
- 人设系统（数据分析师、资深顾问、实战教练）
- 斜杠命令快速调用技能（`/选品`、`/爆款`、`/蓝海` 等）

### 🎯 商品分析
- **新品发现** — 蓝海机会品挖掘，场景筛选 + 多维标签过滤
- **爆款列表** — 类目热销品追踪，流量结构分析，搜索过滤
- **商品列表** — 店铺商品管理，批量选择对比，红标预警
- **ProductPanel 四Tab面板** — 概览/竞品对标/流量成本/优化建议

### 🤖 模型体系
- **YUE Pro** — 深度推理（×1.0 Token）
- **YUE Fast** — 快速响应（×0.5 Token）
- **YUE Ultra** — 旗舰推理（×2.0 Token，专业版）
- **YUE Auto** — 智能调度（×1.5 Token，专业版）
- **DeepSeek / GLM / Qwen** — 免费第三方模型

### 🏪 Skills 广场
- 12 个运营技能模块，涵盖选品、素材、SEO、上架、流量、数据
- 一键安装，即插即用

### ⚙️ 设置中心
- 套餐管理（基础版/专业版 ¥29/月/企业版 ¥99/月）
- Token 额度可视化
- 抖音小店绑定
- 模型切换

## 技术栈

- **Vue 3** + TypeScript + `<script setup>`
- **Vite 5** 构建
- **Pinia** 状态管理
- **Vue Router 4** 路由
- **Element Plus** UI 组件库
- **ECharts** 图表（vue-echarts）

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 项目结构

```
src/
├── api/                    # API 接口层
├── assets/
│   └── styles/global.css   # 全局样式 & CSS 变量
├── components/
│   └── chat/               # 聊天相关组件
│       ├── ChatInput.vue       # 输入框 + 模型选择 + 斜杠菜单
│       ├── ChatMessages.vue    # 消息气泡 + 商品卡片
│       ├── ChatSidebar.vue     # 侧边栏（对话列表 + 导航）
│       ├── GuidedOptions.vue   # 快捷选项
│       ├── ProductPanel.vue    # 商品详情面板（4Tab）
│       └── SkillTabs.vue       # 技能标签栏
├── composables/            # 组合式函数
├── router/                 # 路由配置
├── store/modules/          # Pinia Store
│   ├── auth.ts                 # 认证
│   ├── chat.ts                 # 对话 & 流式消息
│   ├── product.ts              # 商品数据 & Mock
│   ├── settings.ts             # 设置 & 模型 & 额度
│   └── skills.ts               # 技能 & 人设
├── types/                  # TypeScript 类型定义
├── utils/
│   └── product.ts              # 公共工具函数
└── views/
    ├── AppLayout.vue           # 全局布局（侧边栏 + 主内容 + 面板）
    ├── ChatView.vue            # 对话主页
    ├── LoginView.vue           # 登录/注册
    ├── SettingsView.vue        # 设置中心
    ├── SkillsView.vue          # 我的技能
    ├── StoreView.vue           # Skills 广场
    ├── FavoritesView.vue       # 工具箱（收藏）
    ├── HotProductsView.vue     # 爆款列表
    ├── NewProductsView.vue     # 新品发现
    └── MyProductsView.vue      # 商品列表
```

## 版本历史

### v1.4.0
- 公共 utils 重构（gradients / scoreColor / productGradient 提取）
- 三页商品卡片格式统一（130px 图片 + 14px 名称 + 统计行 + 流量行）
- 爆款列表搜索功能（按名称/类目过滤）
- Token 消耗 Tooltip 说明
- 套餐权益详细化（多行列表）
- Skills 广场全部免费
- Slogan 更新为「AI 驱动的电商运营平台」
- 滚动问题修复

### v1.3.0
- 商品分析多维度深化
- 新品发现 / 爆款列表 / 商品列表页
- ProductPanel 4Tab 面板（概览/竞品对标/流量成本/优化建议）
- 商品图片区域（渐变占位图）
- 批量选择 + 对比分析
- 竞品分析/优化方案新建对话交互

### v1.2.0
- Skills 技能系统（多技能切换、人设、斜杠命令）
- Skills 广场
- 设置中心（模型切换、额度管理、套餐升级）
- 抖音小店绑定
- 工具箱（收藏）

### v1.1.0
- 基础对话功能
- AI 流式回复
- 商品卡片展示

## 数据说明

当前版本使用 Mock 数据（localStorage），所有商品数据、对话内容、用户信息均为模拟数据。后续将接入后端 API。

## License

Private — 仅供内部使用
