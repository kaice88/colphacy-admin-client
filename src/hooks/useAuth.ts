import {
  REQUEST_AUTH_LOGIN_PASSWORD,
  REQUEST_AUTH_LOGOUT,
} from "./../constants/apis";
import { useMutation } from "@tanstack/react-query";
import axios from "../settings/axios";
import useAuthStore from "../store/AuthStore";
import isEmpty from "lodash/isEmpty";
import { useNavigate } from "react-router-dom";
import { notificationShow } from "../components/Notification";
import { HOME } from "../constants/routes";

function useAuth() {
  const { login, userProfile, logout, update } = useAuthStore();
  const isAuthenticated = !isEmpty(userProfile);
  const updateUserProfile = (userProfile) => {
    update(userProfile);
  };
  const navigate = useNavigate();
  const handleLoginPassword = useMutation({
    mutationKey: ["login"],
    mutationFn: (data) => {
      return axios.post(REQUEST_AUTH_LOGIN_PASSWORD, data);
    },
  });

  const onSubmitAccountForm = (
    data: { username: string; password: string },
    onError: (error: object) => void
  ) => {
    handleLoginPassword.mutate(data, {
      onSuccess: (data) => {
        login(data.data.accessToken, data.data.userProfile,data.data.expirationTime);
        navigate(HOME);
        notificationShow("success", "Success!", "Đăng nhập thành công!");
      },
      onError: (error) => onError(error),
    });
  };
  const handleLogout = useMutation({
    mutationKey: ["logout"],
    mutationFn: () => {
      logout();
      return axios.post(REQUEST_AUTH_LOGOUT);
    },
   
  });

  const getTokenDuration = () => {
    const expirationDate = new Date(localStorage.getItem('expirationTime') || Date.now());
    const now = new Date()
    const duration = expirationDate.getTime() - now.getTime()
    return duration
  }

  return {
    userProfile,
    isAuthenticated,
    onSubmitAccountForm,
    handleLoginPassword,
    logout: handleLogout,
    updateUserProfile,
    getTokenDuration
  };
}
export default useAuth;
