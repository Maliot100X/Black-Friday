'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle, Bot, User, MapPin, Tag, Loader2, Globe } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  deals?: any[];
  stores?: any[];
}

interface ChatResponse {
  response: string;
  language: string;
  deals_found?: any[];
  stores_found?: any[];
}

export default function FloatingAIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState<'mk' | 'sq'>('mk');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: language === 'mk'
        ? '👋 Здраво! Јас сум MK Black Friday AI асистент. Како можам да ви помогнам денес?'
        : '👋 Përshëndetje! Unë jam asistenti AI i MK Black Friday. Si mund t\'ju ndihmoj sot?',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // API endpoint - update this with your deployed backend URL
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Update welcome message when language changes
  useEffect(() => {
    setMessages(prev => {
      const newMessages = [...prev];
      if (newMessages[0]?.id === 'welcome') {
        newMessages[0] = {
          ...newMessages[0],
          content: language === 'mk'
            ? '👋 Здраво! Јас сум MK Black Friday AI асистент. Како можам да ви помогнам денес?'
            : '👋 Përshëndetje! Unë jam asistenti AI i MK Black Friday. Si mund t\'ju ndihmoj sot?'
        };
      }
      return newMessages;
    });
  }, [language]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add Authorization header if user is logged in
          // 'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: userMessage.content,
          language: language,
          history: messages.slice(-5).map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data: ChatResponse = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
        deals: data.deals_found,
        stores: data.stores_found,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: language === 'mk'
          ? 'Извинете, има проблем со поврзувањето. Обидете се повторно.'
          : 'Më vini keq, ka një problem me lidhjen. Provo përsëri.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'mk' ? 'sq' : 'mk');
  };

  const clearChat = () => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: language === 'mk'
        ? '👋 Здраво! Јас сум MK Black Friday AI асистент. Како можам да ви помогнам денес?'
        : '👋 Përshëndetje! Unë jam asistenti AI i MK Black Friday. Si mund t\'ju ndihmoj sot?',
      timestamp: new Date(),
    }]);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-2xl w-[380px] h-[500px] flex flex-col border border-gray-200 mb-4 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">
                  {language === 'mk' ? 'AI Асистент' : 'Asistenti AI'}
                </h3>
                <p className="text-xs text-white/80">
                  {language === 'mk' ? 'MK Black Friday Radar' : 'MK Black Friday Radar'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleLanguage}
                className="p-1.5 hover:bg-white/20 rounded-full transition-colors flex items-center gap-1"
                title={language === 'mk' ? 'Switch to Albanian' : 'Префрли на македонски'}
              >
                <Globe size={14} />
                <span className="text-xs font-medium uppercase">{language}</span>
              </button>
              <button
                onClick={clearChat}
                className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
                title={language === 'mk' ? 'Исчисти чет' : 'Pastro bisedën'}
              >
                <span className="text-xs">🗑️</span>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-full transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 ${
                    message.role === 'user'
                      ? 'bg-red-600 text-white rounded-br-md'
                      : 'bg-white text-gray-800 shadow-sm rounded-bl-md border border-gray-100'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.role === 'assistant' && (
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bot size={14} className="text-red-600" />
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

                      {/* Deals Found */}
                      {message.deals && message.deals.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <p className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                            <Tag size={12} />
                            {language === 'mk' ? 'Пронајдени понуди:' : 'Oferta të gjetura:'}
                          </p>
                          {message.deals.map((deal, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-lg p-2 text-xs">
                              <p className="font-medium text-gray-800">{deal.title}</p>
                              <p className="text-gray-600">{deal.store_name}</p>
                              {deal.discount_price && (
                                <p className="text-red-600 font-semibold">{deal.discount_price} MKD</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Stores Found */}
                      {message.stores && message.stores.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <p className="text-xs font-semibold text-gray-500 flex items-center gap-1">
                            <MapPin size={12} />
                            {language === 'mk' ? 'Пронајдени продавници:' : 'Dyqane të gjetura:'}
                          </p>
                          {message.stores.map((store, idx) => (
                            <div key={idx} className="bg-gray-50 rounded-lg p-2 text-xs">
                              <p className="font-medium text-gray-800">{store.name}</p>
                              <p className="text-gray-600">{store.address}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {message.role === 'user' && (
                      <div className="w-6 h-6 bg-red-700 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <User size={14} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-md p-3 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2">
                    <Loader2 size={16} className="animate-spin text-red-600" />
                    <span className="text-sm text-gray-500">
                      {language === 'mk' ? 'Пишувам...' : 'Po shkruaj...'}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    language === 'mk'
                      ? 'Прашај за понуди, продавници...'
                      : 'Pyet për oferta, dyqane...'
                  }
                  className="w-full px-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white transition-all"
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 mt-2 text-center">
              {language === 'mk'
                ? 'Powered by Fireworks AI (Kimi K2.5 Turbo) • Македонски & Shqip'
                : 'Powered by Fireworks AI (Kimi K2.5 Turbo) • Македонски & Shqip'}
            </p>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? 'bg-gray-800 rotate-90'
            : 'bg-gradient-to-r from-red-600 to-red-700 hover:scale-110'
        }`}
      >
        {isOpen ? (
          <X size={24} className="text-white" />
        ) : (
          <div className="flex flex-col items-center">
            <MessageCircle size={24} className="text-white" />
            <span className="text-[8px] text-white font-medium">AI</span>
          </div>
        )}
      </button>
    </div>
  );
}
