import {
  REQUEST_ALL_BRANCHES,
  REQUEST_BRANCHES_PROVINCES,
  REQUEST_BRANCHES_DISTRICTS,
  REQUEST_BRANCHES_SEARCH_DISTRICTS,
  REQUEST_BRANCHES_SEARCH_PROVINCES,
  REQUEST_BRANCHES_SEARCH_KEY,
} from "./../constants/apis";
import { useQuery } from "@tanstack/react-query";
import axios from "../settings/axios";

function useBranchProvinces(
  offset: number,
  limit: number,
  provinceSlug: string,
  districtSlug: string,
  keyword: string
) {
  const fetchAllBranch = useQuery({
    queryKey: ["all_branch"],
    queryFn: () => axios.get(REQUEST_ALL_BRANCHES(offset, limit)),
    enabled: false,
  });
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
  const fetchBranchSearchDistricts = useQuery({
    queryKey: ["branch_search_districts"],
    queryFn: () =>
      axios.get(
        REQUEST_BRANCHES_SEARCH_DISTRICTS(
          provinceSlug,
          districtSlug,
          offset,
          limit
        )
      ),
    enabled: false,
  });
  const fetchBranchSearchProvinces = useQuery({
    queryKey: ["branch_search_provinces"],
    queryFn: () =>
      axios.get(REQUEST_BRANCHES_SEARCH_PROVINCES(provinceSlug, offset, limit)),
    enabled: false,
  });
  const fetchBranchSearchKeywork = useQuery({
    queryKey: ["branch_search_keywork"],
    queryFn: () =>
      axios.get(REQUEST_BRANCHES_SEARCH_KEY(keyword, offset, limit)),
    enabled: false,
  });

  return {
    fetchBranchProvinces,
    fetchAllBranch,
    fetchBranchDistricts,
    fetchBranchSearchDistricts,
    fetchBranchSearchProvinces,
    fetchBranchSearchKeywork,
  };
}
export default useBranchProvinces;
