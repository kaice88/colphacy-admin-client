export interface Product {
  name: string;
  category: string;
  packing: string;
  manufacturer: string;
  brandOrigin: string;
  indications: string;
  registrationNumber: number;
  ingredients: {
    name: string;
    amount: number;
  }[];
  uses: string;
  sideEffects: string;
  storage: string;
  notes: string;
  usage: string;
  status: boolean;
  images: { url: string }[];
  productUnits: {
    unitId: string;
    ratio: number;
    salePrice: number;
    importPrice: number;
    isDefaultUnit: boolean;
  }[];
}
