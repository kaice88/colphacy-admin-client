import { REQUEST_EMPLOYEE_PROFILE } from "./../constants/apis";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "../settings/axios";
import { Account } from "../pages/Account";
import { notificationShow } from "../components/Notification";

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
  const onSubmitProfileForm = (data: Account) => {
    handleUpdateProfile.mutate(data, {
      onSuccess: () => {
        notificationShow(
          "success",
          "Success!",
          "Cập nhật thông tin thành công!"
        );
      },
      onError: (error) => {
        if (error.code === "ERR_NETWORK") {
          notificationShow("error", "Error!", error.message);
        } else if (
          (error.response.status === 500, error.response.status === 403)
        ) {
          notificationShow("error", "Error!", error.response.data.error);
        } else if (error.response.status === 400) {
          notificationShow(
            "error",
            "Error!",
            "Hãy nhập thông tin dưới dạng chuỗi ký tự"
          );
        }
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
