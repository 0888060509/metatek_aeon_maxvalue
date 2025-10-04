import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "../ui/badge";
import { formatDate } from "@/lib/task-display-utils";
import type { RecentTask } from "@/api/app/types";

interface TasksOverviewProps {
  data?: RecentTask[] | null;
}

const defaultTasks = [
  { name: "Ana Miller", task: "Restock shelves", status: "Completed" },
  { name: "John Smith", task: "Clean windows", status: "Pending Approval" },
  { name: "Clara Garcia", task: "Update price tags", status: "Issue" },
  { name: "Robert Brown", task: "Inventory check", status: "Overdue" },
];

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'Completed':
        case 'Hoàn thành':
            return <Badge className="bg-green-100 hover:bg-green-200 text-green-800 border-green-200">Hoàn thành</Badge>;
        case 'Pending Approval':
        case 'Chờ duyệt':
            return <Badge className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-200">Chờ duyệt</Badge>;
        case 'Wait Review':
        case 'Chờ xem xét':
            return <Badge className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-200">Chờ xem xét</Badge>;
        case 'Issue':
        case 'Có vấn đề':
            return <Badge variant="destructive">Có vấn đề</Badge>;
        case 'Overdue':
        case 'Quá hạn':
            return <Badge className="bg-red-100 hover:bg-red-200 text-red-800 border-red-200">Quá hạn</Badge>;
        case 'In Progress':
        case 'Đang thực hiện':
            return <Badge className="bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-200">Đang thực hiện</Badge>;
        case 'Draft':
        case 'Bản nháp':
            return <Badge variant="outline">Bản nháp</Badge>;
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
};

export function TasksOverview({ data }: TasksOverviewProps) {
  const tasks = data && data.length > 0 ? data : [];

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground">Không có nhiệm vụ gần đây</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task, index) => {
        // For API data, use RecentTask structure
        const isApiData = 'id' in task;
        const name = isApiData ? (task as RecentTask).assigneeName || 'N/A' : (task as any).name;
        const taskName = isApiData ? (task as RecentTask).taskName || 'N/A' : (task as any).task;
        const status = isApiData ? (task as RecentTask).stateDisplay || 'N/A' : (task as any).status;
        const avatar = isApiData ? (task as RecentTask).assigneeAvatarLink : null;
        const updateAt = isApiData ? (task as RecentTask).updateAt : null;
        
        return (
          <div key={isApiData ? (task as RecentTask).id : index} className="flex items-center">
            <Avatar className="h-9 w-9">
              {avatar && <AvatarImage src={avatar} alt="Avatar" />}
              <AvatarFallback>
                {name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{name}</p>
              <p className="text-sm text-muted-foreground">
                {taskName}
                {updateAt && (
                  <span className="ml-2 text-xs">
                    • {formatDate(updateAt)}
                  </span>
                )}
              </p>
            </div>
            <div className="ml-auto font-medium">
                {getStatusBadge(status)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
