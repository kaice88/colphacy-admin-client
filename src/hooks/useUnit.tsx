import {
  REQUEST_UNITS,
  REQUEST_UNITS_DELETE,
  REQUEST_UNITS_SEARCH_KEY,
} from './../constants/apis';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from '../settings/axios';

import { notificationShow } from '../components/Notification';
import { handleGlobalException } from '../utils/error';

import { Unit } from '../components/Unit/UnitForm';
import { ErrorObject } from '../types/error';

export function useUnitExceptAdd(
  search: { offset: number; limit: number; keyword: string },
  filter: {
    offset: number;
    limit: number;
  },
) {
  const buildParams = () => {
    const params: { [key: string]: number | string } = {};

    if (filter.offset) {
      params.offset = filter.offset;
    }

    if (filter.limit) {
      params.limit = filter.limit;
    }

    return params;
  };
  const fetchUnit = useQuery({
    queryKey: ['get-units'],
    queryFn: () => {
      const params = buildParams();

      return axios.get(REQUEST_UNITS, {
        params: params,
      });
    },
    enabled: false,
  });
  const fetchUnitSearchKeywork = useQuery({
    queryKey: ['unit_search_keywork'],
    queryFn: () =>
      axios.get(
        REQUEST_UNITS_SEARCH_KEY(search.keyword, search.offset, search.limit),
      ),
    enabled: false,
  });
  return {
    fetchUnit,
    fetchUnitSearchKeywork,
  };
}

function useUnit() {
  const handleAddUnit = useMutation({
    mutationKey: ['add-unit'],
    mutationFn: (data: { name: string }) => {
      return axios.post(REQUEST_UNITS, data);
    },
  });
  const handleDeleteUnit = useMutation({
    mutationKey: ['delete-unit'],
    mutationFn: (data: { id: number }) => {
      return axios.delete(REQUEST_UNITS_DELETE(data.id));
    },
  });
  const onSubmitAddUnitForm = (
    data: { name: string },
    onError: (error: object) => void,
    onSuccess: () => void,
  ) => {
    handleAddUnit.mutate(data, {
      onSuccess: onSuccess,
      onError: (error) => onError(error),
    });
  };

  const onSubmitDeleteUnitForm = (
    data: { id: number },
    onSuccess: () => void,
  ) => {
    handleDeleteUnit.mutate(data, {
      onSuccess: onSuccess,
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
  const handleUpdateUnit = useMutation({
    mutationKey: ['update-unit'],
    mutationFn: (data: Unit) => {
      return axios.put(REQUEST_UNITS, data);
    },
  });
  const onSubmitUpdateUnitForm = (
    data: Unit,
    onError: (error: ErrorObject) => void,
    onSuccess: () => void,
  ) => {
    handleUpdateUnit.mutate(data, {
      onSuccess: onSuccess,
      onError: (error) => onError(error as ErrorObject),
    });
  };

  return {
    onSubmitAddUnitForm,
    handleAddUnit,

    onSubmitDeleteUnitForm,

    handleUpdateUnit,
    onSubmitUpdateUnitForm,
  };
}
export default useUnit;
