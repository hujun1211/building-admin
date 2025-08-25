import request from "@/request/index";
import { urls } from "@/request/urls";

export interface AlarmItem {
	content: string;
	description: string;
}

export type OutLineInfoResponse = {
	device_unit: {
		count: number;
		trend: string;
		trend_count: number;
	};
	alarm_unit: {
		count: number;
		trend: string;
		trend_count: number;
	};
	property_unit: {
		terminals_count: number;
		spaces_count: number;
	};
	building_property_unit: {
		name: string;
		space_count: number;
		device_count: number;
		device_online_rate: number;
	}[];
	sensor_kind_unit: {
		kind: string;
		count: number;
	}[];
};

export function getOutLineInfo(): Promise<OutLineInfoResponse> {
	return request.get(urls.home.getOutLineInfo);
}

export function getAlarmInfo(): Promise<AlarmItem[]> {
	return request.get(urls.home.alarm);
}

interface getLivenessCountListParams {
	end_time?: string;
	time_unit?: string;
}
interface getLivenessCountListResponse {
	values: string[];
	times: string[];
}

export function getLivenessCountList(
	params: getLivenessCountListParams,
): Promise<getLivenessCountListResponse> {
	return request.get(urls.home.getLivenessCountList, { params });
}
