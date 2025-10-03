
"use client";

import Logo from "./logo";
import { usePathname } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { UserMenu } from "./user-menu";

const getTitleFromPathname = (pathname: string) => {
    if (pathname.includes('/field-tasks/')) {
        return "Task Details";
    }
    if (pathname.startsWith('/field-tasks')) {
        return "My Tasks";
    }
    if (pathname.startsWith('/notifications')) {
        return "Notifications";
    }
     if (pathname.startsWith('/account')) {
        return "My Account";
    }
    return "MetaTek";
}

export function FieldAppHeader() {
  const pathname = usePathname();
  const title = getTitleFromPathname(pathname);
  const { user, userRole } = useCurrentUser();

  const getRoleDisplayName = () => {
    switch (userRole) {
      case 'store':
        return 'Nhân viên cửa hàng';
      case 'admin':
        return 'Quản trị viên';
      default:
        return 'Người dùng';
    }
  };

  const getUserInitials = () => {
    const name = user?.name || user?.username || 'User';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 md:px-6">
      <div className="text-lg font-semibold">{title}</div>
      
      {user && (
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium">{user.name || user.username}</p>
            <p className="text-xs text-muted-foreground">{getRoleDisplayName()}</p>
          </div>
          <UserMenu />
        </div>
      )}
    </header>
  );
}
