export const REQUEST_AUTH_LOGIN_PASSWORD = "/auth/employee/login";
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

//View Detail Branch
export const REQUEST_VIEW_DETAIL_BRANCHES = (id: number) => `/branches/${id}`;
