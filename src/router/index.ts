import { createRouter, createWebHistory } from 'vue-router';
import MainLayout from '@/layouts/MainLayout.vue';
import HomeView from '@/features/menu/views/HomeView.vue';
import ProductDetailView from '@/features/menu/views/ProductDetailView.vue';
import FavoritesView from '@/features/favorites/views/FavoritesView.vue';
import LoginView from '@/features/auth/components/LoginView.vue';
import RegisterView from '@/features/auth/components/RegisterView.vue';
import SocialCallback from '@/features/auth/views/SocialCallback.vue'; // 1. Import RegisterView
import ProfileView from '@/features/auth/views/ProfileView.vue';
import OrderHistoryView from '@/features/orders/views/OrderHistoryView.vue';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        { path: '', name: 'home', component: HomeView },
        { path: 'profile', name: 'profile', component: ProfileView, meta: { requiresAuth: true } },
        { path: 'orders', name: 'orders', component: OrderHistoryView, meta: { requiresAuth: true } },
        { path: 'product/:id', name: 'product-detail', component: ProductDetailView },
        { path: 'favorites', name: 'favorites', component: FavoritesView }
      ]
    },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
    { path: '/auth/callback', name: 'social-callback', component: SocialCallback } // 2. Add the register route
  ]
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();
  const token = localStorage.getItem('auth_token');

  // If a token is saved in localStorage but the user profile info hasn't loaded yet,
  // force the router to wait until the API returns the user details.
  if (token && !authStore.user) {
    try {
      await authStore.fetchUser();
    } catch (error) {
      console.error("Token verification failed on refresh:", error);
    }
  }
  
  // Now check permissions using accurate state values
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return { path: '/login' };
  }
});

export default router;