import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { AdminAddProductPanel } from '../admin-add-product-panel/admin-add-product-panel';
import { AdminEditProductPanel } from '../admin-edit-product-panel/admin-edit-product-panel';

@Component({
  selector: 'app-admin-main-page',
  imports: [CurrencyPipe, RouterLink, AdminAddProductPanel, AdminEditProductPanel],
  templateUrl: './admin-main-page.html',
  styleUrl: './admin-main-page.css',
})
export class AdminMainPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly service = inject(ProductService);

  protected readonly products = signal<Product[]>([]);
  protected readonly adding = signal(false);
  protected readonly editing = signal<Product | null>(null);
  protected readonly error = signal('');

  constructor() {
    this.load();
  }

  protected load() {
    this.service.getAllAdmin().subscribe({
      next: (p) => this.products.set(p),
      error: () => this.error.set('Could not load products.'),
    });
  }

  protected toggleHidden(p: Product) {
    const call = p.isActive ? this.service.hide(p._id) : this.service.unhide(p._id);
    call.subscribe({
      next: () => this.load(),
      error: () => this.error.set('Could not change visibility.'),
    });
  }

  protected remove(p: Product) {
    if (!confirm(`Remove "${p.name}" from the shelf?`)) return;
    this.service.remove(p._id).subscribe({
      next: () => this.load(),
      error: () => this.error.set('Could not remove the product.'),
    });
  }

  protected onSaved() {
    this.adding.set(false);
    this.editing.set(null);
    this.load();
  }

  protected logout() {
    this.auth.logout();
    this.router.navigateByUrl('/admin/login');
  }
}