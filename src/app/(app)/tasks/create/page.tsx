"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  GripVertical,
  PlusCircle,
  Trash2,
  Wand2,
  Calendar as CalendarIcon,
  UploadCloud,
} from "lucide-react";
import { format } from "date-fns";

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

const executionCriterionSchema = z.object({
  type: z.string().min(1, "Criterion type is required."),
  requirement: z.string().min(1, "Requirement cannot be empty."),
  weight: z.number().min(0, "Weight must be positive."),
  autoEvaluate: z.boolean().optional(),
});

const formSchema = z.object({
  taskName: z.string().min(1, "Task name is required."),
  taskDescription: z.string().optional(),
  priority: z.string().min(1, "Please select a priority."),
  startDate: z.date(),
  dueDate: z.date(),
  assignee: z.string().min(1, "Please select an assignee."),
  store: z.string().min(1, "Please select a store or region."),
  criteria: z.array(executionCriterionSchema).min(1, "At least one execution criterion is required."),
  isRecurring: z.boolean().optional(),
  recurringFrequency: z.string().optional(),
});

export default function CreateTaskPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskName: "",
      taskDescription: "",
      priority: "medium",
      startDate: new Date(),
      criteria: [{ type: 'pdf-upload', requirement: "", weight: 100, autoEvaluate: false }],
      isRecurring: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "criteria",
  });

  const watchIsRecurring = form.watch("isRecurring");

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: "Task Created",
      description: `Task "${values.taskName}" has been successfully created.`,
    });
    router.push("/tasks");
  }

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
              Create New Task
            </h1>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button variant="outline" size="sm" type="button" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button size="sm" type="submit">
                Assign Task
              </Button>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Task Details</CardTitle>
                  <CardDescription>
                    Fill in the main details of the task.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="taskName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Task Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Q3 Promotion Setup" {...field} />
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
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Add a brief description about what this task entails."
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
                          <FormLabel>Priority</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
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
                          <FormLabel>Start Date</FormLabel>
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
                                    <span>Pick a date</span>
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
                          <FormLabel>Due Date</FormLabel>
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
                                    <span>Pick a date</span>
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
                  <CardTitle>Execution Criteria</CardTitle>
                  <CardDescription>
                      Define the standards and steps required for this task.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-lg space-y-4">
                       <div className="flex items-center gap-2">
                        <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                        <h4 className="font-semibold flex-1">Criterion {index + 1}</h4>
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
                            <FormLabel>Criterion Type</FormLabel>
                             <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select criterion type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="pdf-upload">
                                    <div className="flex items-center gap-2">
                                      <UploadCloud className="h-4 w-4"/>
                                      <span>Upload PDF File</span>
                                    </div>
                                  </SelectItem>
                                  <SelectItem value="photo-upload">
                                    <div className="flex items-center gap-2">
                                      <UploadCloud className="h-4 w-4"/>
                                      <span>Upload Photo</span>
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
                            <FormLabel>Requirement</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Enter requirement content..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-2 gap-4">
                         <FormField
                          control={form.control}
                          name={`criteria.${index}.weight`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Weight/Score</FormLabel>
                              <FormControl>
                                  <Input type="number" placeholder="e.g. 100" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))}/>
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
                                <FormLabel>Evaluate with AI</FormLabel>
                                <FormDescription>
                                  Automatically evaluate PDF uploads.
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
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
                          onClick={() => append({ type: 'pdf-upload', requirement: "", weight: 100, autoEvaluate: false })}
                          >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add Criterion
                      </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid auto-rows-max items-start gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Assignment</CardTitle>
                  <CardDescription>
                    Assign this task to a specific store or team.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="store"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Store / Region</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a store or region" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all-system">All System</SelectItem>
                            <SelectItem value="region-west">Region: West</SelectItem>
                            <SelectItem value="region-east">Region: East</SelectItem>
                            <SelectItem value="store-123">Store #123 (Downtown)</SelectItem>
                            <SelectItem value="store-456">Store #456 (Uptown)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <FormField
                    control={form.control}
                    name="assignee"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Assignee</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an assignee" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                             <SelectItem value="ana-miller">Ana Miller</SelectItem>
                             <SelectItem value="john-smith">John Smith</SelectItem>
                             <SelectItem value="clara-garcia">Clara Garcia</SelectItem>
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
                  <CardTitle>Scheduling</CardTitle>
                  <CardDescription>Configure recurring task settings.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name="isRecurring"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                          <div className="space-y-0.5">
                            <FormLabel>Repeat Task</FormLabel>
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
                       <FormField
                          control={form.control}
                          name="recurringFrequency"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Frequency</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select frequency" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="daily">Daily</SelectItem>
                                  <SelectItem value="weekly">Weekly</SelectItem>
                                  <SelectItem value="monthly">Monthly</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 md:hidden mt-4">
            <Button variant="outline" size="sm" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button size="sm" type="submit">
              Assign Task
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

    