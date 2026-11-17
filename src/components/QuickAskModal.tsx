import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2, Sparkles, Send, CornerDownLeft, HelpCircle } from 'lucide-react';
import { City, CrisisScenario, UserProfile } from '../types';
import { askVayuAssistant } from '../services/geminiService';

interface QuickAskModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  scenario: CrisisScenario;
  city: City;
}

export const QuickAskModal: React.FC<QuickAskModalProps> = ({
  isOpen,
  onClose,
  profile,
  scenario,
  city,
}) => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const presets = [
    'Can my senior parent go for a 6:00 AM morning walk tomorrow?',
    'I do not have an air purifier. What can I do right now for ₹0?',
    'How much PM2.5 does making rotis/frying release without an exhaust fan?',
    'What is the safest window to air out my apartment today?',
  ];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResponse(null);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (textToAsk?: string) => {
    const q = (textToAsk || query).trim();
    if (!q || isLoading) return;

    if (textToAsk) setQuery(textToAsk);
    setIsLoading(true);
    setResponse(null);

    try {
      const answer = await askVayuAssistant(q, profile, scenario, city);
      setResponse(answer);
    } catch {
      setResponse('Unable to fetch response. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/40 backdrop-blur-[2px]">
      <div className="bg-white border border-[#E4E4E7] rounded-[6px] w-full max-w-2xl overflow-hidden shadow-none flex flex-col max-h-[80vh]">
        {/* INPUT HEADER */}
        <div className="p-3 border-b border-[#E4E4E7] flex items-center space-x-2">
          <Search className="w-4 h-4 text-[#71717A] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSubmit();
            }}
            placeholder={`Ask VayuGrid anything about ${city.name} smog, IAQ, or exposure...`}
            className="flex-1 text-sm bg-transparent border-none text-[#09090B] focus:outline-none placeholder:text-[#A1A1AA]"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-[#71717A] hover:text-[#09090B] p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={!query.trim() || isLoading}
            className="p-1.5 bg-[#18181B] hover:bg-[#27272A] disabled:opacity-40 text-white rounded-[4px] cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <CornerDownLeft className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* BODY */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Active Context Chip */}
          <div className="flex items-center space-x-2 text-[11px] text-[#71717A] bg-[#FAFAFA] border border-[#E4E4E7] p-2 rounded-[4px]">
            <HelpCircle className="w-3.5 h-3.5 text-[#09090B]" />
            <span>
              Context: <strong className="text-[#09090B]">{city.name}</strong> • Scenario:{' '}
              <strong className="text-[#09090B]">{scenario.label} (AQI {scenario.aqi})</strong> • Purifier:{' '}
              <strong className="text-[#09090B]">{profile.purifier}</strong>
            </span>
          </div>

          {/* Quick Preset Buttons */}
          {!response && !isLoading && (
            <div className="space-y-2">
              <div className="text-[11px] font-semibold text-[#52525B] uppercase tracking-wide">
                Suggested Questions
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {presets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSubmit(preset)}
                    className="text-left p-2.5 rounded-[4px] border border-[#E4E4E7] bg-white hover:bg-[#F4F4F5] text-[#09090B] transition-colors flex items-center justify-between group"
                  >
                    <span>{preset}</span>
                    <Sparkles className="w-3 h-3 text-[#A1A1AA] group-hover:text-[#18181B]" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="py-8 flex flex-col items-center justify-center space-y-2 text-[#71717A]">
              <Loader2 className="w-5 h-5 animate-spin text-[#18181B]" />
              <span className="text-xs">Consulting atmospheric dispersion & exposure models...</span>
            </div>
          )}

          {/* Response Container */}
          {response && (
            <div className="space-y-3 bg-[#FAFAFA] p-3.5 rounded-[6px] border border-[#E4E4E7]">
              <div className="flex items-center justify-between border-b border-[#E4E4E7] pb-2">
                <span className="font-semibold text-xs text-[#09090B]">VayuGrid Assessment</span>
                <span className="text-[10px] font-mono text-[#71717A]">CPCB & WHO Grounded</span>
              </div>
              <div className="text-xs text-[#09090B] leading-relaxed whitespace-pre-wrap font-sans space-y-2">
                {response}
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-3 bg-[#FAFAFA] border-t border-[#E4E4E7] flex justify-between items-center text-[11px] text-[#71717A]">
          <div className="flex items-center space-x-2">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 bg-white border border-[#E4E4E7] rounded font-mono text-[10px] text-[#09090B]">
              ESC
            </kbd>
            <span>to dismiss</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-medium text-[#09090B] hover:underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
