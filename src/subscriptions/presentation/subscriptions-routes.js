// Lazy-loaded components
const planList = () => import('./views/plan-list.vue');
const membershipDetails = () => import('./views/membership-details.vue');

const subscriptionsRoutes = [
    {path: 'plans', name: 'subscriptions-plans', component: planList, meta: {title: 'Subscription Plans'}},
    {path: 'details', name: 'subscriptions-details', component: membershipDetails, meta: {title: 'My Membership'}},
    {path: '', redirect: { name: 'subscriptions-plans' }}
];

export default subscriptionsRoutes;