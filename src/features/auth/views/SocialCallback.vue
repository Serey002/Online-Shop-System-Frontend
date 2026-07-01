<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <div class="text-4xl mb-4">{{ loading ? '⏳' : '✅' }}</div>
      <p class="text-gray-600 font-medium">{{ loading ? 'Completing sign in...' : 'Redirecting...' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const loading = ref(true);

onMounted(async () => {
  const token = route.query.token as string;
  const error = route.query.error as string;

  if (error) {
    alert(error);
    router.push('/login');
    return;
  }

  if (token) {
    localStorage.setItem('auth_token', token);
    authStore.token = token;
    authStore.isAuthenticated = true;
    await authStore.fetchUser();
    router.push('/');
  } else {
    router.push('/login');
  }
});
</script>
