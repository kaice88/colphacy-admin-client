export const REQUEST_AUTH_LOGIN_PASSWORD = "/auth/employee/login";
export const REQUEST_AUTH_LOGOUT = "/auth/employee/logout";
export const REQUEST_EMPLOYEE_CHANGE_PASSWORD = "/employees/change-password";
export const REQUEST_EMPLOYEE_PROFILE = (id: number) =>
  `employees/profile/${id}`;
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
export const REQUEST_ADD_BRANCHES_DISTRICTS = (provinceId: string) =>
  `/location/districts?provinceId=${provinceId}`;
export const REQUEST_ADD_BRANCHES_WARDS = (districtId: string) =>
  `/location/wards?districtId=${districtId}`;
export const REQUEST_CATEGORIES = `/categories`;
export const REQUEST_CATEGORIES_SEARCH_KEY = (keyword: string,offset: number,
  limit: number) =>
  `/categories?keyword=${keyword}&offset=${offset}&limit=${limit}`;
  export const REQUEST_CATEGORY_DELETE = (id: number) =>
  `/categories/${id}`;
export const REQUEST_UNITS = `/units`;
export const REQUEST_UNITS_SEARCH_KEY = (keyword: string,offset: number,
  limit: number) =>
  `/units?keyword=${keyword}&offset=${offset}&limit=${limit}`;
  export const REQUEST_UNITS_DELETE = (id: number) =>
  `/units/${id}`;
//View Detail Branch
export const REQUEST_VIEW_DETAIL_BRANCHES = (id: number) => `/branches/${id}`;

export const REQUEST_BRANCHES_STATUSES = `/branches/statuses`;

export const REQUEST_PROVIDERS = `/providers`;
export const REQUEST_PROVIDERS_SEARCH_KEY  = (
  keyword: string,
  offset: number,
  limit: number
) => `/providers?keyword=${keyword}&offset=${offset}&limit=${limit}`;
export const REQUEST_PROVIDER_DELETE = (id: number) =>
  `/providers/${id}`;