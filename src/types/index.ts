export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export type DocumentType = 'purchase_sale' | 'lease' | 'services' | 'contract_work' | 'employment';

export type DocumentStatus = 'not_started' | 'in_progress' | 'ready' | 'completed';