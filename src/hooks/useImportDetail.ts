import axios from '../settings/axios';
import { useEffect, useState } from 'react';
import { handleGlobalException } from '../utils/error';
import useProvider from './useProvider';
import { useBranch } from './useBranch';
import { useMutation, useQuery } from '@tanstack/react-query';

function useImportDetail(
  importId: number | null,
  searchProvider?: string,
  searchBranch?: string,
  searchProduct?: string,
) {
  const [providerData, setProviderData] = useState();
  const [branchData, setBranchData] = useState();
  const [productData, setProductData] = useState();
  const searchObjProvider = { offset: 0, limit: 20, keyword: searchProvider };
  const searchObjBranch = { offset: 0, limit: 20, keyword: searchBranch };
  const { fetchProvidersSearchKeywork } = useProvider(searchObjProvider);
  const { fetchBranchSearchKeywork } = useBranch(searchObjBranch);
  //   const handleSubmitProductForm = useMutation({
  //     mutationKey: ['add-product'],
  //     mutationFn: (data: Product) => {
  //       const transformData = {
  //         ...data,
  //         categoryId: Number(data.categoryId),
  //         images: data.images.map((item) => item.url),
  //         productUnits: data.productUnits.map((item) => ({
  //           ...item,
  //           unitId: Number(item.unitId),
  //         })),
  //       };
  //       return !productId
  //         ? axios.post(REQUEST_PRODUCTS, transformData)
  //         : axios.put(REQUEST_PRODUCTS, transformData);
  //     },
  //   });

  //   const onSubmitProductForm = (
  //     data: Product,
  //     onError: (error: object) => void,
  //     onSuccess: () => void,
  //   ) => {
  //     handleSubmitProductForm.mutate(data, {
  //       onSuccess: onSuccess,
  //       onError: (error) => onError(error),
  //     });
  //   };
  const handleSubmitImportForm = useMutation({
    mutationKey: ['add-product'],
    mutationFn: (data) => {
      const transformData = {
        ...data,
        branch: { id: Number(data.branch) },
        provider: { id: Number(data.provider) },
        importDetails: data.importDetails.map((item) => ({
          ...item,
          product: { id: Number(item.product) },
          unitId: Number(item.unitId),
        })),
      };

      return !importId
        ? axios.post('/imports', transformData)
        : axios.put('/imports', transformData);
    },
  });

  const onSubmitImportForm = (
    data,
    onError: (error: object) => void,
    onSuccess: () => void,
  ) => {
    handleSubmitImportForm.mutate(data, {
      onSuccess: onSuccess,
      onError: (error) => onError(error),
    });
  };
  async function fetchProviderSearchData() {
    try {
      if (searchProvider) {
        const providerData = await fetchProvidersSearchKeywork.refetch();
        setProviderData(providerData?.data?.data.items);
      } else {
        setProviderData(null);
      }
    } catch (error) {
      handleGlobalException(error, () => {});
    }
  }

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
  const fetchProductSearchKeywork = useQuery({
    queryKey: ['product_search_keywork'],
    queryFn: () =>
      axios.get('/products/customers', {
        params: {
          keyword: searchProduct,
          sortBy: 'SALE_PRICE',
        },
      }),
    enabled: false,
  });
  async function fetchProductSearchData() {
    try {
      if (searchProduct) {
        const productData = await fetchProductSearchKeywork.refetch();

        setProductData(productData?.data?.data.items);
      } else {
        setProductData(null);
      }
    } catch (error) {
      handleGlobalException(error, () => {});
    }
  }

  useEffect(() => {
    fetchProviderSearchData();
  }, [searchProvider]);

  useEffect(() => {
    fetchBranchSearchData();
  }, [searchBranch]);

  useEffect(() => {
    fetchProductSearchData();
  }, [searchProduct]);

  return {
    providerData,
    branchData,
    productData,
    handleSubmitImportForm,
    onSubmitImportForm,
  };
}
export default useImportDetail;
