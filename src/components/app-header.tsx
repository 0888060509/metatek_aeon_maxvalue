
"use client";

import Link from "next/link";
import { Search, Bell, Menu, CheckCircle, FileWarning, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { SidebarTrigger } from "./ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Badge } from "./ui/badge";

const notifications = [
  {
    type: 'new_submission',
    title: 'New submission for "Sanitation Audit"',
    description: 'John Smith from Uptown just submitted a report.',
    time: '5m ago',
    read: false,
  },
  {
    type: 'rework_approved',
    title: 'Rework for "Holiday Promo Setup" accepted',
    description: 'Clara Garcia has submitted the reworked task.',
    time: '1h ago',
    read: false,
  },
  {
    type: 'comment',
    title: 'New comment on "End-cap Display Check"',
    description: 'Ana Miller: "Looks great, approved!"',
    time: '3h ago',
    read: true,
  },
];

const getNotificationIcon = (type: string) => {
    switch (type) {
        case 'new_submission':
            return <FileWarning className="h-4 w-4 text-warning" />;
        case 'rework_approved':
            return <CheckCircle className="h-4 w-4 text-success" />;
        case 'comment':
            return <MessageSquare className="h-4 w-4 text-muted-foreground" />;
        default:
            return <Bell className="h-4 w-4 text-muted-foreground" />;
    }
}

export function AppHeader() {
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <div className="relative hidden md:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search tasks..."
            className="w-full rounded-lg bg-secondary pl-8 md:w-[200px] lg:w-[336px]"
          />
        </div>
      </div>

      <div className="flex w-full items-center gap-4 justify-end md:gap-2 lg:gap-4">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 justify-center rounded-full p-0 text-xs">{unreadCount}</Badge>}
                    <span className="sr-only">Toggle notifications</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex justify-between items-center">
                    Notifications
                    <Badge variant="secondary">{unreadCount} new</Badge>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.map((item, index) => (
                     <DropdownMenuItem key={index} className="flex items-start gap-3">
                        <div className="mt-1">{getNotificationIcon(item.type)}</div>
                        <div className="flex-1">
                            <p className="text-sm font-medium">{item.title}</p>
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                        </div>
                        {!item.read && <div className="mt-1 h-2 w-2 rounded-full bg-primary" />}
                    </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="justify-center">
                    <Link href="/app/notifications">View all notifications</Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

