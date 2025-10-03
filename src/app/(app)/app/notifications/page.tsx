
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Bell,
  CheckCircle,
  FileWarning,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// Mock data for notifications
const notifications = [
  {
    id: "notif-1",
    type: "new_submission",
    title: 'New submission for "Sanitation Audit"',
    description: "John Smith from Uptown just submitted a report.",
    timestamp: "5 minutes ago",
    href: "/app/reviews/REV-001",
    isRead: false,
  },
  {
    id: "notif-2",
    type: "rework_approved",
    title: 'Rework for "Holiday Promo Setup" accepted',
    description: "Clara Garcia has submitted the reworked task.",
    timestamp: "1 hour ago",
    href: "/app/reviews/REV-002",
    isRead: false,
  },
  {
    id: "notif-3",
    type: "comment",
    title: 'New comment on "End-cap Display Check"',
    description: 'Ana Miller: "Looks great, approved!"',
    timestamp: "3 hours ago",
    href: "/app/reviews/REV-003",
    isRead: true,
  },
    {
    id: "notif-4",
    type: "new_submission",
    title: 'New submission for "Expired Goods Removal"',
    description: "Robert Brown from Suburbia just submitted a report.",
    timestamp: "Yesterday",
    href: "/app/reviews/REV-004",
    isRead: true,
  },
   {
    id: "notif-5",
    type: "rework_approved",
    title: 'Rework for "Weekly Freezer Temp Log" accepted',
    description: "Clara Garcia has submitted the reworked task.",
    timestamp: "2 days ago",
    href: "/app/reviews/REV-005",
    isRead: true,
  }
];

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "new_submission":
      return <FileWarning className="h-5 w-5 text-warning" />;
    case "rework_approved":
      return <CheckCircle className="h-5 w-5 text-success" />;
    case "comment":
      return <MessageSquare className="h-5 w-5 text-muted-foreground" />;
    default:
      return <Bell className="h-5 w-5 text-muted-foreground" />;
  }
};

export default function NotificationsPage() {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          {unreadCount > 0
            ? `You have ${unreadCount} unread notifications.`
            : "All caught up!"}
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
                    <p className="text-xs text-muted-foreground">
                      {notification.timestamp}
                    </p>
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
            <h3 className="text-xl font-semibold mt-4">
              No new notifications
            </h3>
            <p className="text-muted-foreground mt-2">
              Updates about tasks and reviews will appear here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
