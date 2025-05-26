import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Message, DocumentType, DocumentStatus, TemplateFormData } from '../types';
import { useLocale } from './LocaleContext';
import { sendChatMessage, generateDocument as generateDocumentAPI, generateDocumentFromTemplate } from '../services/openai';

interface ChatContextType {
  messages: Message[];
  documentType: DocumentType | null;
  documentStatus: DocumentStatus;
  isProcessing: boolean;
  sendMessage: (content: string) => void;
  resetChat: () => void;
  generateDocument: () => Promise<string>;
  generateFromTemplate: (templateId: string, formData: TemplateFormData) => Promise<string>;
}

const ChatContext = createContext<ChatContextType>({
  messages: [],
  documentType: null,
  documentStatus: 'not_started',
  isProcessing: false,
  sendMessage: () => {},
  resetChat: () => {},
  generateDocument: async () => '',
  generateFromTemplate: async () => '',
});

interface ChatProviderProps {
  children: ReactNode;
  mode?: 'consultation' | 'document';
}

export const ChatProvider: React.FC<ChatProviderProps> = ({ children, mode = 'consultation' }) => {
  const { t } = useLocale();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: mode === 'consultation' ? t('consultationWelcomeMessage') : t('welcomeMessage'),
      timestamp: new Date(),
    },
  ]);
  const [documentType, setDocumentType] = useState<DocumentType | null>(null);
  const [documentStatus, setDocumentStatus] = useState<DocumentStatus>('not_started');
  const [isProcessing, setIsProcessing] = useState(false);

  // Send a user message and get the AI response
  const sendMessage = useCallback(async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsProcessing(true);
    
    try {
      // Send the message to the OpenAI API via our edge function
      const currentMessages = [...messages, userMessage];
      const response = await sendChatMessage({
        messages: currentMessages,
        documentType,
        mode
      });
      
      // Update document type and status if received from API
      if (response.documentType && !documentType) {
        setDocumentType(response.documentType);
      }
      
      if (response.documentStatus !== documentStatus) {
        setDocumentStatus(response.documentStatus);
      }
      
      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, assistantMessage]);
    } catch (error) {
      console.error('Error in sendMessage:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: t('errorMessage'),
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  }, [documentType, documentStatus, messages, t, mode]);

  // Reset the chat
  const resetChat = useCallback(() => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: mode === 'consultation' ? t('consultationWelcomeMessage') : t('welcomeMessage'),
        timestamp: new Date(),
      },
    ]);
    setDocumentType(null);
    setDocumentStatus('not_started');
  }, [t, mode]);

  // Generate the document
  const generateDocument = useCallback(async (): Promise<string> => {
    if (!documentType || documentStatus !== 'ready') {
      throw new Error(t('documentNotReady'));
    }
    
    setIsProcessing(true);
    
    try {
      // Call the document generation API
      const documentUrl = await generateDocumentAPI(documentType);
      setDocumentStatus('completed');
      return documentUrl;
    } catch (error) {
      console.error('Error generating document:', error);
      throw new Error(t('documentGenerationError'));
    } finally {
      setIsProcessing(false);
    }
  }, [documentType, documentStatus, t]);

  // Generate document from a template
  const generateFromTemplate = useCallback(async (templateId: string, formData: TemplateFormData): Promise<string> => {
    setIsProcessing(true);
    
    try {
      // Call the document generation API with the template
      const documentUrl = await generateDocumentFromTemplate(templateId, formData);
      setDocumentStatus('completed');
      
      // Add a system message about the template usage
      const templateMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: t('templateDocumentGenerated'),
        timestamp: new Date(),
      };
      
      setMessages((prevMessages) => [...prevMessages, templateMessage]);
      
      return documentUrl;
    } catch (error) {
      console.error('Error generating document from template:', error);
      throw new Error(t('templateGenerationError'));
    } finally {
      setIsProcessing(false);
    }
  }, [t]);

  const value = {
    messages,
    documentType,
    documentStatus,
    isProcessing,
    sendMessage,
    resetChat,
    generateDocument,
    generateFromTemplate,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => useContext(ChatContext);