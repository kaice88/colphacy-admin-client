export interface OrderItem {
  id: number;

  customer: string;

  orderTime: Date;

  confirmTime: Date;

  shipTime: Date;

  deliverTime: Date;

  cancelTime: Date;

  requestReturnTime: string;

  total: number;

  adminConfirmDeliver?: boolean;

  cancelBy?: string;

  resolveType?: string;
}

export interface DetailOrderItem {
  receiver: {
    id: number;
    name: string;
    phone: string;
    address: {
      streetAddress: string;
      ward: string;
      district: string;
      province: string;
      latitude: number;
      longitude: number;
    };
    isPrimary: boolean;
  };
  orderTime: Date;
  confirmTime: Date;
  shipTime: Date;
  deliverTime: Date | undefined;
  cancelTime: Date | undefined;
  requestReturnTime: Date | undefined;
  status: string;
  paymentMethod: string;
  orderItems: [
    {
      product: {
        id: number;
        name: string;
        image: string;
      };
      unit: {
        id: number;
        name: string;
      };
      price: number;
      expirationDate: Date;
      quantity: number;
    }
  ];
  branch: {
    id: number;
    address: {
      streetAddress: string;
      ward: string;
      district: string;
      province: string;
      latitude: number;
      longitude: number;
    };
    closingHour: string;
    openingHour: string;
    phone: string;
    status: string;
    employees: [];
  };
}

export interface ProductOrderItem {
  product: {
    id: number;
    name: string;
    image: string;
  };
  unit: {
    id: number;
    name: string;
  };
  price: number;
  expirationDate: Date;
  quantity: number;
}

export interface Order {
  branchId: string;
  customerId: string;
  orderTime: Date;
  items: {
    productId: string;
    quantity: number;
    unitId: string;
    salePrice: number;
  }[];
}
