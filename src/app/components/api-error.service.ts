import { Service, signal } from '@angular/core';

export interface ApiError {
  status: number;
  message: string;
}

@Service()
export class ApiErrorService {
  private readonly _error = signal<ApiError | null>(null);
  readonly error = this._error.asReadonly();

  report(status: number) {
    this._error.set({
      status,
      message:
        status === 0
          ? 'Cannot reach the server. Check your connection and try again.'
          : 'The server had a problem. Please try again.',
    });
  }

  clear() {
    this._error.set(null);
  }
}