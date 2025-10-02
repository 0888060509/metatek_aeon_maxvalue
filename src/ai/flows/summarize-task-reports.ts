'use server';
/**
 * @fileOverview This file defines a Genkit flow for summarizing task reports.
 *
 * - summarizeTaskReports - A function that takes task reports as input and returns a summary of key issues and insights.
 * - SummarizeTaskReportsInput - The input type for the summarizeTaskReports function.
 * - SummarizeTaskReportsOutput - The return type for the summarizeTaskReports function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeTaskReportsInputSchema = z.object({
  reports: z.array(
    z.object({
      storeId: z.string().describe('The ID of the store the task was performed at.'),
      region: z.string().describe('The region the store is located in.'),
      taskId: z.string().describe('The ID of the task.'),
      reportText: z.string().describe('The text of the task report.'),
      aiEvaluation: z
        .string()
        .optional()
        .describe('The AI evaluation of the images and documents uploaded.'),
    })
  ).describe('An array of task reports to summarize.'),
});
export type SummarizeTaskReportsInput = z.infer<typeof SummarizeTaskReportsInputSchema>;

const SummarizeTaskReportsOutputSchema = z.object({
  summary: z.string().describe('A summary of the key issues and insights from the task reports.'),
});
export type SummarizeTaskReportsOutput = z.infer<typeof SummarizeTaskReportsOutputSchema>;

export async function summarizeTaskReports(input: SummarizeTaskReportsInput): Promise<SummarizeTaskReportsOutput> {
  return summarizeTaskReportsFlow(input);
}

const summarizeTaskReportsPrompt = ai.definePrompt({
  name: 'summarizeTaskReportsPrompt',
  input: {schema: SummarizeTaskReportsInputSchema},
  output: {schema: SummarizeTaskReportsOutputSchema},
  prompt: `You are an operations manager reviewing task reports from various stores and regions. Analyze the reports provided and summarize the key issues and insights, highlighting any common problems or trends.

Reports:
{{#each reports}}
Store ID: {{storeId}}
Region: {{region}}
Task ID: {{taskId}}
Report Text: {{reportText}}
AI Evaluation: {{aiEvaluation}}
---
{{/each}}`,
});

const summarizeTaskReportsFlow = ai.defineFlow(
  {
    name: 'summarizeTaskReportsFlow',
    inputSchema: SummarizeTaskReportsInputSchema,
    outputSchema: SummarizeTaskReportsOutputSchema,
  },
  async input => {
    const {output} = await summarizeTaskReportsPrompt(input);
    return output!;
  }
);
