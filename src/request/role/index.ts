import request from "@/request";
import { urls } from "@/request/urls";

interface RoleTableParams {
	currentPage: number;
	pageSize: number;
	roleName: string;
}

export interface RoleUser {
	id?: string;
	roleName: string;
	description: string;
}

export interface RoleTableResponse {
	roleList: {
		records: RoleUser[];
		total: number;
		current: number;
		size: number;
	};
}

interface TreeNode {
	title: string;
	key: string;
	children?: TreeNode[];
}

interface rolePermissionResponse {
	check: string[];
	keyMap: Record<string, string>;
	data: TreeNode[];
}

// 角色表格
export function getRoleTableList(
	data: RoleTableParams,
): Promise<RoleTableResponse> {
	return request.post(urls.role.roleTableList, data);
}

// 角色权限
export function getRolePermission(
	roleName: string,
): Promise<rolePermissionResponse> {
	return request({
		url: urls.role.rolePermission,
		method: "POST",
		data: {
			roleName,
		},
	});
}

// 删除角色
export function deleteRole(roleName: string) {
	return request({
		url: urls.role.roleDelete,
		method: "POST",
		data: {
			roleName,
		},
	});
}

// 新增角色
export function addRole(data: RoleUser) {
	return request.post(urls.role.roleAdd, {
		...data,
		group: "test", // 暂时写死
	});
}

// 更新角色
export function updateRole(data: RoleUser) {
	return request.post(urls.role.roleUpdate, data);
}

// 更新角色权限
interface UpdateRolePermissionParams {
	roleName: string;
	buildingMenuPermissions: {
		resourceType: string;
		permissionName: string;
		department: string;
	}[];
	dataPermissions: [];
	applicationPermissions: [];
	etlPermissions: [];
	tablePermissions: [];
	equipPermissions: [];
	filePermissions: [];
	menuPermissions: [];
}
export function updateRolePermission(data: UpdateRolePermissionParams) {
	return request.post(urls.role.rolePermissionUpdate, data);
}
