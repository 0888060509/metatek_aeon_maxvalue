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
} from "lucide-react";

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

const taskStepSchema = z.object({
  instruction: z.string().min(1, "Instruction cannot be empty."),
});

const formSchema = z.object({
  taskName: z.string().min(1, "Task name is required."),
  taskDescription: z.string().optional(),
  assignee: z.string().min(1, "Please select an assignee."),
  store: z.string().min(1, "Please select a store or region."),
  steps: z.array(taskStepSchema).min(1, "At least one step is required."),
});

export default function CreateTaskPage() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      taskName: "",
      taskDescription: "",
      steps: [{ instruction: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "steps",
  });

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
                Save Task
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
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Task Steps</CardTitle>
                  <CardDescription>
                      Define the steps required to complete this task.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fields.map((field, index) => (
                    <FormField
                      key={field.id}
                      control={form.control}
                      name={`steps.${index}.instruction`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="sr-only">Step {index + 1}</FormLabel>
                          <div className="flex items-center gap-2">
                            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                            <FormControl>
                              <Input placeholder={`Step ${index + 1} instruction...`} {...field} />
                            </FormControl>
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                  <div className="flex items-center gap-2">
                       <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => append({ instruction: "" })}
                          >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add Step
                      </Button>
                      <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          >
                          <Wand2 className="h-4 w-4 mr-2" />
                          Generate with AI
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
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 md:hidden mt-4">
            <Button variant="outline" size="sm" type="button" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button size="sm" type="submit">
              Save Task
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
