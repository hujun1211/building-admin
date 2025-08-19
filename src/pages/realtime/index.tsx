import type { PaginationType } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { Pagination } from 'antd'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import { getOutlineInfo, getSensorList } from '@/request/realtime'
import { Card, CardContent } from '@/shadcn/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shadcn/ui/form'
import { Input } from '@/shadcn/ui/input'
import ChartLine from './chart-line'

export default function RealtimePage() {
  const { data: outlineInfo, isError, error } = useQuery({
    queryKey: ['getOutlineInfo'],
    queryFn: getOutlineInfo,
  })
  useEffect(() => {
    if (isError) {
      toast.error(error?.message)
    }
  }, [isError, error])

  const [pageParams, setPageParams] = useState<PaginationType>({ current: 1, pageSize: 4 })
  const { data: sensorList, isLoading } = useQuery({
    queryKey: ['getSensorList', pageParams],
    queryFn: () => getSensorList({
      page: pageParams.current,
      page_size: pageParams.pageSize,
    }),
  })
  useEffect(() => {
    if (sensorList?.page?.totalSize) {
      setPageParams(prev => ({
        ...prev,
        total: sensorList.page.totalSize,
      }))
    }
  }, [sensorList])

  const chartDataList = sensorList?.property.map((item) => {
    return {
      data: item.times.map((time, index) => ({
        time,
        value: item.values[index],
      })),
      name: item.name,
      field: item.field,
      property_id: item.property_id,
    }
  })

  const searchFormSchema = z.object({
    end_time: z.string().optional(), // 数据统计结束日期
    time_unit: z.string().optional(), // 统计范围（daily天 / week周 / month月）
    property_id: z.string().optional(), // 资产编号
    sensor_kind: z.string().optional(), // 传感器种类
    sensor_type: z.string().optional(), // 传感器类型
    is_used: z.string().optional(), // 启用状态（0 / 1）
  })
  const searchForm = useForm<z.infer<typeof searchFormSchema>>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      end_time: '',
      time_unit: '',
      property_id: '',
      sensor_kind: '',
      sensor_type: '',
      is_used: '',
    },
  })

  function pageChange(current: number, pageSize: number) {
    setPageParams({
      current,
      pageSize,
    })
  }

  return (
    <div className="p-5">
      <div className="grid grid-cols-6 gap-5">
        <Card className="h-30 w-full border-gray-100/50">
          <CardContent className="h-full">
            <div className="flex h-full flex-col items-center justify-center gap-2">
              <div>{outlineInfo?.building_count}</div>
              <div>楼宇数</div>
            </div>
          </CardContent>
        </Card>
        <Card className="h-30 w-full border-gray-100/50">
          <CardContent className="h-full">
            <div className="flex h-full flex-col items-center justify-center gap-2">
              <div>{outlineInfo?.space_count}</div>
              <div>空间数</div>
            </div>
          </CardContent>
        </Card>
        <Card className="h-30 w-full border-gray-100/50">
          <CardContent className="h-full">
            <div className="flex h-full flex-col items-center justify-center gap-2">
              <div>{outlineInfo?.terminal_count}</div>
              <div>终端数</div>
            </div>
          </CardContent>
        </Card>
        <Card className="h-30 w-full border-gray-100/50">
          <CardContent className="h-full">
            <div className="flex h-full flex-col items-center justify-center gap-2">
              <div>{outlineInfo?.sensor_count}</div>
              <div>设备数</div>
            </div>
          </CardContent>
        </Card>
        <Card className="h-30 w-full border-gray-100/50">
          <CardContent className="h-full">
            <div className="flex h-full flex-col items-center justify-center gap-2">
              <div>{outlineInfo?.online_count}</div>
              <div>在线设备</div>
            </div>
          </CardContent>
        </Card>
        <Card className="h-30 w-full border-gray-100/50">
          <CardContent className="h-full">
            <div className="flex h-full flex-col items-center justify-center gap-2">
              <div>{outlineInfo?.liveness_count}</div>
              <div>活跃设备</div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-10">
        <Form {...searchForm}>
          <form className="space-y-8">
            <div className="flex gap-5">
              <FormField
                control={searchForm.control}
                name="end_time"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormLabel>结束时间</FormLabel>
                    <div className="flex flex-col">
                      <FormControl>
                        <Input {...field} className="bg-white" />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={searchForm.control}
                name="property_id"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-3">
                    <FormLabel>资产编号</FormLabel>
                    <div className="flex flex-col">
                      <FormControl>
                        <Input {...field} className="bg-white" />
                      </FormControl>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-5">
        {
          chartDataList?.map((chartData, index) => (
            <ChartLine
              key={index}
              chartData={chartData.data}
              name={chartData.name}
              field={chartData.field}
            />
          ))
        }
        <Pagination
          current={pageParams.current}
          pageSize={pageParams.pageSize}
          total={pageParams.total}
          showSizeChanger={false}
          onChange={pageChange}
          showQuickJumper={true}
        />
      </div>
    </div>
  )
}
