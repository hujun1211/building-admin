import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { TreeDataNode, TreeProps } from "antd";
import { Popconfirm, Table, Tree } from "antd";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import type { RoleTableResponse, RoleUser } from "@/request/role";
import {
	addRole,
	deleteRole,
	getRolePermission,
	getRoleTableList,
	updateRole,
	updateRolePermission,
} from "@/request/role";
import { Badge } from "@/shadcn/ui/badge";
import { Button } from "@/shadcn/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/shadcn/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/shadcn/ui/form";
import { Input } from "@/shadcn/ui/input";
import type { PaginationType } from "@/types";

export default function RolePage() {
	// 定义表格列
	const columns = [
		{
			title: "角色名称",
			dataIndex: "roleName",
			key: "roleName",
			align: "center",
		},
		{
			title: "角色描述",
			dataIndex: "description",
			key: "description",
			align: "center",
		},
		{
			title: "角色权限",
			dataIndex: "permission",
			key: "permission",
			align: "center",
			render: (_: any, record: RoleUser) => {
				const rolePermissionList = rolePermissionMap[record.roleName];
				if (rolePermissionList) {
					return (
						<div className="flex justify-center gap-2">
							{rolePermissionList.map((rolePermission: string, index) => (
								<Badge key={index}>{roleKeyMap[rolePermission]}</Badge>
							))}
						</div>
					);
				} else {
					return "";
				}
			},
		},
		{
			title: "操作",
			key: "action",
			align: "center",
			render: (_: any, record: RoleUser) => (
				<div>
					<Button
						variant="link"
						className="text-blue-500 cursor-pointer"
						onClick={() => handleOpenUpdateDialog(record)}
					>
						编辑
					</Button>
					<Popconfirm
						title="确定删除这个角色吗?"
						onConfirm={() => handleDelete(record.roleName)}
						okText="确定"
						cancelText="取消"
					>
						<Button variant="link" className="cursor-pointer">
							删除
						</Button>
					</Popconfirm>
				</div>
			),
		},
	];
	// 数据源
	const [dataSource, setDataSource] = useState<RoleUser[]>([]);
	// 分页
	const [pageParams, setPageParams] = useState<PaginationType>({
		current: 1,
		pageSize: 10,
		showSizeChanger: false,
	});
	function handlePaginationChange(pagination: PaginationType) {
		setPageParams(pagination);
	}

	// 表格请求
	const {
		isPending: tablePending,
		error: tableError,
		data: tableData,
		refetch: tableRefetch,
	} = useQuery({
		queryKey: ["roleTableList", pageParams?.current, pageParams?.pageSize],
		queryFn: () =>
			getRoleTableList({
				currentPage: pageParams.current,
				pageSize: pageParams.pageSize,
				roleName: "",
			}),
	});
	// 设置分页
	useEffect(() => {
		if (tableError) {
			toast.error(tableError.message);
		}
		if (tableData) {
			setDataSource(tableData.roleList.records);
			setPageParams({
				...pageParams,
				total: tableData.roleList.total,
			});
			getRolePermissionMap(tableData);
			getRolePermissionKeyMap();
		}
	}, [tableError, tableData]);

	// 角色权限
	const { mutate: roleUserMutate, mutateAsync: roleUserMutateAsync } =
		useMutation({
			mutationFn: getRolePermission,
		});
	// 获取权限的keyMap
	const [roleKeyMap, setRoleKeyMap] = useState<Record<string, string>>({});
	const [rolePermissionTreeData, setRolePermissionTreeData] = useState<
		TreeDataNode[]
	>([]);

	function getRolePermissionKeyMap() {
		roleUserMutate("", {
			onSuccess: (res) => {
				setRoleKeyMap(res.keyMap);
				setRolePermissionTreeData(res.data);
			},
			onError: (error) => {
				toast.error(error.message);
			},
		});
	}

	// 表格每一行的角色权限
	const [rolePermissionMap, setRolePermissionMap] = useState<
		Record<string, string[]>
	>({});
	async function getRolePermissionMap(tableData: RoleTableResponse) {
		const newMap: Record<string, string[]> = {};
		const recordsMap = tableData.roleList.records;
		const promises = recordsMap.map(async (record) => {
			const roleName = record.roleName;
			if (!newMap[roleName]) {
				const res = await roleUserMutateAsync(roleName);
				newMap[roleName] = res.check;
			}
		});
		await Promise.all(promises);
		setRolePermissionMap(newMap);
	}

	// 删除角色
	const { mutate: deleteRoleMutate } = useMutation({
		mutationFn: deleteRole,
	});
	function handleDelete(roleName: string) {
		deleteRoleMutate(roleName, {
			onSuccess: () => {
				toast.success("删除成功");
				tableRefetch();
			},
			onError: (error) => {
				toast.error(error.message);
			},
		});
		tableRefetch();
	}

	// 打开Dialog
	const [addOrUpdate, setAddOrUpdate] = useState("add");
	const [dialogOpen, setDialogOpen] = useState(false);

	function onDialogOpenChange(open: boolean) {
		setDialogOpen(open);
		if (!open) {
			roleForm.reset({
				roleName: "",
				description: "",
			});
		}
	}

	// 表单
	const roleFormSchema = z.object({
		roleName: z.string().min(1, "不能为空"),
		description: z.string().min(1, "不能为空"),
	});
	const roleForm = useForm<z.infer<typeof roleFormSchema>>({
		resolver: zodResolver(roleFormSchema),
		defaultValues: {
			roleName: "",
			description: "",
		},
	});

	// 新增角色
	const { mutateAsync: addRoleMutate } = useMutation({
		mutationFn: addRole,
	});
	function handleOpenAddDialog() {
		setAddOrUpdate("add");
		setDialogOpen(true);
	}

	// 更新角色
	const { mutateAsync: updateRoleMutate } = useMutation({
		mutationFn: updateRole,
	});
	function handleOpenUpdateDialog(record: any) {
		setAddOrUpdate("update");
		setDialogOpen(true);
		roleForm.reset(record);
		setCheckedKeys(rolePermissionMap[record.roleName]);
	}

	// 更新角色权限
	const { mutateAsync: updateRolePermissionMutate } = useMutation({
		mutationFn: updateRolePermission,
	});

	// 提交表单
	function handleOK() {
		roleForm.handleSubmit(onSubmit)();
	}
	async function onSubmit(values: z.infer<typeof roleFormSchema>) {
		const buildingMenuPermissions = checkedKeys.map((value) => {
			return {
				resourceType: value,
				permissionName: roleKeyMap[value],
				department: "test",
			};
		});

		if (addOrUpdate === "add") {
			try {
				await addRoleMutate(values);
				await updateRolePermissionMutate({
					roleName: values.roleName,
					buildingMenuPermissions,
					dataPermissions: [],
					applicationPermissions: [],
					etlPermissions: [],
					tablePermissions: [],
					equipPermissions: [],
					filePermissions: [],
					menuPermissions: [],
				});
				setDialogOpen(false);
				toast.success("新增成功");
				roleForm.reset();
				tableRefetch();
			} catch (error: any) {
				toast.error(error.message);
			}
		} else {
			try {
				await updateRoleMutate(values);
				await updateRolePermissionMutate({
					roleName: values.roleName,
					buildingMenuPermissions,
					dataPermissions: [],
					applicationPermissions: [],
					etlPermissions: [],
					tablePermissions: [],
					equipPermissions: [],
					filePermissions: [],
					menuPermissions: [],
				});
				setDialogOpen(false);
				toast.success("更新成功");
				roleForm.reset();
				tableRefetch();
			} catch (error: any) {
				toast.error(error.message);
			}
		}
	}

	const [expandedKeys, setExpandedKeys] = useState<string[]>(["menu_building"]);
	const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true);

	function onExpand(expandedKeysValue: string[]) {
		setExpandedKeys(expandedKeysValue);
		setAutoExpandParent(false);
	}
	const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
	function onCheck(checkedKeysValue: string[]) {
		setCheckedKeys(checkedKeysValue);
	}

	return (
		<div className="p-5">
			<div className="mt-5">
				<Button
					className="flex justify-center items-center bg-blue-500 hover:bg-blue-400 rounded-lg w-25 h-10 text-white cursor-pointer"
					onClick={handleOpenAddDialog}
				>
					新增
				</Button>
			</div>

			<Table
				columns={columns}
				dataSource={dataSource}
				loading={tablePending}
				pagination={pageParams}
				onChange={handlePaginationChange}
			/>

			<Dialog open={dialogOpen} onOpenChange={onDialogOpenChange}>
				<DialogContent className="max-w-180!" showCloseButton={false}>
					<DialogClose className="top-3 right-3 absolute flex justify-center items-center bg-gray-200 hover:bg-gray-300 p-1 rounded-full cursor-pointer">
						<X className="w-4 h-4" />
					</DialogClose>
					<DialogHeader>
						{addOrUpdate === "add" ? (
							<DialogTitle>新增角色</DialogTitle>
						) : (
							<DialogTitle>更新角色</DialogTitle>
						)}
					</DialogHeader>
					<div className="mt-5">
						<Form {...roleForm}>
							<form className="space-y-7">
								<FormField
									control={roleForm.control}
									name="roleName"
									render={({ field }) => (
										<FormItem className="relative flex items-center gap-5">
											<FormLabel>角色名称</FormLabel>
											<div className="flex flex-col">
												<FormControl>
													<Input {...field} className="w-80 h-8" />
												</FormControl>
												<FormMessage className="bottom-0 absolute translate-y-full" />
											</div>
										</FormItem>
									)}
								/>
								<FormField
									control={roleForm.control}
									name="description"
									render={({ field }) => (
										<FormItem className="relative flex items-center gap-5">
											<FormLabel>角色描述</FormLabel>
											<div className="flex flex-col">
												<FormControl>
													<Input {...field} className="w-80 h-8" />
												</FormControl>
												<FormMessage className="bottom-0 absolute translate-y-full" />
											</div>
										</FormItem>
									)}
								/>
								<Tree
									checkable
									treeData={rolePermissionTreeData}
									onExpand={onExpand}
									expandedKeys={expandedKeys}
									autoExpandParent={autoExpandParent}
									checkedKeys={checkedKeys}
									onCheck={onCheck}
								/>
							</form>
						</Form>
					</div>
					<DialogFooter className="mt-10">
						<DialogClose asChild>
							<Button variant="outline" className="cursor-pointer">
								取消
							</Button>
						</DialogClose>
						<Button type="button" className="cursor-pointer" onClick={handleOK}>
							确定
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
