import { createClient } from '@supabase/supabase-js';
import { Template, TemplateField, DocumentType, TemplateFormData } from '../types';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Don't create the client immediately to avoid error when env vars aren't set
let supabase: ReturnType<typeof createClient> | null = null;

/**
 * Initialize the Supabase client if not already initialized
 */
const initSupabase = () => {
  if (!supabase && supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
  return supabase;
};

/**
 * Get all templates
 */
export const getTemplates = async (): Promise<Template[]> => {
  const client = initSupabase();
  
  if (!client) {
    console.warn('Supabase client not initialized, using mock templates');
    return getMockTemplates();
  }
  
  try {
    const { data, error } = await client
      .from('templates')
      .select('*')
      .order('name');
      
    if (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Failed to fetch templates:', error);
    return getMockTemplates();
  }
};

/**
 * Get templates by document type
 */
export const getTemplatesByType = async (documentType: DocumentType): Promise<Template[]> => {
  const client = initSupabase();
  
  if (!client) {
    console.warn('Supabase client not initialized, using mock templates');
    return getMockTemplates().filter(t => t.document_type === documentType);
  }
  
  try {
    const { data, error } = await client
      .from('templates')
      .select('*')
      .eq('document_type', documentType)
      .order('name');
      
    if (error) {
      console.error('Error fetching templates:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Failed to fetch templates:', error);
    return getMockTemplates().filter(t => t.document_type === documentType);
  }
};

/**
 * Get a specific template by ID
 */
export const getTemplateById = async (templateId: string): Promise<Template | null> => {
  const client = initSupabase();
  
  if (!client) {
    console.warn('Supabase client not initialized, using mock templates');
    return getMockTemplates().find(t => t.id === templateId) || null;
  }
  
  try {
    const { data, error } = await client
      .from('templates')
      .select('*')
      .eq('id', templateId)
      .single();
      
    if (error) {
      console.error('Error fetching template:', error);
      throw error;
    }
    
    return data || null;
  } catch (error) {
    console.error('Failed to fetch template:', error);
    return getMockTemplates().find(t => t.id === templateId) || null;
  }
};

/**
 * Get template fields for a specific template
 */
export const getTemplateFields = async (templateId: string): Promise<TemplateField[]> => {
  const client = initSupabase();
  
  if (!client) {
    console.warn('Supabase client not initialized, using mock template fields');
    return getMockTemplateFields(templateId);
  }
  
  try {
    const { data, error } = await client
      .from('template_fields')
      .select('*')
      .eq('template_id', templateId)
      .order('order');
      
    if (error) {
      console.error('Error fetching template fields:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Failed to fetch template fields:', error);
    return getMockTemplateFields(templateId);
  }
};

/**
 * Fill a template with form data
 */
export const fillTemplate = (templateContent: string, formData: TemplateFormData): string => {
  let filledTemplate = templateContent;
  
  Object.entries(formData).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    filledTemplate = filledTemplate.replace(regex, String(value));
  });
  
  return filledTemplate;
};

/**
 * Get mock templates for development without Supabase
 */
const getMockTemplates = (): Template[] => {
  return [
    {
      id: '1',
      name: 'Договор купли-продажи',
      description: 'Базовый шаблон договора купли-продажи имущества',
      content: 'ДОГОВОР КУПЛИ-ПРОДАЖИ\n\nг. {{city}} {{date}}\n\n{{seller_name}}, именуемый в дальнейшем «Продавец», с одной стороны, и {{buyer_name}}, именуемый в дальнейшем «Покупатель», с другой стороны, заключили настоящий Договор о нижеследующем:\n\n1. ПРЕДМЕТ ДОГОВОРА\n\n1.1. Продавец обязуется передать в собственность Покупателя, а Покупатель обязуется принять и оплатить следующее имущество: {{property_description}} (далее - "Имущество").\n\n2. ЦЕНА И ПОРЯДОК РАСЧЕТОВ\n\n2.1. Стоимость Имущества составляет {{price}} ({{price_in_words}}) тенге.\n2.2. Оплата производится в следующем порядке: {{payment_terms}}.\n\n3. ПЕРЕДАЧА ИМУЩЕСТВА\n\n3.1. Имущество передается Продавцом Покупателю в течение {{delivery_period}} с момента подписания настоящего Договора.\n3.2. Передача Имущества осуществляется по акту приема-передачи, подписываемому обеими сторонами.\n\n4. ОТВЕТСТВЕННОСТЬ СТОРОН\n\n4.1. За неисполнение или ненадлежащее исполнение обязательств по настоящему Договору стороны несут ответственность в соответствии с законодательством Республики Казахстан.\n\n5. ЗАКЛЮЧИТЕЛЬНЫЕ ПОЛОЖЕНИЯ\n\n5.1. Настоящий Договор вступает в силу с момента его подписания обеими сторонами и действует до полного исполнения сторонами своих обязательств.\n5.2. Все изменения и дополнения к настоящему Договору действительны, если они совершены в письменной форме и подписаны обеими сторонами.\n5.3. Настоящий Договор составлен в двух экземплярах, имеющих одинаковую юридическую силу, по одному для каждой из сторон.\n\n6. РЕКВИЗИТЫ И ПОДПИСИ СТОРОН\n\nПродавец:                               Покупатель:\n{{seller_details}}                      {{buyer_details}}\n\n____________ / {{seller_name}} /         ____________ / {{buyer_name}} /',
      document_type: 'purchase_sale',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Договор аренды помещения',
      description: 'Базовый шаблон договора аренды недвижимого имущества',
      content: 'ДОГОВОР АРЕНДЫ\n\nг. {{city}} {{date}}\n\n{{lessor_name}}, именуемый в дальнейшем «Арендодатель», с одной стороны, и {{lessee_name}}, именуемый в дальнейшем «Арендатор», с другой стороны, заключили настоящий Договор о нижеследующем:\n\n1. ПРЕДМЕТ ДОГОВОРА\n\n1.1. Арендодатель обязуется предоставить Арендатору во временное пользование следующее недвижимое имущество: {{property_description}} (далее - "Помещение").\n1.2. Помещение будет использоваться для: {{purpose}}.\n\n2. СРОК АРЕНДЫ\n\n2.1. Настоящий Договор заключен сроком на {{rental_period}} с {{start_date}} по {{end_date}}.\n\n3. АРЕНДНАЯ ПЛАТА И ПОРЯДОК РАСЧЕТОВ\n\n3.1. Ежемесячная арендная плата составляет {{monthly_rent}} ({{monthly_rent_in_words}}) тенге.\n3.2. Арендная плата вносится не позднее {{payment_day}} числа каждого месяца.\n3.3. Способ оплаты: {{payment_method}}.',
      document_type: 'lease',
      created_at: new Date().toISOString()
    }
  ];
};

/**
 * Get mock template fields for development without Supabase
 */
const getMockTemplateFields = (templateId: string): TemplateField[] => {
  const fields: Record<string, TemplateField[]> = {
    '1': [
      { id: '1', template_id: '1', field_name: 'city', display_name: 'Город', field_type: 'text', required: true, order: 1, created_at: new Date().toISOString() },
      { id: '2', template_id: '1', field_name: 'date', display_name: 'Дата договора', field_type: 'date', required: true, order: 2, created_at: new Date().toISOString() },
      { id: '3', template_id: '1', field_name: 'seller_name', display_name: 'ФИО продавца', field_type: 'text', required: true, order: 3, created_at: new Date().toISOString() },
      { id: '4', template_id: '1', field_name: 'buyer_name', display_name: 'ФИО покупателя', field_type: 'text', required: true, order: 4, created_at: new Date().toISOString() },
      { id: '5', template_id: '1', field_name: 'property_description', display_name: 'Описание имущества', field_type: 'textarea', required: true, order: 5, created_at: new Date().toISOString() },
      { id: '6', template_id: '1', field_name: 'price', display_name: 'Стоимость (цифрами)', field_type: 'number', required: true, order: 6, created_at: new Date().toISOString() },
      { id: '7', template_id: '1', field_name: 'price_in_words', display_name: 'Стоимость (прописью)', field_type: 'text', required: true, order: 7, created_at: new Date().toISOString() },
      { id: '8', template_id: '1', field_name: 'payment_terms', display_name: 'Условия оплаты', field_type: 'textarea', required: true, order: 8, created_at: new Date().toISOString() },
      { id: '9', template_id: '1', field_name: 'delivery_period', display_name: 'Срок передачи имущества', field_type: 'text', required: true, order: 9, created_at: new Date().toISOString() },
      { id: '10', template_id: '1', field_name: 'seller_details', display_name: 'Реквизиты продавца', field_type: 'textarea', required: true, order: 10, created_at: new Date().toISOString() },
      { id: '11', template_id: '1', field_name: 'buyer_details', display_name: 'Реквизиты покупателя', field_type: 'textarea', required: true, order: 11, created_at: new Date().toISOString() }
    ],
    '2': [
      { id: '12', template_id: '2', field_name: 'city', display_name: 'Город', field_type: 'text', required: true, order: 1, created_at: new Date().toISOString() },
      { id: '13', template_id: '2', field_name: 'date', display_name: 'Дата договора', field_type: 'date', required: true, order: 2, created_at: new Date().toISOString() },
      { id: '14', template_id: '2', field_name: 'lessor_name', display_name: 'ФИО арендодателя', field_type: 'text', required: true, order: 3, created_at: new Date().toISOString() },
      { id: '15', template_id: '2', field_name: 'lessee_name', display_name: 'ФИО арендатора', field_type: 'text', required: true, order: 4, created_at: new Date().toISOString() },
      { id: '16', template_id: '2', field_name: 'property_description', display_name: 'Описание помещения', field_type: 'textarea', required: true, order: 5, created_at: new Date().toISOString() }
    ]
  };
  
  return fields[templateId] || [];
};