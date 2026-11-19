import { Routes } from '@angular/router';
import {adminGuard} from './components/admin-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/main-page/main-page').then((m) => m.MainPage),
  },
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./components/product-details-page/product-details-page').then(
        (m) => m.ProductDetailsPage,
      ),
  },
  {
  path: 'admin/login',
  loadComponent: () => import('./components/admin-login/admin-login').then((m) => m.AdminLogin),
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () =>
      import('./components/admin-main-page/admin-main-page').then((m) => m.AdminMainPage),
  },
  { path: '**', redirectTo: '' },
];