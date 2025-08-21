import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import z from "zod";
import { accountPasswordReset } from "@/request/account";
import type { UserInfo } from "@/request/authority";
import { logout } from "@/request/authority";
import { Button } from "@/shadcn/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/shadcn/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/shadcn/ui/form";
import { Input } from "@/shadcn/ui/input";

export default function PersonalPage() {
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
	const token = localStorage.getItem("token");

	useEffect(() => {
		if (token) {
			const decoded = jwtDecode(token);
			setUserInfo(decoded as UserInfo);
		}
	}, [token]);

	const navigate = useNavigate();
	const { mutate: logoutMutate } = useMutation({
		mutationFn: logout,
	});
	function handleLogout() {
		logoutMutate(undefined, {
			onSuccess: () => {
				localStorage.removeItem("token");
				navigate("/login");
			},
			onError: (error) => {
				toast.error(error.message);
			},
		});
	}

	const passwordFormSchema = z
		.object({
			"password-old": z.string().min(6, {
				message: "密码至少需要6个字",
			}),
			"password-new": z.string().min(6, {
				message: "密码至少需要6个字",
			}),
			"password-new-confirm": z.string().min(6, {
				message: "密码至少需要6个字",
			}),
		})
		.refine((data) => data["password-new"] === data["password-new-confirm"], {
			message: "两次输入的密码不一致",
			path: ["password-new-confirm"],
		});

	const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
		resolver: zodResolver(passwordFormSchema),
		defaultValues: {
			"password-old": "",
			"password-new": "",
			"password-new-confirm": "",
		},
	});

	const [dialogOpen, setDialogOpen] = useState(false);

	function handleOK() {
		passwordForm.handleSubmit(onSubmit)();
	}

	const { mutate: updatePasswordMutate } = useMutation({
		mutationFn: accountPasswordReset,
	});
	function onSubmit(values: z.infer<typeof passwordFormSchema>) {
		const username = userInfo?.username;
		const { "password-new": newPassword } = values;
		if (!username) {
			return;
		}

		updatePasswordMutate(
			{ username, newPassword },
			{
				onSuccess: () => {
					setDialogOpen(false);
					toast.success("修改密码成功");
					passwordForm.reset();
					localStorage.removeItem("token");
					navigate("/login");
				},
				onError: (error: Error) => {
					toast.error(error.message);
				},
			},
		);
	}

	return (
		<div className="p-5">
			<div className="mt-5">
				<span>账号名称：</span>
				<span>{userInfo?.remark_name}</span>
			</div>
			<div className="mt-5">
				<span>角色：</span>
				<span>{userInfo?.role_list.toString()}</span>
			</div>
			<div className="mt-5">
				<span>邮箱：</span>
				<span>{userInfo?.mail}</span>
			</div>
			<div className="mt-5">
				<Button
					className="cursor-pointer"
					variant="link"
					onClick={() => setDialogOpen(true)}
				>
					修改密码
				</Button>
			</div>
			<div className="mt-5">
				<Button className="cursor-pointer" onClick={handleLogout}>
					退出登陆
				</Button>
			</div>
			<Dialog open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
				<DialogContent className="max-w-180!" showCloseButton={false}>
					<DialogClose className="top-3 right-3 absolute flex justify-center items-center bg-gray-200 hover:bg-gray-300 p-1 rounded-full cursor-pointer">
						<X className="w-4 h-4" />
					</DialogClose>
					<DialogHeader>
						<DialogTitle>修改密码</DialogTitle>
					</DialogHeader>
					<div className="mt-5">
						<Form {...passwordForm}>
							<form className="space-y-7">
								<FormField
									control={passwordForm.control}
									name="password-old"
									render={({ field }) => (
										<FormItem className="relative flex items-center gap-5">
											<FormLabel>原密码</FormLabel>
											<div className="flex flex-col">
												<FormControl>
													<Input
														{...field}
														type="password"
														placeholder="请输入旧密码"
														className="w-80 h-8"
													/>
												</FormControl>
												<FormMessage className="bottom-0 absolute translate-y-full" />
											</div>
										</FormItem>
									)}
								/>
								<FormField
									control={passwordForm.control}
									name="password-new"
									render={({ field }) => (
										<FormItem className="relative flex items-center gap-5">
											<FormLabel>新密码</FormLabel>
											<div className="flex flex-col">
												<FormControl>
													<Input
														{...field}
														type="password"
														placeholder="请输入新密码"
														className="w-80 h-8"
													/>
												</FormControl>
												<FormMessage className="bottom-0 absolute translate-y-full" />
											</div>
										</FormItem>
									)}
								/>
								<FormField
									control={passwordForm.control}
									name="password-new-confirm"
									render={({ field }) => (
										<FormItem className="relative flex items-center gap-5">
											<FormLabel>确认新密码</FormLabel>
											<div className="flex flex-col">
												<FormControl>
													<Input
														{...field}
														type="password"
														placeholder="确认新密码"
														className="w-80 h-8"
													/>
												</FormControl>
												<FormMessage className="bottom-0 absolute translate-y-full" />
											</div>
										</FormItem>
									)}
								/>
							</form>
						</Form>
					</div>
					<DialogFooter className="mt-10">
						<DialogClose asChild>
							<Button variant="outline" className="cursor-pointer">
								取消
							</Button>
						</DialogClose>
						<Button type="button" className="cursor-pointer" onClick={handleOK}>
							确定
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
