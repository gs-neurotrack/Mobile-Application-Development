import type { Href } from 'expo-router';

export const ROUTES = {
  LOGIN: '/Login/login',
  MENU: '/Menu/menu',
  REGISTER: '/Register/register',
  PROFILE: '/Profile/profile',
  LIST_USER: '/ListUsers/listUsers'
 
} as const satisfies Record<string, Href>;