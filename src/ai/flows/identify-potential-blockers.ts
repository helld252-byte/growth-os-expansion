'use server';
/**
 * @fileOverview An AI agent that analyzes growth channel progress and notes to proactively identify potential blockers or risks.
 *
 * - identifyPotentialBlockers - A function that handles the blocker identification process.
 * - IdentifyPotentialBlockersInput - The input type for the identifyPotentialBlockers function.
 * - IdentifyPotentialBlockersOutput - The return type for the identifyPotentialBlockers function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const IdentifyPotentialBlockersInputSchema = z.object({
  channelName: z.string().describe('The name of the growth channel.'),
  currentStage: z.string().describe('The current stage of the growth channel (e.g., Not Started, Research, Applied, In Review, Approved, Rejected, Onboarding, Live).'),
  nextStep: z.string().describe('The next planned action for the growth channel.'),
  notes: z.string().describe('Any relevant notes or recent updates regarding the channel.'),
  lastUpdate: z.string().describe('The date of the last update for the channel.'),
  linkedPlatform: z.string().nullable().optional().describe('The name of the linked platform, if applicable.'),
  feedback: z.string().nullable().optional().describe('Any feedback received for the channel.'),
  rejectionReason: z.string().nullable().optional().describe('If the channel was rejected, the reason for rejection.'),
  productsUploaded: z.boolean().describe('True if products have been uploaded to the platform, false otherwise.'),
  salesStarted: z.boolean().describe('True if sales have started on the platform, false otherwise.'),
});
export type IdentifyPotentialBlockersInput = z.infer<typeof IdentifyPotentialBlockersInputSchema>;

const IdentifyPotentialBlockersOutputSchema = z.object({
  blockers: z.array(z.object({
    description: z.string().describe('A description of the potential blocker.'),
    severity: z.enum(['High', 'Medium', 'Low']).describe('The severity of the blocker (High, Medium, or Low).'),
    suggestedAction: z.string().describe('A recommended action to mitigate or resolve the blocker.'),
  })).describe('A list of identified potential blockers.'),
  risks: z.array(z.object({
    description: z.string().describe('A description of the potential risk.'),
    impact: z.string().describe('The potential impact if the risk materializes.'),
    mitigationStrategy: z.string().describe('A strategy to mitigate the risk and its impact.'),
  })).describe('A list of identified potential risks.'),
});
export type IdentifyPotentialBlockersOutput = z.infer<typeof IdentifyPotentialBlockersOutputSchema>;

export async function identifyPotentialBlockers(input: IdentifyPotentialBlockersInput): Promise<IdentifyPotentialBlockersOutput> {
  return identifyPotentialBlockersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyPotentialBlockersPrompt',
  input: { schema: IdentifyPotentialBlockersInputSchema },
  output: { schema: IdentifyPotentialBlockersOutputSchema },
  prompt: `You are an expert growth strategist and risk analyst for a company operating "Growth OS".
Your task is to analyze the provided information for a growth channel and proactively identify any potential blockers or risks that could impede progress. Provide a clear description, severity/impact, and a suggested action/mitigation strategy for each.

Growth Channel Information:
Channel Name: {{{channelName}}}
Current Stage: {{{currentStage}}}
Next Step: {{{nextStep}}}
Last Update: {{{lastUpdate}}}
Notes: {{{notes}}}

{{#if linkedPlatform}}Linked Platform: {{{linkedPlatform}}}{{/if}}
{{#if feedback}}Feedback: {{{feedback}}}{{/if}}
{{#if rejectionReason}}Rejection Reason: {{{rejectionReason}}}{{/if}}
Products Uploaded: {{#if productsUploaded}}Yes{{else}}No{{/if}}
Sales Started: {{#if salesStarted}}Yes{{else}}No{{/if}}

Based on this information, identify potential blockers and risks:
`,
});

const identifyPotentialBlockersFlow = ai.defineFlow(
  {
    name: 'identifyPotentialBlockersFlow',
    inputSchema: IdentifyPotentialBlockersInputSchema,
    outputSchema: IdentifyPotentialBlockersOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
