import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { Product } from '../product.model';
import { ProductService } from '../product.service';
import { ProductCell } from '../product-cell/product-cell';
import { ErrorBanner } from '../error-banner/error-banner';

@Component({
  selector: 'app-main-page',
  imports: [ProductCell, RouterLink, ErrorBanner],
  templateUrl: './main-page.html',
  styleUrl: './main-page.css',
})
export class MainPage {
  private readonly service = inject(ProductService);
  private readonly route = inject(ActivatedRoute);

  protected readonly products = signal<Product[]>([]);
  protected readonly loading = signal(true);
  protected readonly failed = signal(false);
  protected readonly query = signal('');

  protected readonly tag = toSignal(
    this.route.queryParamMap.pipe(map((p) => p.get('tag'))),
    { initialValue: null },
  );

  protected readonly filtered = computed(() => {
    const tag = this.tag()?.toLowerCase();
    const q = this.query().trim().toLowerCase();
    return this.products().filter((p) => {
      const matchesTag = !tag || p.tags.some((t) => t.toLowerCase() === tag);
      const matchesQuery =
        !q || p.name.toLowerCase().includes(q) || p.tags.some((t) => t.toLowerCase().includes(q));
      return matchesTag && matchesQuery;
    });
  });

  constructor() {
    this.load();
  }

  protected load() {
    this.loading.set(true);
    this.failed.set(false);
    this.service.getAll().subscribe({
      next: (p) => {
        this.products.set(p);
        this.loading.set(false);
      },
      // the interceptor already reported network and 5xx errors to the banner
      error: () => {
        this.failed.set(true);
        this.loading.set(false);
      },
    });
  }

  protected onSearch(event: Event) {
    this.query.set((event.target as HTMLInputElement).value);
  }
}