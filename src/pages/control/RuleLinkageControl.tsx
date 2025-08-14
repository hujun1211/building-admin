import { useQuery } from '@tanstack/react-query'
import { Table } from 'antd'
import { getRegulationList } from '@/request/control'
import { Badge } from '@/shadcn/ui/badge'

export default function RuleLinkageControl() {
  const columns = [
    {
      title: 'rule_id',
      dataIndex: 'rule_id',
      key: 'rule_id',
      align: 'center',
    },
    {
      title: 't_property_id',
      dataIndex: 't_property_id',
      key: 't_property_id',
      align: 'center',
    },
    {
      title: 't_kind',
      dataIndex: 't_kind',
      key: 't_kind',
      align: 'center',
    },
    {
      title: 't_type',
      dataIndex: 't_type',
      key: 't_type',
      align: 'center',
    },
    {
      title: 'c_property_id',
      dataIndex: 'c_property_id',
      key: 'c_property_id',
      align: 'center',
    },
    {
      title: 'c_kind',
      dataIndex: 'c_kind',
      key: 'c_kind',
      align: 'center',
    },
    {
      title: 'c_type',
      dataIndex: 'c_type',
      key: 'c_type',
      align: 'center',
    },
    {
      title: 'trigger',
      dataIndex: 'trigger',
      key: 'trigger',
      align: 'center',
    },
    {
      title: 'control',
      dataIndex: 'control',
      key: 'control',
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
  ]

  // 请求表格数据
  const { data: ruleLinkageList, isPending: isLoading, refetch } = useQuery({
    queryKey: ['ruleLinkage'],
    queryFn: () => getRegulationList(),
  })

  return (
    <div>
      <Table
        dataSource={ruleLinkageList?.regulation || []}
        columns={columns}
        loading={isLoading}
        className="mt-2"
      />
    </div>
  )
}
