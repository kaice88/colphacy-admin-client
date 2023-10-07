import { useMutation } from "@tanstack/react-query"
import axios from "../settings/axios"
import { REQUEST_AUTH_LOGIN_OTP, REQUEST_GENERATE_OTP } from "../constants/apis"
import useAuthStore from "../store/AuthStore"
import isEmpty from "lodash/isEmpty"
import { useNavigate } from "react-router-dom"



function useAuth() {
    const { login, userProfile } = useAuthStore()
    const isAuthenticated =  !isEmpty(userProfile);
    const navigate = useNavigate()
    const handleLogin = useMutation({
        mutationKey: ['login'],
        mutationFn: (data) => {
          return axios.post(REQUEST_AUTH_LOGIN_OTP, data)
        }
    })

    const onSubmitOTPForm = (data: { otp: string,phone: string }, onError: (error: object) => void) => {
        handleLogin.mutate(data,
            {
                onSuccess: (data) => {
                    login(data.data.accessToken,data.data.userProfile)
                    navigate("/")
                },
                onError: (error) => onError(error),
            })
    }

    const handleGenerateOTP = useMutation({
        mutationKey: ['generate-otp'],
        mutationFn: (data : {phoneNumber: string}) => {
          return axios.post(REQUEST_GENERATE_OTP,{},
            {
                params: { phone: data.phoneNumber}
            }
        )
        }
    })

    const onSubmitPhoneNumberForm = (data: { phoneNumber: string }, onSuccess: () => void, onError: (error) => void) => {
        handleGenerateOTP.mutate(data,
            {
                onSuccess: onSuccess,
                onError: (error) => onError(error),
            })
    }

    return {
        login: handleLogin,
        userProfile,
        isAuthenticated,
        handleGenerateOTP,
        onSubmitPhoneNumberForm,
        onSubmitOTPForm
    }
}
export default useAuth