import AccountManagement from '@/pages/account-management'
import BuildingControl from '@/pages/building-control'
import Home from '@/pages/home'
import IntelligentEvaluation from '@/pages/intelligent-evaluation'
import LogManagement from '@/pages/log-management'
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
    path: '/building-control',
    icon: 'building-2',
    element: <BuildingControl />,
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
    title: '智能评估',
    path: '/intelligent-evaluation',
    icon: 'star',
    element: <IntelligentEvaluation />,
  },
  {
    title: '角色管理',
    path: '/role-management',
    icon: 'users',
    element: <RoleManagement />,
  },
  {
    title: '账号管理',
    path: '/account-management',
    icon: 'user-round',
    element: <AccountManagement />,
  },
  {
    title: '系统设置',
    path: '/system-settings',
    icon: 'settings',
    element: <SystemSettings />,
  },
]

export default sidebarItems
