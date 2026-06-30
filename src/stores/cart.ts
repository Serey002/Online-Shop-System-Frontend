import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '@/services/api';

export const useCartStore = defineStore('cart', () => {
  const items = ref<any[]>([]);
  const isCartOpen = ref(false);

  // Calculates total price
  const totalAmount = computed(() => {
    return items.value.reduce((total, item) => total + (item.price * item.quantity), 0);
  });

  // Calculates total items count across all quantities for the navbar badge
  const totalItemsCount = computed(() => {
    return items.value.reduce((total, item) => total + item.quantity, 0);
  });

  const addToCart = (product: any) => {
    const existingItem = items.value.find(i => i.product_id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      items.value.push({ 
        product_id: product.id, 
        name: product.name, 
        price: product.price, 
        quantity: 1, 
        image: product.image 
      });
    }
    
    isCartOpen.value = true;
  };

  const removeFromCart = (productId: number) => {
    items.value = items.value.filter(i => i.product_id !== productId);
  };

  // FIXED: Properly maps payload keys to match your Laravel API validation expectations
  const submitOrder = async (address: string, paymentMethod: string) => {
    // 1. Convert your items array into a flat description string (e.g., "2x Pepperoni Pizza, 1x Coca Cola")
    const itemsSummaryString = items.value
      .map(i => `${i.quantity}x ${i.name}`)
      .join(', ');

    // 2. Map payload keys exactly matching your working Postman configuration
    const orderPayload = {
      total_price: totalAmount.value,                           // Matches backend 'total_price' validation rule
      items_summary: itemsSummaryString,                       // Matches backend 'items_summary' validation rule
      notes: `Address: ${address}, Payment Method: ${paymentMethod}` // Compiles details into your backend 'notes' column
    };

    // 3. Fire request through your authenticated api interceptor instance
    await api.post('/orders', orderPayload);
    
    // 4. Reset checkout application properties on successful deployment
    items.value = []; 
    isCartOpen.value = false;
  };

  return { 
    items, 
    isCartOpen, 
    totalAmount, 
    totalItemsCount, 
    addToCart, 
    removeFromCart, 
    submitOrder 
  };
});