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