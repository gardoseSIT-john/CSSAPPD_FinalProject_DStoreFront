import { afterNextRender, Component, ElementRef, inject, input, output, signal, viewChild } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../product.model';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-order-page',
  imports: [ReactiveFormsModule],
  templateUrl: './order-page.html',
  styleUrl: './order-page.css',
})
export class OrderPage {
  readonly product = input.required<Product>();
  readonly closed = output<void>();

  private readonly orders = inject(OrderService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dlg');

  protected readonly submitting = signal(false);
  protected readonly placed = signal(false);
  protected readonly error = signal('');

  protected readonly form = this.fb.group({
    size: [''],
    customerName: ['', Validators.required],
    contact: [''],
    dropOff: ['', Validators.required],
  });

  constructor() {
    afterNextRender(() => this.dialog().nativeElement.showModal());
  }

  protected close() {
    this.dialog().nativeElement.close();
  }

  protected submit() {
    this.form.markAllAsTouched();
    const v = this.form.getRawValue();
    const needsSize = this.product().size.length > 0;
    if (this.form.invalid || (needsSize && !v.size)) return;

    this.submitting.set(true);
    this.error.set('');
    this.orders.create({ ...v, product: this.product()._id }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.placed.set(true);
      },
      error: () => {
        this.submitting.set(false);
        this.error.set('Could not place the order. Please try again.');
      },
    });
  }
}