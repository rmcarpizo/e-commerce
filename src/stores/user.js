import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(null)

  const setToken = (newToken) => {
    token.value = newToken
    localStorage.setItem('token', newToken)
    
    
    try {
      const payload = JSON.parse(atob(newToken.split('.')[1]))
      user.value = {
        id: payload.id,
        email: payload.email,
        isAdmin: payload.isAdmin
      }
      console.log('User decoded:', user.value) // Debug log
    } catch (error) {
      console.error('Failed to decode token:', error)
    }
  }

  const clearToken = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
  }

  const isAuthenticated = () => !!token.value
  
  const isAdmin = computed(() => user.value?.isAdmin || false)

  
  if (token.value) {
    try {
      const payload = JSON.parse(atob(token.value.split('.')[1]))
      user.value = {
        id: payload.id,
        email: payload.email,
        isAdmin: payload.isAdmin
      }
    } catch (error) {
      
      clearToken()
    }
  }

  return { token, user, setToken, clearToken, isAuthenticated, isAdmin }
})