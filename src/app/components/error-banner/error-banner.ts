import { Component, DestroyRef, inject, output } from '@angular/core';
import { ApiErrorService } from '../api-error.service';

@Component({
  selector: 'app-error-banner',
  templateUrl: './error-banner.html',
  styleUrl: './error-banner.css',
})
export class ErrorBanner {
  protected readonly errors = inject(ApiErrorService);
  readonly retry = output<void>();

  constructor() {
    // leaving the page clears the error, so it doesn't follow you around
    inject(DestroyRef).onDestroy(() => this.errors.clear());
  }

  protected onRetry() {
    this.errors.clear();
    this.retry.emit();
  }
}