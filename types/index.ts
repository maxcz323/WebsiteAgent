export type LeadStatus =
  | 'new'
  | 'generating'
  | 'generated'
  | 'approved'
  | 'creating_draft'
  | 'draft_created'
  | 'rejected';

export interface Lead {
  id: string;
  created_at: string;
  business_niche: string;
  city: string;
  website_style: string;
  business_name: string | null;
  contact_email: string | null;
  contact_name: string | null;
  status: LeadStatus;
  notes: string | null;
  created_by: string | null;
  created_by_name: string | null;
  assigned_to: string | null;
  assigned_to_name: string | null;
  deal_value: number | null;
  deleted_at: string | null;
}

export interface GeneratedPage {
  id: string;
  lead_id: string;
  html_content: string;
  created_at: string;
}

export interface EmailDraft {
  id: string;
  lead_id: string;
  gmail_draft_id: string | null;
  subject: string;
  body: string;
  created_at: string;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  type: 'call' | 'email' | 'meeting' | 'other';
  scheduled_at: string;
  notes: string | null;
  created_by: string | null;
  created_at: string;
}

export interface GmailTokens {
  access_token: string | null;
  refresh_token: string;
  expiry_date: number | null;
}
