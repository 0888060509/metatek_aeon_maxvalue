
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
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from '@/components/ui/data-table';
import { DataTableColumnHeader } from '@/components/ui/data-table-column-header';
import { Skeleton } from '@/components/ui/skeleton';
import {
    CheckCircle,
    XCircle,
    BadgeCheck,
    Loader2,
} from 'lucide-react';
import { useCurrentUser } from '@/hooks/use-current-user';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGetTaskItems, useApproveTaskItem } from '@/api/app/hooks';
import { useToast } from '@/hooks/use-toast';
import { TASK_STATES } from '@/api/app/task-utils';
import { TaskItemListItem } from '@/api/app/types';
import { formatDate, generateTaskCode, getPriorityText } from '@/lib/task-display-utils';

// Get task status badge
const getTaskStatusBadge = (state: number) => {
  switch (state) {
    case TASK_STATES.WAIT_REVIEW:
      return <Badge className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-200">Chờ duyệt</Badge>;
    case TASK_STATES.COMPLETE:
      return <Badge className="bg-green-100 hover:bg-green-200 text-green-800 border-green-200">Đã duyệt</Badge>;
    case TASK_STATES.DENY:
      return <Badge variant="destructive">Từ chối</Badge>;
    default:
      return <Badge variant="outline">Không xác định</Badge>;
  }
};

const columns: ColumnDef<TaskItemListItem>[] = [
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
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Mã nhiệm vụ" />,
    cell: ({ row }) => (
      <div className="font-medium">
        <Link href={`/app/reviews/${row.original.id}`} className="hover:underline">
          {generateTaskCode(row.getValue('id'))}
        </Link>
      </div>
    ),
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tên nhiệm vụ" />,
    cell: ({ row }) => (
      <Link href={`/app/reviews/${row.original.id}`} className="hover:underline">
        {row.getValue('name') || 'Không có tên'}
      </Link>
    ),
  },
  {
    accessorKey: 'assigneeName',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Người thực hiện" />,
    cell: ({ row }) => row.getValue('assigneeName') || 'Chưa phân công',
  },
  {
    accessorKey: 'creatorName',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Người tạo" />,
    cell: ({ row }) => row.getValue('creatorName') || '-',
  },
  {
    accessorKey: 'submitAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày nộp" />,
    cell: ({ row }) => {
      const submitAt = row.getValue('submitAt') as number | null;
      return submitAt ? formatDate(submitAt) : '-';
    },
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ưu tiên" />,
    cell: ({ row }) => {
      const priority = row.getValue('priority') as number;
      return getPriorityText(priority);
    },
  },
  {
    accessorKey: 'state',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
    cell: ({ row }) => {
      const state = row.getValue('state') as number;
      return getTaskStatusBadge(state);
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    id: 'actions',
    header: 'Thao tác',
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Link href={`/app/reviews/${row.original.id}`} className="text-sm font-medium text-primary hover:underline">
            Xem chi tiết
          </Link>
        </div>
      );
    },
  },
];


export default function ReviewsPage() {
  const { userRole } = useCurrentUser();
  
  // API hooks
  const { data: allTasks, loading, error, execute } = useGetTaskItems();
  const { execute: approveTask, loading: approving } = useApproveTaskItem();
  const { toast } = useToast();
  
  // Filter tasks to only show those in WAIT_REVIEW state
  const reviewTasks = React.useMemo(() => {
    if (!allTasks) return [];
    return allTasks.filter((task: TaskItemListItem) => task.state === TASK_STATES.WAIT_REVIEW);
  }, [allTasks]);

  // Fetch data on mount
  React.useEffect(() => {
    execute({
      state: [TASK_STATES.WAIT_REVIEW], // Only fetch tasks in review state
      page: 1,
      size: 100 // Get more records since we're filtering for reviews
    });
  }, []); // Remove execute from dependencies to prevent loop
  
  // Only admin users can access reviews
  if (userRole === 'store') {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Không có quyền truy cập</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              Bạn không có quyền truy cập trang này. Vui lòng liên hệ quản trị viên nếu cần hỗ trợ.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

   const table = useReactTable({
    data: reviewTasks,
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

  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const canBulkApprove = selectedRows.length > 0;

  // Handle bulk approve
  const handleBulkApprove = async () => {
    if (selectedRows.length === 0) return;

    try {
      // Approve all selected tasks
      await Promise.all(
        selectedRows.map(row => approveTask(row.original.id))
      );

      toast({
        title: "Phê duyệt thành công",
        description: `Đã phê duyệt ${selectedRows.length} nhiệm vụ.`,
      });

      // Refresh the task list
      execute({
        state: [TASK_STATES.WAIT_REVIEW],
        page: 1,
        size: 100
      });

      // Clear selection
      table.toggleAllPageRowsSelected(false);
    } catch (error) {
      toast({
        title: "Lỗi phê duyệt",
        description: "Không thể phê duyệt nhiệm vụ. Vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-8 w-32 ml-auto" />
          </div>
          <Skeleton className="h-4 w-80" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Lỗi tải dữ liệu</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              Không thể tải danh sách review: {error}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start md:items-center">
        <div className="grid gap-2">
          <CardTitle>Duyệt nhiệm vụ</CardTitle>
          <CardDescription>
            Duyệt và phê duyệt các báo cáo nhiệm vụ từ nhóm của bạn.
          </CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-2">
           <Button 
             disabled={!canBulkApprove || approving}
             onClick={handleBulkApprove}
           >
              {approving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang phê duyệt...
                </>
              ) : (
                <>
                  <BadgeCheck className="mr-2 h-4 w-4" />
                  Phê duyệt hàng loạt ({selectedRows.length})
                </>
              )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {reviewTasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Không có nhiệm vụ nào cần duyệt</p>
          </div>
        ) : (
          <DataTable 
            table={table} 
            columns={columns} 
            filterColumnId="name"
            filterPlaceholder="Tìm kiếm theo tên nhiệm vụ..."
          />
        )}
      </CardContent>
    </Card>
  );
}
