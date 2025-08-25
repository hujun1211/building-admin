import request from "@/request";
import { urls } from "@/request/urls";

interface LogListParams {
	page: number;
	page_size: number;
	time?: string;
	operator?: string;
	log_type?: string;
}
interface LogListResponse {
	page: {
		pageNum: number;
		pageSize: number;
		totalSize: number;
	};
	log: {
		time: string;
		operator: string;
		type: string;
		content: string;
	}[];
}
// 日志管理
export function getLogList(params: LogListParams): Promise<LogListResponse> {
	return request.get(urls.log.getLogList, { params });
}

export function getLogTypeList(): Promise<{ type: string; name: string }[]> {
	return request.get(urls.log.getLogTypeList);
}

interface thresholdRoleListParams {
	page: number;
	page_size: number;
}
interface thresholdRoleListResponse {
	page: {
		pageNum: number;
		pageSize: number;
		totalSize: number;
	};
	thresholed: {
		rule_id: string;
		property_id: string;
		sensor_kind: string;
		sensor_type: string;
		max: number;
		min: number;
		is_used: string;
	}[];
}
// 预警规则
export function getThresholdRuleList(
	params: thresholdRoleListParams,
): Promise<thresholdRoleListResponse> {
	return request.get(urls.log.getThresholdRuleList, { params });
}

interface addThresholdRuleParams {
	sensor_property_id: string;
	field: string;
	max: number;
	min: number;
	is_used: string;
}
export function addThresholdRule(params: addThresholdRuleParams) {
	return request.post(urls.log.addThresholdRule, params);
}

export function updateThresholdRule(
	params: addThresholdRuleParams & { rule_id: string },
) {
	return request.post(urls.log.updateThresholdRule, params);
}

export function getThresholdRuleDetails(rule_id: string) {
	return request.get(urls.log.getThresholdRuleDetails, {
		params: {
			rule_id,
		},
	});
}
