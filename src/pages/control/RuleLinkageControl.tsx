import type { AddRegulationParams, PropertyListItem, TriggerSelectListItem } from '@/request/control'
import type { PaginationType } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Table } from 'antd'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import { addRegulation, getControlPropertyList, getFieldSelectList, getManualOperateList, getMonitorPropertyList, getRegulationDetails, getRegulationList, getTriggerSelectList, updateRegulation } from '@/request/control'
import { Badge } from '@/shadcn/ui/badge'
import { Button } from '@/shadcn/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/shadcn/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shadcn/ui/form'
import { Input } from '@/shadcn/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shadcn/ui/select'

const roleFormSchema = z.object({
  rule_id: z.string().optional(),
  t_sensor_property_id: z.string().min(1, '不能为空'),
  c_sensor_property_id: z.string().min(1, '不能为空'),
  field: z.string().min(1, '不能为空，请先选择t_sensor_property_id'),
  control: z.string().min(1, '不能为空，请先选择c_sensor_property_id'),
  trigger: z.string().min(1, '不能为空'),
  is_used: z.string().min(1, '状态不能为空'),
  value: z.coerce.number({ message: '请输入数字' }).nonnegative({ message: '必须 >= 0' }),
})

export default function RuleLinkageControl() {
  const columns = [
    {
      title: 'rule_id',
      dataIndex: 'rule_id',
      key: 'rule_id',
      align: 'center',
    },
    {
      title: 't_sensor_property_id',
      dataIndex: 't_sensor_property_id',
      key: 't_sensor_property_id',
      align: 'center',
    },
    {
      title: 't_kind',
      dataIndex: 't_kind',
      key: 't_kind',
      align: 'center',
    },
    {
      title: 't_type',
      dataIndex: 't_type',
      key: 't_type',
      align: 'center',
    },
    {
      title: 'c_sensor_property_id',
      dataIndex: 'c_sensor_property_id',
      key: 'c_sensor_property_id',
      align: 'center',
    },
    {
      title: 'c_kind',
      dataIndex: 'c_kind',
      key: 'c_kind',
      align: 'center',
    },
    {
      title: 'c_type',
      dataIndex: 'c_type',
      key: 'c_type',
      align: 'center',
    },
    {
      title: 'trigger',
      dataIndex: 'trigger',
      key: 'trigger',
      align: 'center',
    },
    {
      title: 'control',
      dataIndex: 'control',
      key: 'control',
      align: 'center',
    },
    {
      title: 'is_used',
      dataIndex: 'is_used',
      key: 'is_used',
      align: 'center',
      render: (is_used: boolean) => {
        return is_used
          ? <Badge className="bg-green-500">在用</Badge>
          : <Badge className="bg-red-500">停用</Badge>
      },
    },
    {
      title: 'action',
      dataIndex: 'action',
      key: 'action',
      align: 'center',
      render: (_, record: any) => (
        <Button
          variant="link"
          className="cursor-pointer text-blue-500"
          onClick={() => handleOpenUpdateDialog(record)}
        >
          编辑
        </Button>
      ),
    },
  ]

  // 表格分页
  const [pageParams, setPageParams] = useState<PaginationType>({
    current: 1,
    pageSize: 5,
    showSizeChanger: false,
  })
  function handlePaginationChange(pagination: PaginationType) {
    setPageParams(pagination)
  }

  // 请求表格数据
  const { data: ruleLinkageList, isPending: isLoading, refetch, isError, error } = useQuery({
    queryKey: ['ruleLinkage', pageParams.current, pageParams.pageSize],
    queryFn: () => getRegulationList({
      page: pageParams.current,
      page_size: pageParams.pageSize,
    }),
  })
  useEffect(() => {
    if (isError) {
      toast.error(error.message)
    }
  }, [isError])
  // 设置分页
  useEffect(() => {
    if (ruleLinkageList?.page?.totalSize) {
      setPageParams(prev => ({
        ...prev,
        total: ruleLinkageList.page.totalSize,
      }))
    }
  }, [ruleLinkageList])

  const [dialogOpen, setDialogOpen] = useState(false)
  const [addOrUpdate, setAddOrUpdate] = useState('add')

  const [monitorPropertySelectOption, setMonitorPropertySelectOption] = useState<PropertyListItem[]>([])
  const { mutateAsync: getMonitorPropertyListMutate } = useMutation({
    mutationFn: getMonitorPropertyList,
  })

  const [controlPropertySelectOption, setControlPropertySelectOption] = useState<PropertyListItem[]>([])
  const { mutateAsync: getControlPropertyListMutate } = useMutation({
    mutationFn: getControlPropertyList,
  })

  const [fieldSelectOption, setFieldSelectOption] = useState<string[]>([])
  const { mutate: getFieldSelectListMutate, mutateAsync: getFieldSelectListMutateAsync } = useMutation({
    mutationFn: getFieldSelectList,
  })

  const [controlSelectOption, setControlSelectOption] = useState<string[]>([])
  const { mutate: getControlSelectListMutate, mutateAsync: getControlSelectListMutateAsync } = useMutation({
    mutationFn: getManualOperateList,
  })

  const [triggerSelectOption, setTriggerSelectOption] = useState<TriggerSelectListItem[]>([])
  const { mutateAsync: getTriggerSelectListMutate } = useMutation({
    mutationFn: getTriggerSelectList,
  })

  const RoleIsUsedSelectOptions = [
    { value: 'true', label: '在用' },
    { value: 'false', label: '停用' },
  ]

  const roleForm = useForm<z.infer<typeof roleFormSchema>>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: {
      rule_id: '',
      t_sensor_property_id: '',
      c_sensor_property_id: '',
      field: '',
      control: '',
      trigger: '',
      is_used: '',
      value: '',
    },
  })

  async function getSelectOption() {
    const monitorData = await getMonitorPropertyListMutate()
    setMonitorPropertySelectOption(monitorData)

    const controlData = await getControlPropertyListMutate()
    setControlPropertySelectOption(controlData)

    const triggerData = await getTriggerSelectListMutate()
    setTriggerSelectOption(triggerData)
  }

  function onDialogOpenChange(open: boolean) {
    setDialogOpen(open)
    if (!open) {
      roleForm.reset(
        {
          rule_id: '',
          t_sensor_property_id: '',
          c_sensor_property_id: '',
          field: '',
          control: '',
          trigger: '',
          is_used: '',
          value: undefined,
        },
      )
    }
  }

  function handleOpenAddDialog() {
    setAddOrUpdate('add')
    setDialogOpen(true)
    getSelectOption()
  }

  const { mutateAsync: getRegulationDetailsMutate } = useMutation({
    mutationFn: getRegulationDetails,
  })
  async function handleOpenUpdateDialog(record: any) {
    setAddOrUpdate('update')
    setDialogOpen(true)
    await getSelectOption()
    const fieldRes = await getFieldSelectListMutateAsync(record.t_sensor_property_id)
    setFieldSelectOption(fieldRes)

    const controlRes = await getControlSelectListMutateAsync(record.c_sensor_property_id)
    setControlSelectOption(controlRes)

    const data = await getRegulationDetailsMutate(record.rule_id)
    roleForm.reset(data)
  }

  function handleOK() {
    roleForm.handleSubmit(onSubmit)()
  }

  const { mutate: addRegulationMutate } = useMutation({
    mutationFn: addRegulation,
  })
  const { mutate: updateRegulationMutate } = useMutation({
    mutationFn: updateRegulation,
  })
  function onSubmit(values: AddRegulationParams) {
    if (addOrUpdate === 'add') {
      addRegulationMutate(values, {
        onSuccess: () => {
          setDialogOpen(false)
          toast.success('新增成功')
          roleForm.reset()
          refetch()
        },
        onError: (error) => {
          toast.error(error.message)
        },
      })
    }
    else {
      updateRegulationMutate(values, {
        onSuccess: () => {
          setDialogOpen(false)
          toast.success('新增成功')
          roleForm.reset()
          refetch()
        },
        onError: (error) => {
          toast.error(error.message)
        },
      })
    }
  }

  function tSensorPropertyIdChange(value: string, field) {
    field.onChange(value)
    getFieldSelectListMutate(value, {
      onSuccess: (data) => {
        setFieldSelectOption(data)
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  }
  function cSensorPropertyIdChange(value: string, field) {
    field.onChange(value)
    getControlSelectListMutate(value, {
      onSuccess: (data) => {
        setControlSelectOption(data)
      },
      onError: (error) => {
        toast.error(error.message)
      },
    })
  }

  return (
    <div>
      <div>
        <Button className="flex h-10 w-25 cursor-pointer items-center justify-center rounded-lg bg-blue-500 text-white hover:bg-blue-400" onClick={handleOpenAddDialog}>
          新增
        </Button>
      </div>
      <Table
        dataSource={ruleLinkageList?.regulation || []}
        columns={columns}
        pagination={pageParams}
        onChange={handlePaginationChange}
        loading={isLoading}
        className="mt-2"
      />
      <Dialog open={dialogOpen} onOpenChange={onDialogOpenChange}>
        <DialogContent className="max-w-180!" showCloseButton={false}>
          <DialogClose className="absolute top-3 right-3 flex cursor-pointer items-center justify-center rounded-full bg-gray-200 p-1 hover:bg-gray-300 ">
            <X className="h-4 w-4" />
          </DialogClose>
          <DialogHeader>
            {
              addOrUpdate === 'add'
                ? <DialogTitle>新增规则</DialogTitle>
                : <DialogTitle>更新规则</DialogTitle>
            }
          </DialogHeader>
          <div className="mt-5">
            <Form {...roleForm}>
              <form className="space-y-7">
                {
                  addOrUpdate === 'update'
                    ? (
                        <FormField
                          control={roleForm.control}
                          name="rule_id"
                          render={({ field }) => (
                            <FormItem className="relative flex items-center gap-5">
                              <FormLabel>rule_id</FormLabel>
                              <div className="flex flex-col">
                                <FormControl>
                                  <Input {...field} className="h-8 w-80" />
                                </FormControl>
                                <FormMessage className="absolute bottom-0 translate-y-full" />
                              </div>
                            </FormItem>
                          )}
                        />
                      )
                    : null
                }
                <FormField
                  control={roleForm.control}
                  name="t_sensor_property_id"
                  render={({ field }) => (
                    <FormItem className="relative flex items-center gap-5">
                      <FormLabel>t_sensor_property_id</FormLabel>
                      <div className="flex flex-col">
                        <Select onValueChange={value => tSensorPropertyIdChange(value, field)} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-80 bg-white">
                              <SelectValue placeholder="请选择t_sensor_property_id" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {monitorPropertySelectOption.map(option => (
                              <SelectItem
                                key={option.property_id}
                                value={option.property_id}
                              >
                                {option.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="absolute bottom-0 translate-y-full" />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={roleForm.control}
                  name="c_sensor_property_id"
                  render={({ field }) => (
                    <FormItem className="relative flex items-center gap-5">
                      <FormLabel>c_sensor_property_id</FormLabel>
                      <div className="flex flex-col">
                        <Select onValueChange={value => cSensorPropertyIdChange(value, field)} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-80 bg-white">
                              <SelectValue placeholder="请选择t_sensor_property_id" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {controlPropertySelectOption.map(option => (
                              <SelectItem
                                key={option.property_id}
                                value={option.property_id}
                              >
                                {option.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="absolute bottom-0 translate-y-full" />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={roleForm.control}
                  name="field"
                  render={({ field }) => (
                    <FormItem className="relative flex items-center gap-5">
                      <FormLabel>field</FormLabel>
                      <div className="flex flex-col">
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-80 bg-white">
                              <SelectValue placeholder="field" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {fieldSelectOption.map(value => (
                              <SelectItem
                                key={value}
                                value={value}
                              >
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="absolute bottom-0 translate-y-full" />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={roleForm.control}
                  name="control"
                  render={({ field }) => (
                    <FormItem className="relative flex items-center gap-5">
                      <FormLabel>control</FormLabel>
                      <div className="flex flex-col">
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-80 bg-white">
                              <SelectValue placeholder="control" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {controlSelectOption.map(value => (
                              <SelectItem
                                key={value}
                                value={value}
                              >
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="absolute bottom-0 translate-y-full" />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={roleForm.control}
                  name="trigger"
                  render={({ field }) => (
                    <FormItem className="relative flex items-center gap-5">
                      <FormLabel>trigger</FormLabel>
                      <div className="flex flex-col">
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-80 bg-white">
                              <SelectValue placeholder="trigger" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {triggerSelectOption.map(option => (
                              <SelectItem
                                key={option.type}
                                value={option.type}
                              >
                                {option.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="absolute bottom-0 translate-y-full" />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={roleForm.control}
                  name="is_used"
                  render={({ field }) => (
                    <FormItem className="relative flex items-center gap-5">
                      <FormLabel>is_used</FormLabel>
                      <div className="flex flex-col">
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="w-80 bg-white">
                              <SelectValue placeholder="is_used" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {RoleIsUsedSelectOptions.map(option => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className="absolute bottom-0 translate-y-full" />
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={roleForm.control}
                  name="value"
                  render={({ field }) => (
                    <FormItem className="relative flex items-center gap-5">
                      <FormLabel>value</FormLabel>
                      <div className="flex flex-col">
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="请输入value"
                            className="h-8 w-80"
                          />
                        </FormControl>
                        <FormMessage className="absolute bottom-0 translate-y-full" />
                      </div>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
          <DialogFooter className="mt-10">
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer">取消</Button>
            </DialogClose>
            <Button type="button" className="cursor-pointer" onClick={handleOK}>确定</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
