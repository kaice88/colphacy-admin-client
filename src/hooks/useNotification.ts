import { useInfiniteQuery } from "@tanstack/react-query";
import { REQUEST_NOTIFICATION } from "../constants/apis";
import axios from "../settings/axios";

export function useNotification(filter: { offset: number; limit: number }) {
  const buildParams = () => {
    const params: Record<string, any> = {};

    if (filter.limit) {
      params.limit = filter.limit;
    }

    return params;
  };
  const fetchNotification = async ({ pageParam = 0 }) => {
    const params = buildParams();
    params.offset = pageParam;
    const res = await axios.get(REQUEST_NOTIFICATION, {
      params: params,
    });
    return res;
  };
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["fetch_notifications"],
    queryFn: fetchNotification,
    enabled: false,
    getNextPageParam: (lastPage) => {
      const nextOffset = lastPage.data.offset + lastPage.data.items.length;
      if (nextOffset === lastPage.data.totalItems) return undefined;
      else {
        return nextOffset;
      }
    },
  });
  const buildParamsRead = () => {
    const params: Record<string, any> = {};
    params.isRead = false;
    if (filter.limit) {
      params.limit = filter.limit;
    }

    return params;
  };
  const fetchNotificationRead = async ({ pageParam = 0 }) => {
    const params = buildParamsRead();
    params.offset = pageParam;
    const res = await axios.get(REQUEST_NOTIFICATION, {
      params: params,
    });
    return res;
  };
  const {
    data: dataRead,
    error: errorRead,
    fetchNextPage: fetchNextPageRead,
    hasNextPage: hasNextPageRead,
    isFetchingNextPage: isFetchingNextPageRead,
    status: statusRead,
    refetch: refetchRead,
  } = useInfiniteQuery({
    queryKey: ["fetch_notifications_read"],
    queryFn: fetchNotificationRead,
    enabled: false,
    getNextPageParam: (lastPage) => {
      const nextOffset = lastPage.data.offset + lastPage.data.items.length;
      if (nextOffset === lastPage.data.totalItems) return undefined;
      else {
        return nextOffset;
      }
    },
  });
  return {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
    dataRead,
    errorRead,
    fetchNextPageRead,
    hasNextPageRead,
    isFetchingNextPageRead,
    statusRead,
    refetchRead,
  };
}
