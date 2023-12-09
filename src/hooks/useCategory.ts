import {
  REQUEST_CATEGORIES,
  REQUEST_CATEGORIES_SEARCH_KEY,
  REQUEST_CATEGORY_DELETE,
} from './../constants/apis';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from '../settings/axios';
import { notificationShow } from '../components/Notification';
import { useNavigate } from 'react-router-dom';
import { handleGlobalException } from '../utils/error';
import { ErrorObject } from '../types/error';
import { Category } from '../components/Category/CategoryForm';
function useCategory(
  search: { offset: number; limit: number; keyword: string },
  filter: {
    offset: number;
    limit: number;
  },
) {
  const buildParams = () => {
    const params: Record<string, any> = {};

    if (filter.offset) {
      params.offset = filter.offset;
    }

    if (filter.limit) {
      params.limit = filter.limit;
    }

    return params;
  };
  const navigate = useNavigate();
  const fetchCategory = useQuery({
    queryKey: ['get-categories'],
    queryFn: () => {
      const params = buildParams();

      return axios.get(REQUEST_CATEGORIES, {
        params: params,
      });
    },
    enabled: false,
  });
  const fetchCategoriesSearchKeywork = useQuery({
    queryKey: ['category_search_keywork'],
    queryFn: () =>
      axios.get(
        REQUEST_CATEGORIES_SEARCH_KEY(
          search.keyword,
          search.offset,
          search.limit,
        ),
      ),
    enabled: false,
  });
  const handleDeleteCategory = useMutation({
    mutationKey: ['delete-category'],
    mutationFn: (data: { id: number }) => {
      return axios.delete(REQUEST_CATEGORY_DELETE(data.id));
    },
  });
  const onSubmitDeleteCategoryForm = (data: { id: number }, onSuccess) => {
    handleDeleteCategory.mutate(data, {
      onSuccess: onSuccess,
      onError: (error) => {
        const newError = error as ErrorObject;
        handleGlobalException(newError, () => {
          if (newError.response.status === 400) {
            const data = newError.response.data;
            notificationShow('error', 'Error!', data.error);
          }
        });
      },
    });
  };
  const handleAddCategory = useMutation({
    mutationKey: ['add-category'],
    mutationFn: (data: { name: string }) => {
      return axios.post(REQUEST_CATEGORIES, data);
    },
  });
  const onSubmitAddCategoryForm = (
    data: { name: string },
    onError: (error: object) => void,
    onSuccess: () => void,
  ) => {
    handleAddCategory.mutate(data, {
      onSuccess: onSuccess,
      onError: (error) => onError(error as ErrorObject),
    });
  };
  const handleUpdateCategory = useMutation({
    mutationKey: ['update-category'],
    mutationFn: (data: Category) => {
      return axios.put(REQUEST_CATEGORIES, data);
    },
  });
  const onSubmitUpdateCategoryForm = (
    data: Category,
    onError: (error: object) => void,
    onSuccess: () => void,
  ) => {
    handleUpdateCategory.mutate(data, {
      onSuccess: onSuccess,
      onError: (error) => onError(error as ErrorObject),
    });
  };
  return {
    fetchCategory,
    fetchCategoriesSearchKeywork,
    onSubmitAddCategoryForm,
    handleAddCategory,
    onSubmitDeleteCategoryForm,
    onSubmitUpdateCategoryForm,
    handleUpdateCategory,
  };
}

export default useCategory;
