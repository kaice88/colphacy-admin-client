export const REQUEST_AUTH_LOGIN_PASSWORD = "/auth/employee/login";
export const REQUEST_BRANCHES_PROVINCES = "/branches/provinces";
export const REQUEST_ALL_BRANCHES = (offset: number, limit: number) =>
  `/branches?offset=${offset}&limit=${limit}`;
export const REQUEST_BRANCHES_DISTRICTS = (slug: string) =>
  `/branches/provinces/districts/${slug}`;
export const REQUEST_BRANCHES_SEARCH_DISTRICTS = (
  provinceSlug: string,
  districtSlug: string,
  offset: number,
  limit: number
) =>
  `/branches?offset=${offset}&limit=${limit}&province=${provinceSlug}&district=${districtSlug}`;
export const REQUEST_BRANCHES_SEARCH_PROVINCES = (
  provinceSlug: string,
  offset: number,
  limit: number
) => `/branches?offset=${offset}&limit=${limit}&province=${provinceSlug}`;
export const REQUEST_BRANCHES_SEARCH_KEY = (
  keyword: string,
  offset: number,
  limit: number
) => `/branches/search?keyword=${keyword}&offset=${offset}&limit=${limit}`;
