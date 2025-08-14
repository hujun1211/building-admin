import type { RoleUser } from '@/request/role'
import request from '@/request'
import { urls } from '@/request/urls'

interface AccountTableListParams {
  currentPage: number
  pageSize: number
  username: string
}

export interface AccountTableListResponse {
  userInfoList: any[]
  page: {
    currentPage: number
    pageSize: number
    totalSize: number
  }
}

export function getAccountTableList(data: AccountTableListParams): Promise<AccountTableListResponse> {
  return request({
    url: urls.account.accountTableList,
    method: 'POST',
    data,
  })
}

export function getRoleUserList(username: string): Promise<{ roleList: RoleUser[] }> {
  return request({
    url: urls.account.roleUserList,
    method: 'POST',
    data: {
      username,
    },
  })
}
