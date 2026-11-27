import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { API_URL } from './api.config';
import { ApiErrorService } from './api-error.service';
import { AuthService } from './auth.service';

const isShopApi = (url: string) => url === API_URL || url.startsWith(API_URL + '/');

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Cloudinary and any other outside address: untouched, so the token can never leak
  if (!isShopApi(req.url)) return next(req);

  const auth = inject(AuthService);
  const router = inject(Router);
  const errors = inject(ApiErrorService);

  const token = auth.token();
  const outgoing = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(outgoing).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 && !req.url.endsWith('/login')) {
        // expired or missing token on a protected call (a wrong password on /login is not this)
        auth.logout();
        router.navigateByUrl('/admin/login');
      } else if (err.status === 0 || err.status >= 500) {
        errors.report(err.status); // network failure or server error
      }
      return throwError(() => err); // pages can still handle their own errors
    }),
  );
};