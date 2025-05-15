export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export type DocumentType = 'purchase_sale' | 'lease' | 'services' | 'contract_work' | 'employment';

export type DocumentStatus = 'not_started' | 'in_progress' | 'ready' | 'completed';

export interface Template {
  id: string;
  name: string;
  description: string;
  content: string;
  document_type: DocumentType;
  created_at: string;
}

export interface TemplateField {
  id: string;
  template_id: string;
  field_name: string;
  display_name: string;
  field_type: 'text' | 'textarea' | 'number' | 'date' | 'select';
  required: boolean;
  order: number;
  created_at: string;
}

export interface TemplateFormData {
  [key: string]: string | number;
}