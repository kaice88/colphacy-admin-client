import axios from '../settings/axios';
import { useEffect, useState } from 'react';
import { handleGlobalException } from '../utils/error';
import { useQuery } from '@tanstack/react-query';
import { REQUEST_PRODUCTS } from '../constants/apis';
import { notificationShow } from '../components/Notification';

function useProduct(offset?: number, keyword?: string) {
  //   const [loading, setLoading] = useState(false);
  //   const [productData, setProductData] =
  //     useState<{ id: number; name: string }[]>();

  const fetchProduct = useQuery({
    queryKey: ['get-products'],
    queryFn: () => {
      const params: { [key: string]: number | string } = {};
      if (offset) {
        params.offset = offset;
      }
      if (keyword) {
        params.keyword = keyword;
      }
      console.log(params);
      return axios.get(REQUEST_PRODUCTS, { params });
    },
    enabled: false,
    onError: (error) => {
      handleGlobalException(error, () => {});
      //   notificationShow('error', 'Error!', error.message);
    },
  });

  useEffect(() => {
    fetchProduct.refetch();
  }, [offset, keyword]);

  return {
    loading: fetchProduct.isLoading,
    productData: fetchProduct.data?.data,
  };
}
export default useProduct;
