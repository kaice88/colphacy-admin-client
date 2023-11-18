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

function useImport(offset?: number, keyword?: string) {
  const fetchImport = useQuery<ApiResponse>({
    queryKey: ['get-Imports'],
    queryFn: () => {
      const params: { [key: string]: number | string } = {};
      if (offset) {
        params.offset = offset;
      }
      if (keyword) {
        params.keyword = keyword;
      }
      return axios.get('/imports', { params });
    },
    enabled: false,
    onError: (error) => {
      handleGlobalException(error, () => {});
    },
  });

  const handleDeleteProduct = useMutation({
    mutationKey: ['delete-product'],
    mutationFn: (id: number) => {
      return axios.delete(`${REQUEST_PRODUCTS}/${id}`);
    },
  });
  const onSubmitDeleteProductForm = (id: number, onSuccess: () => void) => {
    handleDeleteProduct.mutate(id, {
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
  }, [offset, keyword]);

  return {
    loading: fetchImport.isLoading,
    importData: fetchImport.data?.data,
    // onSubmitDeleteProductForm,
    fetchImport,
  };
}
export default useImport;
