
'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  ColumnFiltersState,
  SortingState,
  PaginationState,
} from '@tanstack/react-table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/ui/data-table';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import {
    CheckCircle,
    XCircle,
    ChevronLeft,
    MoreHorizontal,
    FileText,
} from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// --- Mock Data ---

const taskDetails = {
    id: 'TSK-002',
    title: 'Sanitation Audit',
    description: 'Perform a comprehensive sanitation audit of the store premises, including shelves, floors, and storage areas. Ensure compliance with health and safety regulations.',
    status: 'Pending Approval',
    dueDate: '2023-10-20',
    priority: 'High',
    assignedTo: 'Store Manager',
    store: 'All Stores',
    region: 'All Regions',
};

type Submission = {
  reviewId: string;
  store: string;
  submittedBy: string;
  submittedAt: string;
  aiStatus: 'Đạt' | 'Không Đạt' | 'Lỗi';
  reviewStatus: 'Pending' | 'Approved' | 'Rework'
};

const initialSubmissions: Submission[] = [
    { reviewId: 'REV-001', store: 'Uptown', submittedBy: 'John Smith', submittedAt: '2023-10-20', aiStatus: 'Đạt', reviewStatus: 'Approved' },
    { reviewId: 'REV-008', store: 'Downtown', submittedBy: 'Michael Johnson', submittedAt: '2023-10-19', aiStatus: 'Không Đạt', reviewStatus: 'Rework' },
    { reviewId: 'REV-012', store: 'Suburbia', submittedBy: 'Emily White', submittedAt: '2023-10-20', aiStatus: 'Đạt', reviewStatus: 'Pending' },
    { reviewId: 'REV-015', store: 'Eastside', submittedBy: 'Jessica Brown', submittedAt: '2023-10-21', aiStatus: 'Lỗi', reviewStatus: 'Pending' },
];

// --- Badge Components ---

const getAiStatusBadge = (status: Submission['aiStatus']) => {
  switch (status) {
    case 'Đạt':
      return <Badge className="bg-success hover:bg-success/90 text-success-foreground"><CheckCircle className="mr-1 h-3 w-3" />Đạt</Badge>;
    case 'Không Đạt':
      return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Không Đạt</Badge>;
    default:
      return <Badge variant="outline">Lỗi</Badge>;
  }
};

const getReviewStatusBadge = (status: Submission['reviewStatus']) => {
  switch (status) {
    case 'Approved':
      return <Badge className="bg-success hover:bg-success/90 text-success-foreground">Approved</Badge>;
    case 'Rework':
      return <Badge variant="destructive">Rework</Badge>;
    case 'Pending':
       return <Badge className="bg-warning hover:bg-warning/90 text-warning-foreground">Pending</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
};

const getTaskStatusBadge = (status: string) => {
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
    case 'Draft':
      return <Badge variant="outline">Draft</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};


// --- Table Columns Definition ---

const columns: ColumnDef<Submission>[] = [
  {
    accessorKey: 'store',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Store" />,
  },
  {
    accessorKey: 'submittedBy',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Submitted By" />,
  },
  {
    accessorKey: 'submittedAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Submitted At" />,
  },
  {
    accessorKey: 'aiStatus',
    header: ({ column }) => <DataTableColumnHeader column={column} title="AI Status" />,
    cell: ({ row }) => getAiStatusBadge(row.getValue('aiStatus')),
  },
   {
    accessorKey: 'reviewStatus',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Review Status" />,
    cell: ({ row }) => getReviewStatusBadge(row.getValue('reviewStatus')),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <Link href={`/app/reviews/${row.original.reviewId}`} className="text-sm font-medium text-primary hover:underline">
          View Details
        </Link>
      );
    },
  },
];


// --- Main Component ---

export default function TaskDetailPage({ params }: { params: { taskId: string } }) {
  const [data] = React.useState<Submission[]>(() => [...initialSubmissions]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
  });

  // Find the task based on params.taskId - in a real app, this would be a fetch call.
  const task = taskDetails; 

  if (!task) {
    return <div>Task not found</div>;
  }

  return (
    <div className="space-y-6">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="h-7 w-7" asChild>
                <Link href="/app/tasks">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Back to tasks</span>
                </Link>
            </Button>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                {task.title}
            </h1>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Task Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit Task</DropdownMenuItem>
                        <DropdownMenuItem>Duplicate Task</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Archive Task</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>

        <Card>
            <CardHeader>
                <CardTitle>Task Summary</CardTitle>
                <CardDescription>
                    Overview of the task details and requirements.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{task.description}</p>
                <Separator />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="space-y-1">
                        <p className="text-muted-foreground">Status</p>
                        <div>{getTaskStatusBadge(task.status)}</div>
                    </div>
                    <div className="space-y-1">
                        <p className="text-muted-foreground">Due Date</p>
                        <p className="font-medium">{task.dueDate}</p>
                    </div>
                     <div className="space-y-1">
                        <p className="text-muted-foreground">Priority</p>
                        <p className="font-medium">{task.priority}</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-muted-foreground">Assigned To</p>
                        <p className="font-medium">{task.assignedTo}</p>
                    </div>
                     <div className="space-y-1 col-span-2 md:col-span-4">
                        <p className="text-muted-foreground">Guidelines & Attachments</p>
                         <Button variant="outline" size="sm" className="mt-1">
                            <FileText className="mr-2 h-4 w-4" />
                            View Planogram.pdf
                        </Button>
                    </div>
                </div>

            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Submissions</CardTitle>
                <CardDescription>
                    List of all reports submitted for this task from different stores.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <DataTable 
                    table={table} 
                    columns={columns} 
                    filterColumnId="store"
                    filterPlaceholder="Filter by store..."
                />
            </CardContent>
        </Card>
    </div>
  );
}
