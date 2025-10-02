import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your account and application settings.</CardDescription>
      </CardHeader>
      <CardContent>
         <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg">
            <h3 className="text-xl font-semibold">Coming Soon</h3>
            <p className="text-muted-foreground mt-2">This is where user and application settings will be managed.</p>
        </div>
      </CardContent>
    </Card>
  );
}
