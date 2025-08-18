import { useQuery } from '@tanstack/react-query'
import { ArrowDown, ArrowUp } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { getAlarm, getAlarmCount, getOnlineUnit, getPropertyCount } from '@/request/home'
import { Button } from '@/shadcn/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/shadcn/ui/card'
import { Tabs, TabsList, TabsTrigger } from '@/shadcn/ui/tabs'
import { ChartLine } from './chart-line'
import { ChartPie } from './chart-pie'
import { BuildingTable } from './table'

export default function HomePage() {
  const { data: onlineUnit } = useQuery({
    queryKey: ['onlineUnit'],
    queryFn: getOnlineUnit,
  })

  const { data: propertyCount } = useQuery({
    queryKey: ['propertyCount'],
    queryFn: getPropertyCount,
  })

  const { data: alarmCount } = useQuery({
    queryKey: ['alarmCount'],
    queryFn: getAlarmCount,
  })

  const [lineChartType, setLineChartType] = useState<'day' | 'week' | 'month'>('day')

  const { data: alarm } = useQuery({
    queryKey: ['alarm'],
    queryFn: getAlarm,
  })

  return (
    <div className="p-5">
      <div className="grid grid-cols-3 gap-5">
        <Card className="h-35 w-full border-gray-100/50">
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-xl text-gray-500">在线设备</div>
              <div className={`flex items-center text-sm ${onlineUnit?.trend === 'decrease' ? 'text-green-500' : 'text-red-500'}`}>
                {
                  onlineUnit?.trend === 'decrease' ? <ArrowDown className="mr-1" /> : <ArrowUp className="mr-1" />
                }
                <span>
                  {onlineUnit?.trend_count}
                  %
                </span>
                <span className="ml-2">较昨日</span>
              </div>
            </div>
            <div className="mt-5 text-4xl font-semibold">{onlineUnit?.count}</div>
          </CardContent>
        </Card>
        <Card className="h-35 w-full border-gray-100/50">
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-xl text-gray-500">预警数量</div>
              <div className={`flex items-center text-sm ${alarmCount?.trend === 'decrease' ? 'text-green-500' : 'text-red-500'}`}>
                {
                  alarmCount?.trend === 'decrease' ? <ArrowDown className="mr-1" /> : <ArrowUp className="mr-1" />
                }
                <span>
                  {alarmCount?.trend_count}
                  %
                </span>
                <span className="ml-2">较昨日</span>
              </div>
            </div>
            <div className="mt-5 text-4xl font-semibold">{alarmCount?.count}</div>
          </CardContent>
        </Card>
        <Card className="h-35 w-full border-gray-100/50">
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-xl text-gray-500">房间/空间总数</div>
              <div className="text-sm text-gray-500">
                含
                <span className="mx-1 text-red-500">{propertyCount?.terminals_count}</span>
                个网关（智能箱子）
              </div>
            </div>
            <div className="mt-5 text-4xl font-semibold">{propertyCount?.spaces_count}</div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-5 grid grid-cols-3 gap-5">
        <Card className="col-span-2 border-gray-100/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>活跃设备数量趋势</CardTitle>
            <Tabs defaultValue="day" onValueChange={value => setLineChartType(value as 'day' | 'week' | 'month')}>
              <TabsList>
                <TabsTrigger value="day">日</TabsTrigger>
                <TabsTrigger value="week">周</TabsTrigger>
                <TabsTrigger value="month">月</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <ChartLine type={lineChartType} />
          </CardContent>
        </Card>
        <Card className="col-span-1 h-full rounded-2xl">
          <CardHeader>
            <CardTitle>预警信息</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              {alarm?.slice(0, 3).map((item, index: number) => (
                <div key={index} className="rounded-lg border-l-4 border-red-500 bg-red-100 p-4 text-red-700" role="alert">
                  <p className="font-bold">{item.content}</p>
                  <p>{item.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-5 grid h-100 grid-cols-3 gap-5">
        <Card className="col-span-2 h-full border-gray-100/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>楼宇资产分布</CardTitle>
              <Button variant="link" className="text-blue-500">
                <Link to="/property">新增资产</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <BuildingTable />
          </CardContent>
        </Card>
        <Card className="col-span-1 h-full border-gray-100/50">
          <CardHeader>
            <CardTitle>设备类型统计</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartPie />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
