/**
 * Calculate Routes
 * Route definitions for the calculate module
 *
 * @presentation Calculate Bounded Context
 */
import Calculo from './views/Calculo.vue';

export const calculateRoutes = [
  {
    path: '/calculo',
    name: 'calculo',
    component: Calculo,
    meta: { requiresAuth: true }
  }
];

