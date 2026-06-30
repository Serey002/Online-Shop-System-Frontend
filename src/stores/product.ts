import { defineStore } from 'pinia';
import api from '@/services/api';

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    categories: [],
    isLoading: false,
    activeCategory: 'all'
  }),
  actions: {
    async fetchCategories() {
      try {
        const response = await api.get('/categories');
        this.categories = response.data.data;
      } catch (error) {
        console.error('Failed to load categories', error);
      }
    },
    async fetchProducts(categoryId = null) {
      this.isLoading = true;
      try {
        const url = categoryId && categoryId !== 'all' 
          ? `/products?category_id=${categoryId}` 
          : '/products';
        const response = await api.get(url);
        this.products = response.data.data;
      } catch (error) {
        console.error('Failed to load products', error);
      } finally {
        this.isLoading = false;
      }
    }
  }
});