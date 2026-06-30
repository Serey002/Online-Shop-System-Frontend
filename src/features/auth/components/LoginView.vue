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
                <a href="#" class="text-[11px] font-bold text-orange-500 hover:underline">Forgot?</a>
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
                <span>Sign In</span>
              </button>
            </div>
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

// Properly bundling the local mp4 video asset using Vite's URL constructor
import localVideo from '@/assets/images/video.mp4';
const videoUrl = ref(localVideo);

const authStore = useAuthStore();
const router = useRouter();
const loading = ref(false);

const form = ref({
  email: '',
  password: ''
});

const handleLogin = async () => {
  loading.value = true;
  try {
    await authStore.login(form.value);
    router.push('/');
  } catch (error) {
    alert('Login failed. Please check your credentials.');
  } finally {
    loading.value = false;
  }
};
</script>