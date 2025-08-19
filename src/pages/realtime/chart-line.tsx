import type { ChartConfig } from '@/shadcn/ui/chart'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shadcn/ui/chart'

interface ChartData {
  time: string
  value: number
}

export default function ChartLine({ chartData, name, field }: { chartData: ChartData[], name: string, field: string }) {
  const chartConfig = {
    value: {
      label: field,
      color: '#2563eb',
    },
  } satisfies ChartConfig

  return (
    <div>
      <h2 className="mb-2 text-lg font-semibold">{name}</h2>
      <ChartContainer config={chartConfig} className="h-60 w-full">
        <LineChart
          accessibilityLayer
          data={chartData}
          margin={{ top: 30, right: 50, bottom: 25, left: 0 }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="time"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            label={{ value: '时间', position: 'bottom', fontSize: 14, offset: 10 }}
          />
          <YAxis
            dataKey="value"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            fontSize={12}
            label={{ value: field, position: 'top', fontSize: 14, offset: 20 }}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line dataKey="value" />
        </LineChart>
      </ChartContainer>
    </div>
  )
}
