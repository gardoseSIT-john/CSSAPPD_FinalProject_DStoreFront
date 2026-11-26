import { Component, computed, input, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../product.model';
import { BRAND } from '../brand.config';

const MAX_SLIDES = 5;

@Component({
  selector: 'app-hero-carousel',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './hero-carousel.html',
  styleUrl: './hero-carousel.css',
  host: {
    // pause the autoplay while the mouse or keyboard focus is on the hero
    '(mouseenter)': 'paused.set(true)',
    '(mouseleave)': 'paused.set(false)',
    '(focusin)': 'paused.set(true)',
    '(focusout)': 'paused.set(false)',
  },
})
export class HeroCarousel {
  readonly products = input.required<Product[]>();

  protected readonly brand = BRAND;
  protected readonly index = signal(0);
  protected readonly paused = signal(false);

  // the first few products that have a picture become the slides
  protected readonly slides = computed(() =>
    this.products()
      .filter((p) => p.images.length > 0)
      .slice(0, MAX_SLIDES),
  );

  protected readonly current = computed(() => this.slides()[this.index()] ?? null);

  protected go(target: number): void {
    const total = this.slides().length;
    if (total === 0) {
      return;
    }
    this.index.set((target + total) % total);
  }

  protected next(): void {
    this.go(this.index() + 1);
  }

  protected prev(): void {
    this.go(this.index() - 1);
  }

  protected pad(value: number): string {
    return String(value).padStart(2, '0');
  }
}
