
'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { summarizeTaskReports, type SummarizeTaskReportsInput } from '@/ai/flows/summarize-task-reports';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

// Mock data to simulate fetching reports
const mockReports: SummarizeTaskReportsInput['reports'] = [
  { storeId: 'Uptown', region: 'West', taskId: 'TSK-002', reportText: 'Sanitation audit passed. All areas clean.', aiEvaluation: 'Đạt' },
  { storeId: 'Eastside', region: 'East', taskId: 'TSK-003', reportText: 'Holiday promo setup has issues. Festive Soda is in the wrong place.', aiEvaluation: 'Không Đạt' },
  { storeId: 'Downtown', region: 'West', taskId: 'TSK-008', reportText: 'End-cap display looks great. Fully stocked.', aiEvaluation: 'Đạt' },
  { storeId: 'Suburbia', region: 'North', taskId: 'TSK-009', reportText: 'Removed all expired goods from shelf 3B.', aiEvaluation: 'Đạt' },
  { storeId: 'Eastside', region: 'East', taskId: 'TSK-010', reportText: 'Freezer temperature log seems to have incorrect entries.', aiEvaluation: 'Lỗi' },
  { storeId: 'Uptown', region: 'West', taskId: 'TSK-003', reportText: 'Holiday promo setup complete, but took longer than expected.', aiEvaluation: 'Đạt' },
];

export default function ReportsPage() {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setError('');
    setSummary('');
    try {
      const result = await summarizeTaskReports({ reports: mockReports });
      setSummary(result.summary);
    } catch (e) {
      console.error(e);
      setError('Failed to generate summary. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start md:items-center">
        <div className="grid gap-2">
          <CardTitle>AI-Powered Report Summary</CardTitle>
          <CardDescription>Generate intelligent summaries from all task reports.</CardDescription>
        </div>
         <div className="ml-auto flex items-center gap-2">
           <Button onClick={handleGenerateSummary} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Report Summary'
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {error && (
            <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        
        {summary ? (
            <div className="prose dark:prose-invert max-w-none rounded-lg border bg-secondary/30 p-6 mt-4">
                <h3 className="!mt-0">Executive Summary</h3>
                <p>{summary}</p>
            </div>
        ) : (
            !isLoading && (
                 <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg mt-4">
                    <h3 className="text-xl font-semibold">Ready to get insights?</h3>
                    <p className="text-muted-foreground mt-2">Click the "Generate Report Summary" button to have AI analyze all recent submissions and provide you with key insights and trends.</p>
                </div>
            )
        )}

         {isLoading && (
            <div className="flex flex-col items-center justify-center text-center p-8 border-2 border-dashed rounded-lg mt-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <h3 className="text-xl font-semibold mt-4">Analyzing Reports...</h3>
                <p className="text-muted-foreground mt-2">Our AI is processing the data. This might take a moment.</p>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
