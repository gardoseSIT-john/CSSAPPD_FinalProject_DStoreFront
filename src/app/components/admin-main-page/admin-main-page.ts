import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-admin-main-page',
  imports: [],
  templateUrl: './admin-main-page.html',
  styleUrl: './admin-main-page.css',
})
export class AdminMainPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected logout() {
    this.auth.logout();
    this.router.navigateByUrl('/admin/login');
  }
}