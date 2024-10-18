import { createRouter, createWebHistory } from "vue-router";

const routers = [{
  path: '/',
  name: 'Map',
  component: () => import('@/views/MapView.vue')
}

]

export default routers;
