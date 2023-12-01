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
  orderTime: Date ;
  confirmTime: Date ;
  shipTime: Date ;
  deliverTime: Date | undefined;
  cancelTime: Date | undefined;
  status: string;
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
