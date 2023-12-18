export enum OrderStatus {
  PENDING = 'Chờ xác nhận',
  CONFIRMED = 'Chờ vận chuyển',
  SHIPPING = 'Đang giao',
  DELIVERED = 'Đã giao',
  COMPLETED = 'Hoàn thành',
  CANCELLED = 'Đã hủy',
}

export enum OrderTimeline {
  ORDER_TIME = 'Thời gian đặt',
  CONFIRM_TIME = 'Thời gian xác nhận',
  SHIP_TIME = 'Thời gian giao',
  DELIVER_TIME = 'Thời gian nhận',
  CANCEL_TIME = 'Thời gian hủy',
}

