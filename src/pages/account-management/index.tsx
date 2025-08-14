import type { AccountTableListResponse } from '@/request/account'
import type { RoleUser } from '@/request/role'
import type { PaginationType } from '@/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Table } from 'antd'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { getAccountTableList, getRoleUserList } from '@/request/account'
import { Badge } from '@/shadcn/ui/badge'

export default function AccountManagementPage() {
  const columns = [
    {
      title: '账号名称',
      dataIndex: 'username',
      key: 'username',
      align: 'center',
    },
    {
      title: '账号别名',
      dataIndex: 'remarkName',
      key: 'remarkName',
      align: 'center',
    },
    {
      title: '登录手机',
      dataIndex: 'phone',
      key: 'phone',
      align: 'center',
    },
    {
      title: '所属角色',
      dataIndex: 'role',
      key: 'role',
      align: 'center',
      render: (_: any, record: any) => {
        const roleUserList = userRoleMap[record.username]
        if (roleUserList) {
          return (
            <div className="flex justify-center gap-5">
              {
                roleUserList.map(
                  (roleUser: RoleUser) =>
                    <Badge key={roleUser.roleName}>{roleUser.roleName}</Badge>,
                )
              }
            </div>
          )
        }
        else {
          return ''
        }
      },
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
    },
  ]

  // 表格数据源
  const [dataSource, setDataSource] = useState<any[]>([])

  // 分页
  const [pageParams, setPageParams] = useState<PaginationType>({
    current: 1,
    pageSize: 10,
    showSizeChanger: false,
  })
  function handlePaginationChange(pagination: PaginationType) {
    setPageParams(pagination)
  }

  // 初始请求表格数据
  const { isPending: tablePending, error: tableError, data: tableData, refetch: tableRefetch } = useQuery({
    queryKey: [
      'accountTableList',
      pageParams?.current,
      pageParams?.pageSize,
    ],
    queryFn: () => getAccountTableList({
      currentPage: pageParams.current,
      pageSize: pageParams.pageSize,
      username: '',
    }),
  })
  useEffect(() => {
    if (tableError) {
      toast.error(tableError.message)
    }
    if (tableData) {
      setDataSource(tableData.userInfoList)
      setPageParams({
        ...pageParams,
        total: tableData.page.totalSize,
      })
      getUserRoleMap(tableData)
    }
  }, [tableError, tableData])

  // 获取用户角色列表
  const { mutateAsync: roleUserMutateAsync } = useMutation({
    mutationFn: (username: string) => getRoleUserList(username),
  })
  // 账号角色
  const [userRoleMap, setUserRoleMap] = useState<Record<string, RoleUser[]>>({})
  async function getUserRoleMap(tableData: AccountTableListResponse) {
    const newMap: Record<string, RoleUser[]> = {}
    const promises = tableData.userInfoList.map(async (userInfo) => {
      const username = userInfo.username
      if (!newMap[username]) {
        const res = await roleUserMutateAsync(username)
        newMap[username] = res.roleList
      }
    })
    await Promise.all(promises)
    setUserRoleMap(newMap)
  }

  return (
    <div className="p-5">
      <Table
        dataSource={dataSource}
        columns={columns}
        loading={tablePending}
        pagination={pageParams}
        onChange={handlePaginationChange}
      />
    </div>
  )
}
