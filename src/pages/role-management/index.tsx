import type { RoleTableResponse, RoleUser } from '@/request/role'
import type { PaginationType } from '@/types'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Table } from 'antd'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { getRolePermission, getRoleTableList } from '@/request/role'
import { Badge } from '@/shadcn/ui/badge'

export default function RoleManagementPage() {
  // 定义表格列
  const columns = [
    {
      title: '角色名称',
      dataIndex: 'roleName',
      key: 'roleName',
      align: 'center',
    },
    {
      title: '角色描述',
      dataIndex: 'description',
      key: 'description',
      align: 'center',
    },
    {
      title: '角色权限',
      dataIndex: 'permission',
      key: 'permission',
      align: 'center',
      render: (_: any, record: RoleUser) => {
        const rolePermissionList = rolePermissionMap[record.roleName]
        if (rolePermissionList) {
          return (
            <div className="flex justify-center gap-2">
              {
                rolePermissionList.map(
                  (rolePermission: string, index) => (
                    <Badge key={index}>
                      {roleKeyMap[rolePermission]}
                    </Badge>
                  ),
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
      // render: (_: any, record: RoleUser) => (
      //   <Space size="middle">
      //     <a onClick={() => handleEdit(record)}>编辑</a>
      //     <Popconfirm
      //       title="确定删除这个角色吗?"
      //       onConfirm={() => handleDelete(record.roleName)}
      //       okText="确定"
      //       cancelText="取消"
      //     >
      //       <a>删除</a>
      //     </Popconfirm>
      //   </Space>
      // ),
    },
  ]

  const [dataSource, setDataSource] = useState<RoleUser[]>([])
  // 分页
  const [pageParams, setPageParams] = useState<PaginationType>({
    current: 1,
    pageSize: 10,
    showSizeChanger: false,
  })
  function handlePaginationChange(pagination: PaginationType) {
    setPageParams(pagination)
  }

  const { isPending: tablePending, error: tableError, data: tableData, refetch: tableRefetch } = useQuery({
    queryKey: [
      'roleTableList',
      pageParams?.current,
      pageParams?.pageSize,
    ],
    queryFn: () =>
      getRoleTableList({ currentPage: pageParams.current, pageSize: pageParams.pageSize, roleName: '' }),
  })
  useEffect(() => {
    if (tableError) {
      toast.error(tableError.message)
    }
    if (tableData) {
      setDataSource(tableData.roleList.records)
      setPageParams({
        ...pageParams,
        total: tableData.roleList.total,
      })
      getRolePermissionMap(tableData)
      getRolePermissionKeyMap()
    }
  }, [tableError, tableData])

  // 角色权限
  const { mutate: roleUserMutate, mutateAsync: roleUserMutateAsync } = useMutation({
    mutationFn: getRolePermission,
  })
  // 获取权限的keyMap
  const [roleKeyMap, setRoleKeyMap] = useState<Record<string, string>>({})
  function getRolePermissionKeyMap() {
    roleUserMutate('', {
      onSuccess: (res) => {
        setRoleKeyMap(res.keyMap)
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  }

  // 表格每一行的角色权限
  const [rolePermissionMap, setRolePermissionMap] = useState<Record<string, string[]>>({})
  async function getRolePermissionMap(tableData: RoleTableResponse) {
    const newMap: Record<string, string[]> = {}
    const recordsMap = tableData.roleList.records
    const promises = recordsMap.map(async (record) => {
      const roleName = record.roleName
      if (!newMap[roleName]) {
        const res = await roleUserMutateAsync(roleName)
        newMap[roleName] = res.check
      }
    })
    await Promise.all(promises)
    setRolePermissionMap(newMap)
  }

  return (
    <div className="p-5">
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={tablePending}
        pagination={pageParams}
        onChange={handlePaginationChange}
      />
    </div>
  )
}
