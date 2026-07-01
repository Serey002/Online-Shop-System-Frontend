<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
    <div class="bg-white rounded-[24px] shadow-2xl overflow-hidden max-w-5xl w-full flex flex-col md:flex-row border border-gray-100 h-auto md:h-[620px]">
      
      <div class="hidden md:block w-[33%] bg-[#fffcf7] h-full">
        <img 
          src="https://i.pinimg.com/736x/92/2b/2e/922b2e571cc5e524e1e38505fdae8a32.jpg" 
          class="w-full h-full object-cover"
          alt="Food Presentation"
        >
      </div>

      <div class="w-full md:w-[33%] bg-black relative flex items-center justify-center h-[250px] md:h-full">
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

      <div class="w-full md:w-[34%] p-6 sm:p-8 flex flex-col justify-center bg-white h-full overflow-y-auto">
        <div class="w-full mx-auto">
          
          <div class="mb-4">
            <h2 class="text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight leading-tight">Create Account</h2>
            <p class="text-xs text-gray-400 font-semibold mt-0.5">Sign up to start ordering your food</p>
          </div>

          <form @submit.prevent="handleRegister" class="space-y-3">
            <div v-if="errorMsg" class="p-3 bg-red-50 text-red-600 rounded-xl border border-red-200 text-xs font-semibold">
              {{ errorMsg }}
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Full Name</label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 pointer-events-none text-sm">👤</span>
                <input 
                  v-model="form.name" 
                  type="text" 
                  required 
                  class="w-full pl-11 pr-4 py-2 rounded-xl border-none outline-none text-xs font-semibold text-gray-700 bg-[#eef4fc] focus:bg-[#e2ecf8] transition-all"
                  placeholder="Username" 
                />
              </div>
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Email Address</label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 pointer-events-none text-sm">✉️</span>
                <input 
                  v-model="form.email" 
                  type="email" 
                  required 
                  class="w-full pl-11 pr-4 py-2 rounded-xl border-none outline-none text-xs font-semibold text-gray-700 bg-[#eef4fc] focus:bg-[#e2ecf8] transition-all"
                  placeholder="Your email" 
                />
              </div>
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Phone Number</label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 pointer-events-none text-sm">📞</span>
                <input 
                  v-model="form.phone" 
                  type="tel"
                  class="w-full pl-11 pr-4 py-2 rounded-xl border-none outline-none text-xs font-semibold text-gray-700 bg-[#eef4fc] focus:bg-[#e2ecf8] transition-all"
                  placeholder="You phone number" 
                />
              </div>
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Password</label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 pointer-events-none text-sm">🔒</span>
                <input 
                  v-model="form.password" 
                  type="password" 
                  required 
                  class="w-full pl-11 pr-4 py-2 rounded-xl border-none outline-none text-xs font-semibold text-gray-700 bg-[#eef4fc] focus:bg-[#e2ecf8] transition-all"
                  placeholder="You password" 
                />
              </div>
            </div>

            <div>
              <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Confirm Password</label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 pointer-events-none text-sm">🛡️</span>
                <input 
                  v-model="form.password_confirmation" 
                  type="password" 
                  required 
                  class="w-full pl-11 pr-4 py-2 rounded-xl border-none outline-none text-xs font-semibold text-gray-700 bg-[#eef4fc] focus:bg-[#e2ecf8] transition-all"
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <div class="pt-2">
              <button 
                type="submit" 
                :disabled="loading" 
                class="w-full bg-[#e65100] hover:bg-[#bf4300] text-white font-bold py-2.5 px-6 rounded-xl shadow-md active:scale-[0.98] transition-all disabled:opacity-60 flex items-center justify-center gap-2 text-xs uppercase tracking-wider"
              >
                <span v-if="loading">Registering...</span>
                <span v-else>Sign Up</span>
              </button>
            </div>
          </form>

          <p class="text-center text-[11px] font-bold text-gray-400 mt-5">
            Already have an account? 
            <router-link to="/login" class="text-orange-500 hover:underline ml-1">Sign in</router-link>
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

const form = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: ''
});

const handleRegister = async () => {
  errorMsg.value = '';

  if (form.value.password !== form.value.password_confirmation) {
    errorMsg.value = 'Passwords do not match!';
    return;
  }

  loading.value = true;
  try {
    await authStore.register({
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone,
      password: form.value.password
    });
    
    router.push('/');
  } catch (error: any) {
    errorMsg.value = error.response?.data?.message || 'Registration failed. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>