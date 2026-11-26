import { Component, DOCUMENT, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { ProductService } from '../product.service';
import { ProductCell } from '../product-cell/product-cell';
import { HeroCarousel } from '../hero-carousel/hero-carousel';
import { MarqueeBand } from '../marquee-band/marquee-band';
import { CollectionLoop } from '../collection-loop/collection-loop';
import { ProductRail } from '../product-rail/product-rail';
import { CeoNote } from '../ceo-note/ceo-note';
import { BRAND } from '../brand.config';

@Component({
  selector: 'app-main-page',
  imports: [ProductCell, HeroCarousel, MarqueeBand, CollectionLoop, ProductRail, CeoNote],
  templateUrl: './main-page.html',
  styleUrl: './main-page.css',
})
export class MainPage {
  private readonly service = inject(ProductService);
  private readonly document = inject(DOCUMENT);

  protected readonly brand = BRAND;
  protected readonly bigWords = [BRAND.name, 'Picked by hand', 'Worn by us first'];

  // if the server is down the page still shows, with a message instead of products
  protected readonly loadFailed = signal(false);
  protected readonly products = toSignal(
    this.service.getAll().pipe(
      catchError(() => {
        this.loadFailed.set(true);
        return of([]);
      }),
    ),
    { initialValue: [] },
  );
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

  // a collection tile was clicked: filter by its tag and jump to the products
  protected pickTag(tag: string) {
    this.query.set(tag);
    this.document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  protected clearSearch() {
    this.query.set('');
  }
}
