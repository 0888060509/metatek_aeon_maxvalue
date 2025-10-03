
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  Bell,
  CircleUser,
  Home,
} from "lucide-react";
import Logo from "./logo";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/tasks", label: "Tasks", icon: ClipboardList },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/account", label: "Account", icon: CircleUser },
];

export function FieldAppDesktopSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden 2xl:flex 2xl:flex-col 2xl:fixed 2xl:inset-y-0 2xl:z-50 2xl:w-64 2xl:border-r 2xl:bg-background">
        <div className="flex h-16 shrink-0 items-center px-6">
            <Logo />
        </div>
        <nav className="flex flex-col flex-1 gap-1 px-4 py-2">
            {menuItems.map((item) => (
            <Link
                key={item.href}
                href={item.href}
                className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                    (pathname.startsWith(item.href) && item.href !== '/home') || (pathname === '/home' && item.href === '/home') || (pathname === '/' && item.href === '/home') || (pathname === '/tasks' && item.href === '/tasks')
                    ? "bg-muted text-primary"
                    : ""
                )}
            >
                <item.icon className="h-4 w-4" />
                {item.label}
            </Link>
            ))}
        </nav>
    </div>
  );
}
