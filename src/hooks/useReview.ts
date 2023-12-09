import axios from "../settings/axios";
import { useEffect } from "react";
import { handleGlobalException } from "../utils/error";
import { useMutation, useQuery } from "@tanstack/react-query";
import { REQUEST_REPLY_REVIEW, REQUEST_REVIEW } from "../constants/apis";
import { Review, ReviewListItem } from "../components/Review/type";
import { notificationShow } from "../components/Notification";
import { ErrorObject } from "../types/error";

interface ApiResponse {
  data: {
    items: ReviewListItem[];
    numPages: number;
    offset: number;
    limit: number;
    totalItems: number;
  } | null;
}

function useReview(
  offset?: number,
  keyword?: string,
  sortBy?: "customerName" | "productName" | "rating" | "createdTime" | null,
  order?: "desc" | "asc" | null
) {
  const fetchReview = useQuery<ApiResponse>({
    queryKey: ["get-reviews"],
    queryFn: () => {
      const params: { [key: string]: number | string } = {};
      if (offset) {
        params.offset = offset;
      }
      if (keyword) {
        params.keyword = keyword;
      }
      if (sortBy) {
        params.sortBy = sortBy;
      }
      if (order) {
        params.order = order;
      }
      return axios.get(REQUEST_REVIEW, { params });
    },
    enabled: false,
    onError: (error) => {
      handleGlobalException(error, () => {});
    },
  });
  const handleDeleteReview = useMutation({
    mutationKey: ["delete-review"],
    mutationFn: (id: number) => {
      return axios.delete(`${REQUEST_REVIEW}/${id}`);
    },
  });
  const onSubmitDeleteReviewForm = (id: number, onSuccess: () => void) => {
    handleDeleteReview.mutate(id, {
      onSuccess: onSuccess,
      onError: (error) => {
        handleGlobalException(error, () => {
          if (error.response.status === 400) {
            const data = error.response.data;
            Object.keys(data).forEach((key) => {
              notificationShow("error", "Error!", data[key]);
            });
          }
        });
      },
    });
  };
  const handleAddReview = useMutation({
    mutationKey: ["add-review"],
    mutationFn: (data) => {
      return axios.post(REQUEST_REPLY_REVIEW, data);
    },
  });
  const onSubmitAddReviewForm = (
    data: Review,
    onError: (error: object) => void,
    onSuccess: () => void
  ) => {
    handleAddReview.mutate(data, {
      onSuccess: onSuccess,
      onError: (error) => onError(error as ErrorObject),
    });
  };
  useEffect(() => {
    fetchReview.refetch();
  }, [offset, keyword, order, sortBy]);
  return {
    loading: fetchReview.isLoading,
    reviewData: fetchReview.data?.data,
    onSubmitDeleteReviewForm,
    onSubmitAddReviewForm,
    fetchReview,
  };
}
export default useReview;
