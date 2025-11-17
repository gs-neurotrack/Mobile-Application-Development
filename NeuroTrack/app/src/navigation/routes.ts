import type { Href } from 'expo-router';

export const ROUTES = {
  LOGIN: '/Login/login',
  MENU: './Menu/menu',
  REGISTER: '/Register/register',
 
} as const satisfies Record<string, Href>;