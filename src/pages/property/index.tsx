import type { PaginationType } from '@/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Table } from 'antd'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'
import { addProperty, getPropertyList } from '@/request/property'
import { Badge } from '@/shadcn/ui/badge'
import { Button } from '@/shadcn/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shadcn/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shadcn/ui/form'
import { Input } from '@/shadcn/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shadcn/ui/select'

const searchFormSchema = z.object({
  property_id: z.string().optional(), // 资产编号
  is_used: z.string().optional(), // 资产使用状态
  property_type: z.string().optional(), // 资产类型

  building_number: z.string().optional(), // 楼宇编号
  building_name: z.string().optional(), // 楼宇名称
  building_address: z.string().optional(), // 楼宇地址

  space_number: z.string().optional(), // 空间编号
  space_name: z.string().optional(), // 空间名称
  space_type: z.string().optional(), // 空间类型
  space_floor: z.string().optional(), // 空间楼层

  terminal_number: z.string().optional(), // 终端编号
  terminal_type: z.string().optional(), // 终端类型

  sensor_kind: z.string().optional(), // 传感器种类
  sensor_type: z.string().optional(), // 传感器类型
})

const addBuildingFormSchema = z.object({
  property_id: z.string(), // 资产编号
  name: z.string().min(1, '楼宇名称不能为空'), // 楼宇名称
  number: z.string().optional(), // 楼宇编号
  address: z.string().optional(), // 楼宇地址
  is_used: z.string().optional(), // 楼宇状态
  description: z.string().optional(), // 楼宇描述
})

const addSpaceFormSchema = z.object({
  property_id: z.string(), // 资产编号
  property_bind_id: z.string().min(1, '绑定楼宇id不能为空'), // 绑定楼宇id
  name: z.string().min(1, '空间名称不能为空'), // 空间名称
  number: z.string().min(1, '空间编号不能为空'), // 编号
  floor: z.number().int().min(1, '楼层不能为空'), // 楼层
  type: z.string().optional(), // 类型
  ampere: z.string().optional(), // 电流
  is_used: z.string().optional(), // 状态
  description: z.string().optional(), // 描述
})

const addTerminalFormSchema = z.object({
  property_id: z.string(), // 资产编号
  property_bind_id: z.string().min(1, '绑定楼宇id不能为空'), // 绑定空间id
  number: z.string().min(1, '终端编号不能为空'), // 编号
  type: z.string().min(1, '终端型号不能为空'), // 型号
  is_used: z.string().optional(), // 状态
  description: z.string().optional(), // 描述
})

const addSensorFormSchema = z.object({
  property_id: z.string(), // 资产编号
  property_bind_id: z.string().min(1, '绑定楼宇id不能为空'), // 绑定终端id
  kind: z.string().min(1, '终端种类不能为空'), // 种类
  type: z.string().min(1, '终端型号不能为空'), // 型号
  is_used: z.string().optional(), // 状态
  description: z.string().optional(), // 描述
})

const propertyTypeSelectOptions = [
  { value: 'building', label: '楼宇' },
  { value: 'space', label: '空间' },
  { value: 'terminal', label: '终端' },
  { value: 'sensor', label: '传感器' },
]

const propertyStatusSelectOptions = [
  { value: 'all', label: '全部' },
  { value: 'True', label: '在用' },
  { value: 'False', label: '停用' },
]

const buildingIsUsedSelectOptions = [
  { value: 'true', label: '在用' },
  { value: 'false', label: '停用' },
]

