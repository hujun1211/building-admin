import request from "@/request";
import { urls } from "@/request/urls";

export function getTaskInterVal(): Promise<number> {
	return request.get(urls.settings.getTaskInterVal);
}

export function setTaskInterVal(data: { seconds: number }): Promise<void> {
	return request.post(urls.settings.setTaskInterVal, data);
}
