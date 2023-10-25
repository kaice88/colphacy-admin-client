import axios from "../settings/axios";
import {
  REQUEST_BRANCHES,
  REQUEST_BRANCHES_PROVINCES,
  REQUEST_BRANCHES_DISTRICTS,
  REQUEST_BRANCHES_SEARCH_KEY,
} from "./../constants/apis";
import { useQuery } from "@tanstack/react-query";

function useBranchProvinces(
  search: { offset: number; limit: number; keyword: string },
  filter: {
    offset: number;
    limit: number;
    province?: string;
    district?: string;
  },
  provinceSlug: string
) {
  const buildParams = () => {
    const params: Record<string, any> = {};

    if (filter.province) {
      params.province = filter.province;
    }

    if (filter.district) {
      params.district = filter.district;
    }

    if (filter.offset) {
      params.offset = filter.offset;
    }

    if (filter.limit) {
      params.limit = filter.limit;
    }

    return params;
  };
  const fetchBranchProvinces = useQuery({
    queryKey: ["branch_provinces"],
    queryFn: () => axios.get(REQUEST_BRANCHES_PROVINCES),
    enabled: false,
  });
  const fetchBranchDistricts = useQuery({
    queryKey: ["branch_districts"],
    queryFn: () => axios.get(REQUEST_BRANCHES_DISTRICTS(provinceSlug)),
    enabled: false,
  });
  const fetchBranch = useQuery({
    queryKey: ["all_branch"],
    queryFn: () => {
      const params = buildParams();

      return axios.get(REQUEST_BRANCHES, {
        params: params,
      });
    },
    enabled: false,
  });
  const fetchBranchSearchKeywork = useQuery({
    queryKey: ["branch_search_keywork"],
    queryFn: () =>
      axios.get(
        REQUEST_BRANCHES_SEARCH_KEY(search.keyword, search.offset, search.limit)
      ),
    enabled: false,
  });

  return {
    fetchBranchProvinces,
    fetchBranchDistricts,
    fetchBranch,
    fetchBranchSearchKeywork,
  };
}
export default useBranchProvinces;
