<template>
  <div 
    class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group relative flex flex-col h-full cursor-pointer"
    @click="$router.push(`/product/${product.id}`)"
  >
    
    <div class="relative aspect-square w-full bg-gray-50 overflow-hidden">
      <img 
        :src="formatImageUrl(product.image)" 
        :alt="product.name" 
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />

      <button 
        @click.stop.prevent="favoritesStore.toggleFavorite(product.id)"
        class="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-white/80 backdrop-blur-xs shadow-sm hover:bg-white transition-all active:scale-95 group-hover:opacity-100 pointer-events-auto"
        aria-label="Toggle Favorite"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          :fill="favoritesStore.isFavorite(product.id) ? '#ef4444' : 'none'" 
          viewBox="0 0 24 24" 
          stroke-width="2" 
          :stroke="favoritesStore.isFavorite(product.id) ? '#ef4444' : '#6b7280'" 
          class="w-5 h-5 transition-colors duration-200"
        >
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      </button>
    </div>

    <div class="p-4 flex flex-col flex-1">
      <h3 class="font-bold text-gray-800 text-base line-clamp-1 mb-1">{{ product.name }}</h3>
      <p class="text-xs text-gray-400 line-clamp-2 mb-2 flex-1">{{ product.description }}</p>
      
      <div class="flex items-center gap-1 text-amber-400 text-xs mb-3">
        <span v-for="star in 5" :key="star">
          {{ star <= Math.round(product.average_rating || 0) ? '★' : '☆' }}
        </span>
        <span class="text-gray-400 ml-1">({{ product.reviews_count || 0 }})</span>
      </div>
      
      <div class="flex items-center justify-between mt-auto pt-2">
        <div>
          <span class="text-xs text-gray-400 block font-medium uppercase tracking-wider">Price</span>
          <span class="text-lg font-extrabold text-primary">${{ parseFloat(product.price).toFixed(2) }}</span>
        </div>
        <button 
          @click.stop="cartStore.addToCart(product)"
          class="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md shadow-orange-500/10 active:scale-[0.98] transition-all"
        >
          Add +
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '@/stores/cart';
import { useFavoritesStore } from '@/stores/favorites';

defineProps<{
  product: {
    id: number;
    name: string;
    description: string;
    price: string;
    image: string;
  }
}>();

const cartStore = useCartStore();
const favoritesStore = useFavoritesStore();

const formatImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `http://localhost:8000/storage/${url}`;
};
</script>