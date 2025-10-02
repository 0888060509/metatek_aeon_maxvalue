
import { redirect } from 'next/navigation';

// The default page for the (field) group is the task list.
export default function FieldRootPage() {
  redirect('/tasks');
}
