import type { ChartConfig } from '@/shadcn/ui/chart'
import { useQuery } from '@tanstack/react-query'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { getActiveUnitTrendDay, getActiveUnitTrendMonth, getActiveUnitTrendWeek } from '@/request/home'
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from '@/shadcn/ui/chart'

const chartConfig = {
  value: {
    label: '活跃设备数量',
    color: '#2563eb',
  },
} satisfies ChartConfig

export function ChartLine({ type }: { type: 'day' | 'week' | 'month' }) {
  const { data: chartDataDay } = useQuery({
    queryKey: ['activeUnitTrendDay'],
    queryFn: getActiveUnitTrendDay,
  })

  const { data: chartDataWeek } = useQuery({
    queryKey: ['activeUnitTrendWeek'],
    queryFn: getActiveUnitTrendWeek,
  })

  const { data: chartDataMonth } = useQuery({
    queryKey: ['activeUnitTrendMonth'],
    queryFn: getActiveUnitTrendMonth,
  })

  const chartDataMap = {
    day: chartDataDay,
    week: chartDataWeek,
    month: chartDataMonth,
  }

  return (
    <ChartContainer config={chartConfig} className="h-80 w-full">
      <LineChart accessibilityLayer data={chartDataMap[type]}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="time"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <YAxis
          dataKey="value"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          fontSize={12}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Line dataKey="value" />
      </LineChart>
    </ChartContainer>
  )
}
