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
export function getLogList(params: LogListParams): Promise<LogListResponse> {
	return request.get(urls.log.getLogList, { params });
}

export function getLogTypeList(): Promise<{ type: string; name: string }[]> {
	return request.get(urls.log.getLogTypeList);
}
