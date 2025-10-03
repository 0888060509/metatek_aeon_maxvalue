'use client';

import { useCurrentUser } from '@/hooks/use-current-user';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User, Settings } from 'lucide-react';

export function UserMenu() {
  const { user, userRole } = useCurrentUser();
  const { logout } = useAuth();

  if (!user) {
    return null;
  }

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getUserDisplayName = () => {
    return user.name || user.username || 'Người dùng';
  };

  const getRoleDisplayName = () => {
    switch (userRole) {
      case 'store':
        return 'Nhân viên cửa hàng';
      case 'admin':
        return 'Quản lý';
      default:
        return 'Người dùng';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar || user.avatarLink} alt={getUserDisplayName()} />
            <AvatarFallback>{getInitials(getUserDisplayName())}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {getUserDisplayName()}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email || user.username}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {getRoleDisplayName()}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Hồ sơ</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings className="mr-2 h-4 w-4" />
          <span>Cài đặt</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Compact user info component for headers
export function UserInfo() {
  const { user, userRole } = useCurrentUser();

  if (!user) {
    return null;
  }

  const getUserDisplayName = () => {
    return user.name || user.username || 'Người dùng';
  };

  const getRoleDisplayName = () => {
    switch (userRole) {
      case 'field':
        return 'Nhân viên thực địa';
      case 'admin':
        return 'Quản trị viên';
      default:
        return 'Người dùng';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Avatar className="h-6 w-6">
        <AvatarImage src={user.avatar || user.avatarLink} alt={getUserDisplayName()} />
        <AvatarFallback className="text-xs">
          {getUserDisplayName().slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="text-sm">
        <div className="font-medium">{getUserDisplayName()}</div>
        <div className="text-xs text-muted-foreground">{getRoleDisplayName()}</div>
      </div>
    </div>
  );
}