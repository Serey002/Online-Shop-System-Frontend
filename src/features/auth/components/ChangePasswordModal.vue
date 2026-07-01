<template>
  <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
    <div class="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
      <h3 class="text-2xl font-bold text-gray-900 mb-6">Change Password</h3>
      
      <div v-if="successMessage" class="mb-4 p-3 bg-green-50 text-green-700 rounded-xl border border-green-200 text-sm">
        {{ successMessage }}
      </div>

      <div v-if="errorMessage" class="mb-4 p-3 bg-red-50 text-red-700 rounded-xl border border-red-200 text-sm">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="changePassword" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
          <input 
            v-model="form.current_password" 
            type="password" 
            required
            class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            placeholder="Enter your current password"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
          <input 
            v-model="form.new_password" 
            type="password" 
            required
            minlength="8"
            class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            placeholder="Enter new password (min 8 characters)"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
          <input 
            v-model="form.new_password_confirmation" 
            type="password" 
            required
            class="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
            placeholder="Confirm your new password"
          />
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <button 
            type="button"
            @click="closeModal" 
            class="px-6 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 text-gray-700 font-medium transition"
          >
            Cancel
          </button>
          <button 
            type="submit"
            :disabled="loading"
            class="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition disabled:opacity-50"
          >
            {{ loading ? 'Changing...' : 'Change Password' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import api from '@/services/api';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'success']);

const form = reactive({
  current_password: '',
  new_password: '',
  new_password_confirmation: ''
});

const loading = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const changePassword = async () => {
  loading.value = true;
  successMessage.value = '';
  errorMessage.value = '';

  // Validate passwords match
  if (form.new_password !== form.new_password_confirmation) {
    errorMessage.value = 'New passwords do not match!';
    loading.value = false;
    return;
  }

  try {
    const response = await api.put('/user/change-password', {
      current_password: form.current_password,
      new_password: form.new_password,
      new_password_confirmation: form.new_password_confirmation
    });

    successMessage.value = response.data.message || 'Password changed successfully!';
    
    // Reset form
    form.current_password = '';
    form.new_password = '';
    form.new_password_confirmation = '';

    // Close modal after 2 seconds
    setTimeout(() => {
      emit('success');
      closeModal();
    }, 2000);

  } catch (error: any) {
    console.error('Change password error:', error);
    errorMessage.value = error.response?.data?.message || 
                         error.response?.data?.errors?.current_password?.[0] ||
                         'Failed to change password. Please check your current password.';
  } finally {
    loading.value = false;
  }
};

const closeModal = () => {
  successMessage.value = '';
  errorMessage.value = '';
  form.current_password = '';
  form.new_password = '';
  form.new_password_confirmation = '';
  emit('close');
};
</script>
