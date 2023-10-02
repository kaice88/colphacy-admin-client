import { useMutation } from "@tanstack/react-query"
import axios from "../settings/axious"
import { REQUEST_AUTH_LOGIN } from "../constants/apis"
import useAuthStore from "../store/AuthStore"

function useAuth() {
    
    const { login, logout, userProfile } = useAuthStore()
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
        userProfile
    }
}
export default useAuth