/**
 * OpenAI API service for handling chat interactions
 */
import { Message, DocumentType, DocumentStatus, TemplateFormData } from '../types';
import { createClient } from '@supabase/supabase-js';
import { getTemplateById, fillTemplate } from './templates';

// Initialize Supabase client only when needed
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Don't create the client immediately to avoid the error
let supabase: ReturnType<typeof createClient> | null = null;

interface OpenAIResponse {
  response: string;
  documentType: DocumentType | null;
  documentStatus: DocumentStatus;
  references?: { title: string; content: string }[];
}

interface SendMessageParams {
  messages: Message[];
  documentType: DocumentType | null;
  mode?: 'consultation' | 'document';
}

/**
 * Send a chat message to the OpenAI API via Supabase Edge Function
 */
export const sendChatMessage = async ({ 
  messages, 
  documentType, 
  mode = 'document' 
}: SendMessageParams): Promise<OpenAIResponse> => {
  try {
    // Format messages for the API
    const formattedMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // For development without Supabase connection, provide mock responses
    if (!supabaseUrl || !supabaseAnonKey) {
      console.warn('Supabase credentials not found, using mock response');
      return getMockResponse(messages, documentType, mode);
    }

    // Initialize Supabase client if not already initialized and credentials are available
    if (!supabase && supabaseUrl && supabaseAnonKey) {
      try {
        supabase = createClient(supabaseUrl, supabaseAnonKey);
      } catch (err) {
        console.error('Failed to initialize Supabase client:', err);
        return getMockResponse(messages, documentType, mode);
      }
    }

    // Call the Supabase Edge Function if client is available
    if (supabase) {
      try {
        const { data, error } = await supabase.functions.invoke('chat', {
          body: {
            messages: formattedMessages,
            documentType,
            mode
          }
        });

        if (error) {
          console.error('Supabase Edge Function error:', error);
          // Fall back to mock response instead of throwing
          return getMockResponse(messages, documentType, mode);
        }

        return {
          response: data.response,
          documentType: data.documentType,
          documentStatus: data.documentStatus,
          references: data.references
        };
      } catch (err) {
        console.error('Failed to send a request to the Edge Function:', err);
        return getMockResponse(messages, documentType, mode);
      }
    } else {
      // Fallback to mock if client initialization failed
      console.warn('Supabase client not available, using mock response');
      return getMockResponse(messages, documentType, mode);
    }
  } catch (error) {
    console.error('Error sending message to OpenAI:', error);
    
    // Fall back to a mock response if API call fails
    return getMockResponse(messages, documentType, mode);
  }
};

/**
 * Generate a mock response for development or fallback
 */
