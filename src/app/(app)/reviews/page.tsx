
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
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from '@/components/ui/data-table';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import {
    CheckCircle,
    XCircle,
    BadgeCheck,
} from 'lucide-react';

type Review = {
  id: string;
  taskId: string;
  taskTitle: string;
  store: string;
  submittedBy: string;
  submittedAt: string;
  aiStatus: 'Đạt' | 'Không Đạt' | 'Lỗi';
};


const reviews: Review[] = [
    { id: 'REV-001', taskId: 'TSK-002', taskTitle: 'Sanitation Audit', store: 'Uptown', submittedBy: 'John Smith', submittedAt: '2023-10-20', aiStatus: 'Đạt'},
    { id: 'REV-002', taskId: 'TSK-003', taskTitle: 'Holiday Promo Setup', store: 'Eastside', submittedBy: 'Clara Garcia', submittedAt: '2023-10-18', aiStatus: 'Không Đạt'},
    { id: 'REV-003', taskId: 'TSK-008', taskTitle: 'End-cap Display Check', store: 'Downtown', submittedBy: 'Ana Miller', submittedAt: '2023-10-21', aiStatus: 'Đạt'},
    { id: 'REV-004', taskId: 'TSK-009', taskTitle: 'Expired Goods Removal', store: 'Suburbia', submittedBy: 'Robert Brown', submittedAt: '2023-10-22', aiStatus: 'Đạt'},
    { id: 'REV-005', taskId: 'TSK-010', taskTitle: 'Weekly Freezer Temp Log', store: 'Eastside', submittedBy: 'Clara Garcia', submittedAt: '2023-10-23', aiStatus: 'Lỗi'},
];

const getAiStatusBadge = (status: Review['aiStatus']) => {
  switch (status) {
    case 'Đạt':
      return <Badge className="bg-success hover:bg-success/90 text-success-foreground"><CheckCircle className="mr-1 h-3 w-3" />Đạt</Badge>;
    case 'Không Đạt':
      return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Không Đạt</Badge>;
    default:
      return <Badge variant="outline">Lỗi</Badge>;
  }
};

const columns: ColumnDef<Review>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'taskId',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Task ID" />,
    cell: ({ row }) => <div className="font-medium"><Link href={`/reviews/${row.original.id}`} className="hover:underline">{row.getValue('taskId')}</Link></div>,
  },
  {
    accessorKey: 'taskTitle',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Task Title" />,
    cell: ({ row }) => <Link href={`/reviews/${row.original.id}`} className="hover:underline">{row.getValue('taskTitle')}</Link>,
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
    accessorKey: 'aiStatus',
    header: ({ column }) => <DataTableColumnHeader column={column} title="AI Status" />,
    cell: ({ row }) => getAiStatusBadge(row.getValue('aiStatus')),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return (
        <Link href={`/reviews/${row.original.id}`} className="text-sm font-medium text-primary hover:underline">
          View Details
        </Link>
      );
    },
  },
];


export default function ReviewsPage() {
  const [data, setData] = React.useState(reviews);
   const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
        pagination: {
            pageSize: 10,
        }
    }
  });

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const canBulkApprove = selectedRows.length > 0 && selectedRows.every(row => row.original.aiStatus === 'Đạt');

  return (
    <Card>
      <CardHeader className="flex flex-row items-start md:items-center">
        <div className="grid gap-2">
          <CardTitle>Task Reviews</CardTitle>
          <CardDescription>
            Review and approve task reports from your team.
          </CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-2">
           <Button disabled={!canBulkApprove}>
              <BadgeCheck className="mr-2 h-4 w-4" />
              Bulk Approve ({selectedRows.length})
          </Button>
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
