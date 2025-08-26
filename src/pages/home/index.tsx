import { useQuery } from "@tanstack/react-query";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router";
import { getAlarmInfo, getOutLineInfo } from "@/request/home";
import { getTaskInterVal } from "@/request/settings";
import { Button } from "@/shadcn/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shadcn/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import { ChartLine } from "./chart-line";
import { ChartPie } from "./chart-pie";
import { BuildingTable } from "./table";

export default function HomePage() {
	// 设备信息概览
	const { data: outlineInfo } = useQuery({
		queryKey: ["getOutLineInfo"],
		queryFn: getOutLineInfo,
	});
	const { device_unit, alarm_unit, property_unit, building_property_unit, sensor_kind_unit } = outlineInfo || {}

	// 预警信息
	const { data: alarmInfo } = useQuery({
		queryKey: ["alarm"],
		queryFn: getAlarmInfo,
	});

	// 任务间隔
	const { data: taskInterVal } = useQuery({
		queryKey: ["getTaskInterVal"],
		queryFn: getTaskInterVal,
	});

	// 折线图类型切换
	const [lineChartType, setLineChartType] = useState<"daily" | "week" | "month">(
		"daily",
	);

	return (
		<div className="p-5">
			<div className="gap-5 grid grid-cols-3">
				<Card className="border-gray-100/50 w-full h-35">
					<CardContent className="space-y-5">
						<div className="flex justify-between items-center">
							<div className="text-gray-500 text-xl">在线设备</div>
							<div
								className={`flex items-center ${device_unit?.trend === "decrease" ? "text-green-500" : "text-red-500"}`}
							>
								<span>
									{device_unit?.trend === "decrease" ? (
										<ArrowDown size={24} />
									) : (
										<ArrowUp size={24} />
									)}
								</span>
								<span className="text-xl">{device_unit?.trend_count}%</span>
								<span className="ml-2 text-sm">较昨日</span>
							</div>
						</div>
						<div className="font-semibold text-4xl">
							{device_unit?.count}
						</div>
					</CardContent>
				</Card>
				<Card className="border-gray-100/50 w-full h-35">
					<CardContent>
						<div className="flex justify-between items-center">
							<div className="text-gray-500 text-xl">预警数量</div>
							<div
								className={`flex items-center ${alarm_unit?.trend === "decrease" ? "text-green-500" : "text-red-500"}`}
							>
								{alarm_unit?.trend === "decrease" ? (
									<ArrowDown size={24} />
								) : (
									<ArrowUp size={24} />
								)}
								<span className="text-xl">{alarm_unit?.trend_count}%</span>
								<span className="ml-2 text-sm">较昨日</span>
							</div>
						</div>
						<div className="mt-5 font-semibold text-4xl">
							{alarm_unit?.count}
						</div>
					</CardContent>
				</Card>
				<Card className="border-gray-100/50 w-full h-35">
					<CardContent>
						<div className="flex justify-between items-center">
							<div className="text-gray-500 text-xl">房间/空间总数</div>
							<div className="text-gray-500 text-sm">
								含
								<span className="mx-1 text-red-500">
									{property_unit?.terminals_count}
								</span>
								个网关（智能箱子）
							</div>
						</div>
						<div className="mt-5 font-semibold text-4xl">
							{property_unit?.spaces_count}
						</div>
					</CardContent>
				</Card>
			</div>
			<div className="gap-5 grid grid-cols-3 mt-5">
				<Card className="col-span-2 border-gray-100/50">
					<CardHeader className="flex flex-row justify-between items-center">
						<CardTitle>
							<span>活跃设备数量趋势（</span>
							<span className="text-red-500">{taskInterVal}</span>
							<span>秒内设备数据有变化视为活跃）</span>
							<NavLink
								to="/settings"
								className="ml-2 font-normal text-blue-500 text-sm underline"
							>
								活跃规则
							</NavLink>
						</CardTitle>
						<Tabs
							defaultValue="daily"
							onValueChange={(value) =>
								setLineChartType(value as "daily" | "week" | "month")
							}
						>
							<TabsList>
								<TabsTrigger value="daily">日</TabsTrigger>
								<TabsTrigger value="week">周</TabsTrigger>
								<TabsTrigger value="month">月</TabsTrigger>
							</TabsList>
						</Tabs>
					</CardHeader>
					<CardContent>
						<ChartLine type={lineChartType} />
					</CardContent>
				</Card>
				<Card className="col-span-1 rounded-2xl h-full">
					<CardHeader>
						<CardTitle>预警信息</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="flex flex-col gap-2">
							{alarmInfo?.slice(0, 3).map((item, index: number) => (
								<div
									key={item.content}
									className="bg-red-100 p-4 border-red-500 border-l-4 rounded-lg text-red-700"
									role="alert"
								>
									<p className="font-bold">{item.content}</p>
									<p>{item.description}</p>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
			<div className="gap-5 grid grid-cols-3 mt-5 h-100">
				<Card className="col-span-2 border-gray-100/50 h-full">
					<CardHeader>
						<div className="flex justify-between items-center">
							<CardTitle>楼宇资产分布</CardTitle>
							<Button variant="link" className="text-blue-500">
								<Link to="/property">新增资产</Link>
							</Button>
						</div>
					</CardHeader>
					<CardContent>
						<BuildingTable tableData={building_property_unit} />
					</CardContent>
				</Card>
				<Card className="col-span-1 border-gray-100/50 h-full">
					<CardHeader>
						<CardTitle>设备类型统计</CardTitle>
					</CardHeader>
					<CardContent>
						<ChartPie pieData={sensor_kind_unit} />
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
