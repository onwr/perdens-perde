"use client";

interface FontSizeInputProps {
  label?: string;
  desktopValue: string;
  mobileValue: string;
  onDesktopChange: (val: string) => void;
  onMobileChange: (val: string) => void;
  desktopPlaceholder?: string;
  mobilePlaceholder?: string;
}

/**
 * Reusable component for desktop + mobile font size inputs.
 * If left empty, the Tailwind default sizes remain active on the page.
 */
export default function FontSizeInput({
  label,
  desktopValue,
  mobileValue,
  onDesktopChange,
  onMobileChange,
  desktopPlaceholder = 'Örn: 44px',
  mobilePlaceholder = 'Örn: 28px',
}: FontSizeInputProps) {
  return (
    <div>
      {label && (
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{label}</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
            🖥 Masaüstü
          </label>
          <input
            type="text"
            value={desktopValue}
            onChange={(e) => onDesktopChange(e.target.value)}
            placeholder={desktopPlaceholder}
            className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-cyan-300 outline-none"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
            📱 Mobil
          </label>
          <input
            type="text"
            value={mobileValue}
            onChange={(e) => onMobileChange(e.target.value)}
            placeholder={mobilePlaceholder}
            className="w-full h-10 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-cyan-300 outline-none"
          />
        </div>
      </div>
    </div>
  );
}
