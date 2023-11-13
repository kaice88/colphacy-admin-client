import {
  REQUEST_PROVIDERS,
  REQUEST_PROVIDERS_SEARCH_KEY,
  REQUEST_PROVIDER_DELETE
} from "./../constants/apis";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "../settings/axios";
import { notificationShow } from "../components/Notification";
import { handleGlobalException } from "../utils/error";
import { useNavigate } from "react-router-dom";
import { ErrorObject } from "../types/error";
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
  const navigate = useNavigate();
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
  const handleDeleteProvider = useMutation({
    mutationKey: ["delete-provider"],
    mutationFn: (data: { id: number }) => {
      return axios.delete(REQUEST_PROVIDER_DELETE(data.id));
    },
  });
  const onSubmitDeleteProviderForm = (data: { id: number }) => {
    handleDeleteProvider.mutate(data, {
      onSuccess: () => {
        notificationShow("success", "Success!", "Xóa danh mục thành công!");
        navigate("/", { state: { from: location.pathname } });
      },
      onError: (error) => {
        const newError = error as ErrorObject
        handleGlobalException(newError, () => {
          if (newError.response.status === 400) {
            const data = newError.response.data;
            notificationShow("error", "Error!", data.error);
          }
        });
      },
    });
  };
  return {
    fetchProvider,
    fetchProvidersSearchKeywork,
    handleDeleteProvider,
    onSubmitDeleteProviderForm
  };
}

export default useProvider;
