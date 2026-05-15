import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const Layout = () => import('@/App.vue')

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Index',
        component: () => import('@/views/index/IndexPage.vue'),
        meta: { title: '商家类型选择' }
      },
      {
        path: 'nova',
        name: 'NovaDashboard',
        component: () => import('@/views/nova/NovaDashboard.vue'),
        meta: { title: 'Nova 铺货管家', mode: 'nova' }
      },
      {
        path: 'nova/selection',
        name: 'NovaSelection',
        component: () => import('@/views/nova/NovaSelection.vue'),
        meta: { title: '一键选品', mode: 'nova' }
      },
      {
        path: 'nova/supply',
        name: 'NovaSupply',
        component: () => import('@/views/nova/NovaSupply.vue'),
        meta: { title: '一键货源', mode: 'nova' }
      },
      {
        path: 'nova/optimize',
        name: 'NovaOptimize',
        component: () => import('@/views/nova/NovaOptimize.vue'),
        meta: { title: '一键优化', mode: 'nova' }
      },
      {
        path: 'nova/maintain',
        name: 'NovaMaintain',
        component: () => import('@/views/nova/NovaMaintain.vue'),
        meta: { title: '一键全店维护', mode: 'nova' }
      },
      {
        path: 'horizon',
        name: 'HorizonComingSoon',
        component: () => import('@/views/horizon/ComingSoon.vue'),
        meta: { title: 'Horizon 深度分析', mode: 'horizon' }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, _from, next) => {
  document.title = `${to.meta.title || 'MarketMind AI'} - MarketMind AI`
  next()
})

export default router
