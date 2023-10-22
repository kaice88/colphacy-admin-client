import { REQUEST_EMPLOYEE_PROFILE } from "./../constants/apis";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "../settings/axios";
import { Account } from "../pages/Account";
import { notificationShow } from "../components/Notification";
import { handleGlobalException } from "../utils/error";

function useEmployeeProfile() {
  const storedAccount = localStorage.getItem("userProfile");
  const account = storedAccount ? (JSON.parse(storedAccount) as Account) : null;
  const id = Number(account?.id);
  const fetchEmployeeProfile = useQuery({
    queryKey: ["employee_profile"],
    queryFn: () => axios.get(REQUEST_EMPLOYEE_PROFILE(id)),
    enabled: false,
  });
  const handleUpdateProfile = useMutation({
    mutationKey: ["employee_updtae_profile"],
    mutationFn: (data: Account) => {
      return axios.put(REQUEST_EMPLOYEE_PROFILE(id), data);
    },
  });
  const onSubmitProfileForm = (data: Account, onSuccess) => {
    handleUpdateProfile.mutate(data, {
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
    fetchEmployeeProfile,
    handleUpdateProfile,
    onSubmitProfileForm,
  };
}
export default useEmployeeProfile;
