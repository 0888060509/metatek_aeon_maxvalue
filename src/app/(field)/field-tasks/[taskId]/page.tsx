
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, RefreshCw, FileText } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


// In a real app, you would fetch task details based on params.taskId
const tasks = {
    'TSK-002': {
        id: 'TSK-002',
        title: 'Sanitation Audit',
        description: 'Perform a comprehensive sanitation audit of the store premises, including shelves, floors, and storage areas. Ensure compliance with health and safety regulations.',
        store: 'Uptown',
        dueDate: '2023-10-20',
        status: 'In Progress',
        rejectionReason: null,
    },
    'TSK-003': {
        id: 'TSK-003',
        title: 'Holiday Promo Setup',
        description: 'Set up the main promotional display for the holiday season according to the provided planogram.',
        store: 'Eastside',
        dueDate: '2023-10-18',
        status: 'Rework',
        rejectionReason: 'Sản phẩm "Festive Soda" đặt sai vị trí so với planogram. Planogram yêu cầu đặt ở kệ thứ 2, ảnh chụp cho thấy sản phẩm ở kệ thứ 3.',
    },
    'TSK-001': {
        id: 'TSK-001',
        title: 'Q3 Product Display Check',
        description: 'Review the product displays for the Q3 campaign to ensure they are compliant with brand guidelines.',
        store: 'Downtown',
        dueDate: '2023-10-15',
        status: 'Completed',
        rejectionReason: null,
    }
};


export default function FieldTaskDetailPage({ params }: { params: { taskId: string } }) {

  const task = tasks[params.taskId as keyof typeof tasks] || tasks['TSK-002'];

  const isRework = task.status === 'Rework';
  const isCompleted = task.status === 'Completed';

  const getAction = () => {
    if (isCompleted) {
        return (
            <Button size="lg" className="w-full" asChild>
                <Link href={`/app/reviews/REV-001`}> 
                    Xem lại báo cáo đã nộp
                </Link>
            </Button>
        );
    }
    if (isRework) {
        return (
             <Button size="lg" className="w-full" asChild>
                <Link href={`/field-tasks/${task.id}/execute?rework=true`}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Bắt đầu làm lại
                </Link>
            </Button>
        );
    }
    return (
        <Button size="lg" className="w-full" asChild>
            <Link href={`/field-tasks/${task.id}/execute`}>
                Bắt đầu thực hiện
            </Link>
        </Button>
    );
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
       
        {isRework && task.rejectionReason && (
            <Alert variant="destructive">
                <RefreshCw className="h-4 w-4" />
                <AlertTitle>Yêu cầu làm lại</AlertTitle>
                <AlertDescription>
                    {task.rejectionReason}
                </AlertDescription>
            </Alert>
        )}

        <Card>
            <CardHeader>
                <CardTitle>Chi tiết tác vụ</CardTitle>
                <CardDescription>{task.store} - Hạn chót: {task.dueDate}</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-muted-foreground">{task.description}</p>
                <div className="mt-6">
                    <h3 className="font-semibold mb-2">Tài liệu & Yêu cầu</h3>
                     <Button variant="outline" size="sm" className="mt-1">
                        <FileText className="mr-2 h-4 w-4" />
                        Xem Planogram.pdf
                    </Button>
                </div>
            </CardContent>
        </Card>

        {getAction()}
    </div>
  );
}

