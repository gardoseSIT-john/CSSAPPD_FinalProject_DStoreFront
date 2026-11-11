import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';
import { ProductService } from '../product.service';
import { OrderPage } from '../order-page/order-page';

@Component({
  selector: 'app-product-details-page',
  imports: [RouterLink, CurrencyPipe, OrderPage],
  templateUrl: './product-details-page.html',
  styleUrl: './product-details-page.css',
})
export class ProductDetailsPage {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(ProductService);

  // undefined = still loading, null = not found
  protected readonly product = toSignal(
    this.route.paramMap.pipe(
      map((params) => params.get('id') ?? ''),
      switchMap((id) => this.service.getOne(id).pipe(catchError(() => of(null)))),
    ),
  );

  protected readonly selected = signal(0);
  protected readonly ordering = signal(false);

  protected select(index: number) {
    this.selected.set(index);
  }
}