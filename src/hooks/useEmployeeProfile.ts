import { REQUEST_EMPLOYEE_PROFILE } from "./../constants/apis";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "../settings/axios";
import { Account } from "../pages/Account";
import useAuthStore from "../store/AuthStore";

function useEmployeeProfile() {
  const storedAccount = localStorage.getItem("userProfile");
  const { update } = useAuthStore();
  const updateUserProfile = (userProfile) => {
    update(userProfile);
  };
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
  const onSubmitProfileForm = (data: Account, onSuccess: () => void, onError: (error: object) => void) => {
    handleUpdateProfile.mutate(data, {
      onSuccess: onSuccess,
      onError: (error) => onError(error),
    });
  };

  return {
    fetchEmployeeProfile,
    handleUpdateProfile,
    onSubmitProfileForm,
    updateUserProfile,
  };
}
export default useEmployeeProfile;
