import { create } from 'zustand'

interface AuthStoreState {
  userProfile: object | null
  accessToken: string | null
  setLocalStorage: (accessToken: string, userProfile: object) => void
  login: (accessToken: string, userProfile: object) => void
  logout: () => void
}

const useAuthStore = create<AuthStoreState>(set => ({

  userProfile: localStorage.getItem('userProfile')
    ? JSON.parse(localStorage.getItem('userProfile')!)
    : {},
  accessToken: localStorage.getItem('accessToken') ? localStorage.getItem('accessToken') : '',

  setLocalStorage: (accessToken, userProfile) => {
    localStorage.setItem('userProfile', JSON.stringify(userProfile))
    localStorage.setItem('accessToken', accessToken)
  },

  login: (accessToken, userProfile) => {
    set((state) => {
      state.setLocalStorage(accessToken, userProfile)
      return {
        accessToken,
        userProfile,
      }
    })
  },
  logout: () => {
    set(() => {
      localStorage.clear()
      return {
        accessToken: '',
        userProfile: {},
      }
    })
  },
}))

export default useAuthStore