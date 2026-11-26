import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BRAND } from '../brand.config';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink],
  templateUrl: './site-header.html',
  styleUrl: './site-header.css',
})
export class SiteHeader {
  protected readonly brand = BRAND;
}
