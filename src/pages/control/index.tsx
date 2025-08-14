import { Tabs } from 'antd'
import ManualControl from './ManualControl'
import RuleLinkageControl from './RuleLinkageControl'

export default function ControlPage() {
  return (
    <div className="p-5">
      <Tabs
        items={[
          {
            key: '1',
            label: '规则联动控制',
            children: <RuleLinkageControl />,
          },
          {
            key: '2',
            label: '手动控制',
            children: <ManualControl />,
          },
        ]}
      >
      </Tabs>
    </div>
  )
}
