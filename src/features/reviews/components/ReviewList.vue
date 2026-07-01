<template>
  <div class="mt-8">
    <h3 class="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h3>
    
    <div v-if="loading" class="text-center py-8 text-gray-500">
      Loading reviews...
    </div>
    
    <div v-else-if="reviews.length === 0" class="text-center py-8 bg-gray-50 rounded-xl">
      <div class="text-4xl mb-2">💬</div>
      <p class="text-gray-600">No reviews yet. Be the first to review this product!</p>
    </div>
    
    <div v-else class="space-y-4">
      <div 
        v-for="review in reviews" 
        :key="review.id" 
        class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-orange-400 to-pink-500">
              <img 
                v-if="review.user?.image_url" 
                :src="review.user.image_url" 
                :alt="review.user?.name || 'User'"
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                {{ review.user?.name?.charAt(0).toUpperCase() || 'U' }}
              </div>
            </div>
            <div>
              <h4 class="font-semibold text-gray-900">{{ review.user?.name || 'Anonymous' }}</h4>
              <div class="flex items-center gap-2">
                <div class="flex text-amber-400">
                  <span v-for="star in 5" :key="star">
                    {{ star <= review.rating ? '★' : '☆' }}
                  </span>
                </div>
                <span class="text-xs text-gray-500">
                  {{ formatDate(review.created_at) }}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <p v-if="review.comment" class="text-gray-700 leading-relaxed">
          {{ review.comment }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import api from '@/services/api';

const props = defineProps({
  productId: {
    type: Number,
    required: true
  }
});

const reviews = ref<any[]>([]);
const loading = ref(true);

const fetchReviews = async () => {
  loading.value = true;
  try {
    const response = await api.get(`/products/${props.productId}/reviews`);
    reviews.value = response.data.data || [];
  } catch (error) {
    console.error('Failed to fetch reviews', error);
    reviews.value = [];
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
};

onMounted(() => {
  fetchReviews();
});

watch(() => props.productId, () => {
  fetchReviews();
});

defineExpose({
  fetchReviews
});
</script>
