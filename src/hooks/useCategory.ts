import {
  REQUEST_CATEGORIES,
  REQUEST_CATEGORIES_SEARCH_KEY,
  REQUEST_CATEGORY_DELETE,
} from "./../constants/apis";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "../settings/axios";
import { notificationShow } from "../components/Notification";
import { useNavigate } from "react-router-dom";
import { handleGlobalException } from "../utils/error";
import { Category } from "../components/Category/CategoryTable";
function useCategory(
  search: { offset: number; limit: number; keyword: string },
  filter: {
    offset: number;
    limit: number;
  }
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
    queryKey: ["get-categories"],
    queryFn: () => {
      const params = buildParams();

      return axios.get(REQUEST_CATEGORIES, {
        params: params,
      });
    },
    enabled: false,
  });
  const fetchCategoriesSearchKeywork = useQuery({
    queryKey: ["category_search_keywork"],
    queryFn: () =>
      axios.get(
        REQUEST_CATEGORIES_SEARCH_KEY(
          search.keyword,
          search.offset,
          search.limit
        )
      ),
    enabled: false,
  });
  const handleDeleteCategory = useMutation({
    mutationKey: ["delete-category"],
    mutationFn: (data: { id: number }) => {
      return axios.delete(REQUEST_CATEGORY_DELETE(data.id));
    },
  });
  const onSubmitDeleteCategoryForm = (data: { id: number }) => {
    handleDeleteCategory.mutate(data, {
      onSuccess: () => {
        notificationShow("success", "Success!", "Xóa danh mục thành công!");
        navigate("/", { state: { from: location.pathname } });
      },
      onError: (error) => {
        handleGlobalException(error, () => {
          if (error.response.status === 400) {
            const data = error.response.data;
            Object.keys(data).forEach((key) => {
              notificationShow("error", "Error!", data[key]);
            });
          }
        });
      },
    });
  };
  const handleAddCategory = useMutation({
    mutationKey: ["add-category"],
    mutationFn: (data: { name: string }) => {
      return axios.post(REQUEST_CATEGORIES, data);
    },
  });
  const onSubmitAddCategoryForm = (
    data: { name: string },
    onError: (error: object) => void,
    onSuccess: () => void
  ) => {
    handleAddCategory.mutate(data, {
      onSuccess: onSuccess,
      onError: (error) => onError(error),
    });
  };
  const handleUpdateCategory = useMutation({
    mutationKey: ["update-category"],
    mutationFn: (data: Category) => {
      return axios.put(REQUEST_CATEGORIES, data);
    },
  });
  const onSubmitUpdateCategoryForm = (
    data: Category,
    onError: (error: object) => void,
    onSuccess: () => void
  ) => {
    handleUpdateCategory.mutate(data, {
      onSuccess: onSuccess,
      onError: (error) => onError(error),
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
