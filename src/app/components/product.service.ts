import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product,ProductInput } from './product.model';
import { Order, PendingOrder } from './order.model';

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
  create(product: ProductInput) {
  return this.http.post<Product>(`${this.api}/products`, product);
}

update(id: string, product: ProductInput) {
  return this.http.put<Product>(`${this.api}/products/${id}`, product);
}

remove(id: string) {
  return this.http.delete<void>(`${this.api}/products/${id}`);
}

//Order stuff
getPending() {
  return this.http.get<PendingOrder[]>(`${this.api}/orders`);
}

complete(id: string) {
  return this.http.patch<Order>(`${this.api}/orders/${id}/complete`, {});
}

}