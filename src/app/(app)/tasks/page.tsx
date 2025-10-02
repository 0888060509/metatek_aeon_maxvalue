import Link from 'next/link';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const tasks = [
    { id: 'TSK-001', title: 'Q3 Product Display Check', store: 'Downtown', region: 'West', assignedTo: 'Ana Miller', status: 'Completed', dueDate: '2023-10-15' },
    { id: 'TSK-002', title: 'Sanitation Audit', store: 'Uptown', region: 'West', assignedTo: 'John Smith', status: 'Pending Approval', dueDate: '2023-10-20' },
    { id: 'TSK-003', title: 'Holiday Promo Setup', store: 'Eastside', region: 'East', assignedTo: 'Clara Garcia', status: 'Issue', dueDate: '2023-10-18' },
    { id: 'TSK-004', title: 'Weekly Stock Count', store: 'Suburbia', region: 'North', assignedTo: 'Robert Brown', status: 'Overdue', dueDate: '2023-10-12' },
    { id: 'TSK-005', title: 'Fire Safety Inspection', store: 'Downtown', region: 'West', assignedTo: 'Ana Miller', status: 'In Progress', dueDate: '2023-10-25' },
    { id: 'TSK-006', title: 'New Employee Onboarding', store: 'Uptown', region: 'West', assignedTo: 'HR Dept', status: 'Completed', dueDate: '2023-10-05' },
];

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'Completed':
            return <Badge className="bg-success hover:bg-success/90 text-success-foreground">Completed</Badge>;
        case 'Pending Approval':
            return <Badge className="bg-warning hover:bg-warning/90 text-warning-foreground">Pending Approval</Badge>;
        case 'Issue':
            return <Badge variant="destructive">Issue</Badge>;
        case 'Overdue':
            return <Badge className="bg-info hover:bg-info/90 text-info-foreground">Overdue</Badge>;
        case 'In Progress':
            return <Badge variant="secondary">In Progress</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
};


export default function TasksPage() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
            <CardTitle>Tasks</CardTitle>
            <CardDescription>Manage and track all tasks across your organization.</CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-2">
            <Button asChild size="sm" className="gap-1">
                <Link href="/tasks/create">
                    <PlusCircle className="h-4 w-4" />
                    Create Task
                </Link>
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Store / Region</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.id}</TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.store} / {task.region}</TableCell>
                <TableCell>{task.assignedTo}</TableCell>
                <TableCell>{getStatusBadge(task.status)}</TableCell>
                <TableCell>{task.dueDate}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
