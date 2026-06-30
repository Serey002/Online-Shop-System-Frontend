<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <header class="bg-white shadow-sm sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center gap-2 text-primary font-bold text-2xl cursor-pointer" @click="$router.push('/')">
          FoodSR
        </div>
        
        <nav class="flex items-center gap-6">
          <router-link to="/" class="text-gray-600 hover:text-primary transition-colors">Menu</router-link>
          <router-link v-if="auth.isAuthenticated" to="/orders" class="text-gray-600 hover:text-primary transition-colors">Orders</router-link>
          
          <button class="relative p-2 text-gray-600 hover:text-primary transition-colors flex items-center justify-center">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke-width="2" 
              stroke="#6b7280" 
              class="w-6 h-6 hover:stroke-orange-500 transition-colors duration-200"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
            <span 
              v-if="favorites.totalFavorites > 0" 
              class="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center"
            >
              {{ favorites.totalFavorites }}
            </span>
          </button>

          <button @click="cart.isCartOpen = true" class="relative p-2 text-gray-600 hover:text-primary transition-colors">
            🛒
            <span v-if="cart.totalItemsCount > 0" class="absolute top-0 right-0 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {{ cart.totalItemsCount }}
            </span>
          </button>

          <div v-if="auth.isAuthenticated" class="flex gap-4 items-center">
            <router-link to="/profile" class="text-gray-800 font-medium hover:text-primary">Profile</router-link>
            <button @click="handleLogout" class="text-sm text-red-500 hover:text-red-700">Logout</button>
          </div>
          <router-link v-else to="/login" class="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors">
            Login
          </router-link>
        </nav>
      </div>
    </header>

    <main class="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view />
    </main>

    <CartSidebar />
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { useCartStore } from '@/stores/cart';
import { useFavoritesStore } from '@/stores/favorites';
import { useRouter } from 'vue-router';
import CartSidebar from '@/features/orders/components/CartSidebar.vue';

const auth = useAuthStore();
const cart = useCartStore();
const favorites = useFavoritesStore();
const router = useRouter();

const handleLogout = () => {
  auth.logout();
  router.push('/login');
};
</script>