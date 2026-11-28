import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found-page',
  imports: [RouterLink],
  template: `
    <main>
      <h1>Page not found</h1>
      <p>This address doesn't lead anywhere.</p>
      <a routerLink="/">Back to the shop</a>
    </main>
  `,
})
export class NotFoundPage {}
