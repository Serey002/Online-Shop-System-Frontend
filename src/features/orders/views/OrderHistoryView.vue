<template>
  <div class="max-w-4xl mx-auto mt-8 px-4">
    <h2 class="text-3xl font-extrabold text-gray-900 mb-8">Your Order History</h2>

    <div v-if="loading" class="text-center py-10 text-gray-500">
      Loading your orders...
    </div>

    <div v-else-if="orders.length === 0" class="text-center py-10 bg-white rounded-2xl shadow-sm border border-gray-100">
      <div class="text-4xl mb-4">🛒</div>
      <h3 class="text-xl font-bold text-gray-800 mb-2">No orders yet</h3>
      <p class="text-gray-500 mb-6">Looks like you haven't ordered any delicious food yet!</p>
      <router-link to="/" class="bg-[#e65100] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#bf4300] transition-colors">
        Browse Menu
      </router-link>
    </div>

    <div v-else class="space-y-6">
      <div v-for="order in orders" :key="order.id" class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
        
        <div class="flex flex-col sm:flex-row justify-between sm:items-center border-b border-gray-100 pb-4 mb-4 gap-4">
          <div>
            <span class="text-sm font-bold text-gray-400">Order #{{ order.id }}</span>
            <div class="text-gray-800 font-semibold mt-1">
              Date: {{ order.created_at ? new Date(order.created_at).toLocaleDateString() : 'Invalid Date' }}
            </div>
          </div>
          
          <div class="flex items-center gap-4">
            <span :class="getStatusColor(order.status)" class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              {{ order.status || 'Processing' }}
            </span>
            <span class="text-xl font-extrabold text-orange-600">
              ${{ order.total_price ? Number(order.total_price).toFixed(2) : '0.00' }}
            </span>
          </div>
        </div>

        <div class="flex items-center justify-end mb-3">
          <button 
            @click="reorder(order)" 
            :disabled="reorderLoading === order.id"
            class="text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
          >
            {{ reorderLoading === order.id ? 'Adding...' : '🔄 Buy Again' }}
          </button>
        </div>

        <div class="space-y-1 bg-gray-50 p-3 rounded-xl border border-gray-100">
          <span class="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Items Breakdown</span>
          <p class="text-sm text-gray-700 font-medium leading-relaxed">
            {{ order.items_summary || 'No item descriptions details found.' }}
          </p>
        </div>

        <div v-if="order.notes" class="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
          <div>
            <span class="font-bold text-gray-700">Delivery Notes / Address:</span> 
            <span class="text-gray-600 ml-1">{{ order.notes }}</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import { useCartStore } from '@/stores/cart';

const cartStore = useCartStore();
const orders = ref<any[]>([]);
const loading = ref(true);

onMounted(async () => {
  try {
    const response = await api.get('/orders');
    if (response.data && response.data.data) {
      orders.value = response.data.data;
    } else {
      orders.value = response.data;
    }
  } catch (error) {
    console.error('Failed to fetch orders', error);
  } finally {
    loading.value = false;
  }
});

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'delivered': return 'bg-green-100 text-green-700';
    case 'cancelled': return 'bg-red-100 text-red-700';
    case 'shipped': return 'bg-blue-100 text-blue-700';
    case 'preparing': return 'bg-amber-100 text-amber-700';
    case 'served & done': return 'bg-green-100 text-green-700';
    default: return 'bg-orange-100 text-orange-700';
  }
};

const reorderLoading = ref<number | null>(null);

const reorder = async (order: any) => {
  reorderLoading.value = order.id;
  try {
    const response = await api.get('/products');
    const allProducts = response.data.data || [];

    const items = order.items_summary?.split(', ') || [];
    for (const item of items) {
      const match = item.match(/(\d+)x\s+(.+)/);
      if (!match) continue;
      const quantity = parseInt(match[1]);
      const name = match[2].trim();
      const product = allProducts.find((p: any) => p.name.toLowerCase() === name.toLowerCase());
      if (product) {
        for (let i = 0; i < quantity; i++) {
          cartStore.addToCart(product);
        }
      }
    }
    cartStore.isCartOpen = true;
  } catch (error) {
    console.error('Failed to reorder', error);
  } finally {
    reorderLoading.value = null;
  }
};
</script>