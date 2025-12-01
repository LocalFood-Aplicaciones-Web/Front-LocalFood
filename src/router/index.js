import { createRouter, createWebHistory } from "vue-router";
import Home from "../Shared/presentation/pages/Home.vue";
import Colegas from "../Shared/presentation/pages/Colegas.vue";
import Restaurantes from "../Shared/presentation/pages/Restaurantes.vue";
import Calculo from "../calculate/presentation/views/Calculo.vue";
import SignIn from "../iam/presentation/views/sign-in-form.vue";
import SignUp from "../iam/presentation/views/sign-up-form.vue";
import { colleaguesRoutes } from "../colleagues/presentation/colleagues-routes.js";

const router = createRouter(
  {
    history: createWebHistory(),
    routes: [
      {
        path: "/login",
        name: "login",
        component: SignIn,
        meta: { public: true }
      },
      {
        path: "/register",
        name: "register",
        component: SignUp,
        meta: { public: true }
      },
      {
        path:"/",
        name: "home",
        component: Home,
        meta: { requiresAuth: true }
      },
      ...colleaguesRoutes,
      {
        path:"/colegas",
        name: "colegas",
        component: Colegas,
        meta: { requiresAuth: true }
      },
      {
        path:"/restaurantes",
        name: "restaurantes",
        component: Restaurantes,
        meta: { requiresAuth: true }
      },
      {
        path:"/calculo",
        name: "calculo",
        component: Calculo,
        meta: { requiresAuth: true }
      }
    ]
  }
)

// Navigation guard
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token');
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const isPublic = to.matched.some(record => record.meta.public);

  if (requiresAuth && !token) {
    next('/login');
  } else if (isPublic && token) {
    next('/');
  } else {
    next();
  }
});

export default router;