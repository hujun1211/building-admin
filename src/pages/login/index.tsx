import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { z } from "zod";
import type { LoginResponse } from "@/request/authority";
import { login } from "@/request/authority";
import { Button } from "@/shadcn/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/shadcn/ui/form";
import { Input } from "@/shadcn/ui/input";

const formSchema = z.object({
	username: z.string().min(2, {
		message: "用户名至少需要2个字",
	}),
	password: z.string().min(6, {
		message: "密码至少需要6个字",
	}),
});

export default function LoginPage() {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	const { mutate, isPending } = useMutation({
		mutationFn: login,
	});

	const navigate = useNavigate();

	function onSubmit(values: z.infer<typeof formSchema>) {
		mutate(values, {
			onSuccess: (data: LoginResponse) => {
				localStorage.setItem("token", data.token);
				navigate("/");
			},
			onError: (error) => {
				toast.error(error.message);
			},
		});
	}

	return (
		<div className="flex justify-center items-center bg-gray-100 min-h-screen">
			<div className="space-y-8 bg-white shadow-md p-8 rounded-lg w-full max-w-md">
				<div className="text-center">
					<h1 className="font-bold text-3xl">登录</h1>
				</div>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="username"
							render={({ field }) => (
								<FormItem>
									<FormLabel>用户名</FormLabel>
									<FormControl>
										<Input placeholder="请输入用户名" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>密码</FormLabel>
									<FormControl>
										<Input
											type="password"
											placeholder="请输入密码"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							disabled={isPending}
							type="submit"
							className="w-full cursor-pointer"
						>
							登录
						</Button>
					</form>
				</Form>
			</div>
		</div>
	);
}
