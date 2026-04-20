'use server';
/**
 * @fileOverview A Genkit flow for summarizing the status of a growth platform.
 *
 * - summarizePlatformStatus - A function that generates a concise summary of a platform's status.
 * - SummarizePlatformStatusInput - The input type for the summarizePlatformStatus function.
 * - SummarizePlatformStatusOutput - The return type for the summarizePlatformStatus function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SummarizePlatformStatusInputSchema = z.object({
  name: z.string().describe('The name of the growth channel/platform.'),
  type: z.string().describe('The type of the platform (e.g., Dropshipping, Wholesale).'),
  market: z.string().describe('The target market for this platform.'),
  owner: z.string().describe('The owner or manager of this platform.'),
  currentStage: z.string().describe('The current stage of the platform in the pipeline (e.g., Not Started, Research, Onboarding, Live).'),
  lastUpdate: z.string().describe('The date and details of the last update or activity on this platform.'),
  productsUploaded: z.string().optional().describe('Information about products uploaded, if applicable.'),
  salesStarted: z.string().optional().describe('Whether sales have started on this platform.'),
  firstOrderDate: z.string().optional().describe('The date of the first order, if sales have started.'),
  nextStep: z.string().describe('The identified next action required for this platform.'),
  blockers: z.string().optional().describe('Any current blockers preventing progress.'),
  contactPerson: z.string().optional().describe('The primary contact person for this platform.'),
  notes: z.string().optional().describe('Any additional notes or feedback related to the platform.'),
});
export type SummarizePlatformStatusInput = z.infer<typeof SummarizePlatformStatusInputSchema>;

const SummarizePlatformStatusOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the platform\'s current status, stage, recent activity, and key progress points.'),
});
export type SummarizePlatformStatusOutput = z.infer<typeof SummarizePlatformStatusOutputSchema>;

export async function summarizePlatformStatus(input: SummarizePlatformStatusInput): Promise<SummarizePlatformStatusOutput> {
  return summarizePlatformStatusFlow(input);
}

const summarizePlatformStatusPrompt = ai.definePrompt({
  name: 'summarizePlatformStatusPrompt',
  input: { schema: SummarizePlatformStatusInputSchema },
  output: { schema: SummarizePlatformStatusOutputSchema },
  prompt: `As an AI assistant for Growth OS, your task is to provide a concise, high-level summary of a specific growth channel's current status.
Focus on its current stage, recent activity, and key progress points.

Platform Details:
Name: {{{name}}}
Type: {{{type}}}
Market: {{{market}}}
Owner: {{{owner}}}
Current Stage: {{{currentStage}}}
Last Update: {{{lastUpdate}}}
{{#if productsUploaded}}Products Uploaded: {{{productsUploaded}}}{{\/if}}
{{#if salesStarted}}Sales Started: {{{salesStarted}}}{{\/if}}
{{#if firstOrderDate}}First Order Date: {{{firstOrderDate}}}{{\/if}}
Next Step: {{{nextStep}}}
{{#if blockers}}Blockers: {{{blockers}}}{{\/if}}
{{#if contactPerson}}Contact Person: {{{contactPerson}}}{{\/if}}
{{#if notes}}Notes: {{{notes}}}{{\/if}}

Provide a summary that is easy to understand at a glance, highlighting the most critical information about its status and what needs attention.
`,
});

const summarizePlatformStatusFlow = ai.defineFlow(
  {
    name: 'summarizePlatformStatusFlow',
    inputSchema: SummarizePlatformStatusInputSchema,
    outputSchema: SummarizePlatformStatusOutputSchema,
  },
  async (input) => {
    const { output } = await summarizePlatformStatusPrompt(input);
    return output!;
  }
);
