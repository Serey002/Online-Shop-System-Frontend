<template>
  <div class="max-w-6xl mx-auto px-4 py-8">
    <div v-if="loading" class="text-center py-20">
      <div class="text-4xl mb-4">⏳</div>
      <p class="text-gray-600">Loading product details...</p>
    </div>

    <div v-else-if="product" class="bg-white rounded-2xl shadow-lg overflow-hidden">
      <!-- Product Header -->
      <div class="grid md:grid-cols-2 gap-8 p-8">
        <!-- Product Image -->
        <div class="relative">
          <img 
            :src="product.image_url || '/placeholder.jpg'" 
            :alt="product.name"
            class="w-full h-96 object-cover rounded-xl shadow-md"
          />
          <div v-if="product.stock <= 0" class="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold">
            Out of Stock
          </div>
        </div>

        <!-- Product Info -->
        <div class="flex flex-col justify-between">
          <div>
            <div class="flex items-center gap-2 mb-2">
              <span class="text-sm font-semibold text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                {{ product.category?.name || 'Uncategorized' }}
              </span>
            </div>
            
            <h1 class="text-4xl font-extrabold text-gray-900 mb-4">{{ product.name }}</h1>
            
            <div class="flex items-center gap-3 mb-4">
              <div class="flex text-amber-400 text-xl">
                <span v-for="star in 5" :key="star">
                  {{ star <= Math.round(product.average_rating || 0) ? '★' : '☆' }}
                </span>
              </div>
              <span class="text-gray-600 font-medium">
                {{ product.average_rating?.toFixed(1) || '0.0' }} 
                ({{ product.reviews_count || 0 }} reviews)
              </span>
            </div>

            <p class="text-gray-700 text-lg leading-relaxed mb-6">
              {{ product.description || 'No description available.' }}
            </p>

            <div class="flex items-baseline gap-2 mb-6">
              <span class="text-4xl font-black text-orange-600">${{ product.price }}</span>
              <span class="text-gray-500">per item</span>
            </div>

            <div class="mb-6">
              <span class="text-sm text-gray-600">Stock: </span>
              <span :class="product.stock > 10 ? 'text-green-600' : 'text-orange-600'" class="font-bold">
                {{ product.stock }} available
              </span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="space-y-3">
            <button 
              @click="addToCart"
              :disabled="product.stock <= 0"
              class="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all active:scale-95 shadow-lg"
            >
              {{ product.stock <= 0 ? 'Out of Stock' : 'Add to Cart' }}
            </button>
            
            <button 
              @click="openReviewModal"
              class="w-full border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-bold py-4 px-6 rounded-xl transition-all"
            >
              Write a Review
            </button>

            <router-link 
              to="/"
              class="block text-center text-gray-600 hover:text-gray-900 font-medium py-2"
            >
              ← Back to Menu
            </router-link>
          </div>
        </div>
      </div>

      <!-- Reviews Section -->
      <div class="border-t border-gray-200 p-8">
        <ReviewList 
          :product-id="productId" 
          ref="reviewListRef"
        />
      </div>
    </div>

    <div v-else class="text-center py-20">
      <div class="text-4xl mb-4">😕</div>
      <p class="text-gray-600 mb-4">Product not found</p>
      <router-link to="/" class="text-orange-500 hover:text-orange-600 font-bold">
        Return to Menu
      </router-link>
    </div>

    <!-- Review Modal -->
    <SubmitReviewModal 
      :is-open="showReviewModal"
      :product-id="productId"
      @close="showReviewModal = false"
      @review-submitted="handleReviewSubmitted"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useProductStore } from '@/stores/product';
import { useCartStore } from '@/stores/cart';
import ReviewList from '@/features/reviews/components/ReviewList.vue';
import SubmitReviewModal from '@/features/reviews/components/SubmitReviewModal.vue';

const route = useRoute();
const productStore = useProductStore();
const cartStore = useCartStore();

const productId = ref(Number(route.params.id));
const product = ref<any>(null);
const loading = ref(true);
const showReviewModal = ref(false);
const reviewListRef = ref<any>(null);

const fetchProduct = async () => {
  loading.value = true;
  try {
    product.value = await productStore.fetchProductById(productId.value);
  } catch (error) {
    console.error('Failed to load product', error);
  } finally {
    loading.value = false;
  }
};

const addToCart = () => {
  if (product.value && product.value.stock > 0) {
    cartStore.addToCart(product.value);
  }
};

const openReviewModal = () => {
  showReviewModal.value = true;
};

const handleReviewSubmitted = () => {
  // Refresh reviews list
  if (reviewListRef.value) {
    reviewListRef.value.fetchReviews();
  }
  // Refresh product to update rating
  fetchProduct();
};

onMounted(() => {
  fetchProduct();
});
</script>
