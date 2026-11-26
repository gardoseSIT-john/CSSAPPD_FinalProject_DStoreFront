import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BRAND } from '../brand.config';

@Component({
  selector: 'app-site-footer',
  imports: [RouterLink],
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.css',
})
export class SiteFooter {
  protected readonly brand = BRAND;
  protected readonly year = new Date().getFullYear();
}
