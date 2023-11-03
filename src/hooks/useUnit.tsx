import { REQUEST_UNITS } from "./../constants/apis";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "../settings/axios";
function useUnit() {
  const fetchUnit = useQuery({
    queryKey: ["units"],
    queryFn: () => axios.get(REQUEST_UNITS),
    enabled: false,
  });
  const handleAddUnit = useMutation({
    mutationKey: ["add-unit"],
    mutationFn: (data: { name: string }) => {
      return axios.post(REQUEST_UNITS, data);
    },
  });
  const onSubmitAddUnitForm = (
    data: { name: string },
    onError: (error: object) => void,
    onSuccess: () => void
  ) => {
    handleAddUnit.mutate(data, {
      onSuccess: onSuccess,
      onError: (error) => onError(error),
    });
  };
  return {
    fetchUnit,
    onSubmitAddUnitForm,
    handleAddUnit,
  };
}
export default useUnit;