export default function PropertyPage() {
  // 楼宇资产表格
  // 表格列
  const columns = [
    {
      title: '资产编号',
      dataIndex: 'property_id',
      key: 'property_id',
      align: 'center',
    },
    {
      title: '资产名称',
      dataIndex: 'property_name',
      key: 'property_name',
      align: 'center',
    },
    {
      title: '资产类型',
      dataIndex: 'property_type',
      key: 'property_type',
      align: 'center',
    },
    {
      title: '资产使用状态',
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
      title: '活跃情况',
      dataIndex: 'is_liveness',
      key: 'is_liveness',
      align: 'center',
      render: (is_liveness: boolean) => {
        return is_liveness
          ? <Badge className="bg-green-500">在线</Badge>
          : <Badge className="bg-red-500">离线</Badge>
      },
    },
    {
      title: '楼宇',
      dataIndex: 'building',
      key: 'building',
      align: 'center',
    },
    {
      title: '空间',
      dataIndex: 'space',
      key: 'space',
      align: 'center',
    },
    {
      title: '终端',
      dataIndex: 'terminal',
      key: 'terminal',
      align: 'center',
    },
    {
      title: '传感器',
      dataIndex: 'sensor',
      key: 'sensor',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      key: 'operation',
      align: 'center',
      render: () => '查看',
    },
  ]

  // 表格分页
  const [pageParams, setPageParams] = useState<PaginationType>({
    current: 1,
    pageSize: 5,
    showSizeChanger: false,
  })
  const [searchValues, setSearchValues] = useState<z.infer<typeof searchFormSchema>>({})
  function handlePaginationChange(pagination: PaginationType) {
    setPageParams(pagination)
  }

  // 请求表格数据
  const { data: propertyData, isPending: isLoading, refetch } = useQuery({
    queryKey: ['propertyList', pageParams.current, pageParams.pageSize, searchValues],
    queryFn: () => getPropertyList({
      page: pageParams.current,
      page_size: pageParams.pageSize,
      ...searchValues,
    }),
  })
  useEffect(() => {
    if (propertyData?.page?.totalSize) {
      setPageParams(prev => ({
        ...prev,
        total: propertyData.page.totalSize,
      }))
    }
  }, [propertyData])

  // 搜索表单
  const searchForm = useForm<z.infer<typeof searchFormSchema>>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      property_id: '',
      is_used: '',
      property_type: '',
      building_number: '',
      building_name: '',
      building_address: '',
      space_number: '',
      space_name: '',
      space_type: '',
      space_floor: '',
      terminal_number: '',
      terminal_type: '',
      sensor_kind: '',
      sensor_type: '',
    },
  })
  // 搜索表单提交
  function onSearchFormSubmit(values: z.infer<typeof searchFormSchema>) {
    console.log(values)
    setSearchValues(values)
    refetch()
  }

  // 新增资产
  const propertyType = searchForm.watch('property_type')
  const [addPropertySelectValue, setAddPropertySelectValue] = useState('')
  function onAddPropertySelectValueChange(value: string) {
    setAddPropertySelectValue(value)
  }

  // 新增楼宇
  // 新增楼宇表单
  const addBuildingForm = useForm<z.infer<typeof addBuildingFormSchema>>({
    resolver: zodResolver(addBuildingFormSchema),
    defaultValues: {
      property_id: 'LY9999',
      name: '',
      number: undefined,
      address: undefined,
      is_used: undefined,
      description: undefined,
    },
  })
  // 新增空间表单
  const addSpaceForm = useForm<z.infer<typeof addSpaceFormSchema>>({
    resolver: zodResolver(addSpaceFormSchema),
    defaultValues: {
      property_id: 'KJ9999',
      property_bind_id: undefined,
      name: undefined,
      number: undefined,
      floor: undefined,
      type: undefined,
      ampere: undefined,
      is_used: undefined,
      description: undefined,
    },
  })
  // 新增终端表单
  const addTerminalForm = useForm<z.infer<typeof addTerminalFormSchema>>({
    resolver: zodResolver(addTerminalFormSchema),
    defaultValues: {
      property_id: 'ZD9999',
      property_bind_id: undefined,
      number: undefined,
      type: undefined,
      is_used: undefined,
      description: undefined,
    },
  })
  // 新增传感器表单
  const addSensorForm = useForm<z.infer<typeof addSensorFormSchema>>({
    resolver: zodResolver(addSensorFormSchema),
    defaultValues: {
      property_id: 'CGQ9999',
      property_bind_id: undefined,
      kind: undefined,
      type: undefined,
      is_used: undefined,
      description: undefined,
    },
  })

  // 新增楼宇请求
  const { mutate: addPropertyMutate } = useMutation({
    mutationFn: addProperty,
  })

  // 新增资产表单提交
  async function onAddPropertyFormSubmit(values: any) {
    console.log(values)
    if (addPropertySelectValue === 'building') {
      const isValid = await addBuildingForm.trigger() // 触发全部字段验证
      console.log(isValid)
      // if (!isValid) {

      // }
      // addPropertyMutate(values, {
      //   onSuccess: () => {
      //     toast.success('新增楼宇成功')
      //     addBuildingForm.reset()
      //     refetch()
      //   },
      //   onError: (error) => {
      //     toast.error(error.message)
      //   },
      // })
    }
    // if (addPropertySelectValue === 'space') {
    //   const isValid = await addSpaceForm.trigger() // 触发全部字段验证
    //   if (!isValid) {
    //     return null
    //   }
    //   // addPropertyMutate(values, {
    //   //   onSuccess: () => {
    //   //     toast.success('新增楼宇成功')
    //   //     addBuildingForm.reset()
    //   //     refetch()
    //   //   },
    //   //   onError: (error) => {
    //   //     toast.error(error.message)
    //   //   },
    //   // })
    // }
  }
  function handleAddProperty() {
    if (addPropertySelectValue === 'building') {
      addBuildingForm.handleSubmit(onAddPropertyFormSubmit)()
    }
    if (addPropertySelectValue === 'space') {
      addSpaceForm.handleSubmit(onAddPropertyFormSubmit)()
    }
    // if(addPropertySelectValue === 'terminal') {
    //   addTerminalForm.handleSubmit(onAddPropertyFormSubmit)()
    // }
    // if(addPropertySelectValue === 'sensor') {
    //   addSensorForm.handleSubmit(onAddPropertyFormSubmit)()
    // }
  }

  return (
    <div className="p-5">
      <Form {...searchForm}>
        <form className="space-y-8" onSubmit={searchForm.handleSubmit(onSearchFormSubmit)}>
          <div className="flex gap-5">
            <FormField
              control={searchForm.control}
              name="property_id"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormLabel>资产编号</FormLabel>
                  <div className="flex flex-col">
                    <FormControl>
                      <Input {...field} className="bg-white" />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={searchForm.control}
              name="is_used"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormLabel>资产使用状态</FormLabel>
                  <div className="flex flex-col">
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-50 bg-white">
                            <SelectValue placeholder="请选择资产使用状态" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {propertyStatusSelectOptions.map(option => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={searchForm.control}
              name="property_type"
              render={({ field }) => (
                <FormItem className="flex items-center gap-3">
                  <FormLabel>资产类型</FormLabel>
                  <div className="flex flex-col">
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-50 bg-white">
                          <SelectValue placeholder="请选择资产类型" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {propertyTypeSelectOptions.map(option => (
                          <SelectItem
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit" className="cursor-pointer">查询</Button>
            <Button className="cursor-pointer" onClick={() => searchForm.reset()}>清空</Button>
          </div>
          <div>
            {
              propertyType === 'building' && (
                <div className="flex gap-5">
                  <FormField
                    control={searchForm.control}
                    name="building_number"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-3">
                        <FormLabel>楼宇编号</FormLabel>
                        <div className="flex flex-col">
                          <FormControl>
                            <Input {...field} className="bg-white" />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={searchForm.control}
                    name="building_name"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-3">
                        <FormLabel>楼宇名称</FormLabel>
                        <div className="flex flex-col">
                          <FormControl>
                            <Input {...field} className="bg-white" />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={searchForm.control}
                    name="building_address"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-3">
                        <FormLabel>楼宇地址</FormLabel>
                        <div className="flex flex-col">
                          <FormControl>
                            <Input {...field} className="bg-white" />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              )
            }
            {
              propertyType === 'space' && (
                <div className="flex gap-5">
                  <FormField
                    control={searchForm.control}
                    name="space_number"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-3">
                        <FormLabel>空间编号</FormLabel>
                        <div className="flex flex-col">
                          <FormControl>
                            <Input {...field} className="bg-white" />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={searchForm.control}
                    name="space_name"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-3">
                        <FormLabel>空间名称</FormLabel>
                        <div className="flex flex-col">
                          <FormControl>
                            <Input {...field} className="bg-white" />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={searchForm.control}
                    name="space_type"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-3">
                        <FormLabel>空间类型</FormLabel>
                        <div className="flex flex-col">
                          <FormControl>
                            <Input {...field} className="bg-white" />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={searchForm.control}
                    name="space_floor"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-3">
                        <FormLabel>空间楼层</FormLabel>
                        <div className="flex flex-col">
                          <FormControl>
                            <Input {...field} className="bg-white" />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              )
            }
            {
              propertyType === 'terminal' && (
                <div className="flex gap-5">
                  <FormField
                    control={searchForm.control}
                    name="terminal_number"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-3">
                        <FormLabel>终端编号</FormLabel>
                        <div className="flex flex-col">
                          <FormControl>
                            <Input {...field} className="bg-white" />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={searchForm.control}
                    name="terminal_type"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-3">
                        <FormLabel>终端类型</FormLabel>
                        <div className="flex flex-col">
                          <FormControl>
                            <Input {...field} className="bg-white" />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              )
            }
            {
              propertyType === 'sensor' && (
                <div className="flex gap-5">
                  <FormField
                    control={searchForm.control}
                    name="sensor_kind"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-3">
                        <FormLabel>传感器种类</FormLabel>
                        <div className="flex flex-col">
                          <FormControl>
                            <Input {...field} className="bg-white" />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={searchForm.control}
                    name="sensor_type"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-3">
                        <FormLabel>传感器类型</FormLabel>
                        <div className="flex flex-col">
                          <FormControl>
                            <Input {...field} className="bg-white" />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              )
            }
          </div>
        </form>
      </Form>
      <div className="mt-10">
        <Dialog>
          <DialogTrigger>
            <div className="flex h-10 w-25 cursor-pointer items-center justify-center rounded-lg bg-blue-500 text-white hover:bg-blue-400">
              新增
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-180!">
            <DialogHeader>
              <DialogTitle>新增资产</DialogTitle>
            </DialogHeader>
            <div className="mt-5 ">
              <div>
                <Select onValueChange={onAddPropertySelectValueChange} value={addPropertySelectValue}>
                  <SelectTrigger className="w-50">
                    <SelectValue placeholder="请先选择资产类型" />
                  </SelectTrigger>
                  <SelectContent>
                    {propertyTypeSelectOptions.map(option => (
                      <SelectItem
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-10">
                {
                  addPropertySelectValue === 'building' && (
                    <Form {...addBuildingForm}>
                      <form className="space-y-7">
                        <FormField
                          control={addBuildingForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem className="relative flex items-center gap-5">
                              <FormLabel>楼宇名称</FormLabel>
                              <div className="flex flex-col">
                                <FormControl>
                                  <Input {...field} className="h-8 w-80" />
                                </FormControl>
                                <FormMessage className="absolute bottom-0 translate-y-full" />
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={addBuildingForm.control}
                          name="number"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-5">
                              <FormLabel>楼宇编号</FormLabel>
                              <div className="flex flex-col">
                                <FormControl>
                                  <Input {...field} className="h-8 w-80" />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={addBuildingForm.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-5">
                              <FormLabel>楼宇地址</FormLabel>
                              <div className="flex flex-col">
                                <FormControl>
                                  <Input {...field} className="h-8 w-80" />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={addBuildingForm.control}
                          name="is_used"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-5">
                              <FormLabel>楼宇状态</FormLabel>
                              <div className="flex flex-col">
                                <FormControl>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="w-80 bg-white">
                                        <SelectValue placeholder="请选择楼宇使用状态" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {buildingIsUsedSelectOptions.map(option => (
                                        <SelectItem
                                          key={option.value}
                                          value={option.value}
                                        >
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={addBuildingForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-5">
                              <FormLabel>楼宇描述</FormLabel>
                              <div className="flex flex-col">
                                <FormControl>
                                  <Input {...field} className="h-8 w-80" />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                      </form>
                    </Form>
                  )
                }
                {
                  addPropertySelectValue === 'space' && (
                    <Form {...addSpaceForm}>
                      <form className="space-y-7">
                        <FormField
                          control={addSpaceForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem className="relative flex items-center gap-5">
                              <FormLabel>空间名称</FormLabel>
                              <div className="flex flex-col">
                                <FormControl>
                                  <Input {...field} className="h-8 w-80" />
                                </FormControl>
                                <FormMessage className="absolute bottom-0 translate-y-full" />
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={addSpaceForm.control}
                          name="number"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-5">
                              <FormLabel>空间编号</FormLabel>
                              <div className="flex flex-col">
                                <FormControl>
                                  <Input {...field} className="h-8 w-80" />
                                </FormControl>
                                <FormMessage className="absolute bottom-0 translate-y-full" />
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={addSpaceForm.control}
                          name="floor"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-5">
                              <FormLabel>所在楼层</FormLabel>
                              <div className="flex flex-col">
                                <FormControl>
                                  <Input {...field} className="h-8 w-80" />
                                </FormControl>
                                <FormMessage className="absolute bottom-0 translate-y-full" />
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={addSpaceForm.control}
                          name="is_used"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-5">
                              <FormLabel>空间状态</FormLabel>
                              <div className="flex flex-col">
                                <FormControl>
                                  <Select onValueChange={field.onChange} value={field.value}>
                                    <FormControl>
                                      <SelectTrigger className="w-80 bg-white">
                                        <SelectValue placeholder="请选择空间使用状态" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {buildingIsUsedSelectOptions.map(option => (
                                        <SelectItem
                                          key={option.value}
                                          value={option.value}
                                        >
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </FormControl>
                                <FormMessage />
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={addSpaceForm.control}
                          name="type"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-5">
                              <FormLabel>空间类型</FormLabel>
                              <div className="flex flex-col">
                                <FormControl>
                                  <Input {...field} className="h-8 w-80" />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={addSpaceForm.control}
                          name="ampere"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-5">
                              <FormLabel>电流</FormLabel>
                              <div className="flex flex-col">
                                <FormControl>
                                  <Input {...field} className="h-8 w-80" />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={addSpaceForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem className="flex items-center gap-5">
                              <FormLabel>空间描述</FormLabel>
                              <div className="flex flex-col">
                                <FormControl>
                                  <Input {...field} className="h-8 w-80" />
                                </FormControl>
                              </div>
                            </FormItem>
                          )}
                        />
                      </form>
                    </Form>
                  )
                }
              </div>
            </div>
            <DialogFooter className="mt-10">
              <DialogClose asChild>
                <Button variant="outline" className="cursor-pointer">取消</Button>
              </DialogClose>
              <Button type="button" className="cursor-pointer" onClick={handleAddProperty}>确定</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <Table
        dataSource={propertyData?.property ?? []}
        columns={columns}
        loading={isLoading}
        pagination={pageParams}
        onChange={handlePaginationChange}
        className="mt-2"
      />
    </div>
  )
}
