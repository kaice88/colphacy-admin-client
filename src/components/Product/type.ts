export interface Product {
  id?: number;
  name: string;
  categoryId: string;
  packing: string;
  manufacturer: string;
  brandOrigin: string;
  indications: string;
  registrationNumber: string;
  ingredients: {
    name: string;
    amount: string;
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
  shortDescription: string;
  fullDescription: string;
}

export interface ProductData {
  id: number;
  name: string;
  categoryId: number;
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
  images: string[];
  productUnits: {
    unitId: number;
    ratio: number;
    salePrice: number;
    importPrice?: number;
    defaultUnit: boolean;
  }[];
}

export interface ProductListItem {
  id: number;
  name: string;
  categoryName: string;
  importPrice: number;
  salePrice: number;
}
