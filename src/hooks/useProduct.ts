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

function useProduct(
  offset?: number,
  keyword?: string,
  sortBy?: 'salePrice' | 'importPrice' | null,
  order?: 'desc' | 'asc' | null,
) {
  const fetchProduct = useQuery<ApiResponse>({
    queryKey: ['get-products'],
    queryFn: () => {
      const params: { [key: string]: number | string } = {};
      if (offset) {
        params.offset = offset;
      }
      if (keyword) {
        params.keyword = keyword;
      }
      if (sortBy) {
        params.sortBy = sortBy;
      }
      if (order) {
        params.order = order;
      }
      return axios.get(REQUEST_PRODUCTS, { params });
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
    fetchProduct.refetch();
  }, [offset, keyword, order, sortBy]);

  return {
    loading: fetchProduct.isLoading,
    productData: fetchProduct.data?.data,
    onSubmitDeleteProductForm,
    fetchProduct,
  };
}
export default useProduct;
