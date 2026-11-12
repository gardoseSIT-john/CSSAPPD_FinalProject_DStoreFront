import { Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../product.model';

@Component({
  selector: 'app-product-cell',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './product-cell.html',
  styleUrl: './product-cell.css',
})
export class ProductCell {
  readonly product = input.required<Product>();
}