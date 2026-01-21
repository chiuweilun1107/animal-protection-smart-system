import { useState, useCallback } from 'react';
import { MessageCircle } from 'lucide-react';
import { ChatWindow } from './ChatWindow';
import { mockAIService } from '../../services/mockAIService';
import type { Message } from './types';

export function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSendMessage = useCallback(
    async (userMessage: string) => {
      // 添加用戶消息
      const userMsg: Message = {
        id: `user-${Date.now()}`,
        content: userMessage,
        sender: 'user',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMsg]);

      try {
        // 獲取 AI 回覆
        const aiResponse = await mockAIService.sendMessage(userMessage);

        const aiMsg: Message = {
          id: `ai-${Date.now()}`,
          content: aiResponse.message,
          sender: 'ai',
          timestamp: aiResponse.timestamp
        };

        setMessages(prev => [...prev, aiMsg]);
      } catch (error) {
        console.error('Failed to get AI response:', error);

        const errorMsg: Message = {
          id: `error-${Date.now()}`,
          content: '抱歉，發生錯誤。請稍後重試。',
          sender: 'ai',
          timestamp: new Date(),
          isError: true
        };

        setMessages(prev => [...prev, errorMsg]);
      }
    },
    []
  );

  return (
    <>
      {/* 浮動按鈕 */}
      <button
        className="fixed bottom-6 right-6 z-50 w-16 h-16
                   bg-gradient-to-br from-blue-600 to-purple-600
                   rounded-2xl shadow-2xl shadow-blue-600/30
                   hover:shadow-blue-600/50 hover:scale-110
                   transition-all duration-300
                   flex items-center justify-center group"
        onClick={() => setIsOpen(true)}
        title="打開 AI 助手"
      >
        <MessageCircle
          className="text-white group-hover:scale-110 transition-transform"
          size={28}
        />
      </button>

      {/* 聊天窗口 */}
      {isOpen && (
        <ChatWindow
          messages={messages}
          onClose={() => setIsOpen(false)}
          onSendMessage={handleSendMessage}
        />
      )}
    </>
  );
}
