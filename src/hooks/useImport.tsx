import axios from '../settings/axios';
import { useEffect, useState } from 'react';
import { handleGlobalException } from '../utils/error';
import { useMutation, useQuery } from '@tanstack/react-query';
import { REQUEST_PRODUCTS } from '../constants/apis';
import { ProductListItem } from '../components/Product/type';
import { notificationShow } from '../components/Notification';
import { useBranch } from './useBranch';

interface ApiResponse {
  data: {
    items: ProductListItem[];
    numPages: number;
    offset: number;
    limit: number;
    totalItems: number;
  } | null;
}

function useImport(
  searchBranch?: string,
  branchId?: number,
  offset?: number,
  keyword?: string,
  startDate?: Date,
  endDate?: Date,
) {
  const [branchData, setBranchData] = useState();
  const searchObjBranch = { offset: 0, limit: 20, keyword: searchBranch };
  const { fetchBranchSearchKeywork } = useBranch(searchObjBranch);
  const fetchImport = useQuery<ApiResponse>({
    queryKey: ['get-Imports'],
    queryFn: () => {
      const params: { [key: string]: number | string | Date } = {};
      if (offset) {
        params.offset = offset;
      }
      if (keyword) {
        params.keyword = keyword;
      }
      if (branchId) {
        params.branchId = branchId;
      }
      if (startDate) {
        params.startDate = new Date(startDate).toISOString();
      }
      if (endDate) {
        params.endDate = new Date(endDate).toISOString();
      }
      return axios.get('/imports', { params });
    },
    enabled: false,
    onError: (error) => {
      handleGlobalException(error, () => {});
    },
  });

  const handleDeleteImport = useMutation({
    mutationKey: ['delete-import'],
    mutationFn: (id: number) => {
      return axios.delete(`/imports/${id}`);
    },
  });
  const onSubmitDeleteImportForm = (id: number, onSuccess: () => void) => {
    handleDeleteImport.mutate(id, {
      onSuccess: onSuccess,
      onError: (error) => {
        handleGlobalException(error, () => {
          if (error.response.status === 400) {
            const data = error.response.data;
            Object.keys(data).forEach((key) => {
              notificationShow('error', 'Error!', data[key]);
            });
          }
        });
      },
    });
  };
  useEffect(() => {
    fetchImport.refetch();
  }, [offset, keyword, startDate, endDate, branchId]);

  async function fetchBranchSearchData() {
    try {
      if (searchBranch) {
        const branchData = await fetchBranchSearchKeywork.refetch();
        setBranchData(branchData?.data?.data.items);
      } else {
        setBranchData(null);
      }
    } catch (error) {
      handleGlobalException(error, () => {});
    }
  }
  useEffect(() => {
    fetchBranchSearchData();
  }, [searchBranch]);
  return {
    loading: fetchImport.isLoading,
    importData: fetchImport.data?.data,
    onSubmitDeleteImportForm,
    fetchImport,
    branchData,
  };
}
export default useImport;
