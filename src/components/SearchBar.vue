<template>
  <div class="relative w-full">
    <svg
      class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="2"
      stroke="currentColor"
    >
      <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>

    <input
      v-model="query"
      type="text"
      placeholder="Search for food..."
      class="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
      @input="onInput"
    />

    <button
      v-if="query"
      @click="clear"
      class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'search', query: string): void;
}>();

const query = ref('');

let debounceTimer: ReturnType<typeof setTimeout>;

const onInput = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    emit('search', query.value);
  }, 400);
};

const clear = () => {
  query.value = '';
  emit('search', '');
};
</script>
