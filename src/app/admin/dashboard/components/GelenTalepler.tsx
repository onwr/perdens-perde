"use client";

import { useEffect, useState } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, Check, X, Calendar, Phone, MapPin, Info, FileText, Image as ImageIcon, Trash2 } from 'lucide-react';

interface FileData {
  name: string;
  url: string;
  type: string;
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  location: string;
  details: string;
  files?: FileData[];
  createdAt: any;
  type?: string;     // 'Ücretsiz Keşif' or 'Fiyat Teklifi' or undefined (for old records)
  orderNo?: string;
  status?: string;   // 'Bekliyor', 'Onaylandı', 'Reddedildi'
  productCategory?: string;
  productQuantity?: string;
}

type FilterType = 'Tümü' | 'Keşif Talebi' | 'Fiyat Teklifi';

export default function GelenTalepler() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<FilterType>('Tümü');

  useEffect(() => {
    const q = query(collection(db, 'kesif_talepleri'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const leadsData: Lead[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        leadsData.push({ id: doc.id, ...data } as Lead);
      });
      setLeads(leadsData);
      setLoading(false);
    }, (error) => {
      console.error("Firebase dinleme hatası:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const docRef = doc(db, 'kesif_talepleri', id);
      await updateDoc(docRef, { status: newStatus });
    } catch (e) {
      console.error(e);
      alert('Durum güncellenirken bir hata oluştu.');
    }
  };

  const deleteLead = async (id: string) => {
    if (!confirm('Bu talebi kalıcı olarak silmek istediğinize emin misiniz?')) return;
    try {
      await deleteDoc(doc(db, 'kesif_talepleri', id));
    } catch (e) {
      console.error(e);
      alert('Talep silinirken bir hata oluştu.');
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Tarih Yok';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    }).format(date);
  };

  const filteredLeads = leads.filter(lead => {
    if (filterType === 'Tümü') return true;
    const leadType = lead.type === 'Keşif Talebi' ? 'Keşif Talebi' : 'Fiyat Teklifi';
    return leadType === filterType;
  });

  return (
    <>
      <div className="mb-10 block sm:flex items-end justify-between gap-4">
        <div className="mb-6 sm:mb-0">
          <h2 className="text-3xl font-extrabold mb-2 tracking-tight">Talep Listesi</h2>
          <p className="text-slate-500 font-medium">Sistem üzerinden gönderilen tüm müşteri formları ve keşif/teklif istekleri.</p>
        </div>

        <div className="bg-white p-1.5 rounded-2xl border border-slate-200 inline-flex shadow-sm max-w-full overflow-x-auto">
          {(['Tümü', 'Keşif Talebi', 'Fiyat Teklifi'] as FilterType[]).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm tracking-wide transition-all whitespace-nowrap ${filterType === type
                ? 'bg-zinc-900 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 text-slate-400">
          <Loader2 size={40} className="animate-spin mb-4" />
          <p className="font-medium">Talepler Yükleniyor...</p>
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-[24px] p-16 text-center shadow-sm">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText size={32} className="text-slate-300" />
          </div>
          <h3 className="text-xl font-bold text-slate-700 mb-2">{filterType} Bulunamadı</h3>
          <p className="text-slate-500">Bu kategoriye ait gelen herhangi bir müşteri talebi yok.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {filteredLeads.map((lead) => {
            const isKesif = lead.type === 'Keşif Talebi';
            const currentStatus = lead.status || 'Bekliyor';
            const isPending = currentStatus === 'Bekliyor';

            return (
              <div key={lead.id} className="bg-white rounded-[24px] p-6 md:p-8 border border-slate-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group flex flex-col justify-between">
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-[100px] -z-0 opacity-[0.15] pointer-events-none transition-transform duration-500
            ${currentStatus === 'Onaylandı' ? 'bg-emerald-500' : currentStatus === 'Reddedildi' ? 'bg-red-500' : 'bg-orange-500'}
          `}></div>

                <div className="relative z-10 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-5 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest px-3 py-1 bg-slate-100 text-slate-500 rounded-md">
                          {lead.orderNo || 'TLP-ESKİ'}
                        </span>
                        <span className={`text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-md border
                    ${isKesif ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-purple-50 text-purple-600 border-purple-100'}
                  `}>
                          {isKesif ? 'KEŞİF TALEBİ' : 'FİYAT TEKLİFİ'}
                        </span>
                      </div>

                      <h3 className="text-[22px] font-extrabold text-slate-800 mb-1">{lead.name}</h3>
                      <div className="flex items-center gap-2 text-slate-400 text-sm font-semibold">
                        <Calendar size={14} />
                        {formatDate(lead.createdAt)}
                      </div>
                    </div>

                    <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 font-bold text-xs shrink-0 self-start sm:self-auto
                ${currentStatus === 'Onaylandı' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' :
                        currentStatus === 'Reddedildi' ? 'bg-red-50 border-red-200 text-red-700' :
                          'bg-orange-50 border-orange-200 text-orange-700'}
              `}>
                      {currentStatus === 'Onaylandı' && <Check size={16} />}
                      {currentStatus === 'Reddedildi' && <X size={16} />}
                      {currentStatus === 'Bekliyor' && <Loader2 size={16} className="animate-spin" />}
                      {currentStatus}
                    </div>

                  </div>

                  <div className="space-y-5 mb-8">
                    <div className="flex items-start gap-4">
                      <div className="mt-0.5 p-2 bg-slate-50 text-slate-400 rounded-xl shrink-0 border border-slate-100 shadow-sm">
                        <Phone size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Müşteri Telefonu</p>
                        <a href={`tel:${lead.phone}`} className="text-slate-800 font-extrabold text-[15px] hover:text-emerald-600 transition-colors">{lead.phone}</a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="mt-0.5 p-2 bg-slate-50 text-slate-400 rounded-xl shrink-0 border border-slate-100 shadow-sm">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Adres / Konum</p>
                        <p className="text-slate-700 font-medium">{lead.location || 'Adres detayı verilmedi.'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="mt-0.5 p-2 bg-slate-50 text-slate-400 rounded-xl shrink-0 border border-slate-100 shadow-sm">
                        <Info size={18} />
                      </div>
                      <div className="w-full">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Müşteri Notu</p>
                        <div className="text-slate-600 leading-relaxed font-medium text-[14px] bg-slate-50/50 border border-slate-100 p-4 rounded-xl mt-2 w-full whitespace-pre-wrap">
                          {lead.details || 'Bir not yazılmadı.'}
                        </div>
                      </div>
                    </div>

                    {!isKesif && (lead.productCategory || lead.productQuantity) && (
                      <div className="flex flex-col sm:flex-row gap-4 pt-3 border-t border-slate-100 mt-2">
                        <div className="flex-1 bg-blue-50/50 border border-blue-100 rounded-xl p-4">
                          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Seçilen Kategori</p>
                          <p className="font-extrabold text-blue-700">{lead.productCategory || 'Belirtilmedi'}</p>
                        </div>
                        <div className="flex-1 bg-indigo-50/50 border border-indigo-100 rounded-xl p-4">
                          <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1">Tahmini Miktar / m²</p>
                          <p className="font-extrabold text-indigo-700">{lead.productQuantity || '-'}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {lead.files && lead.files.length > 0 && (
                    <div className="mt-6 pt-6 border-t border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Eklenen Fotoğraflar ({lead.files.length})</p>
                      <div className="flex flex-wrap gap-2">
                        {lead.files.map((file, i) => (
                          <a
                            key={i}
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2.5 bg-white hover:bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-xl transition-all shadow-sm hover:shadow text-sm font-bold text-slate-700 group/link"
                          >
                            <ImageIcon size={18} className="text-blue-500 group-hover/link:scale-110 transition-transform" />
                            <span className="truncate max-w-[120px] sm:max-w-[150px]">{file.name}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="w-full mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
                  {isPending ? (
                    <>
                      <button
                        onClick={() => handleStatusChange(lead.id, 'Onaylandı')}
                        className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                      >
                        <Check size={18} /> Talebi Onayla
                      </button>
                      <button
                        onClick={() => handleStatusChange(lead.id, 'Reddedildi')}
                        className="flex-1 bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                      >
                        <X size={18} /> Talebi Reddet
                      </button>
                    </>
                  ) : (
                    <div className="flex-1 text-center py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 font-bold text-sm pointer-events-none">
                      İşlem Tamamlandı
                    </div>
                  )}

                  <button
                    onClick={() => deleteLead(lead.id)}
                    className="px-4 py-3 bg-red-50 hover:bg-red-500 border border-red-100 text-red-500 hover:text-white rounded-xl font-bold flex items-center justify-center transition-all group/del shrink-0"
                    title="Talebi Sil"
                  >
                    <Trash2 size={18} className="group-hover/del:scale-110 transition-transform" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
