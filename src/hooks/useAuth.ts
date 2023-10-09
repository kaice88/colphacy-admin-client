import { REQUEST_AUTH_LOGIN_PASSWORD } from './../constants/apis';
import { useMutation } from "@tanstack/react-query"
import axios from "../settings/axios"
import useAuthStore from "../store/AuthStore"
import isEmpty from "lodash/isEmpty"
import { useNavigate } from "react-router-dom"
import { notificationShow } from '../components/Notification'
import { HOME } from '../constants/routes';


function useAuth() {
    const { login, userProfile } = useAuthStore()
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

   
    return {
        userProfile,
        isAuthenticated,
        onSubmitAccountForm,
        handleLoginPassword
    }
}
export default useAuth