export interface Product {
  name: string;
  categoryId: string;
  packing: string;
  manufacturer: string;
  brandOrigin: string;
  indications: string;
  registrationNumber: string;
  ingredients: {
    name: string;
    amount: number;
  }[];
  uses: string;
  sideEffects: string;
  storage: string;
  notes: string;
  usage: string;
  status: 'PRE_ORDER' | 'FOR_SALE';
  images: { url: string }[];
  productUnits: {
    unitId?: string;
    ratio: number;
    salePrice: number;
    importPrice?: number;
    defaultUnit: boolean;
  }[];
}
