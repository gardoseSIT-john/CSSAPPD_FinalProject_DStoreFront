import { Component, computed, input } from '@angular/core';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../product.model';
import { cloudinaryUrl, IMG } from '../image-url';

@Component({
  selector: 'app-product-cell',
  imports: [RouterLink, CurrencyPipe, NgOptimizedImage],
  templateUrl: './product-cell.html',
  styleUrl: './product-cell.css',
})
export class ProductCell {
  readonly product = input.required<Product>();

  protected readonly src = computed(() =>
    cloudinaryUrl(this.product().images[0] ?? '', IMG.card),
  );
}