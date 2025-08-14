import { Outlet } from 'react-router'
import { Separator } from '@/shadcn/ui/separator'
import { SidebarProvider, SidebarTrigger } from '@/shadcn/ui/sidebar'
import { AppSidebar } from './app-sidebar'
import BreadCrumb from './bread-crumb'

export default function Layout() {
  return (
    <SidebarProvider style={{
      '--sidebar-width': '14rem',
      '--sidebar-width-mobile': '14rem',
    } as React.CSSProperties}
    >
      <AppSidebar />
      <main className="flex h-screen w-full flex-col bg-gray-100/50">
        <div className="mt-5 ml-5 flex shrink-0 items-center gap-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4!" />
          <BreadCrumb />
        </div>
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  )
}
