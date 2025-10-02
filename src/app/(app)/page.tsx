
import { redirect } from 'next/navigation';

// This page is now only for the Back Office (app) role.
// We redirect to the dashboard, which is the main landing page for this role.
export default function AppPage() {
  redirect('/app/dashboard');
}
