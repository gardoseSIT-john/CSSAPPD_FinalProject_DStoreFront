import { Component, ElementRef, effect, input, signal, viewChild } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../product.model';

@Component({
  selector: 'app-product-rail',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './product-rail.html',
  styleUrl: './product-rail.css',
  host: {
    '(window:resize)': 'updateArrows()',
  },
})
export class ProductRail {
  readonly products = input.required<Product[]>();

  private readonly track = viewChild<ElementRef<HTMLDivElement>>('track');
  protected readonly atStart = signal(true);
  protected readonly atEnd = signal(true);

  constructor() {
    // re-check the arrows whenever the list changes
    effect(() => {
      this.products();
      setTimeout(() => this.updateArrows());
    });
  }

  protected scroll(direction: number): void {
    const el = this.track()?.nativeElement;
    if (!el) {
      return;
    }
    el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' });
  }

  protected updateArrows(): void {
    const el = this.track()?.nativeElement;
    if (!el) {
      return;
    }
    this.atStart.set(el.scrollLeft <= 4);
    this.atEnd.set(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  }
}
