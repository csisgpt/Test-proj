import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios'

export interface ApiConfig {
  baseURL: string
  timeout?: number
  headers?: Record<string, string>
}

export interface ApiResponse<T = any> {
  data: T
  status: number
  message?: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn?: number
}

export class ApiClient {
  private instance: AxiosInstance
  private token: AuthTokens | null = null
  private refreshPromise: Promise<AuthTokens> | null = null
  private subscribers: Array<(token: string) => void> = []

  constructor(config: ApiConfig) {
    const runtimeBase = (window as any).__APP_CONFIG?.apiBaseUrl

    this.instance = axios.create({
      baseURL: config.baseURL || runtimeBase || import.meta.env.VITE_API_BASE_URL,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...config.headers,
      },
    })

    this.setupInterceptors()
    this.loadTokenFromStorage()
  }

  private setupInterceptors(): void {
    this.instance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        if (this.token?.accessToken) {
          config.headers.Authorization = `Bearer ${this.token.accessToken}`
        }
        config.headers['X-Request-Time'] = new Date().toISOString()
        if (import.meta.env.DEV) {
          console.log(`🚀 [API] ${config.method?.toUpperCase()} ${config.url}`)
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    this.instance.interceptors.response.use(
      (response) => {
        if (import.meta.env.DEV) {
          const requestTime = response.config.headers['X-Request-Time']
          if (requestTime) {
            const duration = Date.now() - new Date(requestTime as string).getTime()
            console.log(`✅ [API] Response in ${duration}ms`)
          }
        }
        return response.data
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
        if (error.response?.status === 401 && !originalRequest._retry && this.token?.refreshToken) {
          originalRequest._retry = true
          if (!this.refreshPromise) {
            this.refreshPromise = this.refreshAccessToken()
          }
          try {
            const newTokens = await this.refreshPromise
            this.refreshPromise = null
            originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`
            return this.instance(originalRequest)
          } catch (refreshError) {
            this.handleAuthenticationError()
            return Promise.reject(refreshError)
          }
        }
        if (!error.response) {
          this.handleNetworkError(error)
        }
        this.handleApiError(error)
        return Promise.reject(error)
      }
    )
  }

  private async refreshAccessToken(): Promise<AuthTokens> {
    if (!this.token?.refreshToken) {
      throw new Error('No refresh token available')
    }

    try {
      const response = await axios.post(`${this.instance.defaults.baseURL}/auth/refresh`, {
        refreshToken: this.token.refreshToken,
      })

      const newTokens: AuthTokens = response.data
      this.setTokens(newTokens)
      this.subscribers.forEach((callback) => callback(newTokens.accessToken))
      this.subscribers = []

      return newTokens
    } catch (error) {
      this.clearTokens()
      throw error
    }
  }

  private handleAuthenticationError(): void {
    this.clearTokens()
    window.dispatchEvent(new CustomEvent('auth:logout'))
    window.location.href = '/login?expired=true'
  }

  private handleNetworkError(_error: AxiosError): void {
    // ← error ↦ _error
    window.dispatchEvent(
      new CustomEvent('api:network-error', {
        detail: { message: 'Network connection error. Please check your internet connection.' },
      })
    )
  }

  private handleApiError(error: AxiosError): void {
    const message = (error.response?.data as any)?.message || error.message
    const status = error.response?.status

    window.dispatchEvent(
      new CustomEvent('api:error', {
        detail: { message, status, endpoint: error.config?.url },
      })
    )
  }

  private loadTokenFromStorage(): void {
    const stored = localStorage.getItem('auth_tokens')
    if (stored) {
      try {
        this.token = JSON.parse(stored)
      } catch (e) {
        console.error('Failed to parse stored tokens', e)
      }
    }
  }

  public setTokens(tokens: AuthTokens): void {
    this.token = tokens
    localStorage.setItem('auth_tokens', JSON.stringify(tokens))
  }

  public clearTokens(): void {
    this.token = null
    localStorage.removeItem('auth_tokens')
  }

  public getTokens(): AuthTokens | null {
    return this.token
  }

  public get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.get<any, T>(url, config)
  }

  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.post<any, T>(url, data, config)
  }

  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.put<any, T>(url, data, config)
  }

  public patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.patch<any, T>(url, data, config)
  }

  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.instance.delete<any, T>(url, config)
  }

  public async upload(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<any> {
    const formData = new FormData()
    formData.append('file', file)

    return this.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (event) => {
        if (onProgress && event.total) {
          onProgress(Math.round((event.loaded * 100) / event.total))
        }
      },
    })
  }

  public createCancelToken() {
    return axios.CancelToken.source()
  }
}

let apiInstance: ApiClient | null = null

export function createApiClient(config: ApiConfig): ApiClient {
  if (!apiInstance) {
    apiInstance = new ApiClient(config)
  }
  return apiInstance
}

export function useApi(): ApiClient {
  if (!apiInstance) {
    throw new Error('API Client not initialized. Call createApiClient first.')
  }
  return apiInstance
}

export { AxiosError, type AxiosRequestConfig } from 'axios'
