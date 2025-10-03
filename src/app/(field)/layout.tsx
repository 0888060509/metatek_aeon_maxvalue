
import { FieldAppHeader } from "@/components/field-app-header";
import { FieldAppSidebar } from "@/components/field-app-sidebar";
import { FieldAppDesktopSidebar } from "@/components/field-app-desktop-sidebar";

export default function FieldAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      <FieldAppDesktopSidebar />
      <div className="flex flex-1 flex-col">
        <FieldAppHeader />
        <main className="flex-1 bg-muted/40 p-4 md:p-6 mb-16 md:mb-0 md:ml-64">
          {children}
        </main>
      </div>
      <FieldAppSidebar />
    </div>
  );
}
