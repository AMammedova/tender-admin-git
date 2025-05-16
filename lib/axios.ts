import axios from "axios"
import { getSession } from "next-auth/react"

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://tend.grandmart.az:6004/api";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  async (config) => {
    const session = await getSession()
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`
    }

    // Accept-Language yalnız GET üçün əlavə et
    if (config.method?.toLowerCase() === "get") {
      config.headers["Accept-Language"] = getCurrentLocaleFromCookie();
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration or unauthorized access
      // You might want to redirect to login or refresh token
    }
    return Promise.reject(error)
  },
)

function getCurrentLocaleFromCookie() {
  if (typeof document !== "undefined") {
    const match = document.cookie.match(/(^| )NEXT_LOCALE=([^;]+)/);
    return match ? match[2] : "en";
  }
  return "en";
}
