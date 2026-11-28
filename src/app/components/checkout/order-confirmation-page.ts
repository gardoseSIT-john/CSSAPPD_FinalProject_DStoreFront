import { Component, input } from '@angular/core';

@Component({
  selector: 'app-order-confirmation-page',
  template: `
    <main>
      <h1>Order confirmation</h1>
      <p>Placeholder for order {{ ref() }} (Feature 8).</p>
    </main>
  `,
})
export class OrderConfirmationPage {
  readonly ref = input<string>();
}
