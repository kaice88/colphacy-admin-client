import { useMutation } from '@tanstack/react-query';
import {
  REQUEST_CATEGORIES,
  REQUEST_UNITS,
  UPLOAD_IMAGES,
} from '../constants/apis';
import axios from '../settings/axios';
import { useEffect, useState } from 'react';
import { handleGlobalException } from '../utils/error';
import { Product } from '../components/Product/type';
import { notificationShow } from '../components/Notification';

function useProductDetail() {
  const [loading, setLoading] = useState(false);
  const [unitData, setUnitData] = useState<{ id: number; name: string }[]>();
  const [categoryData, setCategoryData] =
    useState<{ id: number; name: string }[]>();
  // const [unitData, setUnitData] = useState();
  const handleUploadImages = useMutation({
    mutationKey: ['upload-images'],
    mutationFn: (data) => {
      return axios.post(UPLOAD_IMAGES, data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const handleAddProductForm = useMutation({
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
      return axios.post('/products', transformData);
    },
  });

  const onSubmitAddProductForm = (
    data: Product,
    onError: (error: object) => void,
  ) => {
    handleAddProductForm.mutate(data, {
      onSuccess: () => {
        notificationShow(
          'success',
          'Success!',
          'Thêm sản phẩm mới thành công!',
        );
      },
      onError: (error) => onError(error),
    });
  };

  async function fetchData() {
    try {
      setLoading(true);
      const unitData = await axios.get(`${REQUEST_UNITS}/all`);
      const categoryData = await axios.get(`${REQUEST_CATEGORIES}/all`);
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
    loading,
    onSubmitAddProductForm,
  };
}
export default useProductDetail;
