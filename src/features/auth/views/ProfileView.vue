<template>
  <div class="max-w-2xl mx-auto mt-8 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
    <h2 class="text-3xl font-extrabold text-gray-900 mb-6">My Profile</h2>
    
    <div v-if="successMessage" class="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200">
      {{ successMessage }}
    </div>

    <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
      {{ errorMessage }}
    </div>

    <form @submit.prevent="updateProfile" class="space-y-5">
      <!-- Profile Image Upload -->
      <div class="flex flex-col items-center mb-6">
        <div class="relative">
          <div class="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 bg-gray-100 flex items-center justify-center">
            <img 
              v-if="imagePreview || authStore.user?.image_url" 
              :src="imagePreview || authStore.user?.image_url" 
              alt="Profile" 
              class="w-full h-full object-cover"
            />
            <svg 
              v-else
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke-width="1.5" 
              stroke="currentColor" 
              class="w-16 h-16 text-gray-400"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <label class="absolute bottom-0 right-0 bg-primary hover:bg-primary-dark text-white p-2 rounded-full cursor-pointer shadow-lg transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
            </svg>
            <input 
              type="file" 
              accept="image/*" 
              @change="handleImageChange" 
              class="hidden"
            />
          </label>
        </div>
        <p class="mt-3 text-sm text-gray-500">Click the camera icon to upload a new profile picture</p>
      </div>

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
const errorMessage = ref('');
const imagePreview = ref('');
const selectedImage = ref<File | null>(null);

const form = ref({
  name: '',
  email: '',
  phone: ''
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

const handleImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (file) {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      errorMessage.value = 'Please select a valid image file';
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      errorMessage.value = 'Image size must be less than 5MB';
      return;
    }
    
    selectedImage.value = file;
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
    
    errorMessage.value = '';
  }
};

const updateProfile = async () => {
  loading.value = true;
  successMessage.value = '';
  errorMessage.value = '';
  
  try {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('name', form.value.name);
    formData.append('email', form.value.email);
    formData.append('phone', form.value.phone);
    
    // Add profile image if selected
    if (selectedImage.value) {
      formData.append('image', selectedImage.value);
    }
    
    await api.post('/user/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    // Refresh user data in store
    await authStore.fetchUser();
    successMessage.value = 'Profile updated successfully!';
    
    // Clear image selection
    selectedImage.value = null;
    imagePreview.value = '';
    
  } catch (error: any) {
    console.error(error);
    errorMessage.value = error.response?.data?.message || 'Failed to update profile. Please check your inputs.';
  } finally {
    loading.value = false;
  }
};
</script>
