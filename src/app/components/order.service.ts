import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NewOrder, Order } from './order.model';

@Service()
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly api = 'http://localhost:3000/api';

  create(order: NewOrder) {
    return this.http.post<Order>(`${this.api}/orders`, order);
  }
}