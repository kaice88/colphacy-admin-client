import { REQUEST_UNITS, REQUEST_UNITS_SEARCH_KEY } from "./../constants/apis";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "../settings/axios";
export function useUnitExceptAdd(
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
  const fetchUnit = useQuery({
    queryKey: ["get-units"],
    queryFn: () => {
      const params = buildParams();

      return axios.get(REQUEST_UNITS, {
        params: params,
      });
    },
    enabled: false,
  });
  const fetchUnitSearchKeywork = useQuery({
    queryKey: ["unit_search_keywork"],
    queryFn: () =>
      axios.get(
        REQUEST_UNITS_SEARCH_KEY(search.keyword, search.offset, search.limit)
      ),
    enabled: false,
  });
  return {
    fetchUnit,
    fetchUnitSearchKeywork
  };
}

function useUnit() {
  const handleAddUnit = useMutation({
    mutationKey: ["add-unit"],
    mutationFn: (data: { name: string }) => {
      return axios.post(REQUEST_UNITS, data);
    },
  });
  const onSubmitAddUnitForm = (
    data: { name: string },
    onError: (error: object) => void,
    onSuccess: () => void
  ) => {
    handleAddUnit.mutate(data, {
      onSuccess: onSuccess,
      onError: (error) => onError(error),
    });
  };
  return {
    onSubmitAddUnitForm,
    handleAddUnit,
  };
}
export default useUnit;

