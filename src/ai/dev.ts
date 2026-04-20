import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-platform-status-flow.ts';
import '@/ai/flows/identify-potential-blockers.ts';
import '@/ai/flows/recommend-priorities.ts';
import '@/ai/flows/draft-outreach-emails.ts';
import '@/ai/flows/suggest-next-actions.ts';
import '@/ai/flows/summarize-weekly-progress.ts';