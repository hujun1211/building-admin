import request from '@/request'
import { urls } from '@/request/urls'

interface RegulationItem {
  rule_id: string
  t_property_id: string
  t_kind: string
  t_type: string
  c_property_id: string
  c_kind: string
  c_type: string
  trigger: string
  control: string
  is_used: string // TODO
}
interface RegulationListResponse {
  page: {
    pageNum: number
    pageSize: number
    totalSize: number
  }
  regulation: RegulationItem[]
}

interface ManualItem {
  property_id: string
  property_type: string
  property_name: string
  is_used: string
  is_liveness: string
  building: string
  space: string
  terminal: string
  sensor: string
}
interface ManualListResponse {
  page: {
    pageNum: number
    pageSize: number
    totalSize: number
  }
  manual: ManualItem[]
}

export interface ManualOperateParams {
  property_id: string
  control: string
}

// 控制规则列表
export function getRegulationList(): Promise<RegulationListResponse> {
  return request.get(urls.control.getRegulationList)
}

// 手动控制
export function getManualList(): Promise<ManualListResponse> {
  return request.get(urls.control.getManualList)
}

export function getManualOperateList(property_id: string): Promise<string[]> {
  return request.get(urls.control.getManualOperateList, {
    params: {
      property_id,
    },
  })
}

export function manualOperate({ property_id, control }: ManualOperateParams) {
  return request.get(urls.control.manualOperate, {
    params: {
      property_id,
      control,
    },
  })
}
