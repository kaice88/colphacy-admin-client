import { useMutation } from '@tanstack/react-query';
import {
  REQUEST_CATEGORIES,
  REQUEST_PRODUCTS,
  REQUEST_UNITS,
  UPLOAD_IMAGES,
} from '../constants/apis';
import axios from '../settings/axios';
import { useEffect, useState } from 'react';
import { handleGlobalException } from '../utils/error';
import { Product, ProductData } from '../components/Product/type';
import { notificationShow } from '../components/Notification';

function useProductDetail(productId: number | null) {
  const [loading, setLoading] = useState(false);
  const [unitData, setUnitData] = useState<{ id: number; name: string }[]>();
  const [productData, setProductData] = useState<ProductData>();
  const [categoryData, setCategoryData] =
    useState<{ id: number; name: string }[]>();
  const handleUploadImages = useMutation({
    mutationKey: ['upload-images'],
    mutationFn: (data) => {
      return axios.post(UPLOAD_IMAGES, data);
    },
    onError: (error) => {
      handleGlobalException(error, () => {
        notificationShow('error', 'Error!', error.response.data.error);
      });
    },
  });

  const handleSubmitProductForm = useMutation({
    mutationKey: ['add-product'],
    mutationFn: (data: Product) => {
      const transformData = {
        ...data,
        categoryId: Number(data.categoryId),
        images: data.images.map((item) => item.url),
        productUnits: data.productUnits.map((item) => ({
          ...item,
          unitId: Number(item.unitId),
        })),
      };
      return !productId
        ? axios.post(REQUEST_PRODUCTS, transformData)
        : axios.put(REQUEST_PRODUCTS, transformData);
    },
  });

  const onSubmitProductForm = (
    data: Product,
    onError: (error: object) => void,
    onSuccess: () => void,
  ) => {
    handleSubmitProductForm.mutate(data, {
      onSuccess: () => onSuccess(),
      onError: (error) => onError(error),
    });
  };

  async function fetchData() {
    try {
      setLoading(true);
      const unitData = await axios.get(`${REQUEST_UNITS}/all`);
      const categoryData = await axios.get(`${REQUEST_CATEGORIES}/all`);
      if (productId) {
        const productData = await axios.get(`${REQUEST_PRODUCTS}/${productId}`);
        setProductData(productData.data);
      }
      setUnitData(unitData.data);
      setCategoryData(categoryData.data);
    } catch (error) {
      handleGlobalException(error, () => {});
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return {
    uploadImages: handleUploadImages,
    unitData,
    categoryData,
    productData,
    loading,
    onSubmitProductForm,
  };
}
export default useProductDetail;
