import { REQUEST_CATEGORIES, REQUEST_CATEGORIES_SEARCH_KEY } from "./../constants/apis";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "../settings/axios";
import { Category } from "../components/Category/CategoryTable";
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
      queryKey: ["get-Categories"],
      queryFn: () => {
        const params = buildParams();
  
        return axios.get(REQUEST_CATEGORIES, {
          params: params,
        });
      },
      enabled: false,
    });
    const fetchCategoriesSearchKeywork = useQuery({
      queryKey: ["Category_search_keywork"],
      queryFn: () =>
        axios.get(
          REQUEST_CATEGORIES_SEARCH_KEY(search.keyword, search.offset, search.limit)
        ),
      enabled: false,
    });
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
      onSubmitUpdateCategoryForm,
      handleUpdateCategory
    };
  }

export default useCategory;
