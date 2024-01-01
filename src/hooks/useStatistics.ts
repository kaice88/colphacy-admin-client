import axios from '../settings/axios';
import { useEffect, useState } from 'react';
import { handleGlobalException } from '../utils/error';
import { useQuery } from '@tanstack/react-query';

import { useBranch } from './useBranch';

// interface ApiResponse {
//   data: {
//     items: ProductListItem[];
//     numPages: number;
//     offset: number;
//     limit: number;
//     totalItems: number;
//   } | null;
// }

function useStatistics(
  searchBranch: string,
  branchId?: number,
  month?: number,
  year: number = new Date().getFullYear(),
  timeZone: number = 7,
) {
  const [branchData, setBranchData] = useState();
  const searchObjBranch = { offset: 0, limit: 20, keyword: searchBranch };
  const { fetchBranchSearchKeywork } = useBranch(searchObjBranch);
  const { refetch: fetchStatistics, data: statisticsData } = useQuery({
    queryKey: ['get-statistics'],
    queryFn: () => {
      const params: { [key: string]: number | string | Date } = {};
      if (branchId) {
        params.branchId = branchId;
      }
      if (month) {
        params.month = month;
      }
      if (year) {
        params.year = year;
      }
      if (timeZone) {
        params.timeZone = timeZone;
      }

      return axios.get('/statistics', { params });
    },
    enabled: false,
    onError: (error) => {
      handleGlobalException(error, () => {});
    },
  });

  const { refetch: fetchStatisticsProduct, data: statisticsProductData } =
    useQuery({
      queryKey: ['get-statisticsProduct'],
      queryFn: () => {
        const params: { [key: string]: number | string | Date } = {};
        if (branchId) {
          params.branchId = branchId;
        }

        return axios.get('/statistics/products', { params });
      },
      enabled: false,
      onError: (error) => {
        handleGlobalException(error, () => {});
      },
    });
  const { refetch: fetchYears, data: yearData } = useQuery({
    queryKey: ['get-years'],
    queryFn: () => {
      return axios.get('/statistics/available-years', {
        params: {
          timeZone,
        },
      });
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
    fetchStatistics();
    fetchStatisticsProduct();
  }, [branchId, month, year, timeZone]);
  useEffect(() => {
    fetchYears();
  }, []);
  useEffect(() => {
    fetchBranchSearchData();
  }, [searchBranch]);
  return {
    statisticsData,
    fetchYears,
    yearData,
    branchData,
    fetchStatisticsProduct,
    statisticsProductData,
  };
}
export default useStatistics;
