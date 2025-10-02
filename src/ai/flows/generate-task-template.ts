'use server';

/**
 * @fileOverview AI-powered task template generator.
 *
 * - generateTaskTemplate - A function that generates a task template from a text description.
 * - GenerateTaskTemplateInput - The input type for the generateTaskTemplate function.
 * - GenerateTaskTemplateOutput - The return type for the generateTaskTemplate function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateTaskTemplateInputSchema = z.object({
  taskDescription: z
    .string()
    .describe('A detailed text description of the task to be performed.'),
});
export type GenerateTaskTemplateInput = z.infer<typeof GenerateTaskTemplateInputSchema>;

const GenerateTaskTemplateOutputSchema = z.object({
  taskTemplate: z
    .string()
    .describe(
      'A JSON string representing the task template. The template should include steps, instructions, and any relevant details for field team members.'
    ),
});
export type GenerateTaskTemplateOutput = z.infer<typeof GenerateTaskTemplateOutputSchema>;

export async function generateTaskTemplate(input: GenerateTaskTemplateInput): Promise<GenerateTaskTemplateOutput> {
  return generateTaskTemplateFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTaskTemplatePrompt',
  input: {schema: GenerateTaskTemplateInputSchema},
  output: {schema: GenerateTaskTemplateOutputSchema},
  prompt: `You are an expert task template generator. Your job is to take a description of a task and generate a JSON task template that includes steps, instructions, and all relevant details to be performed by field team members.

  Task Description: {{{taskDescription}}}

  Ensure that the generated JSON is a valid JSON.
  Example:
  {
    "taskName": "Check Inventory",
    "taskDescription": "Verify that the stock levels match our database.",
    "steps": [
      { "stepNumber": 1, "instruction": "Count the number of items on the shelves" },
      { "stepNumber": 2, "instruction": "Compare counts against the database" },
      { "stepNumber": 3, "instruction": "Report any discrepancies" }
    ]
  }
  `,
});

const generateTaskTemplateFlow = ai.defineFlow(
  {
    name: 'generateTaskTemplateFlow',
    inputSchema: GenerateTaskTemplateInputSchema,
    outputSchema: GenerateTaskTemplateOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
