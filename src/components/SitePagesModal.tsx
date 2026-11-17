import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ShieldCheck,
  Mail,
  FileText,
  DollarSign,
  Scale,
  Send,
  ExternalLink,
  Code2,
  Heart,
  Award,
  Layers,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Cpu,
  Globe2,
} from 'lucide-react';
import type { SitePageId } from '../types';

interface SitePagesModalProps {
  isOpen: boolean;
  initialPage?: SitePageId;
  onClose: () => void;
  liquidGlassEnabled?: boolean;
  onShowToast?: (msg: string) => void;
}

export const SitePagesModal: React.FC<SitePagesModalProps> = ({
  isOpen,
  initialPage = 'vikabuilds',
  onClose,
  liquidGlassEnabled = false,
  onShowToast,
}) => {
  const [activePage, setActivePage] = useState<SitePageId>(initialPage);

  // Synchronize when initialPage prop changes
  React.useEffect(() => {
    setActivePage(initialPage);
  }, [initialPage]);

  // Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactCategory, setContactCategory] = useState('General Feedback');
  const [contactMessage, setContactMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim() || !contactMessage.trim()) {
      onShowToast?.('Please fill out all contact fields.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      onShowToast?.('Message dispatched successfully to VIKABUILDS!');
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    }, 700);
  };

  const navItems: { id: SitePageId; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'vikabuilds', label: 'Created by VIKABUILDS', icon: Sparkles },
    { id: 'about', label: 'About Us', icon: Layers },
    { id: 'contact', label: 'Contact Us', icon: Mail },
    { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck },
    { id: 'refund', label: 'Refund Policy', icon: DollarSign },
    { id: 'terms', label: 'Terms of Service', icon: Scale },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className={`w-full max-w-4xl h-[90vh] max-h-[780px] rounded-[8px] flex flex-col overflow-hidden shadow-2xl border transition-all ${
          liquidGlassEnabled
            ? 'liquid-glass-modal border-white/80'
            : 'bg-white border-[#E4E4E7]'
        }`}
      >
        {/* MODAL HEADER */}
        <div className="h-14 px-4 sm:px-6 border-b border-[#E4E4E7] flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-6 h-6 rounded-[4px] bg-[#18181B] text-white flex items-center justify-center font-bold text-xs tracking-tighter">
              V
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-sm tracking-tight text-[#09090B]">
                  VayuGrid Intelligence
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-600 border border-zinc-200 uppercase font-medium">
                  Official
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-[4px] text-[#71717A] hover:text-[#09090B] hover:bg-[#F4F4F5] border border-transparent hover:border-[#E4E4E7] transition-all cursor-pointer"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* MODAL BODY: SPLIT VIEW WITH SIDEBAR & CONTENT */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden bg-[#FAFAFA]">
          {/* NAVIGATION SIDEBAR */}
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#E4E4E7] bg-white p-3 shrink-0 flex md:flex-col gap-1 overflow-x-auto md:overflow-y-auto">
            <div className="hidden md:block px-2 py-1.5 text-[11px] font-mono font-semibold uppercase text-[#71717A] tracking-wider">
              Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActivePage(item.id);
                    setIsSubmitted(false);
                  }}
                  className={`flex items-center space-x-2.5 px-3 py-2 rounded-[6px] text-xs font-medium transition-all text-left whitespace-nowrap cursor-pointer shrink-0 md:w-full ${
                    isActive
                      ? 'bg-[#18181B] text-white shadow-xs font-semibold'
                      : 'text-[#52525B] hover:text-[#09090B] hover:bg-[#F4F4F5]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-[#71717A]'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}

            <div className="hidden md:block mt-auto pt-4 border-t border-[#E4E4E7] px-2 text-[11px] text-[#71717A] space-y-1">
              <div className="font-medium text-[#09090B]">VIKABUILDS Studio</div>
              <div>vkenterprisesltd725@gmail.com</div>
              <div className="font-mono text-[10px] text-zinc-400">v1.0 Production Build</div>
            </div>
          </div>

          {/* PAGE CONTENT CONTAINER */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-white text-[#09090B]">
            {/* 1. CREATED BY VIKABUILDS */}
            {activePage === 'vikabuilds' && (
              <div className="space-y-6 max-w-2xl animate-in fade-in duration-150">
                <div className="border border-[#E4E4E7] rounded-[8px] p-6 bg-gradient-to-br from-zinc-50 via-white to-zinc-100 relative overflow-hidden">
                  <div className="absolute top-3 right-3 flex items-center space-x-1.5 bg-black text-white px-2.5 py-1 rounded-full text-[10px] font-mono tracking-wide">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>CREATOR SPOTLIGHT</span>
                  </div>

                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-14 h-14 rounded-[8px] bg-[#18181B] text-white flex items-center justify-center font-bold text-2xl tracking-tight shadow-md border border-zinc-700">
                      VB
                    </div>
                    <div>
                      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#09090B]">
                        VIKABUILDS
                      </h1>
                      <p className="text-xs text-[#52525B] font-mono">
                        Crafting High-Craft Autonomous Systems & Environmental Intelligence
                      </p>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#52525B] leading-relaxed mb-4">
                    <strong>VIKABUILDS</strong> is founded by <strong>Vikas (VIKA)</strong>, dedicated to engineering production-grade software that bridges complex scientific algorithms with clean, human-centric design. VayuGrid was conceived to tackle the harsh reality of winter smog across northern cities, transforming abstract AQI figures into actionable, life-saving household protocols.
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2 border-t border-zinc-200">
                    <a
                      href="https://github.com/vkenterprisesltd725-maker/vayugrid"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-[4px] bg-[#18181B] text-white hover:bg-zinc-800 transition-colors"
                    >
                      <Code2 className="w-3.5 h-3.5" />
                      <span>GitHub: vkenterprisesltd725-maker</span>
                      <ExternalLink className="w-3 h-3 ml-0.5 opacity-70" />
                    </a>
                    <a
                      href="mailto:vkenterprisesltd725@gmail.com"
                      className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-[4px] bg-white border border-[#E4E4E7] text-[#09090B] hover:bg-[#F4F4F5] transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-rose-500" />
                      <span>vkenterprisesltd725@gmail.com</span>
                    </a>
                  </div>
                </div>

                {/* Core Engineering Principles */}
                <div className="space-y-3">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-[#71717A] font-mono">
                    Engineering Principles of VIKABUILDS
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-[6px] border border-[#E4E4E7] bg-[#FAFAFA]">
                      <div className="flex items-center space-x-2 mb-1.5">
                        <Cpu className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-bold text-[#09090B]">Anti-AI Slop Craft</span>
                      </div>
                      <p className="text-[11px] text-[#52525B] leading-relaxed">
                        Never bloated templates or cliché illustrations. Strict adherence to Linear/Vercel hairline architectural precision and tabular data clarity.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-[6px] border border-[#E4E4E7] bg-[#FAFAFA]">
                      <div className="flex items-center space-x-2 mb-1.5">
                        <Award className="w-4 h-4 text-sky-600" />
                        <span className="text-xs font-bold text-[#09090B]">Atmospheric Physics Grounding</span>
                      </div>
                      <p className="text-[11px] text-[#52525B] leading-relaxed">
                        Every reduction number is anchored to peer-reviewed CPCB, WHO (15 µg/m³ 24h limit), and ASHRAE ventilation mechanics.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-[6px] border border-[#E4E4E7] bg-[#FAFAFA]">
                      <div className="flex items-center space-x-2 mb-1.5">
                        <Heart className="w-4 h-4 text-rose-600" />
                        <span className="text-xs font-bold text-[#09090B]">Everyday Citizen Centric</span>
                      </div>
                      <p className="text-[11px] text-[#52525B] leading-relaxed">
                        Tailored for mothers, seniors, and non-specialist citizens with plain-English safety guides and friendly interactive analogies.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-[6px] border border-[#E4E4E7] bg-[#FAFAFA]">
                      <div className="flex items-center space-x-2 mb-1.5">
                        <Globe2 className="w-4 h-4 text-indigo-600" />
                        <span className="text-xs font-bold text-[#09090B]">Open & Free Internet Data</span>
                      </div>
                      <p className="text-[11px] text-[#52525B] leading-relaxed">
                        Direct connection to Open-Meteo European Atmosphere Service (ECMWF & CAMS) without key walls or subscription traps.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Other Projects by VIKABUILDS */}
                <div className="p-4 rounded-[6px] border border-[#E4E4E7] bg-white space-y-2">
                  <div className="text-xs font-bold text-[#09090B]">Selected Systems by VIKABUILDS:</div>
                  <div className="space-y-1.5 text-xs text-[#52525B]">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#09090B]">• VayuGrid OS</span>
                      <span className="font-mono text-[10px] text-zinc-500">Urban Atmospheric Intelligence</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#09090B]">• AI Resume Intelligence Platform</span>
                      <span className="font-mono text-[10px] text-zinc-500">Autonomous Talent Analytics</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#09090B]">• Universal AI Studio</span>
                      <span className="font-mono text-[10px] text-zinc-500">Multi-Model Agent Workstation</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. ABOUT US */}
            {activePage === 'about' && (
              <div className="space-y-5 max-w-2xl animate-in fade-in duration-150">
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-[#09090B] mb-1">
                    About VayuGrid (वायुग्रिड)
                  </h1>
                  <p className="text-xs text-[#52525B]">
                    Urban Air Quality & Exposure Intelligence Operating System
                  </p>
                </div>

                <div className="p-4 rounded-[6px] border border-amber-200 bg-amber-50/60 text-amber-950 text-xs leading-relaxed space-y-1.5">
                  <div className="font-bold flex items-center space-x-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
                    <span>The Problem We Solve</span>
                  </div>
                  <p>
                    During winter months across the Indo-Gangetic Plain and global landlocked valleys, a meteorological phenomenon known as a <strong>thermal inversion</strong> forms a stagnant cold air blanket over cities. Industrial emissions, vehicular exhaust, and crop residue smoke become trapped at ground level, driving PM2.5 concentrations to hazardous levels (AQI 300–500+).
                  </p>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-[#52525B] leading-relaxed">
                  <h2 className="text-sm font-bold text-[#09090B]">Why Generic AQI Apps Fall Short</h2>
                  <p>
                    Existing weather apps only report a single red number like "AQI 380: Hazardous" and suggest "Wear a mask". They fail to address core questions:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-xs text-[#52525B]">
                    <li>When does the thermal boundary layer rise in the afternoon to allow safe 30-minute house airing?</li>
                    <li>How does unvented gas cooking contribute an extra 150 µg/m³ of indoor particulate spikes?</li>
                    <li>Which exact commute shift (car/scooter vs metro) prevents the most cumulative inhaled lung dose?</li>
                  </ul>

                  <h2 className="text-sm font-bold text-[#09090B] pt-2">The VayuGrid Solution</h2>
                  <p>
                    VayuGrid combines <strong>grounded environmental physics</strong>, <strong>diurnal boundary layer mechanics</strong>, and <strong>Gemini 2.5 Flash</strong> to deliver a hyper-personalized daily operating protocol for every household. It accounts for whether you have infants, elders with cardiac vulnerability, an air purifier, or gas exhaust—quantifying the exact percentage of inhaled PM2.5 avoided.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-[#E4E4E7]">
                  <div className="p-3 border border-[#E4E4E7] rounded-[6px] text-center">
                    <div className="text-lg font-bold font-mono text-[#09090B]">15 µg/m³</div>
                    <div className="text-[10px] text-[#71717A]">WHO 24h Safe Limit</div>
                  </div>
                  <div className="p-3 border border-[#E4E4E7] rounded-[6px] text-center">
                    <div className="text-lg font-bold font-mono text-[#09090B]">500 AQI</div>
                    <div className="text-[10px] text-[#71717A]">CPCB Calibrated Range</div>
                  </div>
                  <div className="p-3 border border-[#E4E4E7] rounded-[6px] text-center col-span-2 sm:col-span-1">
                    <div className="text-lg font-bold font-mono text-emerald-700">100% Free</div>
                    <div className="text-[10px] text-[#71717A]">Open Data Architecture</div>
                  </div>
                </div>
              </div>
            )}

            {/* 3. CONTACT US */}
            {activePage === 'contact' && (
              <div className="space-y-5 max-w-2xl animate-in fade-in duration-150">
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-[#09090B] mb-1">
                    Contact VIKABUILDS
                  </h1>
                  <p className="text-xs text-[#52525B]">
                    Get in touch with the creator, report an issue, or request enterprise air grid deployment.
                  </p>
                </div>

                {isSubmitted ? (
                  <div className="p-6 border border-emerald-200 bg-emerald-50 rounded-[8px] text-center space-y-3">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <div className="text-sm font-bold text-emerald-900">Message Received!</div>
                    <p className="text-xs text-emerald-700 max-w-md mx-auto">
                      Thank you for contacting VIKABUILDS. Our team will review your message and reply to your provided email within 24 to 48 hours.
                    </p>
                    <button
                      type="button"
                      onClick={() => setIsSubmitted(false)}
                      className="mt-2 px-3 py-1.5 text-xs font-semibold rounded-[4px] bg-[#18181B] text-white hover:bg-zinc-800 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSendMessage} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#09090B]">Your Name *</label>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="e.g. Vikas Sharma"
                          className="w-full px-3 py-2 text-xs rounded-[4px] border border-[#E4E4E7] focus:outline-none focus:border-[#18181B] bg-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-[#09090B]">Your Email Address *</label>
                        <input
                          type="email"
                          required
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          placeholder="you@example.com"
                          className="w-full px-3 py-2 text-xs rounded-[4px] border border-[#E4E4E7] focus:outline-none focus:border-[#18181B] bg-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#09090B]">Inquiry Category</label>
                      <select
                        value={contactCategory}
                        onChange={(e) => setContactCategory(e.target.value)}
                        className="w-full px-3 py-2 text-xs rounded-[4px] border border-[#E4E4E7] focus:outline-none focus:border-[#18181B] bg-white"
                      >
                        <option value="General Feedback">General Feedback & Questions</option>
                        <option value="Bug Report">Bug Report / Technical Issue</option>
                        <option value="City Sensor Integration">Suggest New City / Sensor Data</option>
                        <option value="Enterprise & Schools">Enterprise, School or Hospital Grid</option>
                        <option value="Press & Research">Press & Environmental Research</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-[#09090B]">Message *</label>
                      <textarea
                        required
                        rows={4}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        placeholder="Write your thoughts, questions, or feedback here..."
                        className="w-full px-3 py-2 text-xs rounded-[4px] border border-[#E4E4E7] focus:outline-none focus:border-[#18181B] bg-white resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-2.5 px-4 rounded-[4px] bg-[#18181B] text-white hover:bg-zinc-800 font-semibold text-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer shadow-xs disabled:opacity-60"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>{isSubmitting ? 'Transmitting...' : 'Send Message to VIKABUILDS'}</span>
                    </button>
                  </form>
                )}

                {/* Direct Contact Cards */}
                <div className="pt-4 border-t border-[#E4E4E7] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 border border-[#E4E4E7] rounded-[6px] bg-[#FAFAFA]">
                    <div className="font-bold text-[#09090B] mb-1">Direct Creator Email</div>
                    <a
                      href="mailto:vkenterprisesltd725@gmail.com"
                      className="text-sky-700 hover:underline font-mono text-[11px]"
                    >
                      vkenterprisesltd725@gmail.com
                    </a>
                    <div className="text-[10px] text-[#71717A] mt-1">SLA: Replies in &lt; 24h</div>
                  </div>

                  <div className="p-3 border border-[#E4E4E7] rounded-[6px] bg-[#FAFAFA]">
                    <div className="font-bold text-[#09090B] mb-1">Open Source Repository</div>
                    <a
                      href="https://github.com/vkenterprisesltd725-maker/vayugrid"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-700 hover:underline font-mono text-[11px] truncate block"
                    >
                      github.com/vkenterprisesltd725-maker/vayugrid
                    </a>
                    <div className="text-[10px] text-[#71717A] mt-1">Issues & PRs welcome</div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. PRIVACY POLICY */}
            {activePage === 'privacy' && (
              <div className="space-y-4 max-w-2xl text-xs sm:text-sm text-[#52525B] leading-relaxed animate-in fade-in duration-150">
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-[#09090B] mb-1">
                    Privacy Policy
                  </h1>
                  <p className="text-xs text-[#71717A] font-mono">
                    Last Updated: November 17, 2026 • VIKABUILDS
                  </p>
                </div>

                <div className="p-3.5 bg-emerald-50/80 border border-emerald-200 rounded-[6px] text-emerald-950 text-xs">
                  <strong>Summary in Plain English:</strong> We do not track you, sell your location, or store personal telemetry. Your coordinates are used ephemerally to fetch weather and air readings, and all household profile preferences stay strictly on your device.
                </div>

                <div className="space-y-3 pt-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#09090B]">
                    1. Ephemeral Geolocation & Address Data
                  </h2>
                  <p className="text-xs">
                    When you choose to click <em>"Detect Device Address"</em> or <em>"Use My GPS Location"</em>, your browser's latitude and longitude are transmitted directly to the free Open-Meteo Air Quality API and OpenStreetMap Nominatim / BigDataCloud reverse geocoding endpoints. We do not store, log, or profile your location coordinates on any external proprietary database.
                  </p>

                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#09090B]">
                    2. Local Storage of Household Preferences
                  </h2>
                  <p className="text-xs">
                    Your household parameters (such as whether you have infants, elders, air purifiers, or gas stoves) are stored exclusively in your browser’s client-side <code className="font-mono bg-zinc-100 px-1 py-0.5 rounded text-zinc-800">localStorage</code>. This data never leaves your personal device without your explicit action.
                  </p>

                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#09090B]">
                    3. Gemini API & Artificial Intelligence Queries
                  </h2>
                  <p className="text-xs">
                    When invoking the AI Protocol Generator or the Ask Vayu assistant via Google Gemini 2.5 Flash, only non-identifying environmental parameters (e.g., city name, ambient AQI, commute distance) are passed to the API. We never send your name, email, IP address, or physical house address to the AI model.
                  </p>

                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#09090B]">
                    4. Zero Third-Party Advertising & Trackers
                  </h2>
                  <p className="text-xs">
                    VayuGrid contains zero third-party commercial tracking cookies, advertising scripts, or data-broker analytics.
                  </p>

                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#09090B]">
                    5. Privacy Inquiries
                  </h2>
                  <p className="text-xs">
                    For questions regarding our privacy practices, contact us directly at <a href="mailto:vkenterprisesltd725@gmail.com" className="text-sky-700 underline font-mono">vkenterprisesltd725@gmail.com</a>.
                  </p>
                </div>
              </div>
            )}

            {/* 5. REFUND POLICY */}
            {activePage === 'refund' && (
              <div className="space-y-4 max-w-2xl text-xs sm:text-sm text-[#52525B] leading-relaxed animate-in fade-in duration-150">
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-[#09090B] mb-1">
                    Refund & Cancellation Policy
                  </h1>
                  <p className="text-xs text-[#71717A] font-mono">
                    Last Updated: November 17, 2026 • VIKABUILDS
                  </p>
                </div>

                <div className="p-3.5 bg-zinc-50 border border-[#E4E4E7] rounded-[6px] text-xs">
                  <strong>Core Commitment:</strong> The citizen tier of VayuGrid is 100% free. For any future premium tier, institutional dashboard, or sponsored API access, we maintain a transparent, no-questions-asked refund policy.
                </div>

                <div className="space-y-3 pt-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#09090B]">
                    1. 7-Day Money-Back Guarantee
                  </h2>
                  <p className="text-xs">
                    If you purchase any commercial license, enterprise deployment, or dedicated server slot for VayuGrid and are not completely satisfied, you are entitled to a full 100% refund within <strong>7 calendar days</strong> from the date of purchase.
                  </p>

                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#09090B]">
                    2. How to Request a Refund
                  </h2>
                  <p className="text-xs">
                    To initiate a refund, simply send an email to <a href="mailto:vkenterprisesltd725@gmail.com" className="text-sky-700 underline font-mono">vkenterprisesltd725@gmail.com</a> with the subject line <em>"Refund Request - [Your Order ID]"</em>. Include the email address used during purchase. No explanation is required.
                  </p>

                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#09090B]">
                    3. Refund Processing Timeline
                  </h2>
                  <p className="text-xs">
                    Once received, your refund will be processed within <strong>3 to 5 business days</strong>. The amount will be credited back to your original payment method (bank account, UPI, credit card).
                  </p>

                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#09090B]">
                    4. Cancellation of Recurring Plans
                  </h2>
                  <p className="text-xs">
                    You may cancel any active recurring subscriptions at any time via your account dashboard or by emailing us. Your access will remain active until the end of the current billing cycle, with zero future renewal charges.
                  </p>
                </div>
              </div>
            )}

            {/* 6. TERMS OF SERVICE */}
            {activePage === 'terms' && (
              <div className="space-y-4 max-w-2xl text-xs sm:text-sm text-[#52525B] leading-relaxed animate-in fade-in duration-150">
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-[#09090B] mb-1">
                    Terms of Service
                  </h1>
                  <p className="text-xs text-[#71717A] font-mono">
                    Last Updated: November 17, 2026 • VIKABUILDS
                  </p>
                </div>

                <div className="p-3.5 bg-rose-50/80 border border-rose-200 rounded-[6px] text-rose-950 text-xs">
                  <strong>Important Health Disclaimer:</strong> VayuGrid provides scientific exposure reduction modeling and routine suggestions based on published CPCB and WHO guidelines. It is an educational and lifestyle tool, not a substitute for medical diagnosis or clinical treatment.
                </div>

                <div className="space-y-3 pt-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#09090B]">
                    1. Agreement to Terms
                  </h2>
                  <p className="text-xs">
                    By accessing or using VayuGrid OS (the "Application"), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you should discontinue use immediately.
                  </p>

                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#09090B]">
                    2. Advisory & Guidance Scope
                  </h2>
                  <p className="text-xs">
                    While VayuGrid utilizes peer-reviewed boundary layer physics and calibrated PM2.5 formulas, ambient and micro-environmental pollution can vary based on hyper-local sources (e.g. adjacent trash burning, local construction). Users with severe asthma, COPD, or cardiac conditions must follow their physician's medical protocols and emergency health directives.
                  </p>

                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#09090B]">
                    3. Permitted Use & Fair Access
                  </h2>
                  <p className="text-xs">
                    You are granted a revocable, non-exclusive license to use VayuGrid for personal, family, and educational purposes. You agree not to execute automated denial-of-service scripts or scrapers against the open atmospheric telemetry services.
                  </p>

                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#09090B]">
                    4. Intellectual Property
                  </h2>
                  <p className="text-xs">
                    All original software, algorithms, user interfaces, and brand identities associated with VayuGrid and VIKABUILDS are the intellectual property of Vikas (VIKABUILDS).
                  </p>

                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#09090B]">
                    5. Modifications & Contact
                  </h2>
                  <p className="text-xs">
                    We reserve the right to modify these terms at any time. Continued use of the platform after updates constitutes agreement. For any inquiries, contact <a href="mailto:vkenterprisesltd725@gmail.com" className="text-sky-700 underline font-mono">vkenterprisesltd725@gmail.com</a>.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
