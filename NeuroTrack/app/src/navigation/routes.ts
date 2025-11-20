import type { Href } from 'expo-router';

export const ROUTES = {
  LOGIN: '/Login/login',
  MENU: '/Menu/menu',
  REGISTER: '/Register/register',
  PROFILE: '/Profile/profile',
  LIST_USER: '/ListUsers/listUsers',
  SCORES: '/Scores/scores', 
  SCORES_ADMIN: '/ScoresAdmin/scoresAdmin',
  ABOUT: '/About/AboutNeuroTrackScreen'

 
} as const satisfies Record<string, Href>;