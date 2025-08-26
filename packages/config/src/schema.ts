export interface AppConfig {
  API_BASE_URL: string
  APP_NAME: string
}
export function validateEnv(env: Record<string, string | undefined>): AppConfig {
  const API_BASE_URL = env.VITE_API_BASE_URL || ''
  const APP_NAME = env.VITE_APP_NAME || 'My Portal'
  if (!API_BASE_URL) throw new Error('VITE_API_BASE_URL is required')
  return { API_BASE_URL, APP_NAME }
}
