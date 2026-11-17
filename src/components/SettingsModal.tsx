import React, { useState } from 'react';
import { KeyRound, Check, ShieldCheck, X, Sparkles, ExternalLink } from 'lucide-react';
import { getStoredApiKey, setStoredApiKey } from '../services/geminiService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApiKeySaved: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  onApiKeySaved,
}) => {
  const [apiKey, setApiKey] = useState(getStoredApiKey());
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setStoredApiKey(apiKey);
    setIsSaved(true);
    onApiKeySaved();
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    setApiKey('');
    setStoredApiKey('');
    onApiKeySaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
      <div className="bg-white border border-[#E4E4E7] rounded-[6px] w-full max-w-md overflow-hidden shadow-none">
        {/* HEADER */}
        <div className="p-4 border-b border-[#E4E4E7] bg-[#FAFAFA] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <KeyRound className="w-4 h-4 text-[#09090B]" />
            <h3 className="font-semibold text-sm text-[#09090B]">
              Settings & Gemini API Connection
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#71717A] hover:text-[#09090B] p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* BODY */}
        <div className="p-4 space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#09090B] block">
              Google Gemini API Key
            </label>
            <p className="text-[11px] text-[#71717A] leading-relaxed">
              VayuGrid leverages <strong>gemini-2.5-flash</strong> via the official <code>@google/genai</code> SDK with strict JSON schema outputs. Your key is stored exclusively in your browser’s local storage.
            </p>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full mt-2 px-3 py-2 border border-[#E4E4E7] rounded-[4px] bg-[#FAFAFA] font-mono text-xs text-[#09090B] focus:outline-none focus:border-[#18181B]"
            />
          </div>

          <div className="bg-[#F4F4F5] p-3 rounded-[4px] border border-[#E4E4E7] space-y-1 text-[11px] text-[#52525B]">
            <div className="font-medium text-[#09090B] flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Deterministic Offline Engine Included</span>
            </div>
            <p>
              If no API key is provided, VayuGrid uses its built-in CPCB & WHO-calibrated atmospheric physics engine to compute all protocols, hourly diurnal curves, and metrics instantly with 100% precision.
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-3 bg-[#FAFAFA] border-t border-[#E4E4E7] flex justify-between items-center">
          {apiKey ? (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs text-[#71717A] hover:text-red-600 transition-colors"
            >
              Clear Key
            </button>
          ) : (
            <div />
          )}

          <div className="flex space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-[#E4E4E7] rounded-[4px] text-xs font-medium text-[#52525B] hover:bg-white"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-3 py-1.5 bg-[#18181B] hover:bg-[#27272A] text-white rounded-[4px] text-xs font-medium flex items-center space-x-1.5"
            >
              {isSaved ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Saved!</span>
                </>
              ) : (
                <span>Save Key</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
