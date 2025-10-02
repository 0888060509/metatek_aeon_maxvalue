
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";


export default function FieldTaskDetailPage({ params }: { params: { taskId: string } }) {

  // In a real app, you would fetch task details based on params.taskId
  const task = {
    id: params.taskId,
    title: 'Sanitation Audit',
    description: 'Perform a comprehensive sanitation audit of the store premises, including shelves, floors, and storage areas. Ensure compliance with health and safety regulations.',
    store: 'Uptown',
    dueDate: '2023-10-20',
  };

  return (
    <div className="space-y-4">
        <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                <Link href="/field-tasks">
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Back to tasks</span>
                </Link>
            </Button>
            <h1 className="text-2xl font-bold flex-1 truncate">{task.title}</h1>
        </div>
       
        <Card>
            <CardHeader>
                <CardTitle>Task Details</CardTitle>
                <CardDescription>{task.store} - Due: {task.dueDate}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{task.description}</p>
                <div className="mt-6">
                    <h3 className="font-semibold mb-2">Requirements</h3>
                    <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg bg-secondary/50">
                        <h3 className="text-lg font-semibold">Task Execution UI</h3>
                        <p className="text-muted-foreground mt-2 text-sm">The UI for capturing photos, filling checklists, and submitting the report will be displayed here.</p>
                    </div>
                </div>
            </CardContent>
        </Card>

         <Button size="lg" className="w-full">
            Submit Report
        </Button>
    </div>
  );
}
