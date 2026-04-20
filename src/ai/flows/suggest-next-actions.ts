'use server';
/**
 * @fileOverview This file defines a Genkit flow for an AI assistant to suggest context-aware next actions for a selected growth opportunity.
 *
 * - suggestNextActions - A function that suggests next actions based on growth opportunity data.
 * - SuggestNextActionsInput - The input type for the suggestNextActions function.
 * - SuggestNextActionsOutput - The return type for the suggestNextActions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema Definition
const SuggestNextActionsInputSchema = z.object({
  opportunityName: z.string().describe('The name of the growth opportunity or platform.'),
  type: z.string().describe('The type of the opportunity (e.g., Dropshipping, Wholesale, Distributor, Partnership).'),
  market: z.string().describe('The target market for this opportunity.'),
  currentStage: z.enum([
    'Not Started',
    'Research',
    'Applied',
    'In Review',
    'Approved',
    'Rejected',
    'Onboarding',
    'Live',
  ]).describe('The current stage of the growth opportunity in the Kanban pipeline.'),
  priority: z.enum(['High', 'Medium', 'Low']).describe('The strategic priority level of this opportunity.'),
  estimatedValue: z.string().describe('Estimated monetary value or impact of the opportunity.'),
  fitScore: z.string().describe('An assessment of how well this opportunity aligns with company strategy (e.g., "High", "Medium", "Low").'),
  riskLevel: z.string().describe('The perceived risk level associated with this opportunity (e.g., "High", "Medium", "Low").'),
  lastUpdate: z.string().optional().describe('Description of the last update or action taken on this opportunity.'),
  productsUploaded: z.boolean().optional().describe('Whether products have been uploaded for this platform.'),
  salesStarted: z.boolean().optional().describe('Whether sales have officially started on this platform.'),
  contactPerson: z.string().optional().describe('The main contact person for this opportunity.'),
  email: z.string().optional().describe('The email of the contact person.'),
  notes: z.string().optional().describe('Any general notes, feedback, or internal comments about this opportunity.'),
  requirements: z.string().optional().describe('Specific requirements like certifications, MOQ, or logistics needs.'),
  blockers: z.string().optional().describe('Any identified issues or blockers preventing progress.'),
});
export type SuggestNextActionsInput = z.infer<typeof SuggestNextActionsInputSchema>;

// Output Schema Definition
const SuggestNextActionsOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      action: z.string().describe('A concise and actionable description of the suggested next step.'),
      reason: z.string().describe('The reasoning behind suggesting this action, linked to the opportunity context.'),
      priority: z.enum(['High', 'Medium', 'Low']).describe('The recommended priority for this action.'),
      relatedStage: z.enum([
        'Not Started',
        'Research',
        'Applied',
        'In Review',
        'Approved',
        'Rejected',
        'Onboarding',
        'Live',
      ]).optional().describe('The stage this action aims to move the opportunity towards.'),
    })
  ).describe('An array of suggested next actions for the growth opportunity.'),
});
export type SuggestNextActionsOutput = z.infer<typeof SuggestNextActionsOutputSchema>;

// Wrapper function to be called from Next.js
export async function suggestNextActions(input: SuggestNextActionsInput): Promise<SuggestNextActionsOutput> {
  return suggestNextActionsFlow(input);
}

// Prompt Definition
const suggestNextActionsPrompt = ai.definePrompt({
  name: 'suggestNextActionsPrompt',
  input: { schema: SuggestNextActionsInputSchema },
  output: { schema: SuggestNextActionsOutputSchema },
  prompt: `You are an AI Growth Assistant for "Growth OS", a strategic and execution platform.
Your task is to analyze a growth opportunity and suggest context-aware next actions to help the team move it forward.
Consider the current stage, identified blockers, priority, value, and any specific notes or requirements.
Provide concrete, actionable steps with reasoning and priority.

Growth Opportunity Details:
Name: {{{opportunityName}}}
Type: {{{type}}}
Market: {{{market}}}
Current Stage: {{{currentStage}}}
Priority: {{{priority}}}
Estimated Value: {{{estimatedValue}}}
Fit Score: {{{fitScore}}}
Risk Level: {{{riskLevel}}}
{{#if lastUpdate}}Last Update: {{{lastUpdate}}}{{/if}}
{{#if productsUploaded}}Products Uploaded: {{productsUploaded}}{{/if}}
{{#if salesStarted}}Sales Started: {{salesStarted}}{{/if}}}
{{#if contactPerson}}Contact Person: {{{contactPerson}}}{{/if}}
{{#if email}}Contact Email: {{{email}}}{{/if}}}
{{#if notes}}Notes: {{{notes}}}{{/if}}}
{{#if requirements}}Requirements: {{{requirements}}}{{/if}}}
{{#if blockers}}Blockers: {{{blockers}}}{{/if}}}

Based on the above information, suggest 1-3 highly relevant next actions. For each action, explain the reasoning, assign a priority, and indicate which stage this action would help move the opportunity towards.
`
});

// Flow Definition
const suggestNextActionsFlow = ai.defineFlow(
  {
    name: 'suggestNextActionsFlow',
    inputSchema: SuggestNextActionsInputSchema,
    outputSchema: SuggestNextActionsOutputSchema,
  },
  async (input) => {
    const {output} = await suggestNextActionsPrompt(input);
    if (!output) {
      throw new Error('AI failed to generate suggestions.');
    }
    return output;
  }
);
