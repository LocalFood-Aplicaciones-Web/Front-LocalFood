<script setup>
import { RouterView, useRoute } from 'vue-router';
import { onMounted, computed } from 'vue';
import { useAuthStore } from './iam/application/auth.store.js';
import Encabezado from './Shared/presentation/components/Encabezado.vue';
import Toast from 'primevue/toast';

const route = useRoute();
const authStore = useAuthStore();

const isPublicRoute = computed(() => route.meta.public);

onMounted(async () => {
    await authStore.loadUser();
});
</script>

<template>
    <div id="app">
        <Toast position="top-right" />
        <Encabezado v-if="!isPublicRoute" />
        <main class="main-content" :class="{ 'full-width': isPublicRoute }">
            <RouterView />
        </main>
    </div>
</template>

<style scoped>
#app {
    min-height: 100vh;
    display: flex;
}

.main-content {
    flex: 1;
    margin-left: 280px;
    background: var(--background-light);
    min-height: 100vh;
    overflow-x: hidden;
    transition: margin-left 0.3s ease;
}

.main-content.full-width {
    margin-left: 0;
}

@media (max-width: 768px) {
    .main-content {
        margin-left: 70px;
    }
    
    .main-content.full-width {
        margin-left: 0;
    }
}
</style>
