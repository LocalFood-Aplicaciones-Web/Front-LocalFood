<script setup>
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';

const router = useRouter();
const { t, locale } = useI18n();

const changeLanguage = () => {
    locale.value = locale.value === 'en' ? 'es' : 'en';
};

const navigateTo = (routeName) => {
    router.push({ name: routeName });
};
</script>

<template>
    <nav class="navbar">
        <div class="navbar-container">
            <div class="navbar-brand" @click="navigateTo('home')">
                <span class="brand-icon">🍽️</span>
                <span class="brand-text">Restaurant Finder</span>
            </div>
            
            <div class="navbar-menu">
                <button 
                    @click="navigateTo('home')" 
                    class="nav-link"
                    :class="{ active: $route.name === 'home' }"
                >
                    {{ t('option.home') }}
                </button>
                <button 
                    @click="navigateTo('colleagues')" 
                    class="nav-link"
                    :class="{ active: $route.name === 'colleagues' }"
                >
                    {{ t('option.colleagues') }}
                </button>
                <button 
                    @click="navigateTo('restaurantes')" 
                    class="nav-link"
                    :class="{ active: $route.name === 'restaurantes' }"
                >
                    {{ t('option.restaurants') }}
                </button>
                <button 
                    @click="navigateTo('calculo')" 
                    class="nav-link"
                    :class="{ active: $route.name === 'calculo' }"
                >
                    {{ t('option.calculate') }}
                </button>
                <button
                  @click="navigateTo('subscriptions')"
                  class="nav-link"
                  :class="{ active: $route.name === 'subscriptions' }"
                >
                    {{ t('option.subscriptions') }}
                </button>
            </div>

            <button @click="changeLanguage" class="lang-toggle">
                {{ locale === 'en' ? '🇪🇸 ES' : '🇺🇸 EN' }}
            </button>
        </div>
    </nav>
</template>

<style scoped>
.navbar {
    background: linear-gradient(135deg, var(--primary-color), var(--primary-hover));
    box-shadow: var(--shadow-md);
    position: sticky;
    top: 0;
    z-index: 100;
}

.navbar-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2rem;
}

.navbar-brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    transition: transform var(--transition-fast);
}

.navbar-brand:hover {
    transform: scale(1.05);
}

.brand-icon {
    font-size: 1.75rem;
}

.brand-text {
    font-size: 1.25rem;
    font-weight: 700;
    color: white;
    letter-spacing: 0.5px;
}

.navbar-menu {
    display: flex;
    gap: 0.5rem;
    flex: 1;
    justify-content: center;
}

.nav-link {
    padding: 0.5rem 1.25rem;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    border: none;
    border-radius: var(--radius-md);
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-fast);
    backdrop-filter: blur(10px);
}

.nav-link:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
}

.nav-link.active {
    background: white;
    color: var(--primary-color);
    font-weight: 600;
}

.lang-toggle {
    padding: 0.5rem 1rem;
    background: white;
    color: var(--primary-color);
    border: none;
    border-radius: var(--radius-md);
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    transition: all var(--transition-fast);
}

.lang-toggle:hover {
    transform: scale(1.05);
    box-shadow: var(--shadow-primary);
}

@media (max-width: 768px) {
    .navbar-container {
        flex-direction: column;
        padding: 1rem;
        gap: 1rem;
    }

    .navbar-menu {
        width: 100%;
        flex-wrap: wrap;
        justify-content: center;
    }

    .nav-link {
        padding: 0.5rem 1rem;
        font-size: 0.9rem;
    }

    .brand-text {
        font-size: 1rem;
    }
}
</style>
