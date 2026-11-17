import React from 'react';
import { X, BookOpen, Sparkles, Check } from 'lucide-react';

interface JargonBusterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JargonBusterModal: React.FC<JargonBusterModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const terms = [
    {
      term: 'PM2.5 (Fine Dust & Soot)',
      analogy: '30× thinner than a strand of human hair',
      explanation:
        'Tiny invisible particles from car exhaust, road dust, and cooking smoke. Because they are microscopic, your nose cannot filter them, and they travel deep into your lungs and bloodstream.',
      ruleOfThumb: 'Under 15 µg/m³ is safe. Above 60 µg/m³ starts irritating eyes and throat.',
    },
    {
      term: 'AQI (Air Quality Index)',
      analogy: 'A thermometer for air cleanliness from 0 to 500',
      explanation:
        'A unified score calculated by government monitors. Think of it like a traffic light: 0–50 is clean green; 100–200 is cautionary yellow/orange; 300+ is emergency red.',
      ruleOfThumb: 'When AQI is above 200, wear an N95 mask outside and close home windows.',
    },
    {
      term: 'Thermal Inversion Window',
      analogy: 'A pot lid trapping steam in your neighborhood',
      explanation:
        'On cold winter mornings and nights, a cold blanket of air gets trapped beneath warm air above. It acts like a sealed lid, trapping all vehicle exhaust, garbage burning, and smoke at street level right where we breathe.',
      ruleOfThumb: 'Smog is thickest between 6:00–10:00 AM and 7:00–11:00 PM. Best outdoor time is 1:30–4:00 PM.',
    },
    {
      term: 'True HEPA Filter',
      analogy: 'A microscopic spiderweb that catches 99.97% of dust',
      explanation:
        'A dense pleated paper-like fiber matrix. Regular air conditioners only catch pet hair and coarse lint; True HEPA catches fine invisible smoke particles.',
      ruleOfThumb: 'Place the purifier in the bedroom with doors and windows closed.',
    },
    {
      term: 'Cooking Smoke Spikes',
      analogy: 'Frying rotis or tadka releases more smoke than a cigarette',
      explanation:
        'Gas flames burning cooking oil release intense indoor PM2.5 bursts (100–300 µg/m³) in minutes if there is no exhaust fan.',
      ruleOfThumb: 'Turn on your kitchen exhaust fan before cooking and let it run for 15 minutes after.',
    },
    {
      term: 'N95 Respirator vs. Cloth Mask',
      analogy: 'A mosquito net (cloth) vs. a water filter (N95)',
      explanation:
        'Cloth and surgical masks have large weave openings that microscopic PM2.5 sails straight through. N95 respirators have electrostatic fibers that magnetically trap smoke particles.',
      ruleOfThumb: 'Always choose an N95 with a snug fit around your nose and chin.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
      <div className="bg-white border border-[#E4E4E7] rounded-[6px] w-full max-w-2xl overflow-hidden shadow-none flex flex-col max-h-[85vh]">
        {/* HEADER */}
        <div className="p-4 border-b border-[#E4E4E7] bg-[#FAFAFA] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-[#09090B]" />
            <div>
              <h3 className="font-semibold text-sm text-[#09090B]">
                Air Quality Terms in Plain English
              </h3>
              <p className="text-[11px] text-[#71717A]">
                Everyday explanations for non-experts and families
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#71717A] hover:text-[#09090B] p-1 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* LIST */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 text-xs">
          {terms.map((item, idx) => (
            <div
              key={idx}
              className="p-3 bg-[#FAFAFA] border border-[#E4E4E7] rounded-[5px] space-y-1.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-bold text-xs text-[#09090B]">{item.term}</span>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  {item.analogy}
                </span>
              </div>
              <p className="text-xs text-[#52525B] leading-relaxed">
                {item.explanation}
              </p>
              <div className="text-[11px] font-medium text-[#18181B] bg-white p-2 rounded border border-[#E4E4E7] flex items-start space-x-1.5 mt-1">
                <span className="text-emerald-600 font-bold">💡 Tip:</span>
                <span>{item.ruleOfThumb}</span>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="p-3 bg-[#FAFAFA] border-t border-[#E4E4E7] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 bg-[#18181B] hover:bg-[#27272A] text-white rounded-[4px] text-xs font-medium cursor-pointer"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
};
