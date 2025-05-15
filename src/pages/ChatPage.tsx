import React from 'react';
import ChatInterface from '../components/chat/ChatInterface';
import { ChatProvider } from '../contexts/ChatContext';

const ChatPage: React.FC = () => {
  return (
    <ChatProvider>
      <ChatInterface />
    </ChatProvider>
  );
};

export default ChatPage;