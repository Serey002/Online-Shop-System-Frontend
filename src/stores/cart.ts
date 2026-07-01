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

  const increaseQuantity = (productId: number) => {
    const item = items.value.find(i => i.product_id === productId);
    if (item) item.quantity += 1;
  };

  const decreaseQuantity = (productId: number) => {
    const item = items.value.find(i => i.product_id === productId);
    if (item) {
      item.quantity -= 1;
      if (item.quantity <= 0) {
        items.value = items.value.filter(i => i.product_id !== productId);
      }
    }
  };

  const removeFromCart = (productId: number) => {
    items.value = items.value.filter(i => i.product_id !== productId);
  };

  const submitOrder = async (address: string, phone: string, paymentMethod: string) => {
    const itemsSummaryString = items.value
      .map(i => `${i.quantity}x ${i.name}`)
      .join(', ');

    const orderPayload = {
      total_price: totalAmount.value,
      items_summary: itemsSummaryString,
      notes: `Address: ${address}, Phone: ${phone}, Payment: ${paymentMethod}`
    };

    await api.post('/orders', orderPayload);
    items.value = []; 
    isCartOpen.value = false;
  };

  return { 
    items, 
    isCartOpen, 
    totalAmount, 
    totalItemsCount, 
    addToCart, 
    increaseQuantity,
    decreaseQuantity,
    removeFromCart, 
    submitOrder 
  };
});