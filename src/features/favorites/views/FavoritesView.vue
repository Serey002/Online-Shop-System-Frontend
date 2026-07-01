<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <div class="flex items-center justify-between mb-8">
      <h1 class="text-3xl font-extrabold text-gray-900">My Favorites</h1>
      <span class="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">{{ products.length }} item(s)</span>
    </div>

    <div v-if="loading" class="text-center py-20">
      <div class="text-4xl mb-4">⏳</div>
      <p class="text-gray-500">Loading your favorites...</p>
    </div>

    <div v-else-if="products.length === 0" class="text-center py-20 bg-white rounded-2xl border border-gray-100">
      <div class="text-6xl mb-4">💔</div>
      <h2 class="text-xl font-bold text-gray-800 mb-2">No favorites yet</h2>
      <p class="text-gray-500 mb-6">Start adding items you love by tapping the heart icon!</p>
      <router-link to="/" class="bg-primary text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors">
        Browse Menu
      </router-link>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <ProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import { useFavoritesStore } from '@/stores/favorites';
import ProductCard from '@/components/ProductCard.vue';

const favoritesStore = useFavoritesStore();
const products = ref<any[]>([]);
const loading = ref(true);

onMounted(async () => {
  if (favoritesStore.favoriteIds.length === 0) {
    loading.value = false;
    return;
  }

  try {
    const response = await api.get('/products');
    const allProducts = response.data.data || [];
    products.value = allProducts.filter((p: any) => favoritesStore.isFavorite(p.id));
  } catch (error) {
    console.error('Failed to load favorites', error);
  } finally {
    loading.value = false;
  }
});
</script>
