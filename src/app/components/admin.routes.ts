import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./admin-main-page/admin-main-page').then((m) => m.AdminMainPage),
  },
  {
    path: 'orders',
    loadComponent: () =>
      import('./admin-db-view/admin-db-view').then((m) => m.AdminDbView),
  },
];