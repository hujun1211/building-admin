import AccountManagement from '@/pages/account-management'
import Control from '@/pages/control'
import Home from '@/pages/home'
import LogManagement from '@/pages/log-management'
import Personal from '@/pages/personal'
import Property from '@/pages/property'
import RealtimeData from '@/pages/realtime-data'
import RoleManagement from '@/pages/role-management'
import SystemSettings from '@/pages/system-settings'
import TeachingResearch from '@/pages/teaching-research'

const sidebarItems = [
  {
    title: '首页',
    path: '/',
    icon: 'house',
    element: <Home />,
  },
  {
    title: '楼宇资产',
    path: '/property',
    icon: 'building',
    element: <Property />,
  },
  {
    title: '楼宇管控',
    path: '/control',
    icon: 'building-2',
    element: <Control />,
  },
  {
    title: '实时数据',
    path: '/realtime-data',
    icon: 'chart-line',
    element: <RealtimeData />,
  },
  {
    title: '日志管理',
    path: '/log-management',
    icon: 'file-text',
    element: <LogManagement />,
  },
  {
    title: '教学科研',
    path: '/teaching-research',
    icon: 'book',
    element: <TeachingResearch />,
  },
  {
    title: '角色管理',
    path: '/role',
    icon: 'users',
    element: <RoleManagement />,
  },
  {
    title: '账号管理',
    path: '/account',
    icon: 'user-round',
    element: <AccountManagement />,
  },
  {
    title: '个人中心',
    path: '/personal',
    icon: 'user',
    element: <Personal />,
  },
  {
    title: '系统设置',
    path: '/system-settings',
    icon: 'settings',
    element: <SystemSettings />,
  },
]

export default sidebarItems
