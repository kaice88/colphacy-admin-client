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
  const [importData, setImportData] = useState();
  const searchObjProvider = { offset: 0, limit: 20, keyword: searchProvider };
  const searchObjBranch = { offset: 0, limit: 20, keyword: searchBranch };
  const { fetchProvidersSearchKeywork } = useProvider(searchObjProvider);
  const { fetchBranchSearchKeywork } = useBranch(searchObjBranch);

  const handleSubmitImportForm = useMutation({
    mutationKey: ['add-product'],
    mutationFn: (data) => {
      const transformData = {
        ...data,
        branch: { id: Number(data.branch) },
        provider: { id: Number(data.provider) },
        importTime: new Date(data.importTime).toISOString(),
        importDetails: data.importDetails.map((item) => ({
          ...item,
          product: { id: Number(item.product) },
          unitId: Number(item.unitId),
          expirationDate: new Date(
            item.expirationDate,
          ).toISOString(),
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
  async function fetchImportData() {
    try {
      if (importId) {
        const importData = await axios.get(`imports/${importId}`);
        setImportData(importData?.data);
      } else {
        setImportData(null);
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

  useEffect(() => {
    fetchImportData();
  }, [importId]);

  return {
    providerData,
    branchData,
    productData,
    importData,
    handleSubmitImportForm,
    onSubmitImportForm,
  };
}
export default useImportDetail;
