
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function FieldAccountPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Account</CardTitle>
        <CardDescription>Manage your profile and settings.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
            <h3 className="text-xl font-semibold">Coming Soon</h3>
            <p className="text-muted-foreground mt-2">Account management features will be available here.</p>
        </div>
      </CardContent>
    </Card>
  );
}
