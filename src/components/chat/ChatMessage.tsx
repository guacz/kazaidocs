import React from 'react';
import { User, Bot } from 'lucide-react';
import { Message } from '../../types';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <motion.div
      className={cn(
        'chat-message',
        isUser ? 'user-message' : 'ai-message'
      )}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {!isUser && (
        <div className="flex-shrink-0 mr-3">
          <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
            <Bot className="h-5 w-5 text-primary-700" />
          </div>
        </div>
      )}
      
      <div
        className={cn(
          'chat-bubble',
          isUser ? 'user-bubble' : 'ai-bubble'
        )}
      >
        {message.content}
      </div>
      
      {isUser && (
        <div className="flex-shrink-0 ml-3">
          <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ChatMessage;