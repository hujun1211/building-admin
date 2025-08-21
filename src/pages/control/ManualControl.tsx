import { useMutation, useQuery } from "@tanstack/react-query";
import { Table } from "antd";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { ManualOperateParams } from "@/request/control";
import {
	getManualList,
	getManualOperateList,
	manualOperate,
} from "@/request/control";
import { Badge } from "@/shadcn/ui/badge";
import { Button } from "@/shadcn/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";
import type { PaginationType } from "@/types";

export default function ManualControl() {
	const columns = [
		{
			title: "资产编号",
			dataIndex: "property_id",
			key: "property_id",
			align: "center",
		},
		{
			title: "资产名称",
			dataIndex: "property_name",
			key: "property_name",
			align: "center",
		},
		{
			title: "使用状态",
			dataIndex: "is_used",
			key: "is_used",
			align: "center",
			render: (is_used: boolean) => {
				return is_used ? (
					<Badge className="bg-green-500">在用</Badge>
				) : (
					<Badge className="bg-red-500">停用</Badge>
				);
			},
		},
		{
			title: "活跃状态",
			dataIndex: "is_liveness",
			key: "is_liveness",
			align: "center",
			render: (is_liveness: boolean) => {
				return is_liveness ? (
					<Badge className="bg-green-500">在用</Badge>
				) : (
					<Badge className="bg-red-500">停用</Badge>
				);
			},
		},
		{
			title: "楼宇信息",
			dataIndex: "building",
			key: "building",
			align: "center",
		},
		{
			title: "空间信息",
			dataIndex: "space",
			key: "space",
			align: "center",
		},
		{
			title: "网关（智能箱）信息",
			dataIndex: "terminal",
			key: "terminal",
			align: "center",
		},
		{
			title: "操作",
			dataIndex: "operate",
			key: "operate",
			align: "center",
			render: (operate: { name: string; type: string }[], record: any) => {
				return (
					<DropdownMenu>
						<DropdownMenuTrigger>
							<div className="text-blue-500 underline cursor-pointer">操作</div>
						</DropdownMenuTrigger>
						<DropdownMenuContent
							side="left"
							sideOffset={-5}
							align="start"
							alignOffset={20}
						>
							{operate.map((item) => {
								return (
									<DropdownMenuItem key={item.name}>
										<div
											className="w-full text-center cursor-pointer"
											onClick={() =>
												handleOperate({
													property_id: record.property_id,
													control: item.type,
												})
											}
										>
											{item.name}
										</div>
									</DropdownMenuItem>
								);
							})}
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	// 表格分页
	const [pageParams, setPageParams] = useState<PaginationType>({
		current: 1,
		pageSize: 5,
		showSizeChanger: false,
	});
	function handlePaginationChange(pagination: PaginationType) {
		setPageParams(pagination);
	}

	// 请求表格数据
	const {
		data: manualList,
		isPending: isLoading,
		refetch,
		isError,
		error,
	} = useQuery({
		queryKey: ["getManualList", pageParams.current, pageParams.pageSize],
		queryFn: () =>
			getManualList({
				page: pageParams.current,
				page_size: pageParams.pageSize,
			}),
	});
	useEffect(() => {
		if (isError) {
			toast.error(error.message);
		}
	}, [isError]);
	// 设置分页
	useEffect(() => {
		if (manualList?.page?.totalSize) {
			setPageParams((prev) => ({
				...prev,
				total: manualList.page.totalSize,
			}));
		}
	}, [manualList]);

	// 控制
	const { mutate: manualOperateMutate } = useMutation({
		mutationFn: manualOperate,
	});
	function handleOperate({ property_id, control }: ManualOperateParams) {
		manualOperateMutate(
			{ property_id, control },
			{
				onSuccess: () => {
					toast.success("操作成功");
					refetch();
				},
				onError: (error) => {
					toast.error(error.message);
				},
			},
		);
	}

	return (
		<div>
			<Table
				dataSource={manualList?.manual || []}
				columns={columns}
				pagination={pageParams}
				onChange={handlePaginationChange}
				loading={isLoading}
				className="mt-2"
			/>
		</div>
	);
}
