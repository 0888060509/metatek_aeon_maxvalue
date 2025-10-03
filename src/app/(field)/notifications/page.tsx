
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
    RefreshCw, 
    CheckCircle2, 
    FilePlus2, 
    MessageSquare,
    Bell,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Mock data for notifications
const notifications = [
  {
    id: 'notif-1',
    type: 'rework',
    title: 'Tác vụ "Holiday Promo Setup" cần làm lại',
    description: 'Ana Miller đã yêu cầu thay đổi.',
    timestamp: '15 phút trước',
    href: '/field-tasks/TSK-003',
    isRead: false,
  },
  {
    id: 'notif-2',
    type: 'approved',
    title: 'Tác vụ "Sanitation Audit" đã được phê duyệt',
    description: 'Làm tốt lắm!',
    timestamp: '1 giờ trước',
    href: '/field-tasks/TSK-002', 
    isRead: false,
  },
  {
    id: 'notif-3',
    type: 'new_task',
    title: 'Tác vụ mới: "Fire Safety Inspection"',
    description: 'Hạn chót: 2023-10-25',
    timestamp: '3 giờ trước',
    href: '/field-tasks/TSK-005',
    isRead: true,
  },
  {
    id: 'notif-4',
    type: 'comment',
    title: 'Ana Miller đã bình luận về "Holiday Promo Setup"',
    description: '"Ok em, để chị xem."',
    timestamp: 'Hôm qua',
    href: '/field-tasks/TSK-003',
    isRead: true,
  },
    {
    id: 'notif-5',
    type: 'approved',
    title: 'Tác vụ "Q3 Product Display Check" đã được phê duyệt',
    description: 'Hoàn thành tốt.',
    timestamp: '2 ngày trước',
    href: '/field-tasks/TSK-001',
    isRead: true,
  },
];

const getNotificationIcon = (type: string) => {
    switch(type) {
        case 'rework':
            return <RefreshCw className="h-5 w-5 text-destructive" />;
        case 'approved':
            return <CheckCircle2 className="h-5 w-5 text-success" />;
        case 'new_task':
            return <FilePlus2 className="h-5 w-5 text-primary" />;
        case 'comment':
            return <MessageSquare className="h-5 w-5 text-muted-foreground" />;
        default:
            return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
}

export default function FieldNotificationsPage() {
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Thông báo</CardTitle>
        <CardDescription>
          {unreadCount > 0 ? `Bạn có ${unreadCount} thông báo mới.` : 'Bạn đã đọc tất cả thông báo.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {notifications.length > 0 ? (
           <div className="flex flex-col gap-2">
            {notifications.map((notification) => (
              <Link key={notification.id} href={notification.href}>
                <div 
                  className={cn(
                    "flex items-start gap-4 rounded-lg border p-4 text-sm transition-colors hover:bg-accent",
                    !notification.isRead && "bg-primary/5 border-primary/20"
                  )}
                >
                  <div className="mt-1">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="grid gap-1">
                    <p className="font-semibold">{notification.title}</p>
                    <p className="text-muted-foreground">
                      {notification.description}
                    </p>
                    <p className="text-xs text-muted-foreground">{notification.timestamp}</p>
                  </div>
                   {!notification.isRead && (
                    <div className="ml-auto flex items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
              <Bell className="h-10 w-10 text-muted-foreground" />
              <h3 className="text-xl font-semibold mt-4">Không có thông báo mới</h3>
              <p className="text-muted-foreground mt-2">Các cập nhật về công việc sẽ hiển thị tại đây.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
