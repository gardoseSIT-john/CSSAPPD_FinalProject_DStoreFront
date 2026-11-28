import { Routes } from '@angular/router';

import { AdminOrdersPage } from './admin-orders-page';

// Loaded only when someone opens /admin/... (lazy group from app.routes.ts).
export const ADMIN_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'orders' },
  { path: 'orders', component: AdminOrdersPage },
];
