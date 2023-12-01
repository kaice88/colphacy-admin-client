import { useMutation, useQuery } from "@tanstack/react-query";
import { handleGlobalException } from "../utils/error";
import { DetailOrderItem, OrderItem } from "../components/Order/type";
import { useEffect } from "react";
import axios from "../settings/axios";

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
  offset?: number|undefined,
  keyword?: string|undefined,
  startDate?: Date|undefined,
  endDate?: Date|undefined,
  status: string|undefined
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
    mutationKey: ["update-status-order"],
    mutationFn: (data: { id: number; toStatus: string | null }) => {
      return axios.put(`/orders`, data);
    },
  });
  const handleChangeStatusOrder = (data: {
    id: number;
    toStatus: string | null;
  }) => {
    changeStatusOrder.mutate(data, {
      onSuccess: () => {},
      onError: (error) => {
        handleGlobalException(error, () => {});
      },
    });
  };
  useEffect(() => {
    fetchOrder.refetch();
  }, [status, startDate, endDate, keyword]);
  return {
    importData: fetchOrder.data?.data?.items,
    fetchOrder,
    handleChangeStatusOrder,
  };
}

export function useDetailOrder(id:number|undefined){
  const fetchDetailOrder = useQuery({
    queryKey: ["get-detail-order"],
    queryFn: () => {
      return axios.get(`/orders/${id}`);
    },
  });
  return{fetchDetailOrder}
}
