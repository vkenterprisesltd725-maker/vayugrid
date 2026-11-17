import React from 'react';
import {
  Sparkles,
  Droplets,
  Heart,
  ShieldCheck,
  Mail,
  Code2,
  ExternalLink,
} from 'lucide-react';
import type { SitePageId } from '../types';

const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-3 h-3' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

interface FooterProps {
  onOpenPage: (pageId: SitePageId) => void;
  liquidGlassEnabled?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenPage,
  liquidGlassEnabled = false,
}) => {
  return (
    <footer
      className={`border-t transition-all mt-8 select-none ${
        liquidGlassEnabled
          ? 'liquid-glass-panel border-white/80'
          : 'bg-white border-[#E4E4E7]'
      } rounded-[8px] p-6 sm:p-8 space-y-6`}
    >
      {/* TOP ROW: BRAND & CREATOR SHOWCASE + NAVIGATION COLUMNS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
        {/* COL 1 & 2: BRAND & CREATED BY VIKABUILDS */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-[4px] bg-[#18181B] text-white flex items-center justify-center font-bold text-xs tracking-tighter">
              V
            </div>
            <span className="font-bold text-sm tracking-tight text-[#09090B]">
              VayuGrid OS
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 border border-zinc-200">
              v1.0
            </span>
          </div>

          <p className="text-xs text-[#52525B] leading-relaxed max-w-sm">
            Urban Air Quality & Exposure Intelligence OS. Helping families and communities avoid severe winter smog through grounded atmospheric physics and personalized routines.
          </p>

          {/* CREATED BY VIKABUILDS FEATURED PILL */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => onOpenPage('vikabuilds')}
              className="group inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-[#18181B] hover:bg-zinc-800 text-white text-xs font-medium transition-all shadow-xs cursor-pointer border border-zinc-700"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300 group-hover:rotate-12 transition-transform" />
              <span>Created by <strong className="font-semibold text-white tracking-wide">VIKABUILDS</strong></span>
              <span className="text-[10px] text-zinc-400 font-mono">→ Learn More</span>
            </button>
          </div>
        </div>

        {/* COL 3: COMPANY & CREATOR */}
        <div className="space-y-2.5">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#71717A]">
            Organization
          </div>
          <ul className="space-y-1.5 text-xs">
            <li>
              <button
                type="button"
                onClick={() => onOpenPage('vikabuilds')}
                className="text-[#52525B] hover:text-[#09090B] hover:underline cursor-pointer flex items-center space-x-1"
              >
                <span>Created by VIKABUILDS</span>
                <span className="text-[9px] bg-amber-100 text-amber-800 font-mono px-1 py-0.2 rounded font-bold">PRO</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onOpenPage('about')}
                className="text-[#52525B] hover:text-[#09090B] hover:underline cursor-pointer"
              >
                About Us & Mission
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onOpenPage('contact')}
                className="text-[#52525B] hover:text-[#09090B] hover:underline cursor-pointer flex items-center space-x-1"
              >
                <Mail className="w-3 h-3 text-rose-500" />
                <span>Contact Us</span>
              </button>
            </li>
            <li>
              <a
                href="https://instagram.com/vedatech_29"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#52525B] hover:text-[#09090B] hover:underline inline-flex items-center space-x-1"
              >
                <InstagramIcon className="w-3 h-3 text-pink-600" />
                <span>Instagram (@VEDATECH_29)</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </a>
            </li>
            <li>
              <a
                href="https://github.com/vkenterprisesltd725-maker/vayugrid"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#52525B] hover:text-[#09090B] hover:underline inline-flex items-center space-x-1"
              >
                <Code2 className="w-3 h-3" />
                <span>GitHub Repository</span>
                <ExternalLink className="w-2.5 h-2.5 opacity-60" />
              </a>
            </li>
          </ul>
        </div>

        {/* COL 4: LEGAL & COMPLIANCE */}
        <div className="space-y-2.5">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#71717A]">
            Legal & Trust
          </div>
          <ul className="space-y-1.5 text-xs">
            <li>
              <button
                type="button"
                onClick={() => onOpenPage('privacy')}
                className="text-[#52525B] hover:text-[#09090B] hover:underline cursor-pointer flex items-center space-x-1"
              >
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Privacy Policy</span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onOpenPage('refund')}
                className="text-[#52525B] hover:text-[#09090B] hover:underline cursor-pointer"
              >
                Refund Policy
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onOpenPage('terms')}
                className="text-[#52525B] hover:text-[#09090B] hover:underline cursor-pointer"
              >
                Terms of Service
              </button>
            </li>
            <li className="pt-1">
              <span className="text-[10px] text-[#71717A] font-mono block">
                Support: vika.in.tech725@gmail.com
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* MIDDLE ROW: SCIENTIFIC GROUNDING METADATA */}
      <div className="border-t border-[#E4E4E7] pt-4 text-[11px] text-[#71717A] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-medium text-[#09090B]">Engine Grounding:</span>
          <span className="font-mono text-[#09090B]">CPCB NAQI (India)</span>
          <span>•</span>
          <span className="font-mono text-[#09090B]">WHO 2021 AQG (15 µg/m³)</span>
          <span>•</span>
          <span className="font-mono text-[#09090B]">ASHRAE 62.2</span>
          <span>•</span>
          <span className="font-mono text-[#09090B]">Open-Meteo European CAMS</span>
        </div>

        {liquidGlassEnabled && (
          <span className="flex items-center space-x-1 text-sky-700 font-medium">
            <Droplets className="w-3 h-3" />
            <span>Liquid Glass Optical Simulation Active</span>
          </span>
        )}
      </div>

      {/* BOTTOM ROW: COPYRIGHT */}
      <div className="border-t border-[#E4E4E7] pt-4 flex flex-col sm:flex-row justify-between items-center text-[11px] text-[#71717A] gap-2">
        <div>
          © 2026 <strong>VayuGrid OS</strong>. Designed & Engineered by{' '}
          <button
            type="button"
            onClick={() => onOpenPage('vikabuilds')}
            className="font-bold text-[#09090B] hover:underline cursor-pointer"
          >
            VIKABUILDS
          </button>
          . All rights reserved.
        </div>
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => onOpenPage('privacy')}
            className="hover:underline"
          >
            Privacy
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => onOpenPage('refund')}
            className="hover:underline"
          >
            Refunds
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => onOpenPage('terms')}
            className="hover:underline"
          >
            Terms
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => onOpenPage('contact')}
            className="hover:underline"
          >
            Contact
          </button>
        </div>
      </div>
    </footer>
  );
};
