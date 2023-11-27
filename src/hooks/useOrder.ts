import { useMutation, useQuery } from "@tanstack/react-query";
import { handleGlobalException } from "../utils/error";
import { OrderItem } from "../components/Order/type";
import { useEffect } from "react";
import axios from "../settings/axios";
import { notificationShow } from "../components/Notification";

interface ApiResponse {
  data: {
    items: OrderItem[];
    numPages: number;
    offset: number;
    limit: number;
    totalItems: number;
  } | null;
}

export default function useOrder(
  offset?: number,
  keyword?: string,
  startDate?: Date,
  endDate?: Date,
  status: string
) {
  const fetchOrder = useQuery<ApiResponse>({
    queryKey: ["get-orders"],
    queryFn: () => {
      const params: { [key: string]: number | string | Date } = {};
      if (offset) {
        params.offset = offset;
      }
      if (status) {
        params.status = status;
      }
      if (keyword) {
        params.keyword = keyword;
      }
      if (startDate) {
        params.startDate = new Date(startDate.getTime() + 7 * 60 * 60 * 1000)
          .toJSON()
          .slice(0, 10);
      }
      if (endDate) {
        console.log(endDate.getTimezoneOffset());
        params.endDate = new Date(endDate.getTime() + 7 * 60 * 60 * 1000)
          .toJSON()
          .slice(0, 10);
      }
      return axios.get("/orders", { params });
    },
    enabled: false,
    onError: (error) => {
      handleGlobalException(error, () => {});
    },
  });
  const changeStatusOrder = useMutation({
    mutationKey: ['update-status-order'],
    mutationFn: (data: {id: number, toStatus: string|null}) => {
      return axios.put(`/orders`, data);
    },
  });
  const handleChangeStatusOrder = (data: {id: number, toStatus: string|null}) => {
    changeStatusOrder.mutate(data, {
      onSuccess: () => {},
      onError: (error) => {
        handleGlobalException(error, () => {
          if (error.response.status === 400) {
            const data = error.response.data;
            Object.keys(data).forEach((key) => {
              notificationShow('error', 'Error!', data[key]);
            });
          }
        });
      },
    });
  };
  useEffect(() => {
    fetchOrder.refetch();
  }, [status, startDate, endDate, keyword]);
  return {
    importData: fetchOrder.data?.data?.items,
    fetchOrder,
    handleChangeStatusOrder
  };
}
