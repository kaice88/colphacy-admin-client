export const REQUEST_AUTH_LOGIN_PASSWORD  = "/auth/employee/login"
export const REQUEST_AUTH_LOGOUT  = "/auth/employee/logout"
export const REQUEST_EMPLOYEE_PROFILE  = (id:number) => `employees/profile/${id}`
export const REQUEST_BRANCHES_PROVINCES = "/branches/provinces";
export const REQUEST_BRANCHES = `/branches`;
export const REQUEST_BRANCHES_DISTRICTS = (slug: string) =>
`/branches/provinces/districts/${slug}`;
export const REQUEST_BRANCHES_SEARCH_KEY = (
  keyword: string,
  offset: number,
  limit: number
  ) => `/branches/search?keyword=${keyword}&offset=${offset}&limit=${limit}`;
  
  // Add Branch
  export const REQUEST_ADD_BRANCHES_PROVINCES = "/location/provinces";
  export const REQUEST_ADD_BRANCHES_DISTRICTS = (provinceId: number) =>
  `/location/districts?provinceId=${provinceId}`;
  export const REQUEST_ADD_BRANCHES_WARDS = (districtId: number) =>
  `/location/wards?districtId=${districtId}`;
  
  export const REQUEST_UNITS = `/units`;
  export const REQUEST_UNITS_SEARCH_KEY = (
    keyword: string,
    offset: number,
    limit: number
    ) => `/units/search?keyword=${keyword}&offset=${offset}&limit=${limit}`;
    