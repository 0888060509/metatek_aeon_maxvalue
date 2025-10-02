
'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
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
import {
  Copy,
  MoreHorizontal,
  PlusCircle,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataTable } from '@/components/ui/data-table';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';

type Task = {
  id: string;
  title: string;
  store: string;
  region: string;
  assignedTo: string;
  status: 'Completed' | 'Pending Approval' | 'Issue' | 'Overdue' | 'In Progress' | 'Draft';
  dueDate: string;
};


const tasks: Task[] = [
    { id: 'TSK-001', title: 'Q3 Product Display Check', store: 'Downtown', region: 'West', assignedTo: 'Ana Miller', status: 'Completed', dueDate: '2023-10-15' },
    { id: 'TSK-002', title: 'Sanitation Audit', store: 'Uptown', region: 'West', assignedTo: 'John Smith', status: 'Pending Approval', dueDate: '2023-10-20' },
    { id: 'TSK-003', title: 'Holiday Promo Setup', store: 'Eastside', region: 'East', assignedTo: 'Clara Garcia', status: 'Issue', dueDate: '2023-10-18' },
    { id: 'TSK-004', title: 'Weekly Stock Count', store: 'Suburbia', region: 'North', assignedTo: 'Robert Brown', status: 'Overdue', dueDate: '2023-10-12' },
    { id: 'TSK-005', title: 'Fire Safety Inspection', store: 'Downtown', region: 'West', assignedTo: 'Ana Miller', status: 'In Progress', dueDate: '2023-10-25' },
    { id: 'TSK-006', title: 'New Employee Onboarding', store: 'Uptown', region: 'West', assignedTo: 'HR Dept', status: 'Completed', dueDate: '2023-10-05' },
    { id: 'TSK-007', title: 'Q4 Product Display Check', store: 'All', region: 'All', assignedTo: 'Store Manager', status: 'Draft', dueDate: '2023-12-31' },
];

const getStatusBadge = (status: Task['status']) => {
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

const columns: ColumnDef<Task>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Task ID" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
  },
  {
    accessorKey: 'store',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Store" />,
     cell: ({ row }) => (
      <div>
        {row.original.store} / {row.original.region}
      </div>
    ),
  },
  {
    accessorKey: 'assignedTo',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Assigned To" />,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => getStatusBadge(row.getValue('status')),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'dueDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Due Date" />,
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const task = row.original;
      return (
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
            <DropdownMenuItem asChild>
              <Link href="/tasks/create?clone=true">
                <Copy className="mr-2 h-4 w-4" />
                Sao chép
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];


export default function TasksPage() {
  const [data] = React.useState(tasks);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });


  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
  });


  return (
    <Card>
      <CardHeader className="flex flex-row items-start md:items-center">
        <div className="grid gap-2">
          <CardTitle>Tasks</CardTitle>
          <CardDescription>
            Manage and track all tasks across your organization.
          </CardDescription>
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
         <DataTable 
            table={table} 
            columns={columns} 
            filterColumnId="title"
            filterPlaceholder="Filter tasks..."
        />
      </CardContent>
    </Card>
  );
}
