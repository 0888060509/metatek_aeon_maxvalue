
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
} from 'lucide-react';

type Review = {
  id: string;
  taskId: string;
  taskTitle: string;
  store: string;
  submittedBy: string;
  submittedAt: string;
  aiStatus: 'Đạt' | 'Không Đạt' | 'Lỗi';
  status: 'Pending' | 'Approved' | 'Rework';
};


const initialReviews: Review[] = [
    { id: 'REV-001', taskId: 'TSK-002', taskTitle: 'Sanitation Audit', store: 'Uptown', submittedBy: 'John Smith', submittedAt: '2023-10-20', aiStatus: 'Đạt', status: 'Approved' },
    { id: 'REV-002', taskId: 'TSK-003', taskTitle: 'Holiday Promo Setup', store: 'Eastside', submittedBy: 'Clara Garcia', submittedAt: '2023-10-18', aiStatus: 'Không Đạt', status: 'Rework' },
    { id: 'REV-003', taskId: 'TSK-008', taskTitle: 'End-cap Display Check', store: 'Downtown', submittedBy: 'Ana Miller', submittedAt: '2023-10-21', aiStatus: 'Đạt', status: 'Approved' },
    { id: 'REV-004', taskId: 'TSK-009', taskTitle: 'Expired Goods Removal', store: 'Suburbia', submittedBy: 'Robert Brown', submittedAt: '2023-10-22', aiStatus: 'Đạt', status: 'Pending' },
    { id: 'REV-005', taskId: 'TSK-010', taskTitle: 'Weekly Freezer Temp Log', store: 'Eastside', submittedBy: 'Clara Garcia', submittedAt: '2023-10-23', aiStatus: 'Lỗi', status: 'Pending' },
];


const getReviewStatusBadge = (status: Review['status']) => {
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

const columns: ColumnDef<Review>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Review ID" />,
    cell: ({ row }) => <div className="font-medium"><Link href={`/app/reviews/${row.original.id}`} className="hover:underline">{row.getValue('id')}</Link></div>,
  },
  {
    accessorKey: 'taskTitle',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Task Title" />,
    cell: ({ row }) => <Link href={`/app/reviews/${row.original.id}`} className="hover:underline">{row.getValue('taskTitle')}</Link>,
  },
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
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => getReviewStatusBadge(row.getValue('status')),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <Link href={`/app/reviews/${row.original.id}`} className="text-sm font-medium text-primary hover:underline">
          View Details
        </Link>
      );
    },
  },
];


export default function ReviewsPage() {
  const [data] = React.useState(() => [...initialReviews]);
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

  return (
    <Card>
      <CardHeader>
        <div className="grid gap-2">
          <CardTitle>Submissions</CardTitle>
          <CardDescription>
            Xem xét, duyệt hoặc yêu cầu làm lại các bài nộp từ cửa hàng.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
         <DataTable 
            table={table} 
            columns={columns} 
            filterColumnId="taskTitle"
            filterPlaceholder="Filter by title..."
        />
      </CardContent>
    </Card>
  );
}
