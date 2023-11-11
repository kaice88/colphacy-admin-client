import { REQUEST_CATEGORIES, REQUEST_CATEGORIES_SEARCH_KEY } from "./../constants/apis";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "../settings/axios";
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
          REQUEST_CATEGORIES_SEARCH_KEY(search.keyword, search.offset, search.limit)
        ),
      enabled: false,
    });
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
    return {
      fetchCategory,
      fetchCategoriesSearchKeywork,
      onSubmitAddCategoryForm,
      handleAddCategory
    };
  }

export default useCategory;
