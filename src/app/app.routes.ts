import { Routes } from '@angular/router';

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
  { path: '**', redirectTo: '' },
];