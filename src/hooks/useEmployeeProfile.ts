import { REQUEST_EMPLOYEE_PROFILE } from "./../constants/apis";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "../settings/axios";
import { Account } from "../pages/Account";
import { notificationShow } from "../components/Notification";

function useEmployeeProfile() {
  const storedAccount = localStorage.getItem("userProfile");
  const account = storedAccount ? JSON.parse(storedAccount) as Account : null;
  const id = Number(account?.id)
  const fetchEmployeeProfile = useQuery({
    queryKey: ["employee_profile"],
    queryFn: () => axios.get(REQUEST_EMPLOYEE_PROFILE(2)),
    enabled: false,
  });
  const handleUpdateProfile = useMutation({
    mutationKey: ["employee_updtae_profile"],
    mutationFn: (data: Account) => {
      return axios.post(REQUEST_EMPLOYEE_PROFILE(id), data);
    },
  });
  const onSubmitProfileForm = (data: Account, onError: (error:object) => void) => {
    handleUpdateProfile.mutate(data,
        {
            onSuccess: () => {
                notificationShow('success', 'Success!',"Đăng nhập thành công!")
            },
            onError: (error) => onError(error),
        })
}
  return {
    fetchEmployeeProfile,
    handleUpdateProfile,
    onSubmitProfileForm
  };
}
export default useEmployeeProfile;
