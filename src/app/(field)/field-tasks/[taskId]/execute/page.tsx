import React from 'react';
import { TaskExecutionPageContent } from './content';

// This is now a Server Component that passes the taskId to the Client Component.
export default function TaskExecutionPage({ params }: { params: { taskId: string } }) {
    const { taskId } = params;
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <TaskExecutionPageContent taskId={taskId} />
        </React.Suspense>
    );
}
