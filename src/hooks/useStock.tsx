import { useQuery } from "@tanstack/react-query";
import { handleGlobalException } from "../utils/error";
import axios from "../settings/axios";
import { useEffect } from "react";

export function useStock(offset?: number, keyword?: string) {
    const { refetch: fetchStock, isLoading, data: stockData } = useQuery({
        queryKey: ['get-Stocks'],
        queryFn: () => {
            const params: { [key: string]: number | string } = {};
            if (offset) {
                params.offset = offset;
            }
            if (keyword) {
                params.keyword = keyword;
            }
            // if (sortBy) {
            //   params.sortBy = sortBy;
            // }
            // if (order) {
            //   params.order = order;
            // }
            return axios.get('/stock', { params });
        },
        enabled: false,
        onError: (error) => {
            handleGlobalException(error, () => { });
        },
    });

    useEffect(() => {
        fetchStock()
    }, [offset, keyword])

    return {
        stockData,
        isLoading,
        fetchStock
    }
}