import { useState, useEffect, useRef } from 'react';
import { chatService } from '../services/api.service';
import Layout from '../components/Layout';
import { Send, Bot, User, Loader2 } from 'lucide-react';

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

      // Convert last 5 history items to messages
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

    // Add user message
    setMessages((prev) => [...prev, { type: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await chatService.ask(userMessage, 'general');

      // Add bot response
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
          {/* Header */}
          <div className="bg-indigo-600 px-6 py-4">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-lg">
                <Bot className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">AI Learning Assistant</h1>
                <p className="text-indigo-100 text-sm">Ask me anything about coding!</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ height: 'calc(100% - 140px)' }}>
            {messages.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <Bot className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p className="text-lg mb-2">Welcome to your AI Learning Assistant!</p>
                <p className="text-sm">Ask questions about courses, coding concepts, or get help with assignments.</p>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[80%]`}>
                  {message.type === 'bot' && (
                    <div className="bg-indigo-100 p-2 rounded-lg flex-shrink-0">
                      <Bot className="w-5 h-5 text-indigo-600" />
                    </div>
                  )}

                  <div
                    className={`rounded-lg px-4 py-3 ${message.type === 'user'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                      }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>

                  {message.type === 'user' && (
                    <div className="bg-gray-200 p-2 rounded-lg flex-shrink-0">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2">
                  <div className="bg-indigo-100 p-2 rounded-lg">
                    <Bot className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="bg-gray-100 text-gray-900 rounded-lg px-4 py-3">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>


          {/* Input Area */}
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                disabled={loading}
                // Added 'text-black' here to ensure your typing is visible
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50 text-black placeholder:text-gray-400"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
            <p className="text-xs text-gray-700 mt-2">
              Ask about courses, programming concepts, quiz help, or learning tips
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}


