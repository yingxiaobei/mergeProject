import { lazy } from 'react';
export const file2Routers = [
  {
    path: '/system/system/roles',
    component: lazy(() => import('./Page2')),
  },
];
