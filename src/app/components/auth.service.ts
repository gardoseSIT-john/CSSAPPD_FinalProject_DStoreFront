import { computed, inject, Service, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';

const TOKEN_KEY = 'adminToken';

@Service()
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly api = 'http://localhost:3000/api';

  private readonly _token = signal<string | null>(sessionStorage.getItem(TOKEN_KEY));

  readonly token = this._token.asReadonly();
  readonly isLoggedIn = computed(() => this._token() !== null);

  login(username: string, password: string) {
    return this.http
      .post<{ token: string }>(`${this.api}/login`, { username, password })
      .pipe(
        tap(({ token }) => {
          sessionStorage.setItem(TOKEN_KEY, token);
          this._token.set(token);
        }),
      );
  }

  logout() {
    sessionStorage.removeItem(TOKEN_KEY);
    this._token.set(null);
  }
}