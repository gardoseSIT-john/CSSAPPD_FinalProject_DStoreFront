import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from './product.model';

@Service()
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly api = 'http://localhost:3000/api';

  getAll() {
    return this.http.get<Product[]>(`${this.api}/products`);
  }

  getOne(id: string) {
    return this.http.get<Product>(`${this.api}/products/${id}`);
  }
}