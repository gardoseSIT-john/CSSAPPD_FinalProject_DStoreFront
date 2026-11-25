import { afterNextRender, Component, ElementRef, inject, output, signal, viewChild } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { splitList } from '../product.model';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-admin-add-product-panel',
  imports: [ReactiveFormsModule],
  templateUrl: './admin-add-product-panel.html',
  styleUrl: './admin-add-product-panel.css',
})
export class AdminAddProductPanel {
  readonly saved = output<void>();
  readonly closed = output<void>();

  private readonly service = inject(ProductService);
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dlg');

  protected readonly submitting = signal(false);
  protected readonly error = signal('');

  protected readonly form = this.fb.group({
    name: ['', Validators.required],
    size: [''],
    tags: [''],
    price: [0, [Validators.required, Validators.min(0)]],
    description: [''],
    images: ['', Validators.required],
  });

  constructor() {
    afterNextRender(() => this.dialog().nativeElement.showModal());
  }

  protected close() {
    this.dialog().nativeElement.close();
  }

  protected submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const v = this.form.getRawValue();
    this.submitting.set(true);
    this.error.set('');
    this.service
      .create({
        name: v.name.trim(),
        size: splitList(v.size, /,/),
        tags: splitList(v.tags, /,/),
        price: v.price,
        description: v.description,
        images: splitList(v.images, /\r?\n/),
      })
      .subscribe({
        next: () => {
          this.saved.emit();
          this.close();
        },
        error: () => {
          this.submitting.set(false);
          this.error.set('Could not add the product. Are you still logged in?');
        },
      });
  }
}