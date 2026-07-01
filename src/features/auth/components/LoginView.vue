<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
    <div class="bg-white rounded-[24px] shadow-2xl overflow-hidden max-w-5xl w-full flex flex-col md:flex-row border border-gray-100 min-h-[500px]">
      
      <div class="hidden md:block w-[33%] bg-[#fffcf7] self-stretch">
        <img 
          src="https://i.pinimg.com/736x/92/2b/2e/922b2e571cc5e524e1e38505fdae8a32.jpg" 
          class="w-full h-full object-cover"
          alt="Food Presentation"
        >
      </div>

      <div class="w-full md:w-[33%] bg-black relative flex items-center justify-center self-stretch min-h-[300px] md:min-h-0">
        <video 
          :src="videoUrl"
          class="w-full h-full object-cover absolute inset-0" 
          controls 
          autoplay 
          loop 
          muted 
          playsinline
        ></video>
      </div>

      <div class="w-full md:w-[34%] p-6 sm:p-10 flex flex-col justify-center bg-white self-stretch">
        <div class="w-full mx-auto">
          <div class="mb-8">
            <h2 class="text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight leading-tight">Welcome Back</h2>
            <p class="text-xs text-gray-400 font-semibold mt-1">Please sign in to continue your order</p>
          </div>

          <form @submit.prevent="handleLogin" class="space-y-5">
            <div v-if="errorMsg" class="p-3 bg-red-50 text-red-600 rounded-xl border border-red-200 text-xs font-semibold">
              {{ errorMsg }}
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1.5">Email Address</label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 pointer-events-none text-sm">✉️</span>
                <input 
                  v-model="form.email" 
                  type="email" 
                  required 
                  class="w-full pl-11 pr-4 py-3 rounded-xl border-none outline-none text-xs font-semibold text-gray-700 bg-[#eef4fc] focus:bg-[#e2ecf8] transition-all"
                  placeholder="Your email" 
                />
              </div>
            </div>

            <div>
              <div class="flex justify-between items-center mb-1.5">
                <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400">Password</label>
              </div>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 pointer-events-none text-sm">🔒</span>
                <input 
                  v-model="form.password" 
                  type="password" 
                  required 
                  class="w-full pl-11 pr-4 py-3 rounded-xl border-none outline-none text-xs font-semibold text-gray-700 bg-[#eef4fc] focus:bg-[#e2ecf8] transition-all"
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <div class="pt-3">
              <button 
                type="submit" 
                :disabled="loading" 
                class="w-full bg-[#e65100] hover:bg-[#bf4300] text-white font-bold py-3 px-6 rounded-xl shadow-md active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
              >
                <span v-if="loading">Signing In...</span>
                <span v-else>Sign In</span>
              </button>
            </div>

            <div class="relative my-4">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-200"></div>
              </div>
              <div class="relative flex justify-center">
                <span class="bg-white px-3 text-[10px] font-bold text-gray-400 uppercase">Or continue with</span>
              </div>
            </div>

            <a 
              :href="`${apiBase}/auth/google/redirect`"
              class="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold py-3 px-6 rounded-xl shadow-sm transition-all text-xs"
            >
              <svg class="w-5 h-5" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.54 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.99 23.99 0 0 0 0 24c0 3.77.88 7.35 2.56 10.56l7.98-5.97z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 5.97C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Sign in with Google
            </a>
          </form>

          <p class="text-center text-[11px] font-bold text-gray-400 mt-8">
            Don't have an account? 
            <router-link to="/register" class="text-orange-500 hover:underline ml-1">Sign up</router-link>
          </p>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

import localVideo from '@/assets/images/video.mp4';
const videoUrl = ref(localVideo);

const authStore = useAuthStore();
const router = useRouter();
const loading = ref(false);
const errorMsg = ref('');
const apiBase = 'http://localhost:8000/api';

const form = ref({
  email: '',
  password: ''
});

const handleLogin = async () => {
  errorMsg.value = '';
  loading.value = true;
  try {
    await authStore.login(form.value);
    router.push('/');
  } catch (error: any) {
    errorMsg.value = error.response?.data?.message || 'Login failed. Please check your credentials.';
  } finally {
    loading.value = false;
  }
};
</script>