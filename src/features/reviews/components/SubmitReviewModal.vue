<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl animate-fade-in">
      <h3 class="text-lg font-black text-gray-900 mb-1">Share Your Feedback</h3>
      <p class="text-xs text-gray-400 mb-4">How was your meal selection?</p>

      <div class="flex gap-2 mb-4 text-xl">
        <button 
          v-for="star in 5" 
          :key="star" 
          @click="form.rating = star"
          type="button"
          class="transition text-2xl"
          :class="star <= form.rating ? 'text-amber-400' : 'text-gray-200'"
        >
          ★
        </button>
      </div>

      <textarea 
        v-model="form.comment" 
        placeholder="Describe your dining experience with this kitchen dish..." 
        rows="4"
        class="w-full border rounded-xl p-3 text-xs focus:outline-none focus:ring-1 focus:ring-orange-500 mb-4 font-medium"
      ></textarea>

      <div class="flex justify-end gap-2 text-xs font-bold">
        <button @click="$emit('close')" class="px-4 py-2 border rounded-xl hover:bg-gray-50 text-gray-500">Cancel</button>
        <button @click="submitReview" class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition">Submit Review</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import api from '@/services/api';

const props = defineProps({
  isOpen: Boolean,
  productId: Number
});

const emit = defineEmits(['close', 'reviewSubmitted']);

const form = reactive({
  rating: 5,
  comment: ''
});

async function submitReview() {
  try {
    await api.post(`/products/${props.productId}/reviews`, {
      rating: form.rating,
      comment: form.comment
    });

    alert('Thank you! Your feedback has been recorded.');
    form.comment = '';
    form.rating = 5;
    emit('reviewSubmitted');
    emit('close');
  } catch (error) {
    alert(error.response?.data?.message || 'Something went wrong submitting your review.');
  }
}
</script>
