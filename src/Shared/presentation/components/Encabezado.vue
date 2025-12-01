<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../../../iam/application/auth.store.js';

const { t, locale } = useI18n();
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const currentUser = computed(() => authStore.currentUser);

const menuItems = [
  { icon: '📊', name: 'home', label: 'Dashboard', path: '/' },
  { icon: '👥', name: 'colleagues', label: t('option.colleagues'), path: '/colleagues' },
  { icon: '🍴', name: 'restaurantes', label: t('option.restaurants'), path: '/restaurantes' },
  { icon: '📍', name: 'calculo', label: t('option.calculate'), path: '/calculo' }
];

const isActive = (path) => {
  return route.path === path;
};

const changeLanguage = () => {
  locale.value = locale.value === 'en' ? 'es' : 'en';
};

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="logo">
        <span class="logo-icon">🍽️</span>
        <h2 class="logo-text">LunchMate</h2>
      </div>
      <div v-if="currentUser" class="user-info">
        <div class="user-avatar">{{ currentUser.name?.charAt(0).toUpperCase() }}</div>
        <div class="user-details">
          <p class="user-name">{{ currentUser.name }}</p>
          <p class="user-role">{{ currentUser.role }}</p>
        </div>
      </div>
    </div>

    <nav class="sidebar-nav">
      <router-link
        v-for="item in menuItems"
        :key="item.name"
        :to="item.path"
        class="nav-item"
        :class="{ active: isActive(item.path) }"
      >
        <span class="nav-icon">{{ item.icon }}</span>
        <span class="nav-label">{{ item.label }}</span>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <button @click="changeLanguage" class="lang-button">
        <span>🌐</span>
        <span>{{ locale === 'en' ? 'Español' : 'English' }}</span>
      </button>
      <button @click="handleLogout" class="logout-button">
        <i class="pi pi-sign-out"></i>
        <span>Logout</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 280px;
  min-height: 100vh;
  background: linear-gradient(180deg, #ff9655 0%, #ff7f3d 100%);
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 12px rgba(0, 0, 0, 0.1);
  position: fixed;
  left: 0;
  top: 0;
  z-index: 100;
}

.sidebar-header {
  padding: 2rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.logo:hover {
  transform: scale(1.05);
}

.logo-icon {
  font-size: 2.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.5px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.sidebar-nav {
  flex: 1;
  padding: 1.5rem 0;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  margin: 0.25rem 0.75rem;
  border-radius: 12px;
}

.nav-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 0;
  background: white;
  border-radius: 0 4px 4px 0;
  transition: height 0.3s ease;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(5px);
}

.nav-item.active {
  background: rgba(255, 255, 255, 0.25);
  font-weight: 600;
}

.nav-item.active::before {
  height: 70%;
}

.nav-icon {
  font-size: 1.5rem;
  width: 32px;
  text-align: center;
}

.nav-label {
  font-size: 1rem;
  letter-spacing: 0.3px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  margin-top: 1rem;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.user-details {
  flex: 1;
  min-width: 0;
}

.user-name {
  margin: 0;
  font-weight: 600;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: white;
}

.user-role {
  margin: 0;
  font-size: 0.75rem;
  opacity: 0.9;
  text-transform: capitalize;
  color: rgba(255, 255, 255, 0.9);
}

.sidebar-footer {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.lang-button,
.logout-button {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.lang-button:hover,
.logout-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.lang-button span:first-child {
  font-size: 1.2rem;
}

.logout-button {
  background: rgba(220, 38, 38, 0.3);
}

.logout-button:hover {
  background: rgba(220, 38, 38, 0.5);
}

/* Scrollbar */
.sidebar-nav::-webkit-scrollbar {
  width: 6px;
}

.sidebar-nav::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}

.sidebar-nav::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}

.sidebar-nav::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

@media (max-width: 768px) {
  .sidebar {
    width: 70px;
  }

  .logo-text,
  .nav-label,
  .lang-button span:last-child,
  .logout-button span,
  .user-details {
    display: none;
  }

  .logo {
    justify-content: center;
  }

  .user-info {
    justify-content: center;
    padding: 0.75rem;
  }

  .nav-item {
    justify-content: center;
    padding: 1rem;
  }

  .lang-button,
  .logout-button {
    padding: 0.875rem;
  }
}
</style>