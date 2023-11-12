import {
  REQUEST_PROVIDERS,
  REQUEST_PROVIDERS_SEARCH_KEY,
} from "./../constants/apis";
import { useQuery } from "@tanstack/react-query";
import axios from "../settings/axios";
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
  return {
    fetchProvider,
    fetchProvidersSearchKeywork
  };
}

export default useProvider;
