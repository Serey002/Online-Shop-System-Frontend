<template>
  <div class="space-y-8">
    <img src="https://i.pinimg.com/736x/d3/e5/cf/d3e5cf388b5a2887074aeff6e56b8b47.jpg" alt="">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-extrabold text-gray-900">Delicious Food, <span class="text-primary">Delivered.</span></h1>
    </div>

    <div class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
      <button v-for="cat in categories" :key="cat.id" 
              @click="activeCategory = cat.id"
              :class="['px-6 py-2 rounded-full font-medium whitespace-nowrap transition-colors', 
                      activeCategory === cat.id ? 'bg-primary text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200']">
        {{ cat.name }}
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import api from '@/services/api';
import ProductCard from '@/components/ProductCard.vue';

const categories = ref<any[]>([]);
const products = ref<any[]>([]);
const activeCategory = ref<number | null>(null);

onMounted(async () => {
  try {
    const catRes = await api.get('/categories');
    
    // Safely extract the array whether Laravel wrapped it or not
    const fetchedCategories = Array.isArray(catRes.data) 
        ? catRes.data 
        : (catRes.data.data || []);
        
    categories.value = [{ id: null, name: 'All' }, ...fetchedCategories];
    
    // Do the same for products
    const prodRes = await api.get('/products').catch(() => ({ data: mockProducts }));
    const fetchedProducts = Array.isArray(prodRes.data) 
        ? prodRes.data 
        : (prodRes.data.data || []);
        
    products.value = fetchedProducts;
    
  } catch (error) {
    console.error("Error fetching data", error);
  }
});

const filteredProducts = computed(() => {
  if (!activeCategory.value) return products.value;
  return products.value.filter(p => p.category_id === activeCategory.value);
});

// Fallback mock data if API isn't fully ready
const mockProducts = [
  { id: 3, name: 'Double Cheeseburger', description: 'Juicy double beef patty with cheddar cheese.', price: 5.99, category_id: 1 },
  { id: 4, name: 'Spicy Chicken Wings', description: '6 pieces of hot and spicy wings.', price: 4.50, category_id: 2 }
];
</script>