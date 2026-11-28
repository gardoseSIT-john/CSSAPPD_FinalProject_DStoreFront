import { Component, input } from '@angular/core';

@Component({
  selector: 'app-product-details-page',
  template: `
    <main>
      <h1>Product details</h1>
      <p>Placeholder for product {{ id() }} (Feature 6).</p>
    </main>
  `,
})
export class ProductDetailsPage {
  readonly id = input<string>();
}
