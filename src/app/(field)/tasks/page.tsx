
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, Clock, Info, CheckCircle2 } from "lucide-react";

const tasks = [
    { id: 'TSK-002', title: 'Sanitation Audit', store: 'Uptown', status: 'In Progress', dueDate: '2023-10-20', points: 150 },
    { id: 'TSK-003', title: 'Holiday Promo Setup', store: 'Eastside', status: 'In Progress', dueDate: '2023-10-18', points: 250 },
    { id: 'TSK-004', title: 'Weekly Stock Count', store: 'Suburbia', status: 'Overdue', dueDate: '2023-10-12', points: 100 },
    { id: 'TSK-005', title: 'Fire Safety Inspection', store: 'Downtown', status: 'New', dueDate: '2023-10-25', points: 200 },
    { id: 'TSK-001', title: 'Q3 Product Display Check', store: 'Downtown', status: 'Completed', dueDate: '2023-10-15', points: 120 },
];

const getStatusInfo = (status: string) => {
    switch (status) {
        case 'New':
            return {
                badge: <Badge variant="secondary">New</Badge>,
                icon: <Info className="h-4 w-4 text-muted-foreground" />,
                textColor: 'text-foreground'
            };
        case 'In Progress':
            return {
                badge: <Badge className="bg-info text-info-foreground hover:bg-info/90">In Progress</Badge>,
                icon: <Clock className="h-4 w-4 text-info" />,
                textColor: 'text-info-foreground'
            };
        case 'Overdue':
            return {
                badge: <Badge variant="destructive">Overdue</Badge>,
                icon: <Clock className="h-4 w-4 text-destructive" />,
                textColor: 'text-destructive'
            };
        case 'Completed':
            return {
                badge: <Badge className="bg-success text-success-foreground hover:bg-success/90">Completed</Badge>,
                icon: <CheckCircle2 className="h-4 w-4 text-success" />,
                textColor: 'text-success-foreground'
            };
        default:
            return {
                badge: <Badge variant="outline">{status}</Badge>,
                icon: <Info className="h-4 w-4 text-muted-foreground" />,
                textColor: 'text-muted-foreground'
            };
    }
};

export default function FieldTasksPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">My Tasks</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map(task => {
            const statusInfo = getStatusInfo(task.status);
            return (
                <Card key={task.id}>
                    <CardHeader>
                        <CardTitle className="line-clamp-2">{task.title}</CardTitle>
                        <CardDescription>{task.store}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                       <div className="flex items-center gap-2 text-sm">
                           {statusInfo.icon}
                           <span className={statusInfo.textColor}>Due: {task.dueDate}</span>
                       </div>
                       <div className="flex items-center">
                           {statusInfo.badge}
                       </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <span className="font-semibold">{task.points} pts</span>
                        <Button asChild variant="outline" size="sm">
                            <Link href={`/tasks/${task.id}`}>
                                {task.status === 'Completed' ? 'View Report' : 'Start Task'}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            )
        })}
      </div>
    </div>
  );
}
