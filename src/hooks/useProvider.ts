import {
  REQUEST_PROVIDERS,
  REQUEST_PROVIDERS_SEARCH_KEY,
  REQUEST_PROVIDER_DELETE,
} from './../constants/apis';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from '../settings/axios';
import { ErrorObject } from '../types/error';
import { Provider } from '../types/Provider';
import { notificationShow } from '../components/Notification';
import { handleGlobalException } from '../utils/error';
import { useNavigate } from 'react-router-dom';
function useProvider(
  search: { offset: number; limit: number; keyword: string },
  filter?: {
    offset: number;
    limit: number;
  },
) {
  const buildParams = () => {
    const params: Record<string, any> = {};

    if (filter?.offset) {
      params.offset = filter.offset;
    }

    if (filter?.limit) {
      params.limit = filter.limit;
    }

    return params;
  };
  const navigate = useNavigate();
  const fetchProvider = useQuery({
    queryKey: ['get-providers'],
    queryFn: () => {
      const params = buildParams();

      return axios.get(REQUEST_PROVIDERS, {
        params: params,
      });
    },
    enabled: false,
  });
  const fetchProvidersSearchKeywork = useQuery({
    queryKey: ['provider_search_keywork'],
    queryFn: () =>
      axios.get(
        REQUEST_PROVIDERS_SEARCH_KEY(
          search.keyword,
          search.offset,
          search.limit,
        ),
      ),
    enabled: false,
  });
  const handleAddProvider = useMutation({
    mutationKey: ['add-provider'],
    mutationFn: (data: { name: string }) => {
      return axios.post(REQUEST_PROVIDERS, data);
    },
  });
  const onSubmitAddProviderForm = (
    data: Provider,
    onError: (error: ErrorObject) => void,
    onSuccess: () => void,
  ) => {
    handleAddProvider.mutate(data, {
      onSuccess: onSuccess,
      onError: (error) => onError(error as ErrorObject),
    });
  };
  const handleUpdateProvider = useMutation({
    mutationKey: ['update-provider'],
    mutationFn: (data: Provider) => {
      return axios.put(REQUEST_PROVIDERS, data);
    },
  });
  const onSubmitUpdateProviderForm = (
    data: Provider,
    onError: (error: object) => void,
    onSuccess: () => void,
  ) => {
    handleUpdateProvider.mutate(data, {
      onSuccess: onSuccess,
      onError: (error) => onError(error as ErrorObject),
    });
  };

  const handleDeleteProvider = useMutation({
    mutationKey: ['delete-provider'],
    mutationFn: (data: { id: number }) => {
      return axios.delete(REQUEST_PROVIDER_DELETE(data.id));
    },
  });
  const onSubmitDeleteProviderForm = (data: { id: number }, onSuccess) => {
    handleDeleteProvider.mutate(data, {
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
  return {
    fetchProvider,
    fetchProvidersSearchKeywork,
    handleAddProvider,
    onSubmitAddProviderForm,
    handleUpdateProvider,
    onSubmitUpdateProviderForm,
    handleDeleteProvider,
    onSubmitDeleteProviderForm,
  };
}

export default useProvider;
