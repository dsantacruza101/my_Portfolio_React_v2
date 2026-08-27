import type { ChatMessage } from '../types';

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

/** Renders a single chat turn, aligned and colored according to its role. */
export const ChatMessageBubble = ({ message }: ChatMessageBubbleProps) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <p
        className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
          isUser
            ? 'bg-linear-to-r from-blue-600 to-teal-500 text-white'
            : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
        }`}
      >
        {message.content}
      </p>
    </div>
  );
};