const getMockResponse = (
  messages: Message[], 
  documentType: DocumentType | null, 
  mode: 'consultation' | 'document' = 'document'
): OpenAIResponse => {
  // Get the last user message
  const lastUserMessage = messages.filter(m => m.role === 'user').pop();
  const userInput = lastUserMessage?.content.toLowerCase() || '';
  
  // Detect document type from user input if not already set
  let detectedDocType = documentType;
  if (!detectedDocType) {
    if (userInput.includes('купля') || userInput.includes('продажа') || userInput.includes('покупка')) {
      detectedDocType = 'purchase_sale';
    } else if (userInput.includes('аренда') || userInput.includes('съем')) {
      detectedDocType = 'lease';
    } else if (userInput.includes('услуг')) {
      detectedDocType = 'services';
    } else if (userInput.includes('подряд') || userInput.includes('работ')) {
      detectedDocType = 'contract_work';
    } else if (userInput.includes('труд') || userInput.includes('работа') || userInput.includes('найм')) {
      detectedDocType = 'employment';
    }
  }
  
  // Determine document status based on conversation length
  const documentStatus: DocumentStatus = messages.length >= 5 ? 'ready' : 'in_progress';
  
  // Generate appropriate response based on context and mode
  let response = 'Извините, я не смог подключиться к серверу. Пожалуйста, проверьте подключение к интернету и попробуйте еще раз.';
  let references = undefined;

  if (mode === 'consultation') {
    if (userInput.includes('договор')) {
      response = 'Согласно Гражданскому кодексу РК, договор считается заключенным, когда стороны достигли соглашения по всем существенным условиям. Для договора купли-продажи существенными условиями являются предмет и цена. Хотите узнать больше о конкретных типах договоров?';
      references = [
        {
          title: 'Гражданский кодекс РК, статья 393',
          content: 'Договор считается заключенным, когда между сторонами в требуемой в подлежащих случаях форме достигнуто соглашение по всем существенным условиям договора.'
        }
      ];
    } else if (userInput.includes('трудов')) {
      response = 'По трудовому законодательству РК, трудовой договор должен быть заключен в письменной форме. Обязательные условия включают место работы, трудовую функцию, дату начала работы, размер и условия оплаты труда. Трудовой договор составляется в двух экземплярах.';
      references = [
        {
          title: 'Трудовой кодекс РК, статья 33',
          content: 'Трудовой договор - письменное соглашение между работником и работодателем, в соответствии с которым работник обязуется лично выполнять определенную работу, а работодатель обязуется предоставить работу, выплачивать работнику заработную плату и обеспечивать условия труда.'
        }
      ];
    } else if (userInput.includes('привет') || userInput.includes('здравствуй')) {
      response = 'Здравствуйте! Я юридический консультант, специализирующийся на законодательстве Республики Казахстан. Я могу предоставить вам информацию по правовым вопросам. Что именно вас интересует?';
    } else {
      response = 'Я могу предоставить консультацию по различным правовым вопросам в соответствии с законодательством Республики Казахстан. Пожалуйста, уточните ваш вопрос, чтобы я мог дать более точный ответ.';
    }
  } else {
    // Document generation mode responses
    if (detectedDocType && documentStatus === 'ready') {
      response = `Отлично! У меня есть вся необходимая информация для составления документа "${detectedDocType}". Вы можете сформировать его, нажав кнопку ниже, или выбрать готовый шаблон для более быстрого заполнения.`;
    } else if (detectedDocType) {
      response = `Я понимаю, что вам нужен документ типа "${detectedDocType}". Расскажите, пожалуйста, подробнее о ваших требованиях к этому документу.`;
    } else if (userInput.includes('привет') || userInput.includes('здравствуй')) {
      response = 'Здравствуйте! Я ИИ-ассистент, который поможет вам составить юридический документ. Какой тип документа вам нужен?';
    } else {
      response = 'Пожалуйста, уточните, какой тип юридического документа вам нужен? Например, договор купли-продажи, аренды, оказания услуг и т.д.';
    }
  }
  
  return {
    response,
    documentType: detectedDocType,
    documentStatus,
    references
  };
};

/**
 * AI-generated document based on conversation
 * In a real implementation, this would call another edge function to generate the actual document
 */
export const generateDocument = async (documentType: DocumentType): Promise<string> => {
  // Simulate document generation with a delay
  return new Promise((resolve) => {
    setTimeout(() => {
      // Return a mock document URL (in real implementation, this would be a URL to the generated document)
      resolve(`/documents/${documentType}_${Date.now()}.pdf`);
    }, 2000);
  });
};

/**
 * Generate document from a template with the provided form data
 */
export const generateDocumentFromTemplate = async (
  templateId: string, 
  formData: TemplateFormData
): Promise<string> => {
  try {
    // Get the template
    const template = await getTemplateById(templateId);
    if (!template) {
      throw new Error('Template not found');
    }
    
    // Fill the template with the form data
    const filledContent = fillTemplate(template.content, formData);
    
    // In a real implementation, this would convert the filled template to a document
    // For this demo, we'll simulate a delay and return a mock URL
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`/documents/template_${template.document_type}_${Date.now()}.pdf`);
      }, 2000);
    });
  } catch (error) {
    console.error('Error generating document from template:', error);
    throw new Error('Failed to generate document from template');
  }
};