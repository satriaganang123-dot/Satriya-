
import React from 'react';
import { IndustryData, Kabupaten, Skala } from '../types';
import { Search, Filter, Download, ChevronRight, Table as TableIcon, Trash2, Eraser, AlertTriangle } from 'lucide-react';

interface MonitoringTableProps {
  data: IndustryData[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onBulkDeleteRevoked: () => void;
}

const MonitoringTable: React.FC<MonitoringTableProps> = ({ data, onSelect, onDelete, onBulkDeleteRevoked }) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterKab, setFilterKab] = React.useState<Kabupaten | 'All'>('All');
  const [filterSkala, setFilterSkala] = React.useState<Skala | 'All'>('All');

  const revokedCount = data.filter(item => item.kondisiSaatIni !== 'Aktif').length;

  const filtered = data.filter(item => {
    const matchesSearch = 
      item.namaPerusahaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.namaPemilik.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.userIdRPBBI.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesKab = filterKab === 'All' || item.kabupaten === filterKab;
    const matchesSkala = filterSkala === 'All' || item.mesin.skala === filterSkala;
    return matchesSearch && matchesKab && matchesSkala;
  });

  // Fungsi hapus sekarang langsung mengeksekusi tanpa konfirmasi sesuai permintaan terbaru
  const handleDeleteClick = (id: string) => {
    onDelete(id);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Konfirmasi: Bersihkan ${revokedCount} data industri dengan status Tidak Aktif/Dicabut secara otomatis?`)) {
      onBulkDeleteRevoked();
    }
  };

  return (
    <div className="relative -m-4 md:-m-8 min-h-screen p-4 md:p-8 overflow-hidden">
      {/* Background Image - Hutan Pinus */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=2041&auto=format&fit=crop")',
          filter: 'brightness(0.7)'
        }}
      />
      
      <div className="absolute inset-0 z-0 bg-slate-900/10 backdrop-blur-[1px]" />

      <div className="relative z-10 space-y-6 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-2">
          <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/30">
            <TableIcon className="w-6 h-6 text-white" />
            <h2 className="text-xl font-black text-white uppercase tracking-wider drop-shadow-md">Database Monitoring Industri</h2>
          </div>
          <div className="flex items-center gap-3">
             {revokedCount > 0 && (
               <button 
                 onClick={handleBulkDelete}
                 className="flex items-center gap-2 px-4 py-2 bg-rose-600/90 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg hover:bg-rose-700 transition-all border border-rose-400/50"
               >
                 <Eraser className="w-4 h-4" /> Bersihkan {revokedCount} Data Dicabut
               </button>
             )}
             <div className="bg-emerald-500/90 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg border border-emerald-400/50">
               Total {filtered.length} Aktif
             </div>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white/90 backdrop-blur-lg p-5 rounded-[2rem] shadow-2xl border border-white/50">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text"
              placeholder="Cari nama perusahaan, pemilik, atau ID RPBBI..."
              className="w-full pl-12 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium text-slate-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl">
              <Filter className="w-4 h-4 text-slate-500" />
              <select 
                className="bg-transparent text-sm focus:outline-none font-bold text-slate-600 cursor-pointer"
                value={filterKab}
                onChange={(e) => setFilterKab(e.target.value as any)}
              >
                <option value="All">Semua Kabupaten</option>
                <option value="Pacitan">Pacitan</option>
                <option value="Ponorogo">Ponorogo</option>
              </select>
            </div>

            <div className="flex items-center gap-2 px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl">
              <select 
                className="bg-transparent text-sm focus:outline-none font-bold text-slate-600 cursor-pointer"
                value={filterSkala}
                onChange={(e) => setFilterSkala(e.target.value as any)}
              >
                <option value="All">Semua Skala</option>
                <option value="Kecil">Kecil</option>
                <option value="Menengah">Menengah</option>
                <option value="Besar">Besar</option>
              </select>
            </div>

            <button className="p-3 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 active:scale-95">
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/50 overflow-hidden mb-10">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="px-6 py-6 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Industri & RPBBI</th>
                  <th className="px-6 py-6 text-xs font-black text-slate-500 uppercase tracking-[0.2em]">Status Legalitas</th>
                  <th className="px-6 py-6 text-xs font-black text-slate-500 uppercase tracking-[0.2em] text-center">Aksi</th>
                  <th className="px-6 py-6 text-xs font-black text-rose-500 uppercase tracking-[0.2em] text-center bg-rose-50/30">Hapus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((row) => (
                  <tr key={row.id} className="hover:bg-emerald-50/40 transition-all group cursor-default">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shadow-sm transition-transform group-hover:scale-110 ${
                          row.kabupaten === 'Pacitan' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
                        }`}>
                          {row.namaPerusahaan.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-black text-slate-800 tracking-tight group-hover:text-emerald-700 transition-colors line-clamp-1">{row.namaPerusahaan}</p>
                            <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${row.kondisiSaatIni === 'Aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700 animate-pulse'}`}>
                              {row.kondisiSaatIni}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-0.5 tracking-widest">{row.kecamatan}, {row.kabupaten} • {row.userIdRPBBI}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-2">
                         <StatusBadge status={row.compliance.rkophh} label="RKOPHH" />
                         <StatusBadge status={row.compliance.hakAksesRPBBI} label="RPBBI" />
                         <span className="px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-tighter bg-slate-100 text-slate-500 border border-slate-200">{row.mesin.skala}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button 
                        onClick={() => onSelect(row.id)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm active:scale-95"
                      >
                        Monitoring <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="px-6 py-5 text-center bg-rose-50/10">
                      <button 
                        onClick={() => handleDeleteClick(row.id)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-rose-200 text-rose-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all shadow-md active:scale-90 group/del"
                        title="Hapus Data Industri Otomatis"
                      >
                        <Trash2 className="w-4 h-4" /> HAPUS
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-2 opacity-30">
                        <AlertTriangle className="w-12 h-12 text-slate-400" />
                        <p className="text-slate-500 font-black uppercase tracking-widest italic">Data tidak ditemukan</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status, label }: { status: string, label: string }) => (
  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-tighter border transition-all ${
    status === 'Sudah' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-rose-50 border-rose-100 text-rose-700'
  }`}>
    {label}: {status}
  </span>
);

export default MonitoringTable;
