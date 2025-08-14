import request from '@/request/index'
import { urls } from '@/request/urls'

interface UserInfo {
  username: string
  remark_name: string
  role_list: string[]
}

interface LoginParams {
  username: string
  password: string
}
interface LoginResponse {
  token: string
  tokenInfo: any
}

export type { LoginParams, LoginResponse, UserInfo }

// 登录
export function login(data: LoginParams): Promise<LoginResponse> {
  return request.post(urls.login.login, data)
}

// 退出
export function logout() {
  return request.post(urls.login.logout)
}
