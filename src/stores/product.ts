import { defineStore } from 'pinia';
import api from '@/services/api';

export const useProductStore = defineStore('product', {
  state: () => ({
    products: [],
    categories: [],
    currentProduct: null,
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
    async fetchProducts(categoryId: any = null, searchQuery: string | null = null) {
      this.isLoading = true;
      try {
        let url = '/products';
        const params = [];
        
        if (categoryId && categoryId !== 'all') {
          params.push(`category_id=${categoryId}`);
        }
        
        if (searchQuery) {
          params.push(`search=${encodeURIComponent(searchQuery)}`);
        }
        
        if (params.length > 0) {
          url += '?' + params.join('&');
        }
        
        const response = await api.get(url);
        this.products = response.data.data;
      } catch (error) {
        console.error('Failed to load products', error);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchProductById(productId: number) {
      this.isLoading = true;
      try {
        const response = await api.get(`/products/${productId}`);
        this.currentProduct = response.data.data;
        return response.data.data;
      } catch (error) {
        console.error('Failed to load product', error);
        throw error;
      } finally {
        this.isLoading = false;
      }
    },
    async searchProducts(query: string) {
      return this.fetchProducts(undefined, query);
    }
  }
});
