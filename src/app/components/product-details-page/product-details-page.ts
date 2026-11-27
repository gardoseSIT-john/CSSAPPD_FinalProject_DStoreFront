import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BehaviorSubject, catchError, combineLatest, map, of, switchMap } from 'rxjs';
import { ProductService } from '../product.service';
import { OrderPage } from '../order-page/order-page';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorBanner } from '../error-banner/error-banner';



@Component({
  selector: 'app-product-details-page',
  imports: [RouterLink, CurrencyPipe, OrderPage,ErrorBanner],
  templateUrl: './product-details-page.html',
  styleUrl: './product-details-page.css',
})
export class ProductDetailsPage {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(ProductService);

  // undefined = still loading, null = not found
  private readonly retryTick = new BehaviorSubject(0);

// undefined = loading (or failed, with the banner showing), null = not found
protected readonly product = toSignal(
  combineLatest([this.route.paramMap, this.retryTick]).pipe(
    map(([params]) => params.get('id') ?? ''),
    switchMap((id) =>
      this.service.getOne(id).pipe(
        catchError((e: HttpErrorResponse) => of(e.status === 404 ? null : undefined)),
      ),
    ),
  ),
);

protected retry() {
  this.retryTick.next(this.retryTick.value + 1);
}

  protected readonly selected = signal(0);
  protected readonly ordering = signal(false);

  protected select(index: number) {
    this.selected.set(index);
  }
}