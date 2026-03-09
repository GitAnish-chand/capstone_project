import { useState, useEffect, useRef } from 'react';
import { chatService } from '../services/api.service';
import Layout from '../components/Layout';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ChatBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadHistory = async () => {
    try {
      const data = await chatService.getHistory(10);
      setHistory(data);

      const historyMessages = data.slice(0, 5).reverse().flatMap((item) => [
        { type: 'user', content: item.question },
        { type: 'bot', content: item.answer },
      ]);
      setMessages(historyMessages);
    } catch (error) {
      console.error('Error loading history:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');

    setMessages((prev) => [...prev, { type: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await chatService.ask(userMessage, 'general');
      setMessages((prev) => [...prev, { type: 'bot', content: response.answer }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { type: 'bot', content: 'Sorry, I encountered an error. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 h-[calc(100vh-64px)] flex flex-col relative">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-3xl overflow-hidden flex flex-col flex-1 border-white/5 bg-zinc-900/60 shadow-2xl"
        >
          {/* Header */}
          <div className="bg-black/40 border-b border-white/10 px-6 py-5 flex items-center space-x-4">
            <div className="bg-indigo-500/20 p-3 rounded-2xl border border-indigo-500/30">
              <Bot className="w-7 h-7 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white tracking-tight">AI Learning Assistant</h1>
              <p className="text-zinc-400 text-sm">Ask me anything about coding!</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 scroll-smooth">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500">
                <Bot className="w-20 h-20 mb-6 text-zinc-700" />
                <p className="text-xl font-medium text-zinc-300 mb-2">Welcome to your AI Assistant!</p>
                <p className="text-center max-w-sm">Ask questions about courses, coding concepts, or get help with assignments.</p>
              </div>
            )}

            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  key={index}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-end space-x-3 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'}`}>
                    {message.type === 'bot' && (
                      <div className="bg-indigo-500/20 p-2.5 rounded-xl border border-indigo-500/30 flex-shrink-0 mb-1">
                        <Bot className="w-5 h-5 text-indigo-400" />
                      </div>
                    )}
                    {message.type === 'user' && (
                      <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 flex-shrink-0 mb-1">
                        <User className="w-5 h-5 text-zinc-300" />
                      </div>
                    )}

                    <div
                      className={`px-5 py-4 shadow-sm ${message.type === 'user'
                          ? 'bg-indigo-600 text-white rounded-2xl rounded-br-sm shadow-indigo-500/20'
                          : 'bg-white/5 text-zinc-200 border border-white/10 rounded-2xl rounded-bl-sm'
                        }`}
                    >
                      <p className="text-[15px] leading-relaxed whitespace-pre-wrap font-sans">{message.content}</p>
                    </div>
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="flex items-end space-x-3">
                    <div className="bg-indigo-500/20 p-2.5 rounded-xl border border-indigo-500/30">
                      <Bot className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl rounded-bl-sm px-5 py-4">
                      <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="bg-black/40 border-t border-white/10 p-4 sm:p-6">
            <form onSubmit={handleSubmit} className="flex gap-3 max-w-4xl mx-auto">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                disabled={loading}
                className="flex-1 px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 text-white placeholder-zinc-500 outline-none transition-all shadow-inner"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-indigo-600 text-white px-6 py-4 rounded-2xl hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-[0_0_20px_-5px_var(--tw-shadow-color)] shadow-indigo-500"
              >
                <Send className="w-6 h-6 ml-1" />
              </motion.button>
            </form>
            <p className="text-center text-xs text-zinc-500 mt-4 font-medium">
              Ask about courses, programming concepts, quiz help, or learning tips
            </p>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
