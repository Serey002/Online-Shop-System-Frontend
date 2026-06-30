<template>
  <div class="order-card border p-6 rounded-xl mb-4 bg-white shadow-sm">
    <div class="flex justify-between items-center mb-4">
      <span class="font-bold text-gray-800">Order #{{ order.id }}</span>
      <span :class="statusBadgeClass(order.status)">{{ order.status }}</span>
    </div>

    <div class="bg-gray-50 p-4 rounded-lg">
      <h4 class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Items Breakdown</h4>
      
      <div v-for="item in order.items" :key="item.id" class="flex justify-between items-center py-2 border-b last:border-0">
        <div>
          <span class="text-sm font-semibold text-gray-700">{{ item.quantity }}x {{ item.product?.name || 'Delicious Dish' }}</span>
        </div>

        <button 
          v-if="order.status.toLowerCase() === 'served & done' || order.status.toLowerCase() === 'completed'"
          @click="openReview(item.product_id)"
          class="text-xs bg-orange-500 hover:bg-orange-600 text-white font-bold px-3 py-1.5 rounded-lg transition"
        >
          Rate & Review
        </button>
      </div>
    </div>

    <SubmitReviewModal 
      :is-open="showModal" 
      :product-id="activeProductId" 
      @close="showModal = false" 
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import SubmitReviewModal from '../../reviews/components/SubmitReviewModal.vue';

const props = defineProps({
  order: { type: Object, required: true }
});

const showModal = ref(false);
const activeProductId = ref(null);

function openReview(productId) {
  activeProductId.value = productId;
  showModal.value = true;
}

function statusBadgeClass(status) {
  const s = status.toLowerCase();
  if (s === 'pending') return 'bg-amber-100 text-amber-700 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider';
  if (s === 'served & done' || s === 'completed') return 'bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider';
  return 'bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider';
}
</script>