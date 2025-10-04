'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, GripVertical, Trash2, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useUpdateTaskItem, useGetTaskItemDetail, useGetAccounts, useSubmitTaskItem } from '@/api/app/hooks';
import { CreateTaskItemRequest, TaskGoal } from '@/api/types';

// Form validation schema
const executionCriterionSchema = z.object({
  type: z.number().min(1, "Goal type is required."), // 1 = ImageUpload
  detail: z.string().min(1, "Goal detail cannot be empty."),
  point: z.number().min(0, "Points must be positive."),
});

const taskFormSchema = z.object({
  taskName: z.string().min(1, "Task name is required."),
  taskDescription: z.string().optional(),
  priority: z.enum(['high', 'medium', 'low'], {
    required_error: "Please select a priority level.",
  }),
  startDate: z.date({
    required_error: "Start date is required.",
  }),
  dueDate: z.date({
    required_error: "Due date is required.",
  }),
  assigneeId: z.string().min(1, "Please select an assignee."),
  criteria: z.array(executionCriterionSchema).min(1, "Cần ít nhất một tiêu chuẩn thực thi."),
});

function EditTaskPageContent() {
  const router = useRouter();
  const params = useParams();
  const taskId = params.taskId as string;
  const { toast } = useToast();
  
  // API hooks
  const { data: taskDetail, loading: loadingTask, execute: fetchTaskDetail } = useGetTaskItemDetail();
  const { execute: updateTask, loading: updating, error: updateError } = useUpdateTaskItem();
  const { execute: submitTask, loading: submitting, error: submitError } = useSubmitTaskItem();
  const { data: accounts, loading: loadingAccounts, execute: fetchAccounts } = useGetAccounts();

  // Form setup
  const form = useForm<z.infer<typeof taskFormSchema>>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      taskName: "",
      taskDescription: "",
      priority: 'medium',
      startDate: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      assigneeId: "",
      criteria: [{ type: 1, detail: "", point: 10 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'criteria',
  });

  const watchCriteria = form.watch('criteria');

  // Load data on mount
  React.useEffect(() => {
    if (taskId) {
      fetchTaskDetail(taskId);
    }
    fetchAccounts({});
  }, [taskId]);

  // Populate form when task data is loaded
  React.useEffect(() => {
    if (taskDetail) {
      form.reset({
        taskName: taskDetail.name || "",
        taskDescription: taskDetail.description || "",
        priority: taskDetail.priority === 3 ? 'high' : taskDetail.priority === 2 ? 'medium' : 'low',
        startDate: taskDetail.startAt ? new Date(taskDetail.startAt * 1000) : new Date(),
        dueDate: taskDetail.endAt ? new Date(taskDetail.endAt * 1000) : new Date(),
        assigneeId: taskDetail.assigneeId || "",
        criteria: taskDetail.listGoal && taskDetail.listGoal.length > 0 
          ? taskDetail.listGoal.map(goal => ({
              type: goal.type,
              detail: goal.detail,
              point: goal.point,
            }))
          : [{ type: 1, detail: "", point: 10 }],
      });
    }
  }, [taskDetail, form]);

  async function saveChanges(values: z.infer<typeof taskFormSchema>) {
    try {
      // Convert form data to API format
      const taskGoals: TaskGoal[] = values.criteria.map((criterion) => ({
        type: criterion.type,
        detail: criterion.detail,
        templateData: null, // No template data for ImageUpload type
        point: criterion.point,
      }));

      const taskData = {
        name: values.taskName,
        description: values.taskDescription || null,
        assigneeId: values.assigneeId,
        priority: values.priority === 'high' ? 3 : values.priority === 'medium' ? 2 : 1,
        startAt: Math.floor(values.startDate.getTime() / 1000),
        endAt: Math.floor(values.dueDate.getTime() / 1000),
        listGoal: taskGoals.length > 0 ? taskGoals : null,
      };

      const result = await updateTask({ id: taskId, data: taskData });
      
      if (result) {
        toast({
          title: "Cập nhật thành công",
          description: `Đã cập nhật nhiệm vụ "${values.taskName}" thành công.`,
        });
        router.push("/app/tasks");
      }
    } catch (error) {
      toast({
        title: "Lỗi cập nhật nhiệm vụ",
        description: "Không thể cập nhật nhiệm vụ. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  }

  async function updateAndSubmit(values: z.infer<typeof taskFormSchema>) {
    try {
      // Convert form data to API format
      const taskGoals: TaskGoal[] = values.criteria.map((criterion) => ({
        type: criterion.type,
        detail: criterion.detail,
        templateData: null, // No template data for ImageUpload type
        point: criterion.point,
      }));

      const taskData = {
        name: values.taskName,
        description: values.taskDescription || null,
        assigneeId: values.assigneeId,
        priority: values.priority === 'high' ? 3 : values.priority === 'medium' ? 2 : 1,
        startAt: Math.floor(values.startDate.getTime() / 1000),
        endAt: Math.floor(values.dueDate.getTime() / 1000),
        listGoal: taskGoals.length > 0 ? taskGoals : null,
      };

      // Step 1: Update task
      const updateResult = await updateTask({ id: taskId, data: taskData });
      
      if (updateResult) {
        // Step 2: Submit task
        const submitResult = await submitTask(taskId);
        
        if (submitResult) {
          toast({
            title: "Thành công!",
            description: "Task đã được cập nhật và giao việc thành công.",
          });
          
          router.push('/app/tasks');
        } else {
          toast({
            title: "Lỗi giao việc",
            description: "Task đã cập nhật nhưng không thể giao việc. Vui lòng thử lại.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật và giao task. Vui lòng thử lại.",
        variant: "destructive",
      });
      console.error('Error updating and submitting task:', error);
    }
  }

  if (loadingTask) {
    return (
      <div className="container mx-auto p-4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Đang tải...</h1>
        </div>
      </div>
    );
  }

  if (!taskDetail) {
    return (
      <div className="container mx-auto p-4">
        <div className="mb-4">
          <h1 className="text-2xl font-bold">Không tìm thấy task</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          ← Quay lại
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Chỉnh sửa Task</h1>
          <p className="text-muted-foreground">
            Cập nhật thông tin và tiêu chuẩn thực thi cho task này.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="flex items-center gap-4 mb-4">
            <div className="ml-auto flex items-center gap-2">
              <Button variant="outline" size="sm" type="button" onClick={() => router.back()}>
                Hủy
              </Button>
               <Button variant="secondary" size="sm" type="button" 
                onClick={form.handleSubmit(saveChanges)} 
                disabled={updating}>
                {updating ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
              {taskDetail?.state === 0 && (
                <Button size="sm" type="button" 
                  onClick={form.handleSubmit(updateAndSubmit)} 
                  disabled={updating || submitting}>
                  {(updating || submitting) ? "Đang giao việc..." : "Cập nhật & Giao việc"}
                </Button>
              )}
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Chi tiết Tác vụ</CardTitle>
                  <CardDescription>
                    Cập nhật thông tin cơ bản về tác vụ cần thực hiện.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="taskName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tên tác vụ</FormLabel>
                          <FormControl>
                            <Input placeholder="Nhập tên tác vụ..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="taskDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mô tả chi tiết</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Nhập mô tả chi tiết về tác vụ..."
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tiêu chuẩn thực thi</CardTitle>
                  <CardDescription>
                      Cập nhật các tiêu chuẩn và các bước cần thiết cho tác vụ này.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="multiple" className="w-full space-y-4" defaultValue={[`criterion-0`]}>
                        {fields.map((field, index) => (
                        <AccordionItem key={field.id} value={`criterion-${index}`} className="border-none">
                             <div className="p-4 border rounded-lg space-y-4 relative">
                                <AccordionTrigger className="p-0 hover:no-underline">
                                    <div className="flex items-center gap-2 flex-1">
                                        <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                                        <h4 className="font-semibold flex-1 text-left">
                                          Mục tiêu {index + 1}: {watchCriteria[index]?.detail || <span className="text-muted-foreground font-normal">Chưa có nội dung</span>}
                                        </h4>
                                    </div>
                                </AccordionTrigger>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => remove(index)}
                                    disabled={fields.length <= 1}
                                    className="absolute top-3 right-3"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                                <AccordionContent className="pt-4 space-y-4">
                                    <FormField
                                    control={form.control}
                                    name={`criteria.${index}.type`}
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Loại tiêu chuẩn</FormLabel>
                                        <Select
                                        onValueChange={(value) => field.onChange(parseInt(value))}
                                        value={field.value?.toString()}
                                        >
                                            <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Chọn loại tiêu chuẩn" />
                                            </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="1">
                                                    <div className="flex items-center gap-2">
                                                    <span>Tải ảnh lên (ImageUpload)</span>
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name={`criteria.${index}.detail`}
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Chi tiết mục tiêu</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Nhập chi tiết mục tiêu..." {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <FormField
                                    control={form.control}
                                    name={`criteria.${index}.point`}
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Điểm</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="ví dụ: 10" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))}/>
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                </div>
                                {/* Additional fields for specific criterion types can be added here */}
                                </AccordionContent>
                             </div>
                        </AccordionItem>
                        ))}
                    </Accordion>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      className="w-full border-dashed"
                      onClick={() => append({ type: 1, detail: "", point: 10 })}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm tiêu chuẩn
                    </Button>
                </CardContent>
              </Card>
            </div>
            <div className="grid auto-rows-max items-start gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin thực thi</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mức độ ưu tiên</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Chọn mức độ ưu tiên" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="high">Cao</SelectItem>
                              <SelectItem value="medium">Trung bình</SelectItem>
                              <SelectItem value="low">Thấp</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Lịch trình</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Ngày bắt đầu</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Chọn ngày bắt đầu</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date(new Date().setHours(0, 0, 0, 0))
                                }
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dueDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Hạn hoàn thành</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Chọn hạn hoàn thành</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date(new Date().setHours(0, 0, 0, 0))
                                }
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Phân công</CardTitle>
                </CardHeader>
                <CardContent>
                   <FormField
                    control={form.control}
                    name="assigneeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giao cho người thực hiện</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn người thực hiện" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                             {loadingAccounts ? (
                               <div className="px-2 py-2 text-sm text-muted-foreground">Đang tải...</div>
                             ) : accounts && accounts.length > 0 ? (
                               accounts.map((account) => (
                                 <SelectItem key={account.id} value={account.id}>
                                   {account.name || 'Không có tên'}
                                 </SelectItem>
                               ))
                             ) : (
                               <div className="px-2 py-2 text-sm text-muted-foreground">Không có người dùng nào</div>
                             )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 md:hidden mt-4">
             <Button variant="outline" size="sm" type="button" onClick={() => router.back()}>
                Hủy
              </Button>
               <Button variant="secondary" size="sm" type="button" 
                onClick={form.handleSubmit(saveChanges)} 
                disabled={updating}>
                {updating ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
              {taskDetail?.state === 0 && (
                <Button size="sm" type="button" 
                  onClick={form.handleSubmit(updateAndSubmit)} 
                  disabled={updating || submitting}>
                  {(updating || submitting) ? "Đang giao việc..." : "Cập nhật & Giao việc"}
                </Button>
              )}
          </div>
        </form>
      </Form>
    </div>
  );
}

export default function EditTaskPage() {
  return <EditTaskPageContent />;
}