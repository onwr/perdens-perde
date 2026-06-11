"use client";

import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, Check, Palette } from 'lucide-react';
import { useSettings, defaultSettings } from '@/contexts/SettingsContext';

const FONT_OPTIONS = ['Manrope', 'Inter', 'Roboto', 'Playfair Display', 'Outfit', 'Montserrat', 'Poppins'];

export default function TemaAyarlari() {
  const { settings, loading } = useSettings();
  const [saving, setSaving] = useState(false);

  // Local state initialized carefully
  const [theme, setTheme] = useState(settings?.theme || defaultSettings.theme);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'site'), { theme }, { merge: true });
      alert('Tema ayarları başarıyla kaydedildi!');
    } catch {
      alert('Kaydedilirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin inline-block" /> Yükleniyor...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold mb-1 tracking-tight">Tema & Tasarım Ayarları</h2>
          <p className="text-slate-500 font-medium">Sitenin ana karakterini belirleyen renk ve font seçeneklerini yönetin.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 disabled:bg-slate-400 text-white px-5 py-3 rounded-xl font-bold transition-all shadow"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />} Değişiklikleri Kaydet
        </button>
      </div>

      <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 bg-violet-50 text-violet-500 rounded-xl flex items-center justify-center">
            <Palette size={20} />
          </div>
          <h3 className="text-lg font-extrabold text-slate-800">Renk ve Yazı Tipleri</h3>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Ana Buton & Vurgu Rengi</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={theme.primaryColor}
                  onChange={(e) => setTheme(p => ({ ...p, primaryColor: e.target.value }))}
                  className="w-12 h-12 rounded-lg cursor-pointer border-0 p-0"
                />
                <input
                  type="text"
                  value={theme.primaryColor}
                  onChange={(e) => setTheme(p => ({ ...p, primaryColor: e.target.value }))}
                  className="flex-1 h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-violet-300 outline-none uppercase"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Varsayılan Arka Plan Rengi</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={theme.backgroundColor}
                  onChange={(e) => setTheme(p => ({ ...p, backgroundColor: e.target.value }))}
                  className="w-12 h-12 rounded-lg cursor-pointer border-0 p-0"
                />
                <input
                  type="text"
                  value={theme.backgroundColor}
                  onChange={(e) => setTheme(p => ({ ...p, backgroundColor: e.target.value }))}
                  className="flex-1 h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-violet-300 outline-none uppercase"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Genel Metin Fontu</label>
              <select
                value={theme.fontFamily}
                onChange={(e) => setTheme(p => ({ ...p, fontFamily: e.target.value }))}
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-violet-300/30 outline-none"
              >
                {FONT_OPTIONS.map(font => <option key={font} value={font}>{font}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Başlık Fontu</label>
              <select
                value={theme.headingFontFamily}
                onChange={(e) => setTheme(p => ({ ...p, headingFontFamily: e.target.value }))}
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-violet-300/30 outline-none"
              >
                {FONT_OPTIONS.map(font => <option key={font} value={font}>{font}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-xl">
          <p className="text-sm font-bold text-slate-600 mb-2">Canlı Tasarım Önizlemesi</p>
          <div className="p-6 bg-white rounded-lg border border-slate-100 shadow-sm" style={{ backgroundColor: theme.backgroundColor }}>
            <h1 className="text-2xl font-bold mb-2 text-slate-900" style={{ fontFamily: theme.headingFontFamily }}>Başlık Örneği ({theme.headingFontFamily})</h1>
            <p className="text-slate-600 mb-4" style={{ fontFamily: theme.fontFamily }}>
              Bu metin genel font seçiminizi temsil eder ({theme.fontFamily}). Renk ve yazılardaki okunabilirliğe dikkat ediniz.
            </p>
            <button className="px-6 py-2 rounded-lg text-white font-bold transition hover:opacity-90" style={{ backgroundColor: theme.primaryColor, fontFamily: theme.fontFamily }}>
              Örnek Buton
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
