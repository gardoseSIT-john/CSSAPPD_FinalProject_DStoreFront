import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-admin-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css',
})
export class AdminLogin {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(NonNullableFormBuilder);

  protected readonly submitting = signal(false);
  protected readonly error = signal('');

  protected readonly form = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  protected submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    const { username, password } = this.form.getRawValue();
    this.submitting.set(true);
    this.error.set('');
    this.auth.login(username, password).subscribe({
      next: () => this.router.navigateByUrl('/admin'),
      error: (e) => {
        this.submitting.set(false);
        this.error.set(
          e.status === 401 ? 'Wrong username or password.' : 'Could not reach the server.',
        );
      },
    });
  }
}