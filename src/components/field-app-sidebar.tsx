
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  Bell,
  CircleUser,
  Home,
} from "lucide-react";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/field-tasks", label: "Tasks", icon: ClipboardList },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/account", label: "Account", icon: CircleUser },
];

export function FieldAppSidebar() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 border-t bg-background md:hidden">
      <nav className="grid grid-cols-4 h-16 items-center">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 text-sm font-medium",
              (pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/'))
                ? "text-primary"
                : "text-muted-foreground hover:text-primary"
            )}
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
