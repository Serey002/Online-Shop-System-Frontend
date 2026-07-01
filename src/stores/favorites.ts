import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

const STORAGE_KEY = 'foodsr_favorites';

export const useFavoritesStore = defineStore('favorites', () => {
  const favoriteIds = ref<number[]>(loadFavorites());

  function loadFavorites(): number[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  function saveFavorites() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds.value));
  }

  const totalFavorites = computed(() => favoriteIds.value.length);

  const isFavorite = (productId: number) => {
    return favoriteIds.value.includes(productId);
  };

  const toggleFavorite = (productId: number) => {
    const index = favoriteIds.value.indexOf(productId);
    if (index > -1) {
      favoriteIds.value.splice(index, 1);
    } else {
      favoriteIds.value.push(productId);
    }
    saveFavorites();
  };

  return {
    favoriteIds,
    totalFavorites,
    isFavorite,
    toggleFavorite
  };
});