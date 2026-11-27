import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe, NgOptimizedImage } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BehaviorSubject, catchError, combineLatest, map, of, switchMap } from 'rxjs';
import { ProductService } from '../product.service';
import { OrderPage } from '../order-page/order-page';
import { ErrorBanner } from '../error-banner/error-banner';
import { cloudinaryUrl, IMG } from '../image-url';

@Component({
  selector: 'app-product-details-page',
  imports: [RouterLink, CurrencyPipe, OrderPage, ErrorBanner, NgOptimizedImage],
  templateUrl: './product-details-page.html',
  styleUrl: './product-details-page.css',
})
export class ProductDetailsPage {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(ProductService);

  // used by the template
  protected readonly IMG = IMG;
  protected readonly src = cloudinaryUrl;

  private readonly retryTick = new BehaviorSubject(0);

  // undefined = loading (or failed, with the banner showing), null = not found
  protected readonly product = toSignal(
    combineLatest([this.route.paramMap, this.retryTick]).pipe(
      map(([params]) => params.get('id') ?? ''),
      switchMap((id) =>
        this.service
          .getOne(id)
          .pipe(catchError((e: HttpErrorResponse) => of(e.status === 404 ? null : undefined))),
      ),
    ),
  );

  protected readonly selected = signal(0);
  protected readonly ordering = signal(false);

  protected select(index: number) {
    this.selected.set(index);
  }

  protected retry() {
    this.retryTick.next(this.retryTick.value + 1);
  }
}