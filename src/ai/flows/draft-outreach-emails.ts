'use server';
/**
 * @fileOverview A Genkit flow for drafting personalized outreach emails for growth channels.
 *
 * - draftOutreachEmails - A function that handles the email drafting process.
 * - DraftOutreachEmailsInput - The input type for the draftOutreachEmails function.
 * - DraftOutreachEmailsOutput - The return type for the draftOutreachEmails function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DraftOutreachEmailsInputSchema = z.object({
  channelName: z.string().describe('The name of the growth channel or platform.'),
  channelType: z.string().describe('The type of the channel (e.g., Dropshipping platform, Wholesale marketplace, Distributor, Retail buyer, Strategic partnership).'),
  currentStage: z.string().describe('The current stage of the channel in the growth pipeline (e.g., Not Started, Research, Applied, In Review, Approved, Rejected, Onboarding, Live).'),
  contactPerson: z.string().optional().describe('The name of the contact person for the outreach.'),
  communicationHistory: z.string().optional().describe('Any previous communication details or history with this channel/contact.'),
  purpose: z.string().describe('The main purpose of the email (e.g., initial outreach, follow-up after application, request for more information, partnership proposal).'),
  additionalContext: z.string().optional().describe('Any additional context or specific points to include in the email.')
});
export type DraftOutreachEmailsInput = z.infer<typeof DraftOutreachEmailsInputSchema>;

const DraftOutreachEmailsOutputSchema = z.object({
  draftedEmail: z.string().describe('The drafted personalized outreach email, including a subject line.')
});
export type DraftOutreachEmailsOutput = z.infer<typeof DraftOutreachEmailsOutputSchema>;

export async function draftOutreachEmails(input: DraftOutreachEmailsInput): Promise<DraftOutreachEmailsOutput> {
  return draftOutreachEmailsFlow(input);
}

const draftOutreachEmailsPrompt = ai.definePrompt({
  name: 'draftOutreachEmailsPrompt',
  input: {schema: DraftOutreachEmailsInputSchema},
  output: {schema: DraftOutreachEmailsOutputSchema},
  prompt: `You are an AI assistant specialized in drafting professional and personalized outreach emails for business growth and partnerships.
Your goal is to create an effective email that engages the recipient and moves the opportunity forward.

Draft a professional and personalized outreach email based on the following information:

Channel Name: {{{channelName}}}
Channel Type: {{{channelType}}}
Current Stage: {{{currentStage}}}
Purpose of Email: {{{purpose}}}

{{#if contactPerson}}
Contact Person: {{{contactPerson}}}
{{/if}}

{{#if communicationHistory}}
Previous Communication: {{{communicationHistory}}}
{{/if}}

{{#if additionalContext}}
Additional Context/Specific Points to Include: {{{additionalContext}}}
{{/if}}

Structure the email clearly, including a suitable subject line.
Ensure the tone is polite, professional, and actionable.
Only output the email content, formatted as a JSON object with a single key 'draftedEmail'.`
});

const draftOutreachEmailsFlow = ai.defineFlow(
  {
    name: 'draftOutreachEmailsFlow',
    inputSchema: DraftOutreachEmailsInputSchema,
    outputSchema: DraftOutreachEmailsOutputSchema,
  },
  async (input) => {
    const {output} = await draftOutreachEmailsPrompt(input);
    return output!;
  }
);
