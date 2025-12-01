/**
 * @file restaurants-routes.js
 * @description Route configuration for restaurants module
 */

import Restaurantes from '../../Shared/presentation/pages/Restaurantes.vue';

export const restaurantsRoutes = [
  {
    path: '/restaurantes',
    name: 'restaurantes',
    component: Restaurantes,
    meta: { requiresAuth: true }
  }
];
