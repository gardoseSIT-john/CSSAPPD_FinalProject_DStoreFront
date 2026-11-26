import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NewOrder, Order } from './order.model';
import { Product } from './product.model';

@Service()
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly api = 'http://localhost:3000/api';

  create(order: NewOrder) {
    return this.http.post<Order>(`${this.api}/orders`, order);
  }

  //F[4] Update
  getAllAdmin() {
  return this.http.get<Product[]>(`${this.api}/admin/products`);
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