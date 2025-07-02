export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId: string;
  productIds: string[];
  isActive: boolean;
  isBlocked: boolean;
  createdAt: string;
  avatar?: string;
}

export type UserRole = 'super_admin' | 'client_admin' | 'product_admin' | 'support_agent' | 'end_user';

export type TicketStatus = 'open' | 'in_progress' | 'waiting_response' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignedTo?: string;
  assignedToName?: string;
  createdBy: string;
  createdByEmail: string;
  createdByName?: string;
  productId: string;
  productName: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  slaBreached: boolean;
  attachments: string[];
  comments: TicketComment[];
  rating?: number;
  feedback?: string;
  jiraTicketId?: string;
}

export interface TicketComment {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  content: string;
  attachments: string[];
  createdAt: string;
  isInternal: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  organizationId: string;
  isActive: boolean;
  createdAt: string;
  slaHours: number;
}

export interface Organization {
  id: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  settings: {
    maintenanceMode: boolean;
    allowTicketSubmission: boolean;
    slackWebhook?: string;
    jiraIntegration?: {
      enabled: boolean;
      url: string;
      token: string;
    };
  };
}

export interface AnalyticsData {
  totalTickets: number;
  openTickets: number;
  resolvedTickets: number;
  avgResolutionTime: number;
  slaCompliance: number;
  agentPerformance: AgentPerformance[];
  ticketsByStatus: Record<TicketStatus, number>;
  ticketsByPriority: Record<TicketPriority, number>;
  ticketsByProduct: Record<string, number>;
  dailyTickets: Array<{ date: string; count: number; resolved: number }>;
}

export interface AgentPerformance {
  userId: string;
  name: string;
  ticketsAssigned: number;
  ticketsResolved: number;
  avgResolutionTime: number;
  avgRating: number;
  slaCompliance: number;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}