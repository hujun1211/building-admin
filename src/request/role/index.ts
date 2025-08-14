import request from '@/request'
import { urls } from '@/request/urls'

interface RoleTableParams {
  currentPage: number
  pageSize: number
  roleName: string
}

export interface RoleUser {
  id?: string
  roleName: string
  description: string
}

export interface RoleTableResponse {
  roleList: {
    records: RoleUser[]
    total: number
    current: number
    size: number
  }
}

interface rolePermissionResponse {
  check: string[]
  keyMap: Record<string, string>
}

export function getRoleTableList(data: RoleTableParams): Promise<RoleTableResponse> {
  return request.post(urls.role.roleTableList, {
    ...data,
  })
}

export function getRolePermission(roleName: string): Promise<rolePermissionResponse> {
  return request({
    url: urls.role.rolePermission,
    method: 'POST',
    data: {
      roleName,
    },
  })
}
