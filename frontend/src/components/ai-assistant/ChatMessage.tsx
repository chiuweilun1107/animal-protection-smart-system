import { useNavigate } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import type { Message } from './types';

interface ChatMessageProps {
  message: Message;
}

const formatTime = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

export function ChatMessage({ message }: ChatMessageProps) {
  const navigate = useNavigate();
  const isUser = message.sender === 'user';
  const isSystem = message.sender === 'system';

  const handleLinkClick = (url: string) => {
    navigate(url);
  };

  if (isSystem) {
    return (
      <div className="flex justify-center">
        <div className="px-4 py-2 bg-slate-200/50 rounded-xl border border-dashed border-slate-300 text-xs text-slate-600">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-sm'
            : 'bg-white text-slate-900 rounded-bl-sm shadow-sm'
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

        {/* 連結區域 */}
        {message.links && message.links.length > 0 && (
          <div className="mt-3 space-y-2">
            {message.links.map((link, index) => (
              <button
                key={index}
                onClick={() => handleLinkClick(link.url)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-xs font-semibold ${
                  isUser
                    ? 'bg-blue-500 hover:bg-blue-400 text-white'
                    : 'bg-blue-50 hover:bg-blue-100 text-blue-600'
                }`}
                title={`前往 ${link.label || link.text}`}
              >
                <span className="flex-1 text-left">{link.text}</span>
                <ExternalLink size={14} className="flex-shrink-0" />
              </button>
            ))}
          </div>
        )}

        <span className="text-xs opacity-75 mt-2 block">{formatTime(message.timestamp)}</span>
      </div>
    </div>
  );
}
