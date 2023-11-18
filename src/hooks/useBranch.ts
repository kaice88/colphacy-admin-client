import { Branch } from '../components/Branch/type';
import axios from '../settings/axios';
import {
  REQUEST_BRANCHES,
  REQUEST_BRANCHES_PROVINCES,
  REQUEST_BRANCHES_DISTRICTS,
  REQUEST_BRANCHES_SEARCH_KEY,
  REQUEST_ADD_BRANCHES_PROVINCES,
  REQUEST_ADD_BRANCHES_DISTRICTS,
  REQUEST_ADD_BRANCHES_WARDS,
  REQUEST_VIEW_DETAIL_BRANCHES,
  REQUEST_BRANCHES_STATUSES,
} from './../constants/apis';
import { useMutation, useQuery } from '@tanstack/react-query';

export function useBranch(
  search: { offset: number; limit: number; keyword: string },
  filter?: {
    offset: number;
    limit: number;
    province?: string;
    district?: string;
  },
  provinceSlug?: string,
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
    queryKey: ['branch_provinces'],
    queryFn: () => axios.get(REQUEST_BRANCHES_PROVINCES),
    enabled: false,
  });
  const fetchBranchDistricts = useQuery({
    queryKey: ['branch_districts'],
    queryFn: () => axios.get(REQUEST_BRANCHES_DISTRICTS(provinceSlug)),
    enabled: false,
  });
  const fetchBranch = useQuery({
    queryKey: ['all_branch'],
    queryFn: () => {
      const params = buildParams();

      return axios.get(REQUEST_BRANCHES, {
        params: params,
      });
    },
    enabled: false,
  });
  const fetchBranchSearchKeywork = useQuery({
    queryKey: ['branch_search_keywork'],
    queryFn: () =>
      axios.get(
        REQUEST_BRANCHES_SEARCH_KEY(
          search.keyword,
          search.offset,
          search.limit,
        ),
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
export function useAddBranch(provinceId: string, districtId: string) {
  const fetchAddBranchProvinces = useQuery({
    queryKey: ['add_branch_provinces'],
    queryFn: () => {
      return axios.get(REQUEST_ADD_BRANCHES_PROVINCES);
    },
    enabled: false,
  });

  const fetchAddBranchDistricts = useQuery({
    queryKey: ['add_branch_districts'],
    queryFn: () => axios.get(REQUEST_ADD_BRANCHES_DISTRICTS(provinceId)),
    enabled: false,
  });
  const fetchAddBranchWards = useQuery({
    queryKey: ['add_branch_wards'],
    queryFn: () => axios.get(REQUEST_ADD_BRANCHES_WARDS(districtId)),
    enabled: false,
  });

  const handleAddBranch = useMutation({
    mutationKey: ['add_new_branch'],
    mutationFn: (data: Branch) => {
      return axios.post(REQUEST_BRANCHES, data);
    },
  });

  const onSubmitAddBranchForm = (
    data: Branch,
    onSuccess: () => void,
    onError: (error: object) => void,
  ) => {
    handleAddBranch.mutate(data, {
      onSuccess: onSuccess,
      onError: (error) => onError(error),
    });
  };

  return {
    fetchAddBranchProvinces,
    fetchAddBranchDistricts,
    fetchAddBranchWards,
    handleAddBranch,
    onSubmitAddBranchForm,
  };
}
export function useViewDetailBranch(id: number) {
  const fetchBranchStatuses = useQuery({
    queryKey: ['branch_statuses'],
    queryFn: () => {
      return axios.get(REQUEST_BRANCHES_STATUSES);
    },
    enabled: false,
  });

  const fetchViewDetailBranch = useQuery({
    queryKey: ['view_detail_branch'],
    queryFn: () => axios.get(REQUEST_VIEW_DETAIL_BRANCHES(id)),
    enabled: false,
  });

  return {
    fetchBranchStatuses,
    fetchViewDetailBranch,
  };
}

export function useEditBranch() {
  const handleEditBranch = useMutation({
    mutationKey: ['edit_branch'],
    mutationFn: (data: Branch) => {
      return axios.put(REQUEST_BRANCHES, data);
    },
  });

  const onSubmitEditBranchForm = (
    data: Branch,
    onSuccess: () => void,
    onError: (error: object) => void,
  ) => {
    handleEditBranch.mutate(data, {
      onSuccess: onSuccess,
      onError: (error) => onError(error),
    });
  };

  return {
    handleEditBranch,
    onSubmitEditBranchForm,
  };
}
