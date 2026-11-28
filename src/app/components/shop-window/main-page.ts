import { Component, inject, input, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

type ApiState = 'checking' | 'connected' | 'error';

@Component({
  selector: 'app-main-page',
  template: `
    <main>
      <h1>Main page</h1>
      <p>Placeholder for the product grid (Feature 4).</p>
      <p>Tag in the URL: {{ tag() ?? 'none' }}</p>
      <!-- Temporary: remove after Feature 1 passes. -->
      <p role="status">API: {{ apiState() }}</p>
    </main>
  `,
})
export class MainPage {
  private readonly http = inject(HttpClient);

  // Filled from /?tag=... thanks to withComponentInputBinding().
  readonly tag = input<string>();

  protected readonly apiState = signal<ApiState>('checking');

  constructor() {
    this.http
      .get<{ status: string; database: string }>(`${environment.apiUrl}/health`)
      .subscribe({
        next: (res) =>
          this.apiState.set(res.status === 'ok' && res.database === 'connected' ? 'connected' : 'error'),
        error: () => this.apiState.set('error'),
      });
  }
}
