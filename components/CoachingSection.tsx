
import React from 'react';
import { IndustryData, Status } from '../types';
import { getSmartAdvice } from '../services/gemini';
import { Sparkles, BrainCircuit, ShieldCheck, Search, Calendar, Activity, Trash2, Download, XCircle, AlertCircle, MoreVertical, Image as ImageIcon, History } from 'lucide-react';

interface CoachingSectionProps {
  industries: IndustryData[];
  onDeleteRecord: (industryId: string, recordId: string) => void;
}

const CoachingSection: React.FC<CoachingSectionProps> = ({ industries, onDeleteRecord }) => {
  const [selectedRecord, setSelectedRecord] = React.useState<{ ind: IndustryData; note: string } | null>(null);
  const [advice, setAdvice] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [startDate, setStartDate] = React.useState('');
  const [endDate, setEndDate] = React.useState('');
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);
  
  // Compliance Filters
  const [filterTenaga, setFilterTenaga] = React.useState<Status | 'All'>('All');
  const [filterRPBBI, setFilterRPBBI] = React.useState<Status | 'All'>('All');

  const handleGetAdvice = async (ind: IndustryData) => {
    setSelectedRecord({ ind, note: 'Analisis Progres Cerdas' });
    setLoading(true);
    setAdvice(null);
    const res = await getSmartAdvice(ind);
    setAdvice(res);
    setLoading(false);
    setOpenMenuId(null);
  };

  // Flattening all coaching records from all industries into a single chronological list
  const allCoachingHistory = industries.flatMap(ind => 
    (ind.riwayatPembinaan || []).map(record => ({
      ...record,
      industry: ind 
    }))
  ).sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());

  const filteredHistory = allCoachingHistory.filter(item => {
    const matchesSearch = 
      item.industry.namaPerusahaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.catatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.industry.kabupaten.toLowerCase().includes(searchTerm.toLowerCase());

    const itemDate = new Date(item.tanggal);
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    if (start) start.setHours(0, 0, 0, 0);
    if (end) end.setHours(23, 59, 59, 999);

    const matchesDate = (!start || itemDate >= start) && (!end || itemDate <= end);
    const matchesTenaga = filterTenaga === 'All' || item.industry.compliance.tenagaTeknis === filterTenaga;
    const matchesRPBBI = filterRPBBI === 'All' || item.industry.compliance.hakAksesRPBBI === filterRPBBI;

    return matchesSearch && matchesDate && matchesTenaga && matchesRPBBI;
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleExport = () => {
    if (filteredHistory.length === 0) {
      alert('Tidak ada data untuk diekspor.');
      return;
    }

    const headers = ['Tanggal', 'Industri', 'Kabupaten', 'Kondisi', 'Kendala', 'Catatan Pembinaan'];
    const csvRows = [
      headers.join(','),
      ...filteredHistory.map(item => [
        `"${item.tanggal}"`,
        `"${item.industry.namaPerusahaan}"`,
        `"${item.industry.kabupaten}"`,
        `"${item.kondisi || ''}"`,
        `"${(item.kendala || '').replace(/"/g, '""')}"`,
        `"${(item.catatan || '').replace(/"/g, '""')}"`
      ].join(','))
    ];

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `rekap-pembinaan-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative -m-4 md:-m-8 min-h-screen p-4 md:p-8 overflow-hidden">
      {/* Background Image - Beautiful Misty Forest */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=2074&auto=format&fit=crop")',
          filter: 'brightness(0.6)'
        }}
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 z-0 bg-emerald-950/20 backdrop-blur-[2px]" />

      <div className="relative z-10 space-y-6 max-w-[1600px] mx-auto pb-10">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-2">
          <div className="flex items-center gap-4 bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/30 shadow-xl">
            <History className="w-7 h-7 text-white" />
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-wider drop-shadow-md">Log Pembinaan Kronologis</h2>
              <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest opacity-80">Cabang Dinas Kehutanan Wilayah Pacitan</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-white/90 backdrop-blur-md text-emerald-900 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg border border-white/50">
              Total {filteredHistory.length} Kejadian Terdata
            </div>
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/30 active:scale-95"
            >
              <Download className="w-4 h-4" /> Export CSV
            </button>
          </div>
        </div>

        {/* Filter Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 bg-white/90 backdrop-blur-lg p-6 rounded-[2.5rem] shadow-2xl border border-white/50">
          <div className="lg:col-span-2 relative">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Cari Industri / Nama Perusahaan</label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text"
                placeholder="Misal: Linggarjati Mahardika..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Dari Tanggal</label>
            <input 
              type="date"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Sampai Tanggal</label>
            <input 
              type="date"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>

        {/* Chronological Table */}
        <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="px-8 py-6 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Waktu Kunjungan</th>
                  <th className="px-8 py-6 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Industri & Wilayah</th>
                  <th className="px-8 py-6 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Progres & Kendala</th>
                  <th className="px-8 py-6 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Arahan Petugas CDK</th>
                  <th className="px-8 py-6 text-xs font-black text-slate-500 uppercase tracking-[0.2em] text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredHistory.map((item) => {
                  const uniqueId = `${item.industry.id}-${item.id}`;
                  return (
                    <tr key={uniqueId} className="hover:bg-emerald-50/40 transition-all group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3 text-sm font-black text-emerald-700 bg-emerald-50 px-4 py-2 rounded-2xl w-fit border border-emerald-100 shadow-sm">
                          <Calendar className="w-4 h-4" />
                          {formatDate(item.tanggal)}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center font-black text-slate-400 text-xs shadow-sm">
                            {item.industry.namaPerusahaan.charAt(0)}
                          </div>
                          <div>
                            <p className="font-black text-slate-800 tracking-tight group-hover:text-emerald-700 transition-colors leading-none mb-1">{item.industry.namaPerusahaan}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{item.industry.kabupaten}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="space-y-2">
                           <div className="flex items-center gap-1.5 text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100 w-fit">
                              <Activity className="w-3 h-3" /> {item.kondisi || 'Aktif'}
                           </div>
                           {item.kendala && item.kendala !== '-' ? (
                              <div className="flex items-start gap-1.5 text-[10px] font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-100 max-w-[200px]">
                                 <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                 <span className="line-clamp-2">{item.kendala}</span>
                              </div>
                           ) : (
                              <p className="text-[10px] text-slate-300 italic ml-1">Tanpa kendala</p>
                           )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="max-w-[400px] bg-white/50 p-4 rounded-[1.5rem] border border-slate-100 shadow-sm group-hover:border-emerald-200 transition-all">
                          <p className="text-xs text-slate-700 leading-relaxed font-medium italic">"{item.catatan}"</p>
                          {item.images && item.images.length > 0 && (
                            <div className="flex items-center gap-1.5 mt-2.5 text-[9px] font-black text-emerald-600 uppercase tracking-tighter">
                               <ImageIcon className="w-3.5 h-3.5" /> {item.images.length} Lampiran Dokumentasi Foto
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center relative">
                        <div className="flex justify-center">
                          <button 
                            onClick={() => setOpenMenuId(openMenuId === uniqueId ? null : uniqueId)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                              openMenuId === uniqueId 
                              ? 'bg-slate-800 text-white border-slate-800 shadow-lg' 
                              : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-500 hover:text-emerald-600 shadow-sm'
                            }`}
                          >
                            Kelola
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </div>

                        {openMenuId === uniqueId && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                            <div className="absolute right-1/2 translate-x-1/2 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 z-20 py-2 animate-in fade-in zoom-in-95 duration-100 origin-top">
                              <button 
                                onClick={() => handleGetAdvice(item.industry)}
                                className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-emerald-700 hover:bg-emerald-50 transition-colors"
                              >
                                <BrainCircuit className="w-4 h-4" /> Analisis AI
                              </button>
                              <div className="h-px bg-slate-100 my-1 mx-2" />
                              <button 
                                onClick={() => {
                                  onDeleteRecord(item.industry.id, item.id);
                                  setOpenMenuId(null);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-rose-600 hover:bg-rose-50 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" /> Hapus Log
                              </button>
                            </div>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filteredHistory.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-8 py-32 text-center">
                      <div className="flex flex-col items-center opacity-30">
                        <ShieldCheck className="w-16 h-16 mb-4 text-slate-400" />
                        <p className="text-slate-500 font-black uppercase tracking-widest italic">Belum ada riwayat pembinaan tercatat</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* AI Advice Panel */}
      {selectedRecord && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-slate-900 w-full max-w-4xl rounded-[2.5rem] shadow-2xl border border-emerald-500/30 overflow-hidden relative animate-in zoom-in-95 duration-500">
            <div className="absolute top-0 right-0 p-8">
              <button onClick={() => setSelectedRecord(null)} className="text-slate-400 hover:text-white font-black p-2 bg-white/5 rounded-xl transition-all">
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-10 space-y-8">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-[1.5rem] flex items-center justify-center border border-emerald-500/20 shadow-inner">
                  <BrainCircuit className="w-10 h-10" />
                </div>
                <div>
                  <h4 className="text-3xl font-black text-white tracking-tight">{selectedRecord.ind.namaPerusahaan}</h4>
                  <p className="text-emerald-400 font-bold text-xs uppercase tracking-widest mt-1">Rekomendasi Strategis AI • Berdasarkan Data Kronologis</p>
                </div>
              </div>

              <div className={`p-8 bg-emerald-950/40 text-emerald-50 rounded-[2rem] border border-emerald-500/20 backdrop-blur-sm min-h-[300px] ${loading ? 'flex items-center justify-center' : ''}`}>
                {loading ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent animate-spin rounded-full" />
                    <span className="font-black text-[10px] uppercase tracking-[0.2em] text-emerald-300">Gemini sedang menganalisis seluruh riwayat...</span>
                  </div>
                ) : advice ? (
                  <div className="prose prose-invert prose-emerald max-w-none">
                    {advice.split('\n').map((line, idx) => (
                      <p key={idx} className="mb-4 text-slate-200 leading-loose flex gap-4 text-sm font-medium">
                        <span className="text-emerald-500 font-black mt-1">/</span>
                        {line}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-slate-500 italic">Gagal memuat rekomendasi cerdas.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoachingSection;
