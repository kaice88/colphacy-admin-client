import {
  REQUEST_PROVIDERS,
  REQUEST_PROVIDERS_SEARCH_KEY,
} from "./../constants/apis";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "../settings/axios";
import { ErrorObject } from "../types/error";
import { Provider } from "../types/Provider";
function useProvider(
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
  const fetchProvider = useQuery({
    queryKey: ["get-providers"],
    queryFn: () => {
      const params = buildParams();

      return axios.get(REQUEST_PROVIDERS, {
        params: params,
      });
    },
    enabled: false,
  });
  const fetchProvidersSearchKeywork = useQuery({
    queryKey: ["provider_search_keywork"],
    queryFn: () =>
      axios.get(
        REQUEST_PROVIDERS_SEARCH_KEY(
          search.keyword,
          search.offset,
          search.limit
        )
      ),
    enabled: false,
  });
  const handleAddProvider = useMutation({
    mutationKey: ["add-provider"],
    mutationFn: (data: { name: string }) => {
      return axios.post(REQUEST_PROVIDERS, data);
    },
  });
  const onSubmitAddProviderForm = (
    data: Provider,
    onError: (error: object) => void,
    onSuccess: () => void
  ) => {
    handleAddProvider.mutate(data, {
      onSuccess: onSuccess,
      onError: (error) => onError(error as ErrorObject),
    });
  };
  const handleUpdateProvider = useMutation({
    mutationKey: ["update-provider"],
    mutationFn: (data: Provider) => {
      return axios.put(REQUEST_PROVIDERS, data);
    },
  });
  const onSubmitUpdateProviderForm = (
    data: Provider,
    onError: (error: object) => void,
    onSuccess: () => void
  ) => {
    handleUpdateProvider.mutate(data, {
      onSuccess: onSuccess,
      onError: (error) => onError(error as ErrorObject),

    });
  };
  return {
    fetchProvider,
    fetchProvidersSearchKeywork,
    handleAddProvider,
    onSubmitAddProviderForm,
    handleUpdateProvider,
    onSubmitUpdateProviderForm
  };
}

export default useProvider;
