import { Routes } from '@angular/router';
import { adminGuard } from './components/admin-guard';

export const routes: Routes = [
  // ---------- Public ----------
  {
    path: '', // also accepts ?tag=jackets, read inside MainPage
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
    path: 'cart',
    loadComponent: () => import('./components/cart-page/cart-page').then((m) => m.CartPage),
  },
  {
    path: 'order-confirmation/:ref',
    loadComponent: () =>
      import('./components/order-confirmation-page/order-confirmation-page').then(
        (m) => m.OrderConfirmationPage,
      ),
  },

  // ---------- Admin ----------
  // Login sits OUTSIDE the guard, so it works without a token. It must come before 'admin'.
  {
    path: 'admin/login',
    loadComponent: () =>
      import('./components/admin-login/admin-login').then((m) => m.AdminLogin),
  },
  // Everything else under /admin is one lazy group. canMatch runs before the code is
  // downloaded, so a logged-out visitor never fetches the admin bundle.
  {
    path: 'admin',
    canMatch: [adminGuard],
    loadChildren: () => import('./components/admin.routes').then((m) => m.adminRoutes),
  },

  // ---------- Unknown URLs ----------
  {
    path: '**',
    loadComponent: () =>
      import('./components/not-found-page/not-found-page').then((m) => m.NotFoundPage),
  },
];