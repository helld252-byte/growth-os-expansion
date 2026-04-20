'use server';
/**
 * @fileOverview An AI agent that recommends a prioritized list of growth opportunities.
 *
 * - recommendPriorities - A function that handles the growth opportunity prioritization process.
 * - RecommendPrioritiesInput - The input type for the recommendPriorities function.
 * - RecommendPrioritiesOutput - The return type for the recommendPriorities function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GrowthOpportunitySchema = z.object({
  id: z.string().describe('Unique identifier for the growth opportunity.'),
  name: z.string().describe('Name of the growth opportunity.'),
  estimatedValue: z.number().describe('Estimated monetary value of the opportunity. Higher is better.'),
  fitScore: z.number().min(1).max(10).describe('Score indicating strategic fit (1-10). Higher is better.'),
  riskLevel: z.enum(['Low', 'Medium', 'High']).describe('Risk level associated with the opportunity.'),
  currentStage: z.enum([
    'Not Started',
    'Research',
    'Applied',
    'In Review',
    'Approved',
    'Rejected',
    'Onboarding',
    'Live',
  ]).describe('Current stage of the opportunity in the pipeline.'),
});

const RecommendPrioritiesInputSchema = z.object({
  opportunities: z.array(GrowthOpportunitySchema).describe('A list of growth opportunities to prioritize.'),
});
export type RecommendPrioritiesInput = z.infer<typeof RecommendPrioritiesInputSchema>;

const PrioritizedOpportunitySchema = z.object({
  id: z.string().describe('Unique identifier of the prioritized growth opportunity.'),
  name: z.string().describe('Name of the prioritized growth opportunity.'),
  priority: z.enum(['High', 'Medium', 'Low']).describe('The recommended priority for this opportunity.'),
  reasoning: z.string().describe('Explanation for the assigned priority.'),
});

const RecommendPrioritiesOutputSchema = z.object({
  prioritizedOpportunities: z.array(PrioritizedOpportunitySchema).describe('A list of growth opportunities, ordered by recommended priority.'),
});
export type RecommendPrioritiesOutput = z.infer<typeof RecommendPrioritiesOutputSchema>;

export async function recommendPriorities(
  input: RecommendPrioritiesInput
): Promise<RecommendPrioritiesOutput> {
  return recommendPrioritiesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'recommendPrioritiesPrompt',
  input: { schema: RecommendPrioritiesInputSchema },
  output: { schema: RecommendPrioritiesOutputSchema },
  prompt: `You are a strategic growth advisor for a company. Your task is to analyze a list of growth opportunities and recommend a priority level (High, Medium, or Low) for each, along with a brief reasoning.

Consider the following criteria for prioritization:
- Estimated Value: Higher value generally means higher priority.
- Fit Score: Higher strategic fit (1-10 scale) generally means higher priority.
- Risk Level: Lower risk generally means higher priority, but balance against value and fit.
- Current Stage: Opportunities in earlier, promising stages might need high priority to advance, while those already Approved or Onboarding might also be high priority if they require critical next steps or attention.

Prioritize opportunities that have a high estimated value, high fit score, and low to medium risk. Opportunities in 'Not Started', 'Research', or 'Applied' stages with strong potential should be prioritized to move forward. Opportunities in 'Approved' or 'Onboarding' stages are also high priority as they are close to generating results.

List the opportunities in your response, assigning a priority and reasoning for each.

Growth Opportunities:

{{#each opportunities}}
- ID: {{{id}}}
  Name: {{{name}}}
  Estimated Value: {{{estimatedValue}}}
  Fit Score: {{{fitScore}}}
  Risk Level: {{{riskLevel}}}
  Current Stage: {{{currentStage}}}
{{/each}}`,
});

const recommendPrioritiesFlow = ai.defineFlow(
  {
    name: 'recommendPrioritiesFlow',
    inputSchema: RecommendPrioritiesInputSchema,
    outputSchema: RecommendPrioritiesOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
