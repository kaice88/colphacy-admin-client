import { useMutation, useQuery } from "@tanstack/react-query";
import { handleGlobalException } from "../utils/error";
import { OrderItem } from "../components/Order/type";
import { useEffect, useState } from "react";
import axios from "../settings/axios";
import { ErrorObject } from "../types/error";
import { notificationShow } from "../components/Notification";
import { useBranch } from "./useBranch";
import { REQUEST_CUSTOMER_SEARCH_KEY } from "../constants/apis";
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
  offset?: number | undefined,
  keyword?: string | undefined,
  startDate?: Date | undefined,
  endDate?: Date | undefined,
  status: string | undefined
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
      onSuccess: () => {
        fetchOrder.refetch();
      },
      onError: (error) => {
        const newError = error as ErrorObject;
        handleGlobalException(newError, () => {
          if (newError.response.status === 400) {
            const data = newError.response.data;
            console.log(data);
            notificationShow("error", "Error!", data["toStatus"]);
          }
        });
      },
    });
  };
  useEffect(() => {
    fetchOrder.refetch();
  }, [status, startDate, endDate, keyword, offset]);
  return {
    OrderData: fetchOrder.data?.data,
    fetchOrder,
    handleChangeStatusOrder,
  };
}

export function useDetailOrder(id: number) {
  const fetchDetailOrder = useQuery({
    queryKey: ["get-detail-order"],
    queryFn: () => {
      return axios.get(`/orders/${id}`);
    },
  });
  return { fetchDetailOrder };
}

export function useAddOrder(
  searchBranch?: string,
  searchProduct?: string,
  searchCustomer?: string
) {
  const [branchData, setBranchData] = useState();
  const [productData, setProductData] = useState();
  const [customerData, setCustomerData] = useState();
  const searchObjBranch = { offset: 0, limit: 20, keyword: searchBranch };
  const { fetchBranchSearchKeywork } = useBranch(searchObjBranch);

  const fetchCustomerSearchKeywork = useQuery({
    queryKey: ["customer_search_keywork"],
    queryFn: () =>
      axios.get(REQUEST_CUSTOMER_SEARCH_KEY(searchCustomer, 0, 20)),
    enabled: false,
  });

  async function fetchBranchSearchData() {
    try {
      if (searchBranch) {
        const branchData = await fetchBranchSearchKeywork.refetch();
        setBranchData(branchData?.data?.data.items);
      } else {
        setBranchData(null);
      }
    } catch (error) {
      handleGlobalException(error, () => {});
    }
  }
  async function fetchCustomerSearchData() {
    try {
      if (searchCustomer) {
        const customers = await fetchCustomerSearchKeywork.refetch();
        setCustomerData(customers?.data?.data.items);
      } else {
        setCustomerData(null);
      }
    } catch (error) {
      handleGlobalException(error, () => {});
    }
  }
  const fetchProductSearchKeywork = useQuery({
    queryKey: ["product_search_keywork"],
    queryFn: () =>
      axios.get("/products/customers", {
        params: {
          keyword: searchProduct,
          sortBy: "SALE_PRICE",
        },
      }),
    enabled: false,
  });
  async function fetchProductSearchData() {
    try {
      if (searchProduct) {
        const productData = await fetchProductSearchKeywork.refetch();
        setProductData(productData?.data?.data.items);
      } else {
        setProductData(null);
      }
    } catch (error) {
      handleGlobalException(error, () => {});
    }
  }
  const handleSubmitOrderForm = useMutation({
    mutationKey: ["add-order"],
    mutationFn: (data) => {
      const transformData = {
        ...data,
        branchId: Number(data.branchId),
        customerId: Number(data.customerId),
        orderTime: new Date(data.orderTime.getTime() + 7 * 60 * 60 * 1000),
        items: data.items.map((item) => ({
          productId: Number(item.productId),
          unitId: Number(item.unitId),
          quantity: Number(item.quantity),
          salePrice: Number(item.salePrice),
        })),
      };
      return axios.post("/orders", transformData);
    },
  });

  const onSubmitAddOrderForm = (
    data,
    onError: (error: object) => void,
    onSuccess: () => void
  ) => {
    handleSubmitOrderForm.mutate(data, {
      onSuccess: onSuccess,
      onError: (error) => onError(error),
    });
  };

  useEffect(() => {
    fetchBranchSearchData();
  }, [searchBranch]);

  useEffect(() => {
    fetchProductSearchData();
  }, [searchProduct]);

  useEffect(() => {
    fetchCustomerSearchData();
  }, [searchCustomer]);

  return {
    branchData,
    productData,
    customerData,
    onSubmitAddOrderForm,
  };
}
