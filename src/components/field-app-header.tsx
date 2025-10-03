
"use client";

import Logo from "./logo";
import { usePathname } from "next/navigation";

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

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-center gap-4 border-b bg-background px-4 md:px-6">
      <div className="text-lg font-semibold">{title}</div>
    </header>
  );
}
