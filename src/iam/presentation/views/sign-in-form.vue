<template>
  <div class="login-page">
    <Toast />
    <div class="login-container">
      <Card class="login-card">
        <template #header>
          <div class="login-header">
            <i class="pi pi-users" style="font-size: 3rem; color: var(--primary-color)"></i>
            <h1>Welcome Back</h1>
            <p>Sign in to continue to LocalFood</p>
          </div>
        </template>
        <template #content>
          <form @submit.prevent="handleLogin" class="p-fluid">
            <div class="field">
              <label for="email">Email</label>
              <InputText 
                id="email"
                v-model="email"
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
                v-model="password"
                placeholder="Enter your password"
                :feedback="false"
                toggleMask
                :class="{ 'p-invalid': errors.password }"
              />
              <small v-if="errors.password" class="p-error">{{ errors.password }}</small>
            </div>

            <Message v-if="authError" severity="error" :closable="false">
              {{ authError }}
            </Message>

            <Button 
              type="submit"
              label="Sign In"
              icon="pi pi-sign-in"
              :loading="loading"
              class="mt-3"
            />

            <Divider align="center">
              <span class="text-sm">OR</span>
            </Divider>

            <div class="text-center">
              <span class="text-600">Don't have an account? </span>
              <Button 
                label="Create Account"
                class="p-button-link p-0"
                @click="$router.push('/register')"
              />
            </div>
          </form>
        </template>
      </Card>

      <div class="demo-credentials">
        <p class="text-sm text-500">Demo Credentials:</p>
        <p class="text-xs"><strong>Admin:</strong> admin@example.com / admin123</p>
        <p class="text-xs"><strong>User:</strong> user@example.com / user123</p>
      </div>
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

const email = ref('');
const password = ref('');
const errors = ref({});
const authError = ref('');
const loading = ref(false);

const validateForm = () => {
  errors.value = {};
  
  if (!email.value) {
    errors.value.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    errors.value.email = 'Email is invalid';
  }
  
  if (!password.value) {
    errors.value.password = 'Password is required';
  } else if (password.value.length < 6) {
    errors.value.password = 'Password must be at least 6 characters';
  }
  
  return Object.keys(errors.value).length === 0;
};

const handleLogin = async () => {
  authError.value = '';
  
  if (!validateForm()) return;
  
  loading.value = true;
  
  try {
    await authStore.login(email.value, password.value);
    toast.add({
      severity: 'success',
      summary: 'Welcome!',
      detail: 'Login successful',
      life: 3000
    });
    router.push('/');
  } catch (error) {
    authError.value = error.message || 'Login failed. Please check your credentials.';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-page {
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

.login-container {
  width: 100%;
  max-width: 450px;
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

.login-card {
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.login-header {
  text-align: center;
  padding: 2rem 2rem 1rem;
}

.login-header h1 {
  margin: 1rem 0 0.5rem;
  color: #2c3e50;
  font-size: 1.8rem;
}

.login-header p {
  color: #7f8c8d;
  margin: 0;
}

.demo-credentials {
  margin-top: 1.5rem;
  text-align: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 1rem;
  border-radius: 12px;
  animation: fadeIn 1s ease 0.3s both;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.demo-credentials p {
  margin: 0.25rem 0;
  color: white;
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