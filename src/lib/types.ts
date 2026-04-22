export type PlatformStage = 
  | 'Not Started'
  | 'Research'
  | 'Applied'
  | 'In Review'
  | 'Approved'
  | 'Rejected'
  | 'Onboarding'
  | 'Live';

export type Priority = 'High' | 'Medium' | 'Low';

export interface Platform {
  id: string;
  name: string;
  type: string;
  market: string;
  website?: string;
  owner: string;
  priority: Priority;
  estimatedValue: number;
  fitScore: number;
  riskLevel: Priority;
  currentStage: PlatformStage;
  dateStarted: string;
  lastUpdate: string;
  productsUploaded: boolean;
  salesStarted: boolean;
  firstOrderDate?: string;
  nextStep: string;
  dueDate: string;
  blockers?: string;
  contactPerson?: string;
  email?: string;
  notes?: string;
  requirements?: string[];
  rejectionReason?: string;
}

export type TaskStatus = 'Open' | 'In Progress' | 'Completed' | 'Overdue';

export interface Task {
  id: string;
  title: string;
  linkedPlatformId?: string;
  linkedPlatformName?: string;
  owner: string;
  priority: Priority;
  dueDate: string;
  status: TaskStatus;
}

export interface HubSection {
  id: string;
  title: string;
  category: 'Brand' | 'Product' | 'Legal' | 'Assets' | 'FAQs';
  content: string;
  lastUpdated: string;
}

export type CampaignStatus = 'Draft' | 'Scheduled' | 'Active' | 'Paused' | 'Completed';
export type CampaignType = 'Paid Ads' | 'Creator Outreach' | 'Seasonal' | 'Awareness' | 'Promotion';

export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  budget: number;
  spend: number;
  reach: number;
  conversions: number;
  owner: string;
  startDate: string;
  endDate: string;
}

export type PartnerStatus = 'Prospecting' | 'Outreach' | 'Negotiating' | 'Active' | 'Inactive';
export type PartnerType = 'Influencer' | 'Community' | 'Forum' | 'School' | 'B2B Partner';

export interface Partner {
  id: string;
  name: string;
  type: PartnerType;
  status: PartnerStatus;
  contact: string;
  impactScore: number; // 1-10
  owner: string;
  lastContact: string;
  notes: string;
}
