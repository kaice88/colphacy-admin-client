export interface OrderItem {
  id: number;

  customer: string;

  orderTime: Date;

  confirmTime: Date;

  shipTime: Date;

  deliverTime: Date;

  cancelTime: Date;

  total: number;

}