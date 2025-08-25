import { Tabs } from "antd";
import LogManagement from "./LogManagement";
import ThresholdRule from "./ThresholdRule";

export default function LogPage() {
  return (
    <div className="p-5">
      <Tabs
        items={[
          {
            key: "1",
            label: "日志管理",
            children: <LogManagement />,
          },
          {
            key: "2",
            label: "预警规则",
            children: <ThresholdRule />,
          },
        ]}
      ></Tabs>
    </div>
  );
}
