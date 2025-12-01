<template>
  <div class="register-page">
    <Toast />
    <div class="register-container">
      <Card class="register-card">
        <template #header>
          <div class="register-header">
            <i class="pi pi-user-plus" style="font-size: 3rem; color: var(--primary-color)"></i>
            <h1>Create Account</h1>
            <p>Join LocalFood today</p>
          </div>
        </template>
        <template #content>
          <form @submit.prevent="handleRegister" class="p-fluid">
            <div class="field">
              <label for="name">Full Name</label>
              <InputText 
                id="name"
                v-model="form.name"
                placeholder="Enter your full name"
                :class="{ 'p-invalid': errors.name }"
              />
              <small v-if="errors.name" class="p-error">{{ errors.name }}</small>
            </div>

            <div class="field">
              <label for="username">Username</label>
              <InputText 
                id="username"
                v-model="form.username"
                placeholder="Choose a username"
                :class="{ 'p-invalid': errors.username }"
              />
              <small v-if="errors.username" class="p-error">{{ errors.username }}</small>
            </div>

            <div class="field">
              <label for="email">Email</label>
              <InputText 
                id="email"
                v-model="form.email"
                type="email"
                placeholder="Enter your email"
                :class="{ 'p-invalid': errors.email }"
              />
              <small v-if="errors.email" class="p-error">{{ errors.email }}</small>
            </div>

            <div class="field">
              <label for="password">Password</label>
              <Password 
                id="password"
                v-model="form.password"
                placeholder="Create a password"
                toggleMask
                :class="{ 'p-invalid': errors.password }"
              >
                <template #footer>
                  <Divider />
                  <p class="mt-2 mb-2 text-sm font-semibold">Password Requirements:</p>
                  <ul class="pl-2 ml-2 mt-0 text-sm" style="line-height: 1.8">
                    <li>At least 6 characters</li>
                    <li>Mix of letters and numbers</li>
                  </ul>
                </template>
              </Password>
              <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
            </div>

            <div class="field">
              <label for="confirmPassword">Confirm Password</label>
              <Password 
                id="confirmPassword"
                v-model="form.confirmPassword"
                placeholder="Confirm your password"
                :feedback="false"
                toggleMask
                :class="{ 'p-invalid': errors.confirmPassword }"
              />
              <small v-if="errors.confirmPassword" class="p-error">{{ errors.confirmPassword }}</small>
            </div>

            <Message v-if="authError" severity="error" :closable="false">
              {{ authError }}
            </Message>

            <Button 
              type="submit"
              label="Create Account"
              icon="pi pi-user-plus"
              :loading="loading"
              class="mt-3"
            />

            <Divider align="center">
              <span class="text-sm">OR</span>
            </Divider>

            <div class="text-center">
              <span class="text-600">Already have an account? </span>
              <Button 
                label="Sign In"
                class="p-button-link p-0"
                @click="$router.push('/login')"
              />
            </div>
          </form>
        </template>
      </Card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../application/auth.store.js';
import { useToast } from 'primevue/usetoast';
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Message from 'primevue/message';
import Toast from 'primevue/toast';
import Divider from 'primevue/divider';

const router = useRouter();
const authStore = useAuthStore();
const toast = useToast();

const form = ref({
  name: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
});

const errors = ref({});
const authError = ref('');
const loading = ref(false);

const validateForm = () => {
  errors.value = {};
  
  if (!form.value.name) {
    errors.value.name = 'Name is required';
  }
  
  if (!form.value.username) {
    errors.value.username = 'Username is required';
  } else if (form.value.username.length < 3) {
    errors.value.username = 'Username must be at least 3 characters';
  }
  
  if (!form.value.email) {
    errors.value.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(form.value.email)) {
    errors.value.email = 'Email is invalid';
  }
  
  if (!form.value.password) {
    errors.value.password = 'Password is required';
  } else if (form.value.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters';
  }
  
  if (!form.value.confirmPassword) {
    errors.value.confirmPassword = 'Please confirm your password';
  } else if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = 'Passwords do not match';
  }
  
  return Object.keys(errors.value).length === 0;
};

const handleRegister = async () => {
  authError.value = '';
  
  if (!validateForm()) return;
  
  loading.value = true;
  
  try {
    await authStore.register({
      name: form.value.name,
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
      role: 'user'
    });
    
    toast.add({
      severity: 'success',
      summary: 'Welcome!',
      detail: 'Account created successfully',
      life: 3000
    });
    
    router.push('/');
  } catch (error) {
    authError.value = error.message || 'Registration failed. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
  animation: gradientShift 15s ease infinite;
  background-size: 200% 200%;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.register-container {
  width: 100%;
  max-width: 500px;
  animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.register-card {
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.register-header {
  text-align: center;
  padding: 2rem 2rem 1rem;
}

.register-header h1 {
  margin: 1rem 0 0.5rem;
  color: #2c3e50;
  font-size: 1.8rem;
}

.register-header p {
  color: #7f8c8d;
  margin: 0;
}

.field {
  margin-bottom: 1.5rem;
}

.field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
}
</style>