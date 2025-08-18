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

interface BindPropertyListParams {
  property_id?: string
  property_type?: string
}

export interface BindPropertyListItem {
  property_id: string
  name: string
  // 传感器参数
  kind?: string
  type?: string
}

export interface SensorKindItem {
  name: string
  kind: string
}

export interface SensorTypeItem {
  name: string
  type: string
}

// 资产列表
export function getPropertyList(params: propertyListParams): Promise<PropertyListResponse> {
  return request.get(urls.property.propertyList, {
    params,
  })
}

// 新增资产
export function addProperty(data: any) {
  return request.post(urls.property.addProperty, data)
}

// 获取可绑定的资产
export function getBindPropertyList(params: BindPropertyListParams): Promise<BindPropertyListItem[]> {
  return request.get(urls.property.getBindPropertyList, {
    params,
  })
}

// 获取传感器种类
export function getSensorKindList(): Promise<SensorKindItem[]> {
  return request.get(urls.property.getSensorKindList)
}

// 获取传感器类型
export function getSensorTypeList(): Promise<SensorTypeItem[]> {
  return request.get(urls.property.getSensorTypeList)
}

export function getPropertyDetails(property_id: string) {
  return request.get(urls.property.getPropertyDetails, {
    params: {
      property_id,
    },
  })
}

export function updateProperty(data: any) {
  return request.post(urls.property.updateProperty, data)
}
