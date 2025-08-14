'use client'

import { useQuery } from '@tanstack/react-query'
import { Pie, PieChart } from 'recharts'
import { getDeviceCategory } from '@/request/home'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/shadcn/ui/chart'

const chartConfig = {
  energy: {
    label: '能源设备',
    color: '#5D85FC',
  },
  environment: {
    label: '环境设备',
    color: '#80C9CB',
  },
  voice: {
    label: '音频设备',
    color: '#D7935C',
  },
  security: {
    label: '安防设备',
    color: '#C388FD',
  },
}

export function ChartPie() {
  const { data: rawData } = useQuery({
    queryKey: ['deviceCategory'],
    queryFn: getDeviceCategory,
  })

  const chartData = rawData?.map(item => ({
    ...item,
    fill: chartConfig[item.kind]?.color || '#8884d8',
  }))

  return (
    <ChartContainer
      config={chartConfig}
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent />}
        />
        <ChartLegend content={<ChartLegendContent />} verticalAlign="bottom" />
        <Pie
          data={chartData}
          dataKey="count"
          nameKey="kind"
          innerRadius="50%"
          outerRadius="80%"
          strokeWidth={5}
          cx="50%"
          cy="50%"
        />
      </PieChart>
    </ChartContainer>
  )
}
