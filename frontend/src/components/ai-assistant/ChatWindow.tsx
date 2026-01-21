import { useRef, useEffect, useState } from 'react';
import { Sparkles, X } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { useDraggable } from './useDraggable';
import type { Message } from './types';

interface ChatWindowProps {
  messages: Message[];
  onClose: () => void;
  onSendMessage: (message: string) => Promise<void>;
}

export function ChatWindow({ messages, onClose, onSendMessage }: ChatWindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { position, isDragging } = useDraggable(windowRef, '.drag-handle');

  const [inputValue, setInputValue] = useState('');
  const [hasInitialized, setHasInitialized] = useState(false);
  const autoFlowRef = useRef<{ stage: 'idle' | 'waiting_first_response' | 'waiting_second' }>({ stage: 'idle' });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 自動滾動到最新消息
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 自動流程：初始化時延遲 3 秒後再填入輸入欄
  useEffect(() => {
    if (!hasInitialized && messages.length === 0) {
      setHasInitialized(true);

      const firstMessage = '我想了解這週發生了多少緊急事件';
      let sendTimer: ReturnType<typeof setTimeout> | null = null;

      // 延遲 3 秒後填入輸入欄
      const fillInputTimer = setTimeout(() => {
        setInputValue(firstMessage);

        // 再延遲一點後自動發送
        sendTimer = setTimeout(() => {
          onSendMessage(firstMessage);
          autoFlowRef.current.stage = 'waiting_first_response';
          setInputValue('');
        }, 300);
      }, 3000);

      return () => {
        clearTimeout(fillInputTimer);
        if (sendTimer !== null) {
          clearTimeout(sendTimer);
        }
      };
    }
  }, [hasInitialized]);

  // 自動流程：接收到 AI 回覆後，3秒後自動輸入第二條消息
  useEffect(() => {
    if (autoFlowRef.current.stage === 'waiting_first_response' && messages.length >= 2) {
      // 已收到用戶消息和 AI 回覆
      autoFlowRef.current.stage = 'waiting_second';

      // 清除之前的計時器（如果有的話）
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current as ReturnType<typeof setTimeout>);
      }

      timeoutRef.current = setTimeout(() => {
        const secondMessage = '我想查看相關報告';
        setInputValue(secondMessage);

        // 再延遲一點自動發送
        setTimeout(() => {
          onSendMessage(secondMessage);
          setInputValue('');
          autoFlowRef.current.stage = 'idle';
        }, 300);
      }, 3000) as unknown as ReturnType<typeof setTimeout>;
    }

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current as ReturnType<typeof setTimeout>);
      }
    };
  }, [messages, onSendMessage]);

  return (
    <div
      ref={windowRef}
      className="fixed z-50 w-[400px] h-[600px]
                 bg-white rounded-3xl shadow-2xl
                 flex flex-col overflow-hidden
                 animate-in fade-in zoom-in-95 duration-300"
      style={{
        bottom: '120px',
        right: '24px',
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: isDragging ? 'grabbing' : 'default',
        willChange: isDragging ? 'transform' : 'auto'
      }}
    >
      {/* Header - 可拖曳區域 */}
      <div className="drag-handle cursor-move bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3 flex-1 pointer-events-none">
          <Sparkles className="text-white flex-shrink-0" size={24} />
          <div className="min-w-0">
            <h3 className="text-lg font-black text-white truncate">AI 助手</h3>
            <p className="text-xs text-blue-100 truncate">智能勤務系統</p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            // 清理自動流程
            if (timeoutRef.current !== null) {
              clearTimeout(timeoutRef.current as ReturnType<typeof setTimeout>);
              timeoutRef.current = null;
            }
            autoFlowRef.current.stage = 'idle';
            setHasInitialized(false);
            onClose();
          }}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0 pointer-events-auto"
          title="關閉"
        >
          <X className="text-white" size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
        {messages.length === 0 ? (
          <div className="text-center text-slate-400 mt-20 flex flex-col items-center">
            <Sparkles size={48} className="mb-4 opacity-50" />
            <p className="text-sm">您好！有什麼可以幫您的嗎？</p>
          </div>
        ) : (
          <>
            {messages.map(msg => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <ChatInput
        onSend={onSendMessage}
        value={inputValue}
        onChange={setInputValue}
      />
    </div>
  );
}
