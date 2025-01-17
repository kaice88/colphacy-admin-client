import {
  REQUEST_EMPLOYEE_PROFILE,
  REQUEST_EMPLOYEE_CHANGE_PASSWORD,
} from "./../constants/apis";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "../settings/axios";
import { Account } from "../pages/Account";
import { notificationShow } from "../components/Notification";
import { IChangePassword } from "../pages/ChangePassword";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/AuthStore";

function useEmployeeProfile() {
  const storedAccount = localStorage.getItem("userProfile");
  const { update } = useAuthStore();
  const updateUserProfile = (userProfile) => {
    update(userProfile);
  };
  const account = storedAccount ? (JSON.parse(storedAccount) as Account) : null;
  const id = Number(account?.id);
  const navigate = useNavigate();
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
  const handleUpdatePassword = useMutation({
    mutationKey: ["employee_updtae_password"],
    mutationFn: (data: IChangePassword) => {
      return axios.put(REQUEST_EMPLOYEE_CHANGE_PASSWORD, data);
    },
  });
  const onSubmitProfileForm = (data: Account, onSuccess: () => void, onError: (error: object) => void) => {
    handleUpdateProfile.mutate(data, {
      onSuccess: onSuccess,
      onError: (error) => onError(error),
    });
  };
  const onSubmitChangePasswordForm = (
    data: IChangePassword,
    onError: (error: object) => void
  ) => {
    handleUpdatePassword.mutate(data, {
      onSuccess: () => {
        notificationShow(
          "success",
          "Success!",
          "Cập nhật thông tin thành công!"
        );
        navigate("/profile");
      },
      onError: (error) => onError(error),
    });
  };

  return {
    fetchEmployeeProfile,
    handleUpdateProfile,
    handleUpdatePassword,
    onSubmitProfileForm,
    onSubmitChangePasswordForm,
    updateUserProfile,
  };
}
export default useEmployeeProfile;
