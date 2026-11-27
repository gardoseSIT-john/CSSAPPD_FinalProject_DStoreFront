import { Component,inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  imports: [RouterLink],
  selector: 'app-order-confirmation-page',
  styleUrl: './order-confirmation-page.css',
  templateUrl: './order-confirmation-page.html',
})
export class OrderConfirmationPage {
protected readonly ref = inject(ActivatedRoute).snapshot.paramMap.get("ref")//Check what this does later.

}
