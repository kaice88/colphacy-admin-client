export interface EmployeeListItem {
  id: number;
  fullName: string;
  username: string;
  phone: string;
  gender: string;
  role: string;
  branch: string;
  active: true;
}
export interface Employee {
  id?: undefined;
  fullName: string;
  username: string;
  phone: string;
  password: string;
  gender: string;
  roleId: number;
  branchId: number;
}
