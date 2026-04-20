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