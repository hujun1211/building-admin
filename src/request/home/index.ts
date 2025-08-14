import request from '@/request/index'
import { urls } from '@/request/urls'

interface OnlineUnitResponse {
  count: number
  trend: string
  trend_count: number
}

interface AlarmCountResponse {
  count: number
  trend: string
  trend_count: number
}

interface PropertyCountResponse {
  terminals_count: number
  spaces_count: number
}

export interface ActiveUnitTrend {
  time: string
  value: number
}

export interface AlarmItem {
  content: string
  description: string
}

export interface PropertyItem {
  name: string
  space_count: number
  device_count: number
  device_online_rate: number
}

export function getOnlineUnit(): Promise<OnlineUnitResponse> {
  return request.get(urls.home.onlineUnit)
}

export function getAlarmCount(): Promise<AlarmCountResponse> {
  return request.get(urls.home.alarmCount)
}

export function getPropertyCount(): Promise<PropertyCountResponse> {
  return request.get(urls.home.propertyCount)
}

export function getActiveUnitTrendDay(): Promise<ActiveUnitTrend[]> {
  return request.get(urls.home.vitality_day)
}

export function getActiveUnitTrendWeek(): Promise<ActiveUnitTrend[]> {
  return request.get(urls.home.vitality_week)
}

export function getActiveUnitTrendMonth(): Promise<ActiveUnitTrend[]> {
  return request.get(urls.home.vitality_month)
}

export function getAlarm(): Promise<AlarmItem[]> {
  return request.get(urls.home.alarm)
}

export function getPropertyList(): Promise<PropertyItem[]> {
  return request.get(urls.home.propertyList)
}

export function getSensorKind(): Promise<string[]> {
  return request.get(urls.home.sensor_kind)
}

export interface DeviceCategory {
  kind: string
  count: number
}

export function getDeviceCategory(): Promise<DeviceCategory[]> {
  return request.get(urls.home.sensor_kind)
}
