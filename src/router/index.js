import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/auth/LoginView.vue' 
import SignUpView from '../views/auth/SignUpView.vue'
import UserManagement from '../views/admin/UserManagement.vue'
import AssetManagement from '../views/admin/AssetManagement.vue'
import AvailableAssets from '../views/user/AvailableAssets.vue'
import NotFound from '../views/NotFound.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignUpView
    },
    {
      path: '/admin/users',
      name: 'AdminUsers',
      component: UserManagement
    },
    {
      path: '/admin/assets',
      name: 'AdminAssets',
      component: AssetManagement
    },
    {
      path: '/assets',
      name: 'AvailableAssets',
      component: AvailableAssets
    },
    { 
      path: '/:pathMatch(.*)*', 
      name: 'NotFound', 
      component: NotFound 
    }
  ],
})

export default router