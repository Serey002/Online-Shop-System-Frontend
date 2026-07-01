<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4" @click.self="$emit('close')">
    <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-gray-900">Checkout</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-50 transition-colors">
          ✕
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Delivery Address</label>
          <input v-model="form.address" type="text" required placeholder="e.g. #123, Street 456, Phnom Penh"
            class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input v-model="form.phone" type="tel" required placeholder="e.g. 012 345 678"
            class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
          <div class="grid grid-cols-2 gap-3">
            <button type="button" @click="form.payment_method = 'cash'"
              :class="['px-4 py-3 rounded-xl border-2 font-medium text-sm transition-all', form.payment_method === 'cash' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-gray-600 hover:border-gray-300']">
              <div class="text-lg mb-1">💵</div>
              Cash
            </button>
            <button type="button" @click="form.payment_method = 'card'"
              :class="['px-4 py-3 rounded-xl border-2 font-medium text-sm transition-all', form.payment_method === 'card' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-200 text-gray-600 hover:border-gray-300']">
              <div class="text-lg mb-1">💳</div>
              Card
            </button>
          </div>
        </div>

        <div class="pt-4 border-t border-gray-100">
          <div class="flex justify-between items-center mb-4">
            <span class="text-sm font-semibold text-gray-600">Total Amount:</span>
            <span class="text-2xl font-black text-primary">${{ Number(total).toFixed(2) }}</span>
          </div>

          <button type="submit" :disabled="submitting"
            class="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-base shadow-lg transition-all">
            {{ submitting ? 'Placing Order...' : 'Place Order' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

defineProps({
  isOpen: Boolean,
  total: { type: Number, default: 0 }
});

const emit = defineEmits(['close', 'submit']);

const form = reactive({
  address: '',
  phone: '',
  payment_method: 'cash'
});

const submitting = ref(false);

const handleSubmit = async () => {
  submitting.value = true;
  try {
    await emit('submit', { ...form });
  } finally {
    submitting.value = false;
  }
};
</script>
