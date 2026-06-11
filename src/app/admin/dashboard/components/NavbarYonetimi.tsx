"use client";

import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, Check, LayoutPanelTop, Phone, Plus, Trash2, ExternalLink } from 'lucide-react';
import { useSettings, defaultSettings } from '@/contexts/SettingsContext';
import FontSizeInput from './FontSizeInput';

const FONT_OPTIONS = ['Var', 'Manrope', 'Inter', 'Roboto', 'Playfair Display', 'Outfit', 'Montserrat', 'Poppins'];

const CATEGORY_TEMPLATE = {
  image: '',
  title: '',
  shortDesc: 'Kurumsal ve mimari projeler için özel üretim sistemler.',
  fullDesc: 'Detaylı açıklama buraya gelecek.',
  ctaTitle: 'Projeniz İçin Özel Fiyat Alın',
  ctaDesc: 'Uzman ekibimiz en uygun çözümü sizin için planlasın.'
};

export default function NavbarYonetimi() {
  const { settings, loading } = useSettings();
  const [saving, setSaving] = useState(false);
  const [savingCats, setSavingCats] = useState(false);
  const [navbar, setNavbar] = useState(settings?.navbar || defaultSettings.navbar);
  const [cards, setCards] = useState(settings?.homeCategories?.cards || defaultSettings.homeCategories.cards);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [addingCat, setAddingCat] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'site'), { navbar }, { merge: true });
      alert('Navbar ayarları başarıyla kaydedildi!');
    } catch {
      alert('Kaydedilirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCatName.trim() || !newCatSlug.trim()) {
      alert('Kategori adı ve URL (slug) alanlarını doldurun.');
      return;
    }
    const slug = newCatSlug.trim().toLowerCase().replace(/\s+/g, '-');
    setAddingCat(true);
    try {
      // 1) homeCategories.cards listesine ekle
      const newCards = [...cards, { slug, title: newCatName.trim(), icon: 'Layers', image: '' }];
      await setDoc(doc(db, 'settings', 'site'), {
        homeCategories: { ...settings.homeCategories, cards: newCards }
      }, { merge: true });

      // 2) categories_content'e şablon dokümanı oluştur
      await setDoc(doc(db, 'categories_content', slug), {
        ...CATEGORY_TEMPLATE,
        title: newCatName.trim()
      }, { merge: true });

      setCards(newCards);
      setNewCatName('');
      setNewCatSlug('');
      alert(`"${newCatName}" kategorisi eklendi! "Kategori İçerikleri" sekmesinden düzenleyebilirsiniz.`);
    } catch (e) {
      console.error(e);
      alert('Kategori eklenirken bir hata oluştu.');
    } finally {
      setAddingCat(false);
    }
  };

  const handleRemoveCategory = async (slug: string) => {
    if (!confirm(`"${slug}" kategorisini kaldırmak istediğinize emin misiniz?`)) return;
    const newCards = cards.filter(c => c.slug !== slug);
    setSavingCats(true);
    try {
      await setDoc(doc(db, 'settings', 'site'), {
        homeCategories: { ...settings.homeCategories, cards: newCards }
      }, { merge: true });
      setCards(newCards);
    } catch {
      alert('Kategori kaldırılırken hata oluştu.');
    } finally {
      setSavingCats(false);
    }
  };

  if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin inline-block" /> Yükleniyor...</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold mb-1 tracking-tight">Üst Menü (Navbar) Yönetimi</h2>
          <p className="text-slate-500 font-medium">Telefon butonu ayarları ve navbar kategori listesini buradan yönetin.</p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-zinc-900 hover:bg-zinc-800 disabled:bg-slate-400 text-white px-5 py-3 rounded-xl font-bold transition-all shadow">
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />} Değişiklikleri Kaydet
        </button>
      </div>

      <div className="max-w-4xl space-y-6">

        {/* Telefon Butonu */}
        <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-7">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center"><LayoutPanelTop size={20} /></div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-800">Sağdaki Telefon Butonu</h3>
              <p className="text-xs text-slate-500 font-medium">Sitenin sağ üst köşesinde sürekli görünen &quot;Keşif İçin Ara&quot; butonu</p>
            </div>
          </div>

          <div className="space-y-5">
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <label className="block text-sm font-bold text-slate-700 mb-1">Buton Üst Yazısı</label>
              <p className="text-xs text-slate-500 mb-3 font-medium">Telefon numarasının üzerindeki küçük açıklama metni</p>
              <input type="text" value={navbar.ctaText}
                onChange={(e) => setNavbar(p => ({ ...p, ctaText: e.target.value }))}
                placeholder="Keşif İçin Ara"
                className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-blue-300 outline-none"
              />
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <label className="block text-sm font-bold text-slate-700 mb-1 flex items-center gap-2">
                <Phone size={14} /> Telefon Numarası
              </label>
              <p className="text-xs text-slate-500 mb-3 font-medium">
                Format: <span className="font-mono font-bold text-blue-600">0555 555 55 55</span> &nbsp;•&nbsp; &quot;tel:&quot; yazmayın, sistem ekler
              </p>
              <input type="text" value={navbar.ctaPhone}
                onChange={(e) => setNavbar(p => ({ ...p, ctaPhone: e.target.value }))}
                placeholder="0533 691 05 84"
                className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-blue-300 outline-none font-mono tracking-wide"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <label className="block text-sm font-bold text-slate-700 mb-3">Arka Plan Rengi</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={navbar.ctaColor}
                    onChange={(e) => setNavbar(p => ({ ...p, ctaColor: e.target.value }))}
                    className="w-14 h-12 rounded-xl cursor-pointer border-0 p-0.5" />
                  <input type="text" value={navbar.ctaColor}
                    onChange={(e) => setNavbar(p => ({ ...p, ctaColor: e.target.value }))}
                    className="flex-1 h-12 px-4 bg-white border border-slate-200 rounded-xl font-mono font-semibold text-slate-800 focus:ring-2 focus:ring-blue-300 outline-none uppercase" />
                </div>
              </div>
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <label className="block text-sm font-bold text-slate-700 mb-3">Yazı / İkon Rengi</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={navbar.ctaTextColor || '#ffffff'}
                    onChange={(e) => setNavbar(p => ({ ...p, ctaTextColor: e.target.value }))}
                    className="w-14 h-12 rounded-xl cursor-pointer border-0 p-0.5" />
                  <input type="text" value={navbar.ctaTextColor || '#ffffff'}
                    onChange={(e) => setNavbar(p => ({ ...p, ctaTextColor: e.target.value }))}
                    className="flex-1 h-12 px-4 bg-white border border-slate-200 rounded-xl font-mono font-semibold text-slate-800 focus:ring-2 focus:ring-blue-300 outline-none uppercase" />
                </div>
              </div>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <label className="block text-sm font-bold text-slate-700 mb-3">Buton Fontu</label>
              <select value={navbar.ctaFont}
                onChange={(e) => setNavbar(p => ({ ...p, ctaFont: e.target.value }))}
                className="w-full md:w-1/2 h-12 px-4 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-blue-300/30 outline-none">
                {FONT_OPTIONS.map(f => <option key={f} value={f}>{f === 'Var' ? 'Genel Fontu Kullan' : f}</option>)}
              </select>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <FontSizeInput
                label="Telefon Butonu Yazı Boyutu"
                desktopValue={navbar.ctaPhoneSizeDesktop || ''}
                mobileValue={navbar.ctaPhoneSizeMobile || ''}
                onDesktopChange={(v) => setNavbar(p => ({ ...p, ctaPhoneSizeDesktop: v }))}
                onMobileChange={(v) => setNavbar(p => ({ ...p, ctaPhoneSizeMobile: v }))}
                desktopPlaceholder="Örn: 13px"
                mobilePlaceholder="Örn: 15px"
              />
            </div>

            {/* Önizleme */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
              <label className="block text-sm font-bold text-slate-700 mb-3">Canlı Önizleme</label>
              <div className="inline-flex items-center rounded-[12px] pl-2 pr-4 py-2 shadow-md border"
                style={{ backgroundColor: navbar.ctaColor, borderColor: navbar.ctaColor }}>
                <div className="w-7 h-7 rounded-[8px] bg-white flex items-center justify-center mr-2.5 shadow-sm" style={{ color: navbar.ctaColor }}>
                  <Phone size={13} className="fill-current" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest leading-none mb-1" style={{ color: navbar.ctaTextColor || '#fff', fontFamily: navbar.ctaFont !== 'Var' ? navbar.ctaFont : undefined }}>
                    {navbar.ctaText || 'Keşif İçin Ara'}
                  </span>
                  <span className="text-[13px] font-extrabold tracking-wide leading-none" style={{ color: navbar.ctaTextColor || '#fff', fontFamily: navbar.ctaFont !== 'Var' ? navbar.ctaFont : undefined }}>
                    {navbar.ctaPhone || '0533 691 05 84'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navbar Kategorileri */}
        <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm p-7">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center">
              <ExternalLink size={20} />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-800">Navbar Kategori Linkleri</h3>
              <p className="text-xs text-slate-500 font-medium mt-0.5 mb-4">Sitenin üst menüsünde görünen kategori linkleri. İçerikleri için &quot;Kategori İçerikleri&quot; sekmesini kullanın.</p>
              
              <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50 mb-6 space-y-4">
                <h4 className="font-bold text-sm text-indigo-900 border-b border-indigo-100/50 pb-2">Ana Kategori Linkleri (Merkez)</h4>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Kategori Menüsü Fontu</label>
                  <select value={navbar.navFont || 'Var'}
                    onChange={(e) => setNavbar(p => ({ ...p, navFont: e.target.value }))}
                    className="w-full md:w-1/2 h-10 px-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-300 outline-none">
                    {FONT_OPTIONS.map(f => <option key={f} value={f}>{f === 'Var' ? 'Genel Fontu Kullan' : f}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Kategori Menüsü Rengi</label>
                  <div className="flex items-center gap-3">
                    <input type="color" value={navbar.navTextColor || '#1e293b'}
                      onChange={(e) => setNavbar(p => ({ ...p, navTextColor: e.target.value }))}
                      className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0.5" />
                    <input type="text" value={navbar.navTextColor || '#1e293b'}
                      onChange={(e) => setNavbar(p => ({ ...p, navTextColor: e.target.value }))}
                      className="w-32 h-10 px-3 bg-white border border-slate-200 rounded-xl font-mono text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-300 outline-none uppercase" />
                  </div>
                </div>

                <FontSizeInput
                  label="Kategori Linkleri Yazı Boyutu"
                  desktopValue={navbar.navLinkSizeDesktop || ''}
                  mobileValue={navbar.navLinkSizeMobile || ''}
                  onDesktopChange={(v) => setNavbar(p => ({ ...p, navLinkSizeDesktop: v }))}
                  onMobileChange={(v) => setNavbar(p => ({ ...p, navLinkSizeMobile: v }))}
                  desktopPlaceholder="Örn: 12px"
                  mobilePlaceholder="Örn: 13px"
                />

                <div className="mt-8 pt-4 border-t border-indigo-200/50">
                  <h4 className="font-bold text-sm text-indigo-900 border-b border-indigo-100/50 pb-2 mb-4">Sağ Kurumsal Linkler (Hakkımızda, Blog, İletişim)</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Kurumsal Link Fontu</label>
                      <select value={navbar.corpLinkFont || 'Var'}
                        onChange={(e) => setNavbar(p => ({ ...p, corpLinkFont: e.target.value }))}
                        className="w-full md:w-1/2 h-10 px-3 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-indigo-300 outline-none">
                        {FONT_OPTIONS.map(f => <option key={f} value={f}>{f === 'Var' ? 'Genel Fontu Kullan' : f}</option>)}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Kurumsal Link Rengi</label>
                      <div className="flex items-center gap-3">
                        <input type="color" value={navbar.corpLinkTextColor || '#94a3b8'}
                          onChange={(e) => setNavbar(p => ({ ...p, corpLinkTextColor: e.target.value }))}
                          className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0.5" />
                        <input type="text" value={navbar.corpLinkTextColor || '#94a3b8'}
                          onChange={(e) => setNavbar(p => ({ ...p, corpLinkTextColor: e.target.value }))}
                          className="w-32 h-10 px-3 bg-white border border-slate-200 rounded-xl font-mono text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-300 outline-none uppercase" />
                      </div>
                    </div>

                    <FontSizeInput
                      label="Kurumsal Link Yazı Boyutu"
                      desktopValue={navbar.corpLinkSizeDesktop || ''}
                      mobileValue={navbar.corpLinkSizeMobile || ''}
                      onDesktopChange={(v) => setNavbar(p => ({ ...p, corpLinkSizeDesktop: v }))}
                      onMobileChange={(v) => setNavbar(p => ({ ...p, corpLinkSizeMobile: v }))}
                      desktopPlaceholder="Örn: 10px"
                      mobilePlaceholder="Örn: 11px"
                    />
                  </div>
                </div>

                {/* Arama Ayarları */}
                <div className="mt-8 pt-4 border-t border-indigo-200/50">
                  <h4 className="font-bold text-sm text-indigo-900 border-b border-indigo-100/50 pb-2 mb-4">Site İçi Arama Butonu</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Arama İkonu Rengi</label>
                      <div className="flex items-center gap-3">
                        <input type="color" value={navbar.searchIconColor || '#475569'}
                          onChange={(e) => setNavbar(p => ({ ...p, searchIconColor: e.target.value }))}
                          className="w-10 h-10 rounded-xl cursor-pointer border-0 p-0.5" />
                        <input type="text" value={navbar.searchIconColor || '#475569'}
                          onChange={(e) => setNavbar(p => ({ ...p, searchIconColor: e.target.value }))}
                          className="w-32 h-10 px-3 bg-white border border-slate-200 rounded-xl font-mono text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-300 outline-none uppercase" />
                      </div>
                    </div>

                    <FontSizeInput
                      label="Arama İkonu Boyutu"
                      desktopValue={navbar.searchIconSizeDesktop || '14px'}
                      mobileValue={navbar.searchIconSizeMobile || '24px'}
                      onDesktopChange={(v) => setNavbar(p => ({ ...p, searchIconSizeDesktop: v }))}
                      onMobileChange={(v) => setNavbar(p => ({ ...p, searchIconSizeMobile: v }))}
                      desktopPlaceholder="Örn: 14px"
                      mobilePlaceholder="Örn: 24px"
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Mevcut Kategoriler */}
          <div className="space-y-3 mb-6">
            {cards.map((cat, idx) => (
              <div key={cat.slug} className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-[11px] font-extrabold shrink-0">{idx + 1}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 truncate">{cat.title}</p>
                  <p className="text-[11px] text-slate-400 font-mono">/{cat.slug}</p>
                </div>
                <a href={`/${cat.slug}`} target="_blank"
                  className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors shrink-0">
                  <ExternalLink size={13} />
                </a>
                <button onClick={() => handleRemoveCategory(cat.slug)} disabled={savingCats}
                  className="w-8 h-8 flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-100 rounded-lg transition-colors shrink-0">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
            {cards.length === 0 && (
              <div className="text-center py-6 text-slate-400 text-sm font-medium border border-dashed border-slate-200 rounded-xl">Henüz kategori eklenmemiş.</div>
            )}
          </div>

          {/* Yeni Kategori Ekle */}
          <div className="bg-indigo-50 p-5 rounded-2xl border border-indigo-100">
            <h4 className="text-sm font-extrabold text-indigo-800 mb-4 flex items-center gap-2"><Plus size={15} /> Yeni Kategori Ekle</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Kategori Adı</label>
                <input type="text" value={newCatName} onChange={(e) => setNewCatName(e.target.value)}
                  placeholder="Örn: Rulo Perde"
                  className="w-full h-11 px-3 bg-white border border-indigo-200 rounded-xl text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-300 outline-none" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">URL Adresi (slug)</label>
                <input type="text" value={newCatSlug} onChange={(e) => setNewCatSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                  placeholder="rulo-perde"
                  className="w-full h-11 px-3 bg-white border border-indigo-200 rounded-xl text-sm font-mono text-slate-800 focus:ring-2 focus:ring-indigo-300 outline-none" />
                {newCatSlug && <p className="text-[10px] text-indigo-500 mt-1 font-medium">/<strong>{newCatSlug}</strong></p>}
              </div>
            </div>
            <div className="bg-white/70 border border-indigo-100 rounded-xl p-3 mb-4 text-xs text-indigo-700 font-medium">
              ℹ Ekle butonuna tıkladığınızda: Kategoriler bölümüne ve navbar&apos;a eklenir, &quot;Kategori İçerikleri&quot; sekmesinde otomatik şablon oluşur.
            </div>
            <button onClick={handleAddCategory} disabled={addingCat || !newCatName.trim() || !newCatSlug.trim()}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-5 py-3 rounded-xl font-bold text-sm transition-all">
              {addingCat ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              {addingCat ? 'Ekleniyor...' : 'Kategoriyi Ekle'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
