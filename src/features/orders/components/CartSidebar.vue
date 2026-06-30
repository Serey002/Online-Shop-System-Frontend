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
          <div v-if="cart.items.length === 0" class="text-center text-gray-400 py-12">
            <div class="text-4xl mb-2">🍽️</div>
            <p class="font-medium">Your cart is empty.</p>
            <p class="text-xs text-gray-400 mt-1">Add items from the menu to see them here.</p>
          </div>
          
          <div 
            v-else 
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
                <span class="text-gray-400 font-normal text-xs">x {{ item.quantity }}</span>
              </p>
            </div>

            <button 
              @click="cart.removeFromCart(item.product_id)" 
              class="text-red-500 text-xs font-medium hover:text-red-700 hover:underline transition-colors whitespace-nowrap"
            >
              Remove
            </button>
          </div>
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