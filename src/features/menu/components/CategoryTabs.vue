<template>
  <div class="flex gap-3 overflow-x-auto pb-3 scrollbar-hide">
    <button 
      v-for="category in categories" 
      :key="category.id"
      @click="$emit('select-category', category.id)"
      :class="[
        'px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-200 border whitespace-nowrap active:scale-95',
        activeCategory === category.id
          ? 'bg-primary border-primary text-white shadow-sm shadow-orange-500/20'
          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
      ]"
    >
      {{ category.name }}
    </button>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  categories: Array<{ id: number | null; name: string }>;
  activeCategory: number | null;
}>();

defineEmits(['select-category']);
</script>