import { useQuery } from '@tanstack/react-query';
import { handleGlobalException } from '../utils/error';
import axios from '../settings/axios';
import { useEffect, useState } from 'react';
import { useBranch } from './useBranch';

export function useStock(
  searchBranch?: string,
  branchId?: number,
  offset?: number,
  keyword?: string,
) {
  const [branchData, setBranchData] = useState();
  const searchObjBranch = { offset: 0, limit: 20, keyword: searchBranch };
  const { fetchBranchSearchKeywork } = useBranch(searchObjBranch);
  const {
    refetch: fetchStock,
    isLoading,
    data: stockData,
  } = useQuery({
    queryKey: ['get-Stocks'],
    queryFn: () => {
      const params: { [key: string]: number | string } = {};
      if (offset) {
        params.offset = offset;
      }
      if (keyword) {
        params.keyword = keyword;
      }
      if (branchId) {
        params.branchId = branchId;
      }
      return axios.get('/stock', { params });
    },
    enabled: false,
    onError: (error) => {
      handleGlobalException(error, () => {});
    },
  });

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

  useEffect(() => {
    fetchStock();
  }, [offset, keyword, branchId]);

  return {
    stockData,
    isLoading,
    fetchStock,
    branchData,
  };
}
