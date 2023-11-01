import { REQUEST_UNITS, REQUEST_UNITS_DELETE } from "./../constants/apis";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "../settings/axios";
import { useNavigate } from "react-router-dom";
import { notificationShow } from "../components/Notification";
import { handleGlobalException } from "../utils/error";
import { Unit } from "../components/Unit/UnitFrom";

function useUnit() {

  const navigate = useNavigate()
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
  const onSubmitAddUnitForm = (data: Unit, onSuccess) => {
    handleAddUnit.mutate(data, {
      onSuccess:onSuccess ,
      onError: (error) => {
        handleGlobalException(error, ()=>{
          if (error.response.status === 400) {
              const data = error.response.data;
              Object.keys(data).forEach((key) => {
                notificationShow("error", "Error!", data[key]);
              });
          }
        })
      },
    });
  };
  const handleDeleteUnit = useMutation({
    mutationKey: ["delete-unit"],
    mutationFn: (data: Unit) => {
      return axios.delete(REQUEST_UNITS_DELETE(data.id), data);
    },
  });
  const onSubmitDeleteUnitForm = (data: Unit, onSuccess) => {
    handleDeleteUnit.mutate(data, {
      onSuccess:onSuccess ,
      onError: (error) => {
        handleGlobalException(error, ()=>{
          if (error.response.status === 400) {
              const data = error.response.data;
              Object.keys(data).forEach((key) => {
                notificationShow("error", "Error!", data[key]);
              });
          }
        })
      },
    });
  };
  return {
    fetchUnit, onSubmitAddUnitForm, handleAddUnit, onSubmitDeleteUnitForm
  };
}
export default useUnit;
