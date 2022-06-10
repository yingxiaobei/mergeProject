import { lazy } from 'react';
export const file1Routers = [
  {
    path: '/system/system/users',
    component: lazy(() => import('./Page1')),
  },
];
