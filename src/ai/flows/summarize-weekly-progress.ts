'use server';
/**
 * @fileOverview A Genkit flow for summarizing weekly progress of active growth opportunities and tasks.
 *
 * - summarizeWeeklyProgress - A function that handles the weekly progress summarization process.
 * - SummarizeWeeklyProgressInput - The input type for the summarizeWeeklyProgress function.
 * - SummarizeWeeklyProgressOutput - The return type for the summarizeWeeklyProgress function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChannelSchema = z.object({
  name: z.string().describe('Name of the growth channel/platform.'),
  type: z.string().describe('Type of the channel (e.g., Dropshipping, Wholesale).'),
  market: z.string().describe('Target market for the channel.'),
  owner: z.string().describe('Owner of the channel.'),
  priority: z.string().describe('Priority level (e.g., High, Medium, Low).'),
  currentStage: z.string().describe('Current stage of the channel in the pipeline (e.g., Not Started, Research, Applied, In Review, Approved, Rejected, Onboarding, Live).'),
  lastUpdate: z.string().describe('Date of the last update for this channel (ISO string).'),
  nextStep: z.string().describe('Description of the next action required.'),
  blockers: z.string().optional().describe('Description of any blockers preventing progress.'),
  salesStarted: z.boolean().optional().describe('Whether sales have started on this channel.'),
  firstOrderDate: z.string().optional().describe('Date of the first order on this channel (ISO string).'),
});

const TaskSchema = z.object({
  title: z.string().describe('Title of the task.'),
  linkedPlatform: z.string().optional().describe('Name of the linked growth platform, if any.'),
  owner: z.string().describe('Owner of the task.'),
  priority: z.string().describe('Priority level (e.g., High, Medium, Low).'),
  dueDate: z.string().describe('Due date of the task (ISO string).'),
  status: z.string().describe('Current status of the task (e.g., Open, In Progress, Completed, Overdue).'),
});

const SummarizeWeeklyProgressInputSchema = z.object({
  activeChannels: z.array(ChannelSchema).describe('A list of all active growth opportunities/channels.'),
  activeTasks: z.array(TaskSchema).describe('A list of all active operational tasks.'),
});
export type SummarizeWeeklyProgressInput = z.infer<typeof SummarizeWeeklyProgressInputSchema>;

const SummarizeWeeklyProgressOutputSchema = z.object({
  summary: z.string().describe('A concise executive summary of the weekly progress across all active growth opportunities and tasks.'),
  keyAchievements: z.array(z.string()).describe('List of key achievements made this week (e.g., channels moved to Approved/Live, sales started, significant progress on high-priority items).'),
  urgentIssues: z.array(z.string()).describe('List of urgent issues or blockers that need immediate attention (e.g., blocked channels, overdue high-priority tasks, channels stuck in "In Review" for too long).'),
  overallTrends: z.array(z.string()).describe('List of overall trends observed in the weekly progress (e.g., positive momentum in a specific market, common bottlenecks across multiple channels, acceleration or stagnation in certain areas).'),
});
export type SummarizeWeeklyProgressOutput = z.infer<typeof SummarizeWeeklyProgressOutputSchema>;

export async function summarizeWeeklyProgress(input: SummarizeWeeklyProgressInput): Promise<SummarizeWeeklyProgressOutput> {
  return summarizeWeeklyProgressFlow(input);
}

const summarizeWeeklyProgressPrompt = ai.definePrompt({
  name: 'summarizeWeeklyProgressPrompt',
  input: { schema: SummarizeWeeklyProgressInputSchema },
  output: { schema: SummarizeWeeklyProgressOutputSchema },
  prompt: `You are an AI assistant for "Growth OS", a strategic and execution platform. Your goal is to provide a concise executive summary of the team's weekly progress.
Analyze the provided active growth opportunities (channels) and active tasks. The data represents the current state.
Infer recent changes and focus your summary on what appears to be new or critical within the "past week" context, even if explicit weekly change data is not provided.

Focus on highlighting:
- Key achievements: Identify any channels that have recently moved to 'Approved' or 'Live' stages, channels where sales have started, or any high-priority tasks that are marked 'Completed'.
- Urgent issues: Identify channels with explicit 'blockers', high-priority tasks that are 'Overdue', or channels that seem to be stuck in a stage like 'In Review' for a prolonged period (using 'lastUpdate' date if available for inference).
- Overall trends: Look for patterns such as a general increase in 'Approved' channels, many channels progressing through 'Research', common types of 'blockers', or a high number of 'Overdue' tasks across different owners/platforms.

Present the information clearly and concisely in JSON format.

Here is the data for active growth opportunities:
{{#if activeChannels.length}}
{{#each activeChannels}}
- Channel Name: {{this.name}}
  - Type: {{this.type}}
  - Market: {{this.market}}
  - Owner: {{this.owner}}
  - Priority: {{this.priority}}
  - Current Stage: {{this.currentStage}}
  - Last Update: {{this.lastUpdate}}
  - Next Step: {{this.nextStep}}
  {{#if this.blockers}}- Blockers: {{this.blockers}}{{/if}}
  {{#if this.salesStarted}}- Sales Started: {{this.salesStarted}}{{/if}}
  {{#if this.firstOrderDate}}- First Order Date: {{this.firstOrderDate}}{{/if}}
{{/each}}
{{else}}
No active growth opportunities to report.
{{/if}}

Here is the data for active tasks:
{{#if activeTasks.length}}
{{#each activeTasks}}
- Task Title: {{this.title}}
  {{#if this.linkedPlatform}}- Linked Platform: {{this.linkedPlatform}}{{/if}}
  - Owner: {{this.owner}}
  - Priority: {{this.priority}}
  - Due Date: {{this.dueDate}}
  - Status: {{this.status}}
{{/each}}
{{else}}
No active tasks to report.
{{/if}}

Based on the above information, generate the weekly progress summary.
`,
});

const summarizeWeeklyProgressFlow = ai.defineFlow(
  {
    name: 'summarizeWeeklyProgressFlow',
    inputSchema: SummarizeWeeklyProgressInputSchema,
    outputSchema: SummarizeWeeklyProgressOutputSchema,
  },
  async (input) => {
    const { output } = await summarizeWeeklyProgressPrompt(input);
    if (!output) {
      throw new Error('Failed to generate weekly progress summary.');
    }
    return output;
  }
);
