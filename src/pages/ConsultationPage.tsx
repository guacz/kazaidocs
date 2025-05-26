import React, { useState, useRef, useEffect } from 'react';
import { Send, RefreshCw, Upload, PanelRightOpen } from 'lucide-react';
import { useLocale } from '../contexts/LocaleContext';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Message } from '../types';
import { ChatProvider, useChat } from '../contexts/ChatContext';
import KnowledgePanel from '../components/consultation/KnowledgePanel';

const ConsultationChat: React.FC = () => {
  const { messages, sendMessage, resetChat, isProcessing } = useChat();
  const { t } = useLocale();
  const { user, openAuthModal } = useAuth();
  const [inputValue, setInputValue] = useState('');
  const [showKnowledgePanel, setShowKnowledgePanel] = useState(false);
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const toggleKnowledgePanel = () => {
    setShowKnowledgePanel(!showKnowledgePanel);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] pt-20">
      {/* Main chat area with optional side panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat messages */}
        <div className={`flex-1 overflow-y-auto bg-gray-50 ${showKnowledgePanel ? 'hidden md:block' : ''}`}>
          <div className="chat-container pb-8">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`chat-message ${message.role === 'user' ? 'user-message' : 'ai-message'}`}
              >
                {message.role !== 'user' && (
                  <div className="flex-shrink-0 mr-3">
                    <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                      <span className="h-5 w-5 text-primary-700">AI</span>
                    </div>
                  </div>
                )}
                
                <div className={`chat-bubble ${message.role === 'user' ? 'user-bubble' : 'ai-bubble'}`}>
                  {message.content}
                </div>
                
                {message.role === 'user' && (
                  <div className="flex-shrink-0 ml-3">
                    <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                      <span className="h-5 w-5 text-white">U</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
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

        {/* Knowledge panel (conditionally rendered) */}
        <AnimatePresence>
          {showKnowledgePanel && (
            <motion.div
              className="w-full md:w-1/3 lg:w-1/4 bg-white border-l border-gray-200 overflow-y-auto"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <KnowledgePanel />
            </motion.div>
          )}
        </AnimatePresence>
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
                placeholder={t('consultationPlaceholder')}
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
              onClick={toggleKnowledgePanel}
              title={showKnowledgePanel ? t('hideKnowledgeBase') : t('showKnowledgeBase')}
            >
              <PanelRightOpen className="h-5 w-5" />
            </button>
            
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700 p-3 rounded-full hover:bg-gray-100"
              onClick={resetChat}
              title={t('resetChat')}
            >
              <RefreshCw className="h-5 w-5" />
            </button>
            
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700 p-3 rounded-full hover:bg-gray-100"
              title={t('uploadDocument')}
            >
              <Upload className="h-5 w-5" />
            </button>
          </form>
          
          <div className="mt-2 text-xs text-gray-500 text-center">
            {t('consultationDisclaimer')}
          </div>
        </div>
      </div>
    </div>
  );
};

const ConsultationPage: React.FC = () => {
  return (
    <ChatProvider>
      <ConsultationChat />
    </ChatProvider>
  );
};

export default ConsultationPage;