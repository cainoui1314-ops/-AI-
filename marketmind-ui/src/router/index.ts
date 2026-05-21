import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: () => import('@/views/AppLayout.vue'),
      children: [
        {
          path: '',
          name: 'Chat',
          component: () => import('@/views/ChatView.vue'),
        },
        {
          path: 'settings',
          name: 'Settings',
          component: () => import('@/views/SettingsView.vue'),
        },
        {
          path: 'skills',
          name: 'Skills',
          component: () => import('@/views/SkillsView.vue'),
        },
        {
          path: 'favorites',
          name: 'Favorites',
          component: () => import('@/views/FavoritesView.vue'),
        },
        {
          path: 'store',
          name: 'Store',
          component: () => import('@/views/StoreView.vue'),
        },
      ],
    },
  ],
})

export default router
