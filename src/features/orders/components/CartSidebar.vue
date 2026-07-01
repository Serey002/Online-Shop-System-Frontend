<template>
  <div 
    v-if="cart.isCartOpen" 
    class="fixed top-16 right-0 bottom-0 w-full max-w-md z-50 pointer-events-none overflow-hidden" 
    role="dialog" 
    aria-modal="true"
  >
    <div class="absolute inset-0 overflow-hidden">
      
      <div class="w-full h-full bg-white shadow-2xl flex flex-col border-l border-gray-100 pointer-events-auto">
        
        <div class="px-6 py-5 flex items-center justify-between border-b border-gray-100 bg-white">
          <h2 class="text-xl font-bold text-gray-900 flex items-center gap-2">
            <span>🛒</span> Your Cart
          </h2>
          <button 
            @click="cart.isCartOpen = false" 
            class="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            ✕
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-6 space-y-4">
          <template v-if="cart.items.length === 0">
            <div class="text-center text-gray-400 py-12">
              <div class="text-4xl mb-2">🍽️</div>
              <p class="font-medium">Your cart is empty.</p>
              <p class="text-xs text-gray-400 mt-1">Add items from the menu to see them here.</p>
            </div>
          </template>
          
          <template v-else>
            <div 
              v-for="item in cart.items" 
              :key="item.product_id" 
              class="flex items-center justify-between gap-4 p-3 rounded-xl border border-gray-50 bg-gray-50/50 hover:bg-gray-50 transition-colors"
            >
            <div class="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200/60">
              <img 
                v-if="item.image" 
                :src="formatImageUrl(item.image)" 
                :alt="item.name" 
                class="w-full h-full object-cover"
              />
              <div v-else class="w-full h-full flex items-center justify-center text-xl bg-gray-100 text-gray-400">
                🍔
              </div>
            </div>

            <div class="flex-1 min-w-0">
              <h4 class="font-semibold text-gray-800 text-sm truncate">{{ item.name }}</h4>
              <p class="text-primary font-bold text-sm mt-0.5">
                ${{ parseFloat(item.price).toFixed(2) }}
              </p>
            </div>

            <div class="flex items-center gap-1 border border-gray-200 rounded-lg">
              <button 
                @click="cart.decreaseQuantity(item.product_id)" 
                class="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-l-lg transition-colors text-lg font-bold"
              >
                −
              </button>
              <span class="w-8 h-8 flex items-center justify-center text-sm font-bold text-gray-800 border-x border-gray-200">
                {{ item.quantity }}
              </span>
              <button 
                @click="cart.increaseQuantity(item.product_id)" 
                class="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-green-500 hover:bg-green-50 rounded-r-lg transition-colors text-lg font-bold"
              >
                +
              </button>
            </div>

            <button 
              @click="cart.removeFromCart(item.product_id)" 
              class="text-red-400 hover:text-red-600 p-1 transition-colors"
              title="Remove"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
            </button>
            </div>
          </template>
        </div>

        <div class="p-6 border-t border-gray-100 bg-gray-50">
          <div class="flex justify-between items-center text-gray-900 mb-4">
            <span class="text-sm font-semibold text-gray-600">Total Amount:</span>
            <span class="text-2xl font-black text-primary">${{ Number(cart.totalAmount || 0).toFixed(2) }}</span>
          </div>
          
          <button 
            @click="handleCheckout" 
            :disabled="cart.items.length === 0 || isSubmitting" 
            class="w-full bg-primary hover:bg-primary-dark disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed text-white py-3.5 rounded-xl font-bold text-base shadow-lg transition-all active:scale-[0.99] text-center"
          >
            {{ isSubmitting ? 'Processing...' : 'Checkout' }}
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useCartStore } from '@/stores/cart';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

const cart = useCartStore();
const auth = useAuthStore();
const router = useRouter();
const isSubmitting = ref(false);

// Appends backend asset server mapping properties matching your Laravel server configurations
const formatImageUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // If your image paths are stored as "products/image.jpg", this appends the local Laravel storage domain
  return `http://localhost:8000/storage/${url}`;
};

const handleCheckout = async () => {
  if (!auth.isAuthenticated) {
    cart.isCartOpen = false;
    router.push('/login');
    return;
  }

  isSubmitting.value = true;
  try {
    await cart.submitOrder('Phnom Penh, Cambodia', 'cash'); // Matches Laravel collection payload criteria
    alert('🎉 Order placed successfully!');
    cart.isCartOpen = false;
  } catch (error) {
    console.error("Checkout failed:", error);
    alert('Failed to place order. Please check your network connection.');
  } finally {
    isSubmitting.value = false;
  }
};
</script>