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

    <div class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
      <button v-for="cat in categories" :key="cat.id" 
              @click="activeCategory = cat.id"
              :class="['px-6 py-2 rounded-full font-medium whitespace-nowrap transition-colors', 
                        activeCategory === cat.id ? 'bg-[#e65100] text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200']">
        {{ cat.name }}
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import api from '@/services/api';
import ProductCard from '@/components/ProductCard.vue'; // Matches your reviews folder configuration

const categories = ref<any[]>([]);
const products = ref<any[]>([]);
const activeCategory = ref<number | null>(null);

// 🎪 Slider Reactive State Data
const currentSlide = ref(0);
let slideInterval: any = null;

// Cleaned up URLs (Fixed your broken third image link!)
const bannerSlides = [
  "https://i.pinimg.com/1200x/1a/e3/2a/1ae32a19d958002c7fb2a99c9a53f012.jpg",
  "https://i.pinimg.com/736x/d3/e5/cf/d3e5cf388b5a2887074aeff6e56b8b47.jpg",
  "https://i.pinimg.com/736x/ef/c4/3c/efc43c341d7536b0a6304462c36b09fa.jpg"
];

// Starts auto playing the banner slides every 4 seconds
const startSlider = () => {
  slideInterval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % bannerSlides.length;
  }, 4000);
};

onMounted(async () => {
  startSlider(); // Fire up slider timer loop

  try {
    const catRes = await api.get('/categories');
    
    const fetchedCategories = Array.isArray(catRes.data) 
        ? catRes.data 
        : (catRes.data.data || []);
        
    categories.value = [{ id: null, name: 'All' }, ...fetchedCategories];
    
    const prodRes = await api.get('/products').catch(() => ({ data: mockProducts }));
    const fetchedProducts = Array.isArray(prodRes.data) 
        ? prodRes.data 
        : (prodRes.data.data || []);
        
    products.value = fetchedProducts;
    
  } catch (error) {
    console.error("Error fetching data", error);
  }
});

// Avoid memory leaks by cleaning up interval when user navigates away
onBeforeUnmount(() => {
  if (slideInterval) clearInterval(slideInterval);
});

const filteredProducts = computed(() => {
  if (activeCategory.value === null) return products.value;
  return products.value.filter(p => p.category_id === activeCategory.value);
});

const mockProducts = [
  { id: 3, name: 'Double Cheeseburger', description: 'Juicy double beef patty with cheddar cheese.', price: 5.99, category_id: 1 },
  { id: 4, name: 'Spicy Chicken Wings', description: '6 pieces of hot and spicy wings.', price: 4.50, category_id: 2 }
];
</script>