"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  BarChart3,
  Settings,
  ChevronDown
} from "lucide-react";
import Logo from "./logo";
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
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/tasks", label: "Tasks", icon: ClipboardList },
  { href: "/reports", label: "Reports", icon: BarChart3 },
];

export function AppSidebar() {
  const pathname = usePathname();
  const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar-1');

  return (
    <>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname.startsWith(item.href)}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
         <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 p-2 rounded-md hover:bg-sidebar-accent transition-colors cursor-pointer">
              {userAvatar && <Avatar className="h-10 w-10">
                  <AvatarImage src={userAvatar.imageUrl} alt="User" data-ai-hint={userAvatar.imageHint} />
                  <AvatarFallback>AM</AvatarFallback>
              </Avatar>}
              <div className="flex-1 overflow-hidden group-data-[collapsible=icon]:hidden">
                  <p className="font-semibold text-sm truncate">Ana Miller</p>
                  <p className="text-xs text-sidebar-foreground/70 truncate">ana.miller@metatek.com</p>
              </div>
              <ChevronDown className="h-4 w-4 group-data-[collapsible=icon]:hidden" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56 mb-2 ml-2">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/settings" passHref><DropdownMenuItem><Settings className="mr-2 h-4 w-4" />Settings</DropdownMenuItem></Link>
            <DropdownMenuItem>Support</DropdownMenuItem>
            <DropdownMenuSeparator />
            <Link href="/" passHref><DropdownMenuItem>Logout</DropdownMenuItem></Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </>
  );
}
