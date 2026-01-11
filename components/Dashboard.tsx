
import React from 'react';
import { IndustryData } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Building2, CheckCircle2, AlertCircle, TrendingUp, Sparkles, MapPin } from 'lucide-react';

interface DashboardProps {
  data: IndustryData[];
}

const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const stats = [
    { label: 'Total Industri', value: data.length, icon: Building2, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pacitan', value: data.filter(d => d.kabupaten === 'Pacitan').length, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Ponorogo', value: data.filter(d => d.kabupaten === 'Ponorogo').length, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Patuh RPBBI', value: data.filter(d => d.compliance.hakAksesRPBBI === 'Sudah').length, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
  ];

  const scaleData = [
    { name: 'Kecil', value: data.filter(d => d.mesin.skala === 'Kecil').length },
    { name: 'Menengah', value: data.filter(d => d.mesin.skala === 'Menengah').length },
    { name: 'Besar', value: data.filter(d => d.mesin.skala === 'Besar').length },
  ];

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

  return (
    <div className="relative -m-4 md:-m-8 min-h-screen p-4 md:p-8 overflow-hidden">
      {/* Background Image with Overlay - Updated to a beautiful forest landscape */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1448375231573-fb95b0e9793c?q=80&w=2070&auto=format&fit=crop")',
          filter: 'brightness(0.25)'
        }}
      />
      
      {/* Decorative Blur Effect */}
      <div className="absolute inset-0 z-0 bg-slate-950/70 backdrop-blur-[2px]" />

      <div className="relative z-10 space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-4">
                <div className="bg-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-500/30 animate-pulse">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter drop-shadow-2xl uppercase">
                  SI-MONBIN <span className="text-emerald-400">INDUSTRI</span>
                </h2>
              </div>
              <div className="flex flex-col mt-2">
                <p className="text-slate-100 font-black tracking-[0.2em] uppercase text-xs md:text-sm">
                  Sistem Informasi Monitoring & Pembinaan Industri Hasil Hutan Kayu
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="h-0.5 w-12 bg-emerald-500 rounded-full" />
                  <p className="text-emerald-400 font-bold uppercase text-[10px] md:text-xs tracking-widest">
                    CDK Wilayah Pacitan & Ponorogo • Cabang Dinas Kehutanan
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white/95 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white/20 hover:scale-[1.02] transition-transform duration-300">
              <div className="flex items-center gap-4">
                <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
                  <p className="text-3xl font-black text-slate-800 tracking-tighter">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
          <div className="bg-white/95 backdrop-blur-md p-8 rounded-[2.5rem] shadow-2xl border border-white/20">
            <h3 className="text-xl font-black mb-8 text-slate-800 flex items-center gap-2">
              <div className="w-2 h-8 bg-emerald-500 rounded-full" />
              Distribusi Skala Usaha
            </h3>
            <div className="h-[320px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scaleData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#64748b' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#64748b' }} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    cursor={{ fill: '#f1f5f9' }}
                  />
                  <Bar dataKey="value" radius={[12, 12, 0, 0]} barSize={50}>
                    {scaleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-md p-8 rounded-[2.5rem] shadow-2xl border border-white/20">
            <h3 className="text-xl font-black mb-8 text-slate-800 flex items-center gap-2">
              <div className="w-2 h-8 bg-indigo-500 rounded-full" />
              Kepatuhan Per Wilayah
            </h3>
            <div className="space-y-8">
               {['Pacitan', 'Ponorogo'].map((kab, idx) => {
                 const kabData = data.filter(d => d.kabupaten === kab);
                 const patuh = kabData.filter(d => d.compliance.rkophh === 'Sudah').length;
                 const percent = kabData.length ? Math.round((patuh / kabData.length) * 100) : 0;
                 return (
                   <div key={kab} className="space-y-3">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-sm font-black text-slate-800 uppercase tracking-wide">Kabupaten {kab}</p>
                          <p className="text-xs text-slate-500 font-medium">{kabData.length} Industri Terdata</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-xl font-black ${percent > 70 ? 'text-emerald-600' : 'text-amber-600'}`}>{percent}%</span>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">Kepatuhan RKOPHH</p>
                        </div>
                      </div>
                      <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden shadow-inner p-1">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 shadow-sm ${idx === 0 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                   </div>
                 )
               })}
               <div className="pt-6 mt-6 border-t border-slate-100">
                  <div className="flex items-start gap-4 p-5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-3xl">
                    <div className="bg-amber-100 p-2 rounded-xl">
                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-amber-900 mb-1">Peringatan Kepatuhan</p>
                      <p className="text-xs text-amber-800/80 leading-relaxed font-medium">
                        Ditemukan <span className="font-black underline">{data.filter(d => d.compliance.tenagaTeknis === 'Belum').length}</span> unit industri tanpa GANISPH. Prioritaskan pembinaan lapangan pada sektor ini.
                      </p>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
