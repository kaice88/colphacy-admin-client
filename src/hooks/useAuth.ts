import { REQUEST_AUTH_LOGIN_PASSWORD,REQUEST_AUTH_LOGOUT_PASSWORD } from './../constants/apis';
import { useMutation } from "@tanstack/react-query"
import axios from "../settings/axios"
import useAuthStore from "../store/AuthStore"
import isEmpty from "lodash/isEmpty"
import { useNavigate } from "react-router-dom"
import { notificationShow } from '../components/Notification'
import { HOME,LOGIN } from '../constants/routes';


function useAuth() {
    const { login, userProfile,logout } = useAuthStore()
    const isAuthenticated =  !isEmpty(userProfile);
    const navigate = useNavigate()
    const handleLoginPassword = useMutation({
        mutationKey: ['login'],
        mutationFn: (data) => {
          return axios.post(REQUEST_AUTH_LOGIN_PASSWORD, data)
        }
    })

    const onSubmitAccountForm = (data: { username: string,password: string },onError: (error:object) => void) => {
        handleLoginPassword.mutate(data,
            {
                onSuccess: (data) => {
                    login(data.data.accessToken,data.data.userProfile)
                    navigate(HOME)
                    notificationShow('success', 'Success!',"Đăng nhập thành công!")
                },
                onError: (error) => onError(error),
            })
    }
    const handleLogout = useMutation({
        mutationKey: ['logout'],
        mutationFn: () => {
          return axios.post(REQUEST_AUTH_LOGOUT_PASSWORD)
        },
        onSuccess: () => {
            logout()
            navigate(LOGIN)
        },
        onError: (error) => {
            notificationShow('error', 'Error!',error.message)
        }
    })

   
    return {
        userProfile,
        isAuthenticated,
        onSubmitAccountForm,
        handleLoginPassword,
        logout : handleLogout
    }
}
export default useAuth