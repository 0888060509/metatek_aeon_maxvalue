import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "../ui/badge";

const tasks = [
  { name: "Ana Miller", email: "ana.miller@example.com", task: "Restock shelves", store: "Store #123", status: "Completed", avatarId: "user-avatar-1" },
  { name: "John Smith", email: "john.smith@example.com", task: "Clean windows", store: "Store #456", status: "Pending Approval", avatarId: "user-avatar-2" },
  { name: "Clara Garcia", email: "clara.g@example.com", task: "Update price tags", store: "Store #789", status: "Issue", avatarId: "user-avatar-3" },
  { name: "Robert Brown", email: "robert.b@example.com", task: "Inventory check", store: "Store #123", status: "Overdue", avatarId: "user-avatar-4" },
];


const getStatusBadge = (status: string) => {
    switch (status) {
        case 'Completed':
            return <Badge className="bg-success hover:bg-success/90 text-success-foreground">Completed</Badge>;
        case 'Pending Approval':
            return <Badge className="bg-warning hover:bg-warning/90 text-warning-foreground">Pending</Badge>;
        case 'Issue':
            return <Badge variant="destructive">Issue</Badge>;
        case 'Overdue':
            return <Badge className="bg-info hover:bg-info/90 text-info-foreground">Overdue</Badge>;
        default:
            return <Badge variant="secondary">{status}</Badge>;
    }
};

export function TasksOverview() {
  return (
    <div className="space-y-4">
      {tasks.map((task) => {
        const avatar = PlaceHolderImages.find(p => p.id === task.avatarId);
        return (
          <div key={task.email} className="flex items-center">
            <Avatar className="h-9 w-9">
              {avatar && <AvatarImage src={avatar.imageUrl} alt="Avatar" data-ai-hint={avatar.imageHint}/>}
              <AvatarFallback>{task.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{task.name}</p>
              <p className="text-sm text-muted-foreground">{task.task} at {task.store}</p>
            </div>
            <div className="ml-auto font-medium">
                {getStatusBadge(task.status)}
            </div>
          </div>
        )
      })}
    </div>
  );
}
