import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw, FileText, Templates } from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';
import { useLocale } from '../../contexts/LocaleContext';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import ChatMessage from './ChatMessage';
import DocumentPreview from './DocumentPreview';
import TemplateSelector from '../templates/TemplateSelector';
import TemplateForm from '../templates/TemplateForm';
import { Template, TemplateFormData } from '../../types';

const ChatInterface: React.FC = () => {
  const { 
    messages, 
    sendMessage, 
    resetChat, 
    isProcessing, 
    documentType, 
    documentStatus,
    generateDocument,
    generateFromTemplate
  } = useChat();
  const { t } = useLocale();
  const { user, openAuthModal } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isProcessing) {
      sendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleGenerateDocument = async () => {
    if (!user) {
      openAuthModal();
      return;
    }

    try {
      const url = await generateDocument();
      setDocumentUrl(url);
    } catch (error) {
      console.error('Failed to generate document:', error);
    }
  };

  const handleGenerateFromTemplate = async (templateId: string, formData: TemplateFormData) => {
    if (!user) {
      openAuthModal();
      return;
    }

    try {
      const url = await generateFromTemplate(templateId, formData);
      setSelectedTemplate(null);
      setDocumentUrl(url);
    } catch (error) {
      console.error('Failed to generate document from template:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleTemplateSelector = () => {
    setShowTemplateSelector(!showTemplateSelector);
    setSelectedTemplate(null);
  };

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
  };

  const handleBackFromTemplate = () => {
    setSelectedTemplate(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] pt-20">
      {/* Chat container */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="chat-container pb-8">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {/* Template selector option when document type is detected */}
          {documentType && documentStatus !== 'not_started' && !documentUrl && (
            <motion.div 
              className="flex justify-center my-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <button 
                className="btn-outline flex items-center"
                onClick={toggleTemplateSelector}
              >
                <Templates className="mr-2 h-5 w-5" />
                {showTemplateSelector ? t('hideTemplates') : t('useTemplate')}
              </button>
            </motion.div>
          )}
          
          {/* Template selector */}
          <AnimatePresence>
            {showTemplateSelector && documentType && !selectedTemplate && (
              <motion.div 
                className="max-w-3xl mx-auto my-4 bg-white p-5 rounded-lg shadow-sm"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <h3 className="text-lg font-medium text-primary-900 mb-3">{t('selectTemplateHeader')}</h3>
                <p className="text-gray-600 text-sm mb-4">{t('selectTemplateDescription')}</p>
                
                <TemplateSelector 
                  documentType={documentType} 
                  onSelectTemplate={handleSelectTemplate}
                  disabled={isProcessing}
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Template form */}
          <AnimatePresence>
            {selectedTemplate && (
              <motion.div 
                className="max-w-3xl mx-auto my-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
              >
                <TemplateForm 
                  template={selectedTemplate}
                  onSubmit={handleGenerateFromTemplate}
                  onBack={handleBackFromTemplate}
                />
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Show document action button when ready */}
          {documentStatus === 'ready' && !showTemplateSelector && !selectedTemplate && !documentUrl && (
            <motion.div 
              className="flex justify-center my-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <button 
                className="btn-primary flex items-center"
                onClick={handleGenerateDocument}
                disabled={isProcessing || documentStatus !== 'ready'}
              >
                <FileText className="mr-2 h-5 w-5" />
                {t('generateDocument')}
              </button>
            </motion.div>
          )}
          
          {/* Document preview */}
          {documentUrl && (
            <DocumentPreview documentUrl={documentUrl} documentType={documentType} />
          )}
          
          {/* Auto-scroll anchor */}
          <div ref={messagesEndRef} />
          
          {/* Loading indicator */}
          {isProcessing && (
            <div className="flex justify-center my-4">
              <div className="bg-white rounded-full p-2 shadow-sm">
                <div className="dot-typing"></div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Input area */}
      <div className="bg-white border-t border-gray-200 px-4 py-3">
        <div className="container mx-auto max-w-4xl">
          <form onSubmit={handleSubmit} className="flex items-end gap-2">
            <div className="relative flex-1">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                className="input min-h-[60px] py-3 pr-12 resize-none"
                placeholder={t('typingPlaceholder')}
                rows={1}
                disabled={isProcessing}
              />
              <button
                type="submit"
                className="absolute right-2 bottom-2 text-primary-600 hover:text-primary-800 disabled:text-gray-400"
                disabled={!inputValue.trim() || isProcessing}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700 p-3 rounded-full hover:bg-gray-100"
              onClick={resetChat}
              title={t('resetChat')}
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          </form>
          
          <div className="mt-2 text-xs text-gray-500 text-center">
            {t('chatDisclaimer')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;