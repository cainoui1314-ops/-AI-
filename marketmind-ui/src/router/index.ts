import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
      meta: { guest: true },
    },
    {
      path: '/auth/callback',
      name: 'AuthCallback',
      component: () => import('@/views/AuthCallbackView.vue'),
      meta: { guest: true },
    },
    {
      path: '/',
      component: () => import('@/views/AppLayout.vue'),
      meta: { requiresAuth: true },
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

router.beforeEach((to, _from, next) => {
  const raw = localStorage.getItem('yueji_auth')
  const isAuthenticated = raw ? !!JSON.parse(raw).token : false

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' })
  } else if (to.meta.guest && isAuthenticated) {
    next({ name: 'Chat' })
  } else {
    next()
  }
})

export default router
