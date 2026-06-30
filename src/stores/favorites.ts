import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useFavoritesStore = defineStore('favorites', () => {
  // Array of favorite product IDs
  const favoriteIds = ref<number[]>([]);

  const totalFavorites = computed(() => favoriteIds.value.length);

  const isFavorite = (productId: number) => {
    return favoriteIds.value.includes(productId);
  };

  const toggleFavorite = (productId: number) => {
    const index = favoriteIds.value.indexOf(productId);
    if (index > -1) {
      favoriteIds.value.splice(index, 1); // Remove if already favorited
    } else {
      favoriteIds.value.push(productId); // Add if not favorited
    }
  };

  return {
    favoriteIds,
    totalFavorites,
    isFavorite,
    toggleFavorite
  };
});