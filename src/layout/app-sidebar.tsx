import type { UserInfo } from '@/request/login'
import { useMutation } from '@tanstack/react-query'
import { jwtDecode } from 'jwt-decode'
import { Atom, ChevronsUpDown, LogOut, User2 } from 'lucide-react'
import { DynamicIcon } from 'lucide-react/dynamic'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { logout } from '@/request/login'
import { cn } from '@/shadcn/lib/utils'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/shadcn/ui/dropdown-menu'
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/shadcn/ui/sidebar'
import sidebarItems from './sidebar-items-data'

export function AppSidebar() {
  const { state } = useSidebar()
  const pathname = useLocation().pathname

  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      const decoded = jwtDecode(token)
      setUserInfo(decoded as UserInfo)
    }
    else {
      // 没有token
      // TODO: token失效
      navigate('/login')
    }
  }, [])

  const { mutate } = useMutation({
    mutationFn: logout,
  })
  function handleLogout() {
    mutate(
      undefined,
      {
        onSuccess: () => {
          localStorage.removeItem('token')
          navigate('/login')
        },
        onError: (error) => {
          console.error(error.message)
          toast.error(error.message)
        },
      },
    )
  }

  return (
    <div>
      <Sidebar collapsible="icon">
        <SidebarHeader className="bg-white">
          <div className="flex h-10 items-center justify-center gap-5">
            {/* <Atom /> */}
            <span className={cn('text-lg font-bold whitespace-nowrap', { hidden: state === 'collapsed' })}>智慧楼宇能源管理系统</span>
          </div>
        </SidebarHeader>
        <SidebarContent className="bg-white">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {sidebarItems.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="h-10 pl-5 data-[active=true]:bg-blue-200/50 data-[active=true]:text-blue-500" isActive={pathname === item.path}>
                      <Link to={item.path}>
                        <DynamicIcon name={item.icon} />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="bg-white">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="h-10">
                    <User2 className="mr-5 inline" />
                    <span>{userInfo?.remark_name}</span>
                    <ChevronsUpDown className="ml-auto inline" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="right"
                  align="start"
                  alignOffset={-80}
                  className="w-60"
                >
                  <DropdownMenuItem>
                    <div className="flex items-center gap-5">
                      <User2 className="inline" />
                      <div>
                        <div className="font-bold">{userInfo?.remark_name}</div>
                        <div>admin@example.com</div>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 inline" />
                    <span onClick={handleLogout}>退出登录</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </div>
  )
}
