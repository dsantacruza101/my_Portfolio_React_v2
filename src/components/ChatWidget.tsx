import { useTranslation } from 'react-i18next';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { useChatWidget } from '../hooks/useChatWidget';
import { ChatMessageBubble } from './ChatMessageBubble';

/** Floating action button that toggles a small RAG-backed chat panel. */
export const ChatWidget = () => {
  const { t } = useTranslation();
  const {
    isOpen,
    toggleOpen,
    close,
    messages,
    input,
    setInput,
    isLoading,
    handleSend,
    panelRef,
    toggleButtonRef,
    inputRef,
  } = useChatWidget();

  return (
    <>
      <button
        ref={toggleButtonRef}
        type="button"
        onClick={toggleOpen}
        aria-expanded={isOpen}
        aria-label={t(isOpen ? 'chat.close' : 'chat.open')}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-linear-to-r from-blue-600 to-teal-500 text-white shadow-xl flex items-center justify-center hover:opacity-90 transition-all"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={t('chat.title')}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed z-50 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-3xl inset-4 bottom-24 sm:inset-auto sm:bottom-24 sm:right-6 sm:w-[380px] sm:h-[550px]"
          >
            <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
              <h2 className="font-black text-slate-900 dark:text-white">
                {t('chat.title')}
              </h2>
              <button
                type="button"
                onClick={close}
                aria-label={t('chat.close')}
                className="text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400 italic">
                  {t('chat.greeting')}
                </p>
              ) : (
                messages.map((message) => (
                  <ChatMessageBubble key={message.id} message={message} />
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl px-4 py-2 flex items-center text-slate-500 dark:text-slate-400">
                    <Loader2 className="animate-spin" size={16} />
                  </div>
                </div>
              )}
            </div>

            <form
              onSubmit={handleSend}
              className="flex items-center gap-2 p-4 border-t border-slate-200 dark:border-slate-800"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('chat.placeholder')}
                disabled={isLoading}
                className="flex-1 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 ring-blue-500 outline-none transition-all dark:text-white disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                aria-label={t('chat.send')}
                className="w-11 h-11 shrink-0 rounded-xl bg-linear-to-r from-blue-600 to-teal-500 text-white flex items-center justify-center hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
