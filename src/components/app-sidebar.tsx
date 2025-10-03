
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  Settings,
  ChevronDown,
  LogOut,
  HelpCircle,
  ClipboardCheck,
} from "lucide-react";
import Logo from "./logo";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useAuth } from "@/hooks/use-auth";
import {
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
} from "./ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

const menuItems = [
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/tasks", label: "Tasks", icon: ClipboardList },
  { href: "/app/reviews", label: "Reviews", icon: ClipboardCheck },
  { href: "/app/reports", label: "Reports", icon: BarChart3 },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { user, userRole } = useCurrentUser();
  const { logout } = useAuth();
  const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar-1');

  // Helper functions
  const getUserDisplayName = () => {
    return user?.name || user?.username || 'Người dùng';
  };

  const getUserEmail = () => {
    return user?.email || user?.username || '';
  };

  const getUserInitials = () => {
    const name = getUserDisplayName();
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href)}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center gap-3 p-2 rounded-md hover:bg-accent transition-colors cursor-pointer">
                <Avatar className="h-10 w-10">
                  <AvatarImage 
                    src={user.avatar || user.avatarLink || userAvatar?.imageUrl} 
                    alt={getUserDisplayName()} 
                  />
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden group-data-[collapsible=icon]:hidden">
                  <p className="font-semibold text-sm truncate">{getUserDisplayName()}</p>
                  <p className="text-xs text-sidebar-foreground/70 truncate">{getUserEmail()}</p>
                  <p className="text-xs text-sidebar-foreground/50 truncate">{getRoleDisplayName()}</p>
                </div>
                <ChevronDown className="h-4 w-4 group-data-[collapsible=icon]:hidden" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 mb-2 ml-2">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{getUserDisplayName()}</p>
                  <p className="text-xs text-muted-foreground">{getUserEmail()}</p>
                  <p className="text-xs text-muted-foreground">{getRoleDisplayName()}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/app/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  Cài đặt
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                Hỗ trợ
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-3 p-2">
            <Avatar className="h-10 w-10">
              <AvatarFallback>?</AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden group-data-[collapsible=icon]:hidden">
              <p className="font-semibold text-sm truncate">Chưa đăng nhập</p>
              <p className="text-xs text-sidebar-foreground/70 truncate">
                <Link href="/" className="hover:underline">Đăng nhập ngay</Link>
              </p>
            </div>
          </div>
        )}
      </SidebarFooter>
    </>
  );
}
