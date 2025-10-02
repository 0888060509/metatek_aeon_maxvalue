import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ReportsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reports</CardTitle>
        <CardDescription>In-depth analysis and summaries of all task reports.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
            <h3 className="text-xl font-semibold">Coming Soon</h3>
            <p className="text-muted-foreground mt-2">This is where aggregated reports and insights will be displayed.</p>
        </div>
      </CardContent>
    </Card>
  );
}
