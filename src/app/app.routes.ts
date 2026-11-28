import { Routes } from '@angular/router';

import { MainPage } from './components/shop-window/main-page';
import { NotFoundPage } from './components/app-shell/not-found-page';

export const routes: Routes = [
  // Public pages
  { path: '', component: MainPage }, // also handles /?tag=...
  {
    path: 'product/:id',
    loadComponent: () =>
      import('./components/product-details/product-details-page').then((m) => m.ProductDetailsPage),
  },
  {
    path: 'cart',
    loadComponent: () => import('./components/cart/cart-page').then((m) => m.CartPage),
  },
  {
    path: 'order-confirmation/:ref',
    loadComponent: () =>
      import('./components/checkout/order-confirmation-page').then((m) => m.OrderConfirmationPage),
  },

  // Admin login stays outside the guard. It must come before the 'admin' group.
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./components/admin-access/admin-login-page').then((m) => m.AdminLoginPage),
  },

  // Everything else under /admin is a lazy-loaded group.
  // Feature 2 adds: canMatch: [adminGuard]
  {
    path: 'admin',
    loadChildren: () => import('./components/admin-orders/admin.routes').then((m) => m.ADMIN_ROUTES),
  },

  // Unknown URLs
  { path: '**', component: NotFoundPage },
];
