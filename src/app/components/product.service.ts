import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product, ProductInput } from './product.model';

@Service()
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly api = 'http://localhost:3000/api';

  getAll() {
    return this.http.get<Product[]>(`${this.api}/products`);
  }

  getAllAdmin() {
    return this.http.get<Product[]>(`${this.api}/admin/products`);
  }

  getOne(id: string) {
    return this.http.get<Product>(`${this.api}/products/${id}`);
  }

  create(product: ProductInput) {
    return this.http.post<Product>(`${this.api}/products`, product);
  }

  update(id: string, product: ProductInput) {
    return this.http.put<Product>(`${this.api}/products/${id}`, product);
  }

  hide(id: string) {
    return this.http.patch<Product>(`${this.api}/products/${id}/hide`, {});
  }

  unhide(id: string) {
    return this.http.patch<Product>(`${this.api}/products/${id}/unhide`, {});
  }

  remove(id: string) {
    return this.http.delete<Product>(`${this.api}/products/${id}`);
  }
}