export interface EmployeeListItem {
  id: number;
  fullName: string;
  username: string;
  phone: string;
  gender: string;
  role: string;
  branch: string;
  active: boolean;
}
export interface Employee {
  id?: undefined | number;
  fullName: string;
  username: string;
  phone: string;
  password: string;
  gender: string;
  roleId: number;
  branchId: number;
  branch: string;
  active: boolean;
}
