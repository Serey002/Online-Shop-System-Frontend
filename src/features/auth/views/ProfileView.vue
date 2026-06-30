<template>
  <div class="max-w-2xl mx-auto mt-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
    <h2 class="text-3xl font-extrabold text-gray-900 mb-6">My Profile</h2>
    
    <div v-if="successMessage" class="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200">
      {{ successMessage }}
    </div>

    <form @submit.prevent="updateProfile" class="space-y-5">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
        <input v-model="form.name" type="text" required 
               class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
        <input v-model="form.email" type="email" required 
               class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
        <input v-model="form.phone" type="text" required 
               class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
      </div>

      <div class="pt-4 border-t border-gray-100">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Change Password (Optional)</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input v-model="form.password" type="password" 
                   class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                   placeholder="Leave blank to keep current password" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
            <input v-model="form.password_confirmation" type="password" 
                   class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all" />
          </div>
        </div>
      </div>

      <div class="pt-6 flex justify-end">
        <button type="submit" :disabled="loading" 
                class="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-70">
          {{ loading ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import api from '@/services/api';

const authStore = useAuthStore();
const loading = ref(false);
const successMessage = ref('');

const form = ref({
  name: '',
  email: '',
  phone: '',
  password: '',
  password_confirmation: ''
});

onMounted(async () => {
  // Make sure user data is loaded
  if (!authStore.user) {
    await authStore.fetchUser();
  }
  
  if (authStore.user) {
    form.value.name = authStore.user.name || '';
    form.value.email = authStore.user.email || '';
    form.value.phone = authStore.user.phone || '';
  }
});

const updateProfile = async () => {
  loading.value = true;
  successMessage.value = '';
  
  try {
    // Only send password if user typed one
    const payload: any = {
      name: form.value.name,
      email: form.value.email,
      phone: form.value.phone,
    };
    
    if (form.value.password) {
      payload.password = form.value.password;
      payload.password_confirmation = form.value.password_confirmation;
    }

    await api.put('/user/profile', payload);
    
    // Refresh user data in store
    await authStore.fetchUser();
    successMessage.value = 'Profile updated successfully!';
    
    // Clear password fields
    form.value.password = '';
    form.value.password_confirmation = '';
    
  } catch (error) {
    console.error(error);
    alert('Failed to update profile. Please check your inputs.');
  } finally {
    loading.value = false;
  }
};
</script>