import { Product } from "./product.model";

export interface NewOrder {
  product: string;       // product _id
  size: string;
  customerName: string;
  contact: string;
  dropOff: string;       // delivery / drop-off point
}

export interface Order extends NewOrder {
  _id: string;
  status: 'pending' | 'completed';
  createdAt: string;
}

// What GET /api/orders returns: product is filled in (null if the product was deleted)
export interface PendingOrder extends Omit<Order, 'product'> {
  product: Product | null;
}