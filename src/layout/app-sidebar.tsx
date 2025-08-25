import { useMutation } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { ChevronsUpDown, LogOut, User2 } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { toast } from "sonner";
import type { UserInfo } from "@/request/authority";
import { logout, tokenValidate } from "@/request/authority";
import { cn } from "@/shadcn/lib/utils";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/shadcn/ui/dropdown-menu";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/shadcn/ui/sidebar";
import sidebarItems from "./sidebar-items-data";

export function AppSidebar() {
	const { state } = useSidebar();
	const pathname = useLocation().pathname;

	const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
	const navigate = useNavigate();

	const { mutate: tokenValidateMutate } = useMutation({
		mutationFn: tokenValidate,
	});

	useEffect(() => {
		const token = localStorage.getItem("token");

		if (!token) {
			navigate("/login");
			return;
		}

		tokenValidateMutate(undefined, {
			onSuccess: (data) => {
				if (data?.isValid) {
					const decoded = jwtDecode(token);
					setUserInfo(decoded as UserInfo);
				} else {
					navigate("/login");
				}
			},
			onError: () => {
				navigate("/login");
			},
		});
	}, []);

	const { mutate: logoutMutate } = useMutation({
		mutationFn: logout,
	});
	function handleLogout() {
		logoutMutate(undefined, {
			onSuccess: () => {
				localStorage.removeItem("token");
				navigate("/login");
			},
		});
	}

	return (
		<div>
			<Sidebar collapsible="icon">
				<SidebarHeader className="bg-white">
					<div className="flex justify-center items-center gap-5 h-10">
						{/* <Atom /> */}
						<span
							className={cn("font-bold text-lg whitespace-nowrap", {
								hidden: state === "collapsed",
							})}
						>
							智慧楼宇能源管理系统
						</span>
					</div>
				</SidebarHeader>
				<SidebarContent className="bg-white">
					<SidebarGroup>
						<SidebarGroupContent>
							<SidebarMenu>
								{sidebarItems.map((item) => (
									<SidebarMenuItem key={item.title}>
										<SidebarMenuButton
											asChild
											className="data-[active=true]:bg-blue-200/50 pl-5 h-10 data-[active=true]:text-blue-500"
											isActive={pathname === item.path}
										>
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
									<SidebarMenuButton className="h-10 cursor-pointer">
										<User2 className="inline mr-5" />
										<span>{userInfo?.remark_name}</span>
										<ChevronsUpDown className="inline ml-auto" />
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
												<div>{userInfo?.mail}</div>
											</div>
										</div>
									</DropdownMenuItem>
									<DropdownMenuSeparator />
									<DropdownMenuItem>
										<LogOut className="inline mr-2" />
										<div
											onClick={handleLogout}
											className="w-full cursor-pointer"
										>
											退出登录
										</div>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarFooter>
			</Sidebar>
		</div>
	);
}
