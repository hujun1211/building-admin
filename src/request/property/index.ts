import request from '@/request/index'
import { urls } from '@/request/urls'

interface PropertyListItem {
  property_id: string // 资产编号
  property_name: string // 资产名称
  property_type: string // 资产类型
  is_used: boolean // 当前状态
  is_liveness: boolean // 活跃情况
  building: string // 楼宇
  space: string // 空间
  terminal: string // 终端
  sensor: string // 传感器
}

interface PropertyListResponse {
  page: {
    pageNum: number
    pageSize: number
    totalSize: number
  }
  property: PropertyListItem[]
}

interface propertyListParams {
  page: number
  page_size: number
  status?: string // 资产使用状态
  property_id?: string // 资产编号
  property_type?: string // 资产类型
  building_number?: string // 楼宇编号
  building_name?: string // 楼宇名称
  building_address?: string // 楼宇地址
  space_number?: string // 空间编号
  space_floor?: string // 空间楼层
  space_name?: string // 空间名称
  space_type?: string // 空间类型
  terminal_number?: string // 终端编号
  terminal_type?: string // 终端类型
  sensor_kind?: string // 传感器种类
  sensor_type?: string // 传感器型号
}

interface AddPropertyParams_Building {
  property_id: string // 资产编号
  name: string // 楼宇名称
  number?: string // 楼宇编号
  address?: string // 楼宇地址
  is_used?: string // 楼宇状态
  description?: string // 楼宇描述
}

export function getPropertyList(params: propertyListParams): Promise<PropertyListResponse> {
  return request.get(urls.property.propertyList, {
    params,
  })
}

export function addProperty(data: AddPropertyParams_Building) {
  return request.post(urls.property.addProperty, data)
}
