import { useMutation } from "@tanstack/react-query"
import axios from "../settings/axios"
import { REQUEST_AUTH_LOGIN } from "../constants/apis"
import useAuthStore from "../store/AuthStore"
import isEmpty from "lodash/isEmpty"

function useAuth() {
    const { login, logout, userProfile } = useAuthStore()
    const isAuthenticated =  false//!isEmpty(userProfile)
    const handleLogin = useMutation({
        mutationKey: ['login'],
        mutationFn: (data) => {
          return axios.post(REQUEST_AUTH_LOGIN, data)
        },
        onError: (err) => { 
            console.log(err);
        },
        onSuccess: (data) => {
            console.log(data);
            // login(data.data.accessToken, data.data.profile)
         }
    })
    return {
        login: handleLogin,
        userProfile,
        isAuthenticated
    }
}
export default useAuth