"use client"

import { createContext, useState, useContext, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = localStorage.getItem("token")

        if (!token) {
          setLoading(false)
          return
        }

        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

        const res = await axios.get("/api/users/me")

        if (res.data) {
          setUser(res.data)
          setIsAuthenticated(true)
        }
      } catch (err) {
        localStorage.removeItem("token")
        delete axios.defaults.headers.common["Authorization"]
      } finally {
        setLoading(false)
      }
    }

    checkLoggedIn()
  }, [])

  const register = async (userData) => {
    try {
      const res = await axios.post("/api/users/register", userData)

      if (res.data.token) {
        localStorage.setItem("token", res.data.token)
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`
        setUser(res.data.user)
        setIsAuthenticated(true)
        return { success: true }
      }
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Registration failed",
      }
    }
  }

  const login = async (userData) => {
    try {
      const res = await axios.post("/api/users/login", userData)

      if (res.data.token) {
        localStorage.setItem("token", res.data.token)
        axios.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`
        setUser(res.data.user)
        setIsAuthenticated(true)
        return { success: true }
      }
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.message || "Login failed",
      }
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    delete axios.defaults.headers.common["Authorization"]
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
