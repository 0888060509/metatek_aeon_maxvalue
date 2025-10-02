
import { FieldAppHeader } from "@/components/field-app-header";
import { FieldAppSidebar } from "@/components/field-app-sidebar";

export default function FieldAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <FieldAppHeader />
      <main className="flex-1 p-4 md:p-6 bg-muted/40">
        {children}
      </main>
      <FieldAppSidebar />
    </div>
  );
}
