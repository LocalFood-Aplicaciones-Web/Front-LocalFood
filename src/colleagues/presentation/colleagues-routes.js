import ColleaguesModern from './views/colleagues-modern.vue';

/**
 * Colleagues routes configuration
 */
export const colleaguesRoutes = [
    {
        path: '/colleagues',
        name: 'colleagues',
        component: ColleaguesModern,
        meta: {
            title: 'Colleagues',
            requiresAuth: true
        }
    }
];
