
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
  RefreshCw,
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
import { useGetTaskItems } from '@/api/hooks';
import { 
  TaskDisplayItem, 
  convertTaskItemToDisplayItem, 
  getStatusVariant, 
  getPriorityColor,
  generateTaskCode
} from '@/lib/task-display-utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCurrentUser } from '@/hooks/use-current-user';

const getStatusBadge = (status: TaskDisplayItem['status']) => {
  const variant = getStatusVariant(status);
  
  switch (status) {
    case 'Completed':
      return <Badge className="bg-green-100 hover:bg-green-200 text-green-800 border-green-200">Hoàn thành</Badge>;
    case 'Pending Approval':
      return <Badge className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-200">Chờ duyệt</Badge>;
    case 'Issue':
      return <Badge variant="destructive">Có vấn đề</Badge>;
    case 'Overdue':
      return <Badge className="bg-red-100 hover:bg-red-200 text-red-800 border-red-200">Quá hạn</Badge>;
    case 'In Progress':
      return <Badge className="bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-200">Đang thực hiện</Badge>;
    case 'Draft':
      return <Badge variant="outline">Bản nháp</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const columns: ColumnDef<TaskDisplayItem>[] = [
  {
    accessorKey: 'code',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Mã nhiệm vụ" />,
    cell: ({ row }) => {
      const code = row.getValue('code') as string;
      return (
        <Link href={`/app/tasks/${row.original.id}`} className="font-medium hover:underline text-blue-600">
          {code}
        </Link>
      );
    },
  },
  {
    accessorKey: 'title',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Tên nhiệm vụ" />,
    cell: ({ row }) => (
      <div className="max-w-[200px]">
        <Link href={`/app/tasks/${row.original.id}`} className="hover:underline text-sm font-medium">
          {row.getValue('title')}
        </Link>
        {row.original.description && (
          <p className="text-xs text-muted-foreground mt-1 truncate">
            {row.original.description}
          </p>
        )}
      </div>
    ),
  },
  {
    accessorKey: 'assignedTo',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Người thực hiện" />,
    cell: ({ row }) => (
      <div className="text-sm">
        {row.getValue('assignedTo')}
      </div>
    ),
  },
  {
    accessorKey: 'priority',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ưu tiên" />,
    cell: ({ row }) => (
      <span className={getPriorityColor(row.getValue('priority'))}>
        {row.getValue('priority')}
      </span>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Trạng thái" />,
    cell: ({ row }) => getStatusBadge(row.getValue('status')),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: 'startDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Ngày bắt đầu" />,
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {row.getValue('startDate') || '-'}
      </div>
    ),
  },
  {
    accessorKey: 'dueDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Hạn hoàn thành" />,
    cell: ({ row }) => (
      <div className="text-sm">
        {row.getValue('dueDate') || '-'}
      </div>
    ),
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
            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/app/tasks/${task.id}`}>Xem chi tiết</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/app/tasks/create?clone=${task.id}`}>
                <Copy className="mr-2 h-4 w-4" />
                Sao chép
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10">
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];


export default function TasksPage() {
  const { userRole } = useCurrentUser();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Search and filter states
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<number[]>([]);
  const [priorityFilter, setPriorityFilter] = React.useState<number[]>([]);

  // API call with debounced search
  const debouncedSearch = React.useMemo(() => {
    return searchQuery.length > 0 ? searchQuery : undefined;
  }, [searchQuery]);

  const {
    data: taskItemsResponse,
    loading,
    error,
    execute
  } = useGetTaskItems();

  // Execute the API call when filters change
  React.useEffect(() => {
    const params = {
      search: debouncedSearch,
      state: statusFilter.length > 0 ? statusFilter : undefined,
      priority: priorityFilter.length > 0 ? priorityFilter : undefined,
      page: pagination.pageIndex + 1,
      size: pagination.pageSize,
    };
    execute(params);
  }, [debouncedSearch, statusFilter, priorityFilter, pagination.pageIndex, pagination.pageSize]);

  // Convert API data to display format
  const displayData = React.useMemo(() => {
    if (!taskItemsResponse) return [];
    return taskItemsResponse.map(convertTaskItemToDisplayItem);
  }, [taskItemsResponse]);

  const table = useReactTable({
    data: displayData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    autoResetPageIndex: false,
    manualPagination: true,
    pageCount: Math.ceil((taskItemsResponse?.length || 0) / pagination.pageSize),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      pagination,
    },
  });

  // Handle search input change
  const handleSearchChange = React.useCallback((value: string) => {
    setSearchQuery(value);
    setPagination(prev => ({ ...prev, pageIndex: 0 })); // Reset to first page
  }, []);

  const handleRefresh = React.useCallback(() => {
    const params = {
      search: debouncedSearch,
      state: statusFilter.length > 0 ? statusFilter : undefined,
      priority: priorityFilter.length > 0 ? priorityFilter : undefined,
      page: pagination.pageIndex + 1,
      size: pagination.pageSize,
    };
    execute(params);
  }, [debouncedSearch, statusFilter, priorityFilter, pagination.pageIndex, pagination.pageSize]);

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Nhiệm vụ</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>
              Không thể tải danh sách nhiệm vụ: {error}
            </AlertDescription>
          </Alert>
          <Button onClick={handleRefresh} className="mt-4">
            <RefreshCw className="h-4 w-4 mr-2" />
            Thử lại
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start md:items-center">
        <div className="grid gap-2">
          <CardTitle>Nhiệm vụ</CardTitle>
          <CardDescription>
            Quản lý và theo dõi tất cả các nhiệm vụ trong tổ chức.
          </CardDescription>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Tải lại
          </Button>
          {userRole === 'admin' && (
            <Button asChild size="sm" className="gap-1">
              <Link href="/app/tasks/create">
                <PlusCircle className="h-4 w-4" />
                Tạo nhiệm vụ
              </Link>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading && displayData.length === 0 ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <DataTable 
            table={table} 
            columns={columns} 
            filterColumnId="title"
            filterPlaceholder="Tìm kiếm nhiệm vụ..."
          />
        )}
        
        {!loading && displayData.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Không có nhiệm vụ nào được tìm thấy.</p>
            <Button asChild className="mt-4">
              <Link href="/app/tasks/create">
                <PlusCircle className="h-4 w-4 mr-2" />
                Tạo nhiệm vụ đầu tiên
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
