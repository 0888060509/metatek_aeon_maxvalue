
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function FieldNotificationsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Your recent notifications will appear here.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
            <h3 className="text-xl font-semibold">No New Notifications</h3>
            <p className="text-muted-foreground mt-2">You're all caught up!</p>
        </div>
      </CardContent>
    </Card>
  );
}
