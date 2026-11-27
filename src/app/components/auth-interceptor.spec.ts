import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { API_URL } from './api.config';
import { ApiErrorService } from './api-error.service';
import { authInterceptor } from './auth-interceptor';
import { AuthService } from './auth.service';

describe('authInterceptor', () => {
  let http: HttpClient;
  let ctrl: HttpTestingController;
  let loggedOut = 0;
  let navigated: string[] = [];

  function setup(token: string | null) {
    loggedOut = 0;
    navigated = [];
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: { token: () => token, logout: () => loggedOut++ } },
        { provide: Router, useValue: { navigateByUrl: (u: string) => navigated.push(u) } },
      ],
    });
    http = TestBed.inject(HttpClient);
    ctrl = TestBed.inject(HttpTestingController);
  }

  it('attaches the token to the shop API', () => {
    setup('abc');
    http.get(`${API_URL}/products`).subscribe();
    const req = ctrl.expectOne(`${API_URL}/products`);
    expect(req.request.headers.get('Authorization')).toBe('Bearer abc');
    req.flush([]);
  });

  it('attaches no header to outside addresses', () => {
    setup('abc');
    const url = 'https://api.cloudinary.com/v1_1/x/image/upload';
    http.post(url, {}).subscribe();
    const req = ctrl.expectOne(url);
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('on 401 clears the token and goes to the login page', () => {
    setup('abc');
    http.get(`${API_URL}/admin/products`).subscribe({ error: () => undefined });
    ctrl.expectOne(`${API_URL}/admin/products`).flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(loggedOut).toBe(1);
    expect(navigated).toEqual(['/admin/login']);
  });

  it('a wrong password on /login does not trigger the redirect', () => {
    setup(null);
    http.post(`${API_URL}/login`, {}).subscribe({ error: () => undefined });
    ctrl.expectOne(`${API_URL}/login`).flush({}, { status: 401, statusText: 'Unauthorized' });
    expect(loggedOut).toBe(0);
    expect(navigated).toEqual([]);
  });

  it('sets the shared error on a 5xx response', () => {
    setup(null);
    http.get(`${API_URL}/products`).subscribe({ error: () => undefined });
    ctrl.expectOne(`${API_URL}/products`).flush({}, { status: 503, statusText: 'Unavailable' });
    expect(TestBed.inject(ApiErrorService).error()?.status).toBe(503);
  });

  it('sets the shared error on a network failure', () => {
    setup(null);
    http.get(`${API_URL}/products`).subscribe({ error: () => undefined });
    ctrl.expectOne(`${API_URL}/products`).error(new ProgressEvent('error'));
    expect(TestBed.inject(ApiErrorService).error()?.status).toBe(0);
  });
});