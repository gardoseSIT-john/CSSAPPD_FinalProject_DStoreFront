import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ProductService } from '../product.service';
import { ProductCell } from '../product-cell/product-cell';

@Component({
  selector: 'app-main-page',
  imports: [ProductCell],
  templateUrl: './main-page.html',
  styleUrl: './main-page.css',
})
export class MainPage {
  private readonly service = inject(ProductService);

  protected readonly products = toSignal(this.service.getAll(), { initialValue: [] });
  protected readonly query = signal('');

  protected readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.products();
    return this.products().filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
    );
  });

  protected onSearch(event: Event) {
    this.query.set((event.target as HTMLInputElement).value);
  }
}