import type { ManualOperateParams } from '@/request/control'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Table } from 'antd'
import { useState } from 'react'
import { toast } from 'sonner'
import { getManualList, getManualOperateList, manualOperate } from '@/request/control'
import { Badge } from '@/shadcn/ui/badge'
import { Button } from '@/shadcn/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/shadcn/ui/dropdown-menu'

export default function ManualControl() {
  const columns = [
    {
      title: 'property_id',
      dataIndex: 'property_id',
      key: 'property_id',
      align: 'center',
    },
    {
      title: 'property_type',
      dataIndex: 'property_type',
      key: 'property_type',
      align: 'center',
    },
    {
      title: 'property_name',
      dataIndex: 'property_name',
      key: 'property_name',
      align: 'center',
    },
    {
      title: 'is_used',
      dataIndex: 'is_used',
      key: 'is_used',
      align: 'center',
      render: (is_used: boolean) => {
        return is_used
          ? <Badge className="bg-green-500">在用</Badge>
          : <Badge className="bg-red-500">停用</Badge>
      },
    },
    {
      title: 'is_liveness',
      dataIndex: 'is_liveness',
      key: 'is_liveness',
      align: 'center',
      render: (is_liveness: boolean) => {
        return is_liveness
          ? <Badge className="bg-green-500">在用</Badge>
          : <Badge className="bg-red-500">停用</Badge>
      },
    },
    {
      title: 'building',
      dataIndex: 'building',
      key: 'building',
      align: 'center',
    },
    {
      title: 'space',
      dataIndex: 'space',
      key: 'space',
      align: 'center',
    },
    {
      title: 'terminal',
      dataIndex: 'terminal',
      key: 'terminal',
      align: 'center',
    },
    {
      title: 'control',
      dataIndex: 'control',
      key: 'control',
      align: 'center',
    },
    {
      title: 'sensor',
      dataIndex: 'sensor',
      key: 'sensor',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      render: (_: any, record: any) => {
        return (
          <DropdownMenu onOpenChange={value => handleOperateClick(value, record.property_id)}>
            <DropdownMenuTrigger>控制</DropdownMenuTrigger>
            <DropdownMenuContent>
              {
                controlDropDownItems.map((item) => {
                  return (
                    <DropdownMenuItem key={item}>
                      <div className="w-full" onClick={() => handleOperate({ property_id: record.property_id, control: item })}>
                        {item}
                      </div>
                    </DropdownMenuItem>
                  )
                })
              }
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  // 请求表格数据
  const { data: manualList, isPending: isLoading, refetch } = useQuery({
    queryKey: ['getManualList'],
    queryFn: () => getManualList(),
  })

  // 获取操作列表
  const { mutate: getManualOperateListMutate } = useMutation({
    mutationFn: getManualOperateList,
  })
  const [controlDropDownItems, setControlDropDownItems] = useState<string[]>([])
  function handleOperateClick(value: boolean, property_id: string) {
    if (value) {
      getManualOperateListMutate(property_id, {
        onSuccess: (data) => {
          setControlDropDownItems(data)
        },
        onError: (error) => {
          toast.error(error.message)
        },
      })
    }
  }

  // 控制
  const { mutate: manualOperateMutate } = useMutation({
    mutationFn: manualOperate,
  })
  function handleOperate({ property_id, control }: ManualOperateParams) {
    manualOperateMutate({ property_id, control }, {
      onSuccess: () => {
        toast.success('操作成功')
        refetch()
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  }

  return (
    <div>
      <Table
        dataSource={manualList?.manual || []}
        columns={columns}
        loading={isLoading}
        className="mt-2"
      />
    </div>
  )
}
