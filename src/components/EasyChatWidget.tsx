import React, { useState, useRef, useEffect } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  Minimize2,
  Maximize2,
  HelpCircle,
  Heart,
} from 'lucide-react';
import type { City, CrisisScenario, UserProfile } from '../types';
import { askVayuAssistant } from '../services/geminiService';

interface EasyChatMessage {
  id: string;
  sender: 'vayu' | 'user';
  text: string;
  time: string;
}

interface EasyChatWidgetProps {
  city: City;
  scenario: CrisisScenario;
  profile: UserProfile;
  liquidGlassEnabled?: boolean;
}

export const EasyChatWidget: React.FC<EasyChatWidgetProps> = ({
  city,
  scenario,
  profile,
  liquidGlassEnabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState<EasyChatMessage[]>([
    {
      id: 'welcome',
      sender: 'vayu',
      text: `👋 **Hi there! I am Vayu, your family smog & air quality helper.**\n\nAsk me anything in everyday language—like whether your kids can play outside in ${city.name}, when to open windows, or how to clean your bedroom air for ₹0 without an expensive purifier!`,
      time: 'Just now',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickQuestions = [
    'Can my kids play outside today?',
    'Is it safe for morning walking?',
    'What mask actually protects from smog?',
    'I have no purifier. What can I do for ₹0?',
    'When should I open windows today?',
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputText).trim();
    if (!textToSend || isLoading) return;

    const userMsg: EasyChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await askVayuAssistant(textToSend, profile, scenario, city);

      const botMsg: EasyChatMessage = {
        id: `vayu-${Date.now()}`,
        sender: 'vayu',
        text: response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      const errorMsg: EasyChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'vayu',
        text: 'Sorry, I had trouble answering that right now. Please try asking again!',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* FLOATING CHAT BUTTON (Bottom Right) */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-5 right-5 z-40 px-3.5 py-2.5 rounded-full flex items-center space-x-2 transition-all duration-300 cursor-pointer shadow-lg hover:scale-105 ${
            liquidGlassEnabled
              ? 'bg-[#18181B] text-white border border-white/40 backdrop-blur-md shadow-[0_8px_24px_rgba(0,0,0,0.18)]'
              : 'bg-[#18181B] hover:bg-[#27272A] text-white'
          }`}
          title="Open Family Air Quality Chat"
        >
          <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
            💬
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold leading-tight">Ask Vayu (Citizen Chat)</span>
            <span className="text-[10px] text-zinc-300 leading-tight">Instant Family Advice</span>
          </div>
        </button>
      )}

      {/* DOCKED CHAT WINDOW */}
      {isOpen && (
        <div
          className={`fixed bottom-5 right-5 z-50 w-96 max-w-[calc(100vw-2rem)] h-[520px] rounded-[8px] flex flex-col overflow-hidden shadow-2xl transition-all ${
            liquidGlassEnabled
              ? 'liquid-glass-panel border-white/80'
              : 'bg-white border border-[#E4E4E7]'
          }`}
        >
          {/* HEADER */}
          <div className="p-3 bg-[#18181B] text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xs">
                V
              </div>
              <div>
                <h4 className="font-semibold text-xs leading-tight">
                  Vayu — Family Air Safety Helper
                </h4>
                <div className="flex items-center space-x-1.5 text-[10px] text-zinc-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Live for {city.name} (AQI {scenario.aqi})</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-zinc-800 rounded transition-colors text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* CHAT MESSAGES BODY */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-[#FAFAFA]/70 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-[6px] p-2.5 space-y-1 ${
                    msg.sender === 'user'
                      ? 'bg-[#18181B] text-white rounded-br-none'
                      : 'bg-white border border-[#E4E4E7] text-[#09090B] rounded-bl-none shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                </div>
                <span className="text-[9px] text-[#A1A1AA] mt-0.5 px-1">{msg.time}</span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center space-x-2 text-[#71717A] bg-white p-2.5 rounded-[6px] border border-[#E4E4E7] w-fit">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-[#18181B]" />
                <span className="text-[11px]">Vayu is typing everyday advice...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* QUICK PROMPT CHIPS */}
          <div className="p-2 bg-white border-t border-[#E4E4E7] flex items-center space-x-1.5 overflow-x-auto text-[11px] shrink-0 no-scrollbar">
            {quickQuestions.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(q)}
                className="whitespace-nowrap px-2 py-1 bg-[#F4F4F5] hover:bg-[#E4E4E7] text-[#52525B] hover:text-[#09090B] rounded-[4px] border border-[#E4E4E7] transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* INPUT BAR */}
          <div className="p-2.5 bg-white border-t border-[#E4E4E7] flex items-center space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder="Ask a question (e.g. Can my kids walk to school?)..."
              className="flex-1 text-xs px-2.5 py-1.5 bg-[#FAFAFA] border border-[#E4E4E7] rounded-[4px] text-[#09090B] focus:outline-none focus:border-[#18181B]"
            />
            <button
              type="button"
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isLoading}
              className="p-1.5 bg-[#18181B] hover:bg-[#27272A] disabled:opacity-40 text-white rounded-[4px] cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
