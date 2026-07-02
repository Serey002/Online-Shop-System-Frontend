<template>
  <div class="space-y-8">
    <div class="relative w-full h-[200px] sm:h-[300px] md:h-[350px] rounded-[24px] overflow-hidden shadow-md bg-gray-100">
      <div 
        v-for="(slide, index) in bannerSlides" 
        :key="index"
        :class="[
          'absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out',
          currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
        ]"
      >
        <img 
          :src="slide" 
          alt="Food Banner" 
          class="w-full h-full object-cover"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      <div class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        <button 
          v-for="(_, index) in bannerSlides" 
          :key="index"
          @click="currentSlide = index"
          :class="[
            'w-2.5 h-2.5 rounded-full transition-all duration-300',
            currentSlide === index ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/80'
          ]"
        ></button>
      </div>
    </div>

    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-extrabold text-gray-900">Delicious Food, <span class="text-[#e65100]">Delivered.</span></h1>
    </div>

    <SearchBar @search="onSearch" />

    <div class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
      <button v-for="cat in categories" :key="cat.id" 
              @click="activeCategory = cat.id"
              :class="['px-6 py-2 rounded-full font-medium whitespace-nowrap transition-colors', 
                        activeCategory === cat.id ? 'bg-[#e65100] text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200']">
        {{ cat.name }}
      </button>
    </div>

    <div v-if="isLoading" class="flex justify-center py-20">
      <svg class="animate-spin h-10 w-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </div>

    <div v-else-if="products.length === 0" class="text-center py-20">
      <svg class="mx-auto w-16 h-16 text-gray-300 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
      </svg>
      <p class="text-gray-400 text-lg font-medium">No food found</p>
      <p class="text-gray-300 text-sm mt-1">Try a different search or category</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <ProductCard v-for="product in products" :key="product.id" :product="product" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import api from '@/services/api';
import ProductCard from '@/components/ProductCard.vue';
import SearchBar from '@/components/SearchBar.vue';

const categories = ref<any[]>([]);
const products = ref<any[]>([]);
const activeCategory = ref<number | null>(null);
const searchQuery = ref('');
const isLoading = ref(false);

const currentSlide = ref(0);
let slideInterval: any = null;

const bannerSlides = [
  "https://i.pinimg.com/1200x/1a/e3/2a/1ae32a19d958002c7fb2a99c9a53f012.jpg",
  "https://i.pinimg.com/736x/d3/e5/cf/d3e5cf388b5a2887074aeff6e56b8b47.jpg",
  "https://i.pinimg.com/736x/ef/c4/3c/efc43c341d7536b0a6304462c36b09fa.jpg"
];

const startSlider = () => {
  slideInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % bannerSlides.length;
  }, 4000);
};

const fetchProducts = async () => {
  isLoading.value = true;
  try {
    let url = '/products';
    const params: string[] = [];

    if (activeCategory.value !== null) {
      params.push(`category_id=${activeCategory.value}`);
    }

    if (searchQuery.value) {
      params.push(`search=${encodeURIComponent(searchQuery.value)}`);
    }

    if (params.length > 0) {
      url += '?' + params.join('&');
    }

    const prodRes = await api.get(url);
    const fetchedProducts = Array.isArray(prodRes.data)
      ? prodRes.data
      : (prodRes.data.data || []);

    products.value = fetchedProducts;
  } catch (error) {
    console.error("Error fetching products", error);
    products.value = [];
  } finally {
    isLoading.value = false;
  }
};

const onSearch = (query: string) => {
  searchQuery.value = query;
};

watch([activeCategory, searchQuery], () => {
  fetchProducts();
});

onMounted(async () => {
  startSlider();

  try {
    const catRes = await api.get('/categories');
    const fetchedCategories = Array.isArray(catRes.data)
      ? catRes.data
      : (catRes.data.data || []);

    categories.value = [{ id: null, name: 'All' }, ...fetchedCategories];
  } catch (error) {
    console.error("Error fetching categories", error);
  }

  await fetchProducts();
});

onBeforeUnmount(() => {
  if (slideInterval) clearInterval(slideInterval);
});
</script>