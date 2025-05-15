import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw, FileText } from 'lucide-react';
import { useChat } from '../../contexts/ChatContext';
import { useLocale } from '../../contexts/LocaleContext';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import ChatMessage from './ChatMessage';
import DocumentPreview from './DocumentPreview';

const ChatInterface: React.FC = () => {
  const { 
    messages, 
    sendMessage, 
    resetChat, 
    isProcessing, 
    documentType, 
    documentStatus,
    generateDocument 
  } = useChat();
  const { t } = useLocale();
  const { user, openAuthModal } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const [documentUrl, setDocumentUrl] = useState<string | null>(null);
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] pt-20">
      {/* Chat container */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="chat-container pb-8">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          
          {/* Show document preview when ready */}
          {documentStatus === 'ready' && (
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