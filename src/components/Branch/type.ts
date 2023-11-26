export interface Branch {
  id?: number;
  closingHour: string;
  openingHour: string;
  phone: string;
  status?: string;
  streetAddress: string;
  ward: string;
  district: string;
  province: string;
  latitude: number;
  longitude: number;
}

export interface DetailBranch {
  closingHour: string;
  district: string;
  id: number;
  latitude: number;
  longitude: number;
  openingHour: string;
  phone: string;
  province: string;
  status: string;
  streetAddress: string;
  ward: string;
}
