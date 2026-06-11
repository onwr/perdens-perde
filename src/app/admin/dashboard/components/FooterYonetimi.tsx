"use client";

import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, Check, LayoutPanelLeft, Plus, Trash2, GripVertical, Image as ImageIcon } from 'lucide-react';
import { useSettings, defaultSettings } from '@/contexts/SettingsContext';
import FontSizeInput from './FontSizeInput';

const FONT_OPTIONS = ['Var', 'Manrope', 'Inter', 'Roboto', 'Playfair Display', 'Outfit', 'Montserrat', 'Poppins'];
const IMGBB_KEY = '51eca7c487b49a21c7f45c86a42093cf';

export default function FooterYonetimi() {
  const { settings, loading } = useSettings();
  const [saving, setSaving] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [footer, setFooter] = useState(settings?.footer || defaultSettings.footer);
  const [logos, setLogos] = useState(settings?.logos || defaultSettings.logos);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'site'), { footer, logos }, { merge: true });
      alert('Footer ayarları başarıyla kaydedildi!');
    } catch {
      alert('Kaydedilirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const addGroup = () => {
    const id = `group_${Date.now()}`;
    setFooter(p => ({ ...p, groups: [...(p.groups || []), { id, title: 'Yeni Başlık' }] }));
  };

  const removeGroup = (id: string) => {
    setFooter(p => ({
      ...p,
      groups: (p.groups || []).filter(g => g.id !== id),
      quickLinks: (p.quickLinks || []).filter(l => l.groupId !== id)
    }));
  };

  const addLink = () => {
    const firstGroup = (footer.groups || [])[0];
    setFooter(p => ({
      ...p,
      quickLinks: [...(p.quickLinks || []), { label: '', href: '', groupId: firstGroup?.id || 'kurumsal' }]
    }));
  };

  if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin inline-block" /> Yükleniyor...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold mb-1 tracking-tight">Alt Bilgi (Footer) Yönetimi</h2>
          <p className="text-slate-500 font-medium">Sitenin en altındaki bölümü, logoyu, linkleri ve yazı tiplerini ayarlayın.</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 disabled:bg-slate-400 text-white px-5 py-3 rounded-xl font-bold transition-all shadow"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />} Değişiklikleri Kaydet
        </button>
      </div>

      <div className="max-w-4xl space-y-6">

        {/* Görsel Tasarım & Logo */}
        <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-7">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 bg-sky-50 text-sky-500 rounded-xl flex items-center justify-center">
              <LayoutPanelLeft size={20} />
            </div>
            <h3 className="text-lg font-extrabold text-slate-800">Görsel Tasarım & Logo</h3>
          </div>
          
          <div className="mb-8 flex items-center gap-6">
            <div className="w-48 h-20 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200 overflow-hidden relative">
               {(logos.footerLogo) ? (
                 <img src={logos.footerLogo} alt="Footer Logo" className="max-w-full max-h-full object-contain p-2" />
               ) : (
                 <span className="text-xs text-slate-400 font-medium">Logo Yok</span>
               )}
               {logoUploading && <div className="absolute inset-0 bg-white/80 flex items-center justify-center"><Loader2 size={18} className="animate-spin text-sky-500" /></div>}
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Footer Logosu</label>
              <p className="text-xs text-slate-500 mb-3">Koyu veya açık arkaplana zıt renkte bir logo yükleyin.</p>
              <label className="inline-flex items-center gap-2 bg-sky-50 text-sky-700 px-4 py-2 rounded-lg text-sm font-bold hover:bg-sky-100 transition-colors cursor-pointer border border-sky-100">
                <ImageIcon size={16} /> Logo Değiştir
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    e.target.value = '';
                    setLogoUploading(true);
                    try {
                      const fd = new FormData();
                      fd.append('image', file);
                      const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_KEY}`, { method: 'POST', body: fd });
                      const payload = await res.json();
                      if (payload.success) setLogos(p => ({ ...p, footerLogo: payload.data.url }));
                    } catch {
                      alert('Resim yüklenemedi.');
                    } finally {
                      setLogoUploading(false);
                    }
                  }}
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Arka Plan Rengi</label>
              <div className="flex items-center gap-3">
                <input type="color" value={footer.backgroundColor}
                  onChange={(e) => setFooter(p => ({ ...p, backgroundColor: e.target.value }))}
                  className="w-14 h-12 rounded-xl cursor-pointer border-0 p-0.5"
                />
                <input type="text" value={footer.backgroundColor}
                  onChange={(e) => setFooter(p => ({ ...p, backgroundColor: e.target.value }))}
                  className="flex-1 h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-mono font-semibold text-slate-800 focus:ring-2 focus:ring-sky-300 outline-none uppercase"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Yazı Rengi</label>
              <div className="flex items-center gap-3">
                <input type="color" value={footer.textColor}
                  onChange={(e) => setFooter(p => ({ ...p, textColor: e.target.value }))}
                  className="w-14 h-12 rounded-xl cursor-pointer border-0 p-0.5"
                />
                <input type="text" value={footer.textColor}
                  onChange={(e) => setFooter(p => ({ ...p, textColor: e.target.value }))}
                  className="flex-1 h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-mono font-semibold text-slate-800 focus:ring-2 focus:ring-sky-300 outline-none uppercase"
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Footer Özel Fontu</label>
              <select value={footer.fontFamily}
                onChange={(e) => setFooter(p => ({ ...p, fontFamily: e.target.value }))}
                className="w-full md:w-1/2 h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-sky-300/30 outline-none"
              >
                {FONT_OPTIONS.map(f => <option key={f} value={f}>{f === 'Var' ? 'Genel Fontu Kullan' : f}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Kurumsal Açıklama & Copyright */}
        <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-7">
          <h3 className="text-lg font-extrabold text-slate-800 mb-5">Kurumsal Metin & Telif</h3>
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Şirket Açıklaması (Logo Altı Metin)</label>
              <textarea value={footer.aboutText}
                onChange={(e) => setFooter(p => ({ ...p, aboutText: e.target.value }))}
                rows={3}
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:ring-2 focus:ring-sky-300 outline-none resize-none"
              />
              <div className="mt-3">
                <FontSizeInput
                  label="Açıklama Metin Boyutu"
                  desktopValue={footer.aboutTextSizeDesktop || ''}
                  mobileValue={footer.aboutTextSizeMobile || ''}
                  onDesktopChange={(v) => setFooter(p => ({ ...p, aboutTextSizeDesktop: v }))}
                  onMobileChange={(v) => setFooter(p => ({ ...p, aboutTextSizeMobile: v }))}
                  desktopPlaceholder="Örn: 15px"
                  mobilePlaceholder="Örn: 14px"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">İletişim Sütunu Başlığı</label>
              <input type="text" value={footer.contactTitle || 'İLETİŞİM'}
                onChange={(e) => setFooter(p => ({ ...p, contactTitle: e.target.value }))}
                className="w-full md:w-1/2 h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-sky-300 outline-none"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Telif Hakkı (Copyright) Metni</label>
                <input type="text" value={footer.copyrightText}
                  onChange={(e) => setFooter(p => ({ ...p, copyrightText: e.target.value }))}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-sky-300 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Tasarım & Yazılım İmza Metni</label>
                <input type="text" value={footer.designerText || 'Tasarım & Yazılım: Kürkaya Yazılım'}
                  onChange={(e) => setFooter(p => ({ ...p, designerText: e.target.value }))}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-sky-300 outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Menü Başlıkları */}
        <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-7">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-extrabold text-slate-800">Menü Başlıkları (Sütunlar)</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Footer&apos;da orta kısımda yer alan sütun başlıklarını yönetin (Örn: KURUMSAL, ÜRÜNLER).</p>
            </div>
            <button type="button" onClick={addGroup}
              className="flex items-center gap-2 bg-sky-50 text-sky-600 px-3 py-2 rounded-lg text-sm font-bold hover:bg-sky-100 transition-colors"
            >
              <Plus size={15} /> Sütun Ekle
            </button>
          </div>
          <div className="space-y-3">
            {(footer.groups || []).map((group) => (
              <div key={group.id} className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <GripVertical size={16} className="text-slate-300 shrink-0" />
                <input
                  type="text"
                  value={group.title}
                  onChange={(e) => {
                    const newGroups = (footer.groups || []).map(g => g.id === group.id ? { ...g, title: e.target.value } : g);
                    setFooter(p => ({ ...p, groups: newGroups }));
                  }}
                  placeholder="Başlık Adı"
                  className="flex-1 h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-800 focus:ring-2 focus:ring-sky-300 outline-none"
                />
                <span className="text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded shrink-0">id: {group.id}</span>
                <button type="button" onClick={() => removeGroup(group.id)}
                  className="w-9 h-9 flex shrink-0 items-center justify-center bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Link Yönetimi */}
        <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-7">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-extrabold text-slate-800">Sütun Linkleri</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Hangi linkin hangi sütun başlığı altında görüneceğini belirleyin.</p>
            </div>
            <button type="button" onClick={addLink}
              className="flex items-center gap-2 bg-sky-50 text-sky-600 px-3 py-2 rounded-lg text-sm font-bold hover:bg-sky-100 transition-colors"
            >
              <Plus size={15} /> Link Ekle
            </button>
          </div>
          <div className="space-y-3">
            {(footer.quickLinks || []).map((link, idx) => (
              <div key={idx} className="flex flex-col sm:flex-row gap-3 items-center bg-slate-50 p-3 rounded-xl border border-slate-200">
                <input type="text" placeholder="Link Metni (Örn: Hakkımızda)" value={link.label}
                  onChange={(e) => {
                    const newLinks = [...(footer.quickLinks || [])];
                    newLinks[idx] = { ...newLinks[idx], label: e.target.value };
                    setFooter(p => ({ ...p, quickLinks: newLinks }));
                  }}
                  className="w-full sm:w-1/4 h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-sky-300 outline-none"
                />
                <input type="text" placeholder="URL (Örn: /hakkimizda)" value={link.href}
                  onChange={(e) => {
                    const newLinks = [...(footer.quickLinks || [])];
                    newLinks[idx] = { ...newLinks[idx], href: e.target.value };
                    setFooter(p => ({ ...p, quickLinks: newLinks }));
                  }}
                  className="flex-1 w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-sky-300 outline-none font-mono"
                />
                <select value={link.groupId}
                  onChange={(e) => {
                    const newLinks = [...(footer.quickLinks || [])];
                    newLinks[idx] = { ...newLinks[idx], groupId: e.target.value };
                    setFooter(p => ({ ...p, quickLinks: newLinks }));
                  }}
                  className="w-full sm:w-[180px] h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:ring-2 focus:ring-sky-300 outline-none"
                >
                  {(footer.groups || []).map(g => <option key={g.id} value={g.id}>{g.title}</option>)}
                </select>
                <button type="button"
                  onClick={() => {
                    const newLinks = [...(footer.quickLinks || [])];
                    newLinks.splice(idx, 1);
                    setFooter(p => ({ ...p, quickLinks: newLinks }));
                  }}
                  className="w-10 h-10 flex shrink-0 items-center justify-center bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
            {(!footer.quickLinks || footer.quickLinks.length === 0) && (
              <div className="text-center py-6 text-slate-400 text-sm font-medium border border-dashed border-slate-200 rounded-xl">
                Herhangi bir link eklenmemiş.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
