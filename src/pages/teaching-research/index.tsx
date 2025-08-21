import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import VirtualTeachingSpacePage from "./virtual-teaching-space";

export default function TeachingResearchPage() {
	return (
		<div className="p-5">
			<Tabs defaultValue="0">
				<TabsList>
					<TabsTrigger value="0">虚拟教学空间</TabsTrigger>
					<TabsTrigger value="1">源码申请</TabsTrigger>
					<TabsTrigger value="2">源码审核</TabsTrigger>
					<TabsTrigger value="3">日志管理</TabsTrigger>
					<TabsTrigger value="4">楼宇管控</TabsTrigger>
					<TabsTrigger value="5">实时数据</TabsTrigger>
				</TabsList>
				<TabsContent value="0">
					<VirtualTeachingSpacePage />
				</TabsContent>
			</Tabs>
		</div>
	);
}
