import axios from '../settings/axios';
import { useEffect } from 'react';
import { handleGlobalException } from '../utils/error';
import { useMutation, useQuery } from '@tanstack/react-query';
import { REQUEST_PRODUCTS } from '../constants/apis';
import { ProductListItem } from '../components/Product/type';
import { notificationShow } from '../components/Notification';

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
  offset?: number,
  keyword?: string,
  startDate?: Date,
  endDate?: Date,
) {
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
      if (startDate) {
        params.startDate = new Date(startDate.getTime() + 7 * 60 * 60 * 1000)
          .toJSON()
          .slice(0, 10);
      }
      if (endDate) {
        params.endDate = new Date(endDate.getTime() + 7 * 60 * 60 * 1000)
          .toJSON()
          .slice(0, 10);
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
  }, [offset, keyword, startDate, endDate]);

  return {
    loading: fetchImport.isLoading,
    importData: fetchImport.data?.data,
    onSubmitDeleteImportForm,
    fetchImport,
  };
}
export default useImport;
