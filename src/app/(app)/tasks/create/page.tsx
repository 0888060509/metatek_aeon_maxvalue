"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeft,
  GripVertical,
  PlusCircle,
  Trash2,
  Calendar as CalendarIcon,
  UploadCloud,
  Eye,
  Wand2,
  FileText,
  Camera,
  ListChecks,
  Type,
  ListTodo,
} from "lucide-react";
import { format } from "date-fns";
import React from 'react';


import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const checklistItemSchema = z.object({
  label: z.string().min(1, "Checklist item cannot be empty."),
});

const multipleChoiceOptionSchema = z.object({
  label: z.string().min(1, "Option label cannot be empty."),
});

const executionCriterionSchema = z.object({
  type: z.string().min(1, "Criterion type is required."),
  requirement: z.string().min(1, "Requirement cannot be empty."),
  weight: z.number().min(0, "Weight must be positive."),
  autoEvaluate: z.boolean().optional(),
  checklistItems: z.array(checklistItemSchema).optional(),
  multipleChoiceOptions: z.array(multipleChoiceOptionSchema).optional(),
});


const formSchema = z.object({
  taskName: z.string().min(1, "Tên tác vụ là bắt buộc."),
  taskDescription: z.string().optional(),
  priority: z.string().min(1, "Vui lòng chọn mức độ ưu tiên."),
  startDate: z.date({ required_error: "Ngày bắt đầu là bắt buộc." }),
  dueDate: z.date({ required_error: "Ngày hết hạn là bắt buộc." }),
  assigneeRole: z.string().min(1, "Vui lòng chọn vai trò."),
  store: z.string().min(1, "Vui lòng chọn cửa hàng hoặc khu vực."),
  criteria: z.array(executionCriterionSchema).min(1, "Cần ít nhất một tiêu chuẩn thực thi."),
  isRecurring: z.boolean().optional(),
  recurringFrequencyType: z.enum(["weekly", "monthly", "custom"]).optional(),
  recurringWeeklyDays: z.array(z.string()).optional(),
  recurringMonthlyType: z.enum(["day_of_month", "day_of_week"]).optional(),
  recurringMonthlyDay: z.number().optional(),
  recurringCustomValue: z.number().optional(),
  recurringCustomUnit: z.enum(["days", "weeks", "months"]).optional(),
  recurringEndType: z.enum(["never", "on_date", "after_occurrences"]).optional(),
  recurringEndDate: z.date().optional(),
  recurringEndOccurrences: z.number().optional(),
}).refine(data => !data.isRecurring || (data.isRecurring && data.recurringFrequencyType), {
    message: "Frequency type is required for recurring tasks.",
    path: ["recurringFrequencyType"],
}).refine(data => !data.isRecurring || (data.isRecurring && data.recurringEndType), {
    message: "End condition is required for recurring tasks.",
    path: ["recurringEndType"],
});


const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

const sampleTask = {
    taskName: "Kiểm tra trưng bày khuyến mãi Q4",
    taskDescription: "Đảm bảo tất cả các sản phẩm trong chương trình khuyến mãi Q4 được trưng bày đúng theo guideline tại các vị trí nổi bật.",
    priority: 'high',
    assigneeRole: 'store-manager',
    store: 'region-west',
    criteria: [
        { type: 'photo-upload', requirement: "Chụp ảnh toàn cảnh khu vực trưng bày", weight: 40, autoEvaluate: true, checklistItems: [], multipleChoiceOptions: [] },
        { type: 'pdf-upload', requirement: "Đối chiếu và xác nhận danh sách sản phẩm trưng bày", weight: 60, autoEvaluate: false, checklistItems: [], multipleChoiceOptions: [] },
    ],
    isRecurring: false,
};


function CreateTaskPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  const isClone = searchParams.get('clone') === 'true';

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskName: "",
      taskDescription: "",
      priority: "medium",
      criteria: [{ type: 'photo-upload', requirement: "", weight: 100, autoEvaluate: false, checklistItems: [], multipleChoiceOptions: [] }],
      isRecurring: false,
      assigneeRole: "store-manager",
      recurringEndType: "never",
    },
  });

  React.useEffect(() => {
    if (isClone) {
        form.reset({
            ...sampleTask,
            // @ts-ignore
            startDate: null,
            // @ts-ignore
            dueDate: null,
        });
         toast({
            title: "Tác vụ đã được sao chép",
            description: "Vui lòng điền Ngày bắt đầu và Ngày hết hạn mới.",
        });
    }
  }, [isClone, form, toast]);


  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "criteria",
  });
  
  const watchCriteria = form.watch("criteria");

  const watchIsRecurring = form.watch("isRecurring");
  const watchRecurringFrequencyType = form.watch("recurringFrequencyType");
  const watchRecurringEndType = form.watch("recurringEndType");
  const watchWeeklyDays = form.watch("recurringWeeklyDays", []);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Submitted values:", values);
    toast({
      title: "Giao việc thành công",
      description: `Đã giao tác vụ "${values.taskName}" thành công.`,
    });
    router.push("/tasks");
  }

  function onSaveDraft() {
    const values = form.getValues();
    console.log("Saving draft:", values);
    toast({
        title: "Lưu nháp thành công",
        description: `Tác vụ "${values.taskName}" đã được lưu vào bản nháp.`,
    });
    router.push("/tasks");
  }

  function handleCreateFromTemplate() {
    form.reset({
        ...sampleTask,
        // @ts-ignore
        startDate: null, 
        // @ts-ignore
        dueDate: null,
    });
    toast({
        title: "Đã tải mẫu tác vụ",
        description: "Vui lòng điền các thông tin còn lại và phân công.",
    });
  }
  
  const renderCriterionSpecificFields = (criterionIndex: number) => {
    const criterionType = watchCriteria[criterionIndex]?.type;

    switch (criterionType) {
        case 'checklist':
            return <ChecklistFields criterionIndex={criterionIndex} control={form.control} />;
        case 'multiple-choice':
            return <MultipleChoiceFields criterionIndex={criterionIndex} control={form.control} />;
        default:
            return null;
    }
  };

  const renderMobilePreview = () => (
    <div className="w-full max-w-[360px] mx-auto bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <div className="space-y-4">
        <h2 className="text-xl font-bold">{form.getValues("taskName") || "Tên tác vụ mẫu"}</h2>
        <div className="flex items-center space-x-2 text-sm">
            <span className={cn(
                "px-2 py-0.5 rounded-full text-xs font-semibold",
                form.getValues("priority") === "high" && "bg-destructive text-destructive-foreground",
                form.getValues("priority") === "medium" && "bg-warning text-warning-foreground",
                form.getValues("priority") === "low" && "bg-blue-500 text-white"
            )}>
                {form.getValues("priority") || "Ưu tiên"}
            </span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-500">Đến hạn: {form.getValues("dueDate") ? format(form.getValues("dueDate"), "dd/MM/yyyy") : "N/A"}</span>
        </div>
        <div className="prose prose-sm dark:prose-invert max-w-none">
            <p>{form.getValues("taskDescription") || "Đây là nơi hiển thị mô tả chi tiết của công việc. Nội dung có thể bao gồm hướng dẫn, ghi chú quan trọng và các yêu cầu khác."}</p>
        </div>

        <div>
            <h3 className="font-semibold mb-2">Tiêu chuẩn thực thi</h3>
            <div className="space-y-3">
                {fields.map((field, index) => (
                    <div key={field.id} className="bg-white dark:bg-gray-700 p-3 rounded-md border border-gray-200 dark:border-gray-600">
                        <div className="flex justify-between items-center">
                            <label className="flex items-center space-x-2">
                                <Checkbox disabled />
                                <span className="text-sm">{form.getValues(`criteria.${index}.requirement`) || `Yêu cầu cho tiêu chuẩn ${index + 1}`}</span>
                            </label>
                            {form.getValues(`criteria.${index}.autoEvaluate`) && <span className="text-xs font-semibold text-primary">AI</span>}
                        </div>
                         <p className="text-xs text-muted-foreground mt-1 pl-6">
                            {
                                {
                                    'pdf-upload': 'Tải lên tệp PDF',
                                    'photo-upload': 'Tải lên hình ảnh',
                                    'checklist': 'Hoàn thành checklist',
                                    'text-input': 'Nhập văn bản',
                                    'number-input': 'Nhập số liệu',
                                    'multiple-choice': 'Chọn một đáp án'
                                }[form.getValues(`criteria.${index}.type`)]
                            }
                        </p>
                    </div>
                ))}
            </div>
        </div>
        <Button className="w-full">Bắt đầu thực hiện</Button>
    </div>
  );

  return (
    <div className="mx-auto grid max-w-5xl flex-1 auto-rows-max gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="icon" className="h-7 w-7" asChild>
              <Link href="/tasks">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back</span>
              </Link>
            </Button>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              {isClone ? "Sao chép Tác vụ" : "Tạo Tác vụ Mới"}
            </h1>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
                 <Button variant="outline" size="sm" type="button" onClick={handleCreateFromTemplate}><Wand2 className="mr-2 h-4 w-4" /> Tạo từ mẫu</Button>
                <Dialog>
                    <DialogTrigger asChild>
                         <Button variant="outline" size="sm" type="button"><Eye className="mr-2 h-4 w-4" /> Xem trước</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                        <DialogTitle>Xem trước trên di động</DialogTitle>
                        <DialogDescription>
                            Đây là cách tác vụ sẽ hiển thị trên ứng dụng của nhân viên.
                        </DialogDescription>
                        </DialogHeader>
                        {renderMobilePreview()}
                    </DialogContent>
                </Dialog>
              <Button variant="outline" size="sm" type="button" onClick={() => router.back()}>
                Hủy
              </Button>
               <Button variant="secondary" size="sm" type="button" onClick={onSaveDraft}>
                Lưu nháp
              </Button>
              <Button size="sm" type="submit">
                Giao việc
              </Button>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Chi tiết Tác vụ</CardTitle>
                  <CardDescription>
                    Điền các thông tin chính của tác vụ.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="taskName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên tác vụ</FormLabel>
                        <FormControl>
                          <Input placeholder="ví dụ: Kiểm tra trưng bày khuyến mãi Q3" {...field} />
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
                        <FormLabel>Mô tả chi tiết (Tùy chọn)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Nhập nội dung hướng dẫn cho người thực thi..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                                    <span>Chọn ngày</span>
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
                                initialFocus
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
                          <FormLabel>Ngày hết hạn</FormLabel>
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
                                    <span>Chọn ngày</span>
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
                                initialFocus
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
                  <CardTitle>Tiêu chuẩn thực thi</CardTitle>
                  <CardDescription>
                      Định nghĩa các tiêu chuẩn và các bước cần thiết cho tác vụ này.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-lg space-y-4">
                       <div className="flex items-center gap-2">
                        <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                        <h4 className="font-semibold flex-1">Tiêu chuẩn {index + 1}</h4>
                         <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            disabled={fields.length <= 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                      </div>

                      <FormField
                        control={form.control}
                        name={`criteria.${index}.type`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Loại tiêu chuẩn</FormLabel>
                             <Select onValueChange={(value) => {
                                 field.onChange(value);
                                 // Reset specific fields when type changes
                                 const currentCriterion = form.getValues(`criteria.${index}`);
                                 update(index, {
                                     ...currentCriterion,
                                     type: value,
                                     checklistItems: value === 'checklist' ? [{ label: '' }] : [],
                                     multipleChoiceOptions: value === 'multiple-choice' ? [{ label: '' }] : []
                                 });
                             }} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Chọn loại tiêu chuẩn" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="photo-upload">
                                    <div className="flex items-center gap-2">
                                      <Camera className="h-4 w-4"/>
                                      <span>Chụp ảnh</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="pdf-upload">
                                    <div className="flex items-center gap-2">
                                      <FileText className="h-4 w-4"/>
                                      <span>Tải lên tệp PDF</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="checklist">
                                    <div className="flex items-center gap-2">
                                      <ListChecks className="h-4 w-4"/>
                                      <span>Checklist</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="text-input">
                                    <div className="flex items-center gap-2">
                                      <Type className="h-4 w-4"/>
                                      <span>Nhập liệu (văn bản)</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="number-input">
                                    <div className="flex items-center gap-2">
                                      <Type className="h-4 w-4"/>
                                      <span>Nhập liệu (số)</span>
                                    </div>
                                  </SelectItem>
                                   <SelectItem value="multiple-choice">
                                    <div className="flex items-center gap-2">
                                      <ListTodo className="h-4 w-4"/>
                                      <span>Câu hỏi Trắc nghiệm</span>
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
                        name={`criteria.${index}.requirement`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nội dung yêu cầu</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Nhập nội dung yêu cầu/câu hỏi..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      {renderCriterionSpecificFields(index)}

                      <div className="grid grid-cols-2 gap-4">
                         <FormField
                          control={form.control}
                          name={`criteria.${index}.weight`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Trọng số/Điểm</FormLabel>
                              <FormControl>
                                  <Input type="number" placeholder="ví dụ: 100" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))}/>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                         <FormField
                          control={form.control}
                          name={`criteria.${index}.autoEvaluate`}
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 mt-4">
                               <div className="space-y-0.5">
                                <FormLabel>Tự động đánh giá bằng AI</FormLabel>
                                <FormDescription>
                                  Chỉ áp dụng cho Chụp ảnh/PDF.
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                  disabled={!['photo-upload', 'pdf-upload'].includes(watchCriteria[index]?.type)}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                       <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => append({ type: 'photo-upload', requirement: "", weight: 100, autoEvaluate: false, checklistItems: [], multipleChoiceOptions: [] })}
                          >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Thêm Tiêu chuẩn
                      </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid auto-rows-max items-start gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Phân công</CardTitle>
                  <CardDescription>
                    Gán tác vụ này cho một cửa hàng hoặc khu vực cụ thể.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="store"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cửa hàng / Khu vực</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn cửa hàng hoặc khu vực" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all-system">Toàn hệ thống</SelectItem>
                            <SelectItem value="region-west">Khu vực: Miền Tây</SelectItem>
                            <SelectItem value="region-east">Khu vực: Miền Đông</SelectItem>
                            <SelectItem value="store-123">Cửa hàng #123 (Trung tâm)</SelectItem>
                            <SelectItem value="store-456">Cửa hàng #456 (Ngoại ô)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="assigneeRole"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giao cho Vai trò</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn một vai trò" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                             <SelectItem value="store-manager">Cửa hàng trưởng</SelectItem>
                             <SelectItem value="shift-supervisor">Giám sát ca</SelectItem>
                             <SelectItem value="field-staff">Nhân viên</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
               <Card>
                    <CardHeader>
                    <CardTitle>Lên lịch</CardTitle>
                    <CardDescription>Cấu hình cài đặt tác vụ lặp lại.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                    <FormField
                        control={form.control}
                        name="isRecurring"
                        render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                            <div className="space-y-0.5">
                            <FormLabel>Lặp lại Tác vụ</FormLabel>
                            </div>
                            <FormControl>
                            <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                            />
                            </FormControl>
                        </FormItem>
                        )}
                    />
                    {watchIsRecurring && (
                        <div className="space-y-4 pt-2">
                        <FormField
                            control={form.control}
                            name="recurringFrequencyType"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tần suất</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                    <SelectValue placeholder="Chọn tần suất" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="weekly">Hàng tuần</SelectItem>
                                    <SelectItem value="monthly">Hàng tháng</SelectItem>
                                    <SelectItem value="custom">Tùy chỉnh</SelectItem>
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        {watchRecurringFrequencyType === 'weekly' && (
                            <FormField
                                control={form.control}
                                name="recurringWeeklyDays"
                                render={() => (
                                <FormItem>
                                    <FormLabel>Vào các ngày</FormLabel>
                                    <div className="grid grid-cols-4 gap-2">
                                        {daysOfWeek.map(day => (
                                            <Button
                                                key={day}
                                                type="button"
                                                variant={watchWeeklyDays.includes(day) ? 'secondary' : 'outline'}
                                                size="sm"
                                                onClick={() => {
                                                    const currentDays = form.getValues('recurringWeeklyDays') || [];
                                                    const newDays = currentDays.includes(day)
                                                    ? currentDays.filter(d => d !== day)
                                                    : [...currentDays, day];
                                                    form.setValue('recurringWeeklyDays', newDays, { shouldValidate: true });
                                                }}
                                                className="capitalize"
                                            >
                                                {day.substring(0,3)}
                                            </Button>
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        )}

                        {watchRecurringFrequencyType === 'monthly' && (
                            <FormField
                                control={form.control}
                                name="recurringMonthlyDay"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Vào ngày</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="ví dụ: 15" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10) || 0)} min={1} max={31}/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        <FormField
                            control={form.control}
                            name="recurringEndType"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Kết thúc lặp lại</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        className="flex flex-col space-y-1"
                                        >
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                            <RadioGroupItem value="never" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Không bao giờ</FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                            <RadioGroupItem value="on_date" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Vào ngày</FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                            <RadioGroupItem value="after_occurrences" />
                                            </FormControl>
                                            <FormLabel className="font-normal">Sau</FormLabel>
                                        </FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {watchRecurringEndType === 'on_date' && (
                             <FormField
                                control={form.control}
                                name="recurringEndDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
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
                                                <span>Chọn ngày kết thúc</span>
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
                                            initialFocus
                                        />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                         {watchRecurringEndType === 'after_occurrences' && (
                             <FormField
                                control={form.control}
                                name="recurringEndOccurrences"
                                render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="flex items-center gap-2">
                                            <Input type="number" className="w-20" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} />
                                            <span>lần lặp lại</span>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        )}
                        </div>
                    )}
                    </CardContent>
                </Card>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 md:hidden mt-4">
             <Button variant="outline" size="sm" type="button" onClick={() => router.back()}>
                Hủy
              </Button>
               <Button variant="secondary" size="sm" type="button" onClick={onSaveDraft}>
                Lưu nháp
              </Button>
              <Button size="sm" type="submit">
                Giao việc
              </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}


// --- Sub-components for specific criterion types ---

interface CriterionFieldProps {
  criterionIndex: number;
  control: any;
}

const ChecklistFields: React.FC<CriterionFieldProps> = ({ criterionIndex, control }) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `criteria.${criterionIndex}.checklistItems`
    });

    return (
        <div className="space-y-2 pt-2">
            <FormLabel>Các mục trong checklist</FormLabel>
            {fields.map((item, k) => (
                <div key={item.id} className="flex items-center gap-2">
                    <FormField
                        control={control}
                        name={`criteria.${criterionIndex}.checklistItems.${k}.label`}
                        render={({ field }) => (
                            <FormItem className="flex-1">
                                <FormControl>
                                    <Input {...field} placeholder={`Mục ${k + 1}`} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(k)} disabled={fields.length <=1}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ))}
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ label: '' })}
            >
                <PlusCircle className="mr-2 h-4 w-4" /> Thêm mục
            </Button>
        </div>
    );
};

const MultipleChoiceFields: React.FC<CriterionFieldProps> = ({ criterionIndex, control }) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `criteria.${criterionIndex}.multipleChoiceOptions`
    });

    return (
        <div className="space-y-2 pt-2">
            <FormLabel>Các lựa chọn</FormLabel>
            {fields.map((item, k) => (
                <div key={item.id} className="flex items-center gap-2">
                    <FormField
                        control={control}
                        name={`criteria.${criterionIndex}.multipleChoiceOptions.${k}.label`}
                        render={({ field }) => (
                             <FormItem className="flex-1">
                                <FormControl>
                                    <Input {...field} placeholder={`Lựa chọn ${k + 1}`} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => remove(k)} disabled={fields.length <=1}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ))}
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ label: '' })}
            >
                <PlusCircle className="mr-2 h-4 w-4" /> Thêm lựa chọn
            </Button>
        </div>
    );
};


export default function CreateTaskPage() {
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <CreateTaskPageContent />
        </React.Suspense>
    );
}

    