
import React, { useState } from 'react';
import { IndustryData, CoachingRecord, Skala } from '../types';
import { Save, X, MessageSquare, History, Camera, Image as ImageIcon, Trash2, ShieldCheck, MapPin, Settings, FilePlus2, AlertCircle, BarChart3, Navigation, Loader2 } from 'lucide-react';

interface IndustryFormProps {
  initialData?: IndustryData;
  onSubmit: (data: IndustryData) => void;
  onCancel: () => void;
}

const IndustryForm: React.FC<IndustryFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const isNew = !initialData;
  const coachingCount = initialData?.riwayatPembinaan?.length || 0;
  
  const [formData, setFormData] = React.useState<IndustryData>(initialData || {
    id: 'IND-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
    badanUsaha: 'UD',
    namaPerusahaan: '',
    jenisIjin: 'PBPHH',
    userIdRPBBI: '',
    namaPemilik: '',
    kabupaten: 'Pacitan',
    kecamatan: '',
    alamatPabrik: '',
    koordinat: undefined,
    perijinan: { noPBPHH: '', tanggal: '', noNIB: '' },
    mesin: { kapasitas: 0, skala: 'Kecil', jenisMesin: 'Bandsaw 36"', jumlah: 1, modalUsaha: 0 },
    bahanBaku: 'Hutan Rakyat',
    compliance: { tenagaTeknis: 'Belum', hakAksesRPBBI: 'Belum', rkophh: 'Belum', dokumenAngkut: 'Belum' },
    kondisiSaatIni: 'Aktif',
    kendala: '-',
    pembinaan: '-',
    tanggalPembinaan: '',
    riwayatPembinaan: []
  });

  const [tempImages, setTempImages] = React.useState<string[]>([]);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof IndustryData] as any),
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      alert("Browser Anda tidak mendukung deteksi lokasi.");
      return;
    }

    setIsDetectingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData(prev => ({
          ...prev,
          koordinat: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
        }));
        setIsDetectingLocation(false);
      },
      (error) => {
        console.error("Gagal mendeteksi lokasi:", error);
        alert("Gagal mendeteksi lokasi. Pastikan izin lokasi diberikan.");
        setIsDetectingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeTempImage = (index: number) => {
    setTempImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleComplianceToggle = (field: keyof IndustryData['compliance']) => {
    setFormData(prev => ({
      ...prev,
      compliance: {
        ...prev.compliance,
        [field]: prev.compliance[field] === 'Sudah' ? 'Belum' : 'Sudah'
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedData = { ...formData };
    
    if (!isNew && formData.tanggalPembinaan && formData.pembinaan !== '-') {
      const newRecord: CoachingRecord = {
        id: Math.random().toString(36).substr(2, 5),
        tanggal: formData.tanggalPembinaan,
        catatan: formData.pembinaan,
        kendala: formData.kendala,
        kondisi: formData.kondisiSaatIni,
        images: tempImages.length > 0 ? tempImages : undefined
      };
      updatedData.riwayatPembinaan = [newRecord, ...(formData.riwayatPembinaan || [])];
    }
    
    onSubmit(updatedData);
  };

  return (
    <div className="relative -m-4 md:-m-8 min-h-screen p-4 md:p-8 overflow-hidden">
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-700"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1511497584788-876760111969?q=80&w=2070&auto=format&fit=crop")',
          filter: 'brightness(0.6)'
        }}
      />
      <div className="absolute inset-0 z-0 bg-emerald-950/20 backdrop-blur-[2px]" />

      <div className="relative z-10 bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/50 overflow-hidden max-w-6xl mx-auto mb-10 transition-all">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl shadow-lg ${isNew ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'}`}>
              {isNew ? <FilePlus2 className="w-6 h-6" /> : <Settings className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                  {isNew ? 'Registrasi Industri Baru' : 'Update & Monitoring Industri'}
                </h3>
                {!isNew && (
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-xl shadow-sm">
                    <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">
                      Interaksi: {coachingCount} Sesi
                    </span>
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
                {isNew ? 'Masukkan data industri pengolahan hasil hutan baru' : `ID: ${formData.id} • ${formData.namaPerusahaan}`}
              </p>
            </div>
          </div>
          <button onClick={onCancel} className="p-2 text-slate-400 hover:text-red-500 transition-colors bg-slate-100 rounded-xl">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form className="p-8 lg:p-12 space-y-12" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-12">
              <section className="space-y-6">
                <h4 className="text-xs font-black text-emerald-700 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-emerald-100 pb-3">
                  <MapPin className="w-4 h-4" /> Profil & Lokasi Pabrik
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-widest">Nama Perusahaan / Unit</label>
                    <input type="text" name="namaPerusahaan" value={formData.namaPerusahaan} onChange={handleChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-black text-slate-800" placeholder="Contoh: UD. Kayu Sejahtera" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-widest">Nama Pemilik</label>
                    <input type="text" name="namaPemilik" value={formData.namaPemilik} onChange={handleChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold text-slate-700" required />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-widest">Kabupaten</label>
                    <select name="kabupaten" value={formData.kabupaten} onChange={handleChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black text-emerald-700">
                      <option value="Pacitan">Pacitan</option>
                      <option value="Ponorogo">Ponorogo</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-widest">Alamat Lengkap & Kecamatan</label>
                    <textarea name="alamatPabrik" value={formData.alamatPabrik} onChange={handleChange} rows={2} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none text-sm font-medium" placeholder="Jl. Raya Pacitan..."></textarea>
                  </div>

                  {/* Geolocation Section */}
                  <div className="md:col-span-2 space-y-3 p-5 bg-slate-50 rounded-3xl border border-slate-100">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black text-emerald-700 uppercase tracking-widest flex items-center gap-2">
                        <Navigation className="w-3 h-3" /> Koordinat Lokasi Otomatis
                      </label>
                      <button 
                        type="button" 
                        onClick={handleDetectLocation}
                        disabled={isDetectingLocation}
                        className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-50"
                      >
                        {isDetectingLocation ? <Loader2 className="w-3 h-3 animate-spin" /> : <Navigation className="w-3 h-3" />}
                        {isDetectingLocation ? 'Mendeteksi...' : 'Ambil Lokasi'}
                      </button>
                    </div>
                    {formData.koordinat ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                           <p className="text-[8px] font-black text-slate-400 uppercase mb-0.5">Latitude</p>
                           <p className="text-xs font-mono font-bold text-slate-700">{formData.koordinat.lat.toFixed(6)}</p>
                        </div>
                        <div className="bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                           <p className="text-[8px] font-black text-slate-400 uppercase mb-0.5">Longitude</p>
                           <p className="text-xs font-mono font-bold text-slate-700">{formData.koordinat.lng.toFixed(6)}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[10px] text-slate-400 italic font-medium">Klik tombol "Ambil Lokasi" untuk mendapatkan koordinat di lapangan.</p>
                    )}
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <h4 className="text-xs font-black text-emerald-700 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-emerald-100 pb-3">
                  <ShieldCheck className="w-4 h-4" /> Legalitas & Perizinan
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-widest">Jenis Ijin</label>
                    <input type="text" name="jenisIjin" value={formData.jenisIjin} onChange={handleChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-widest">User ID RPBBI</label>
                    <input type="text" name="userIdRPBBI" value={formData.userIdRPBBI} onChange={handleChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-mono text-emerald-600 font-bold" placeholder="P9XXX" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-widest">No PBPHH / IUPHHK</label>
                    <input type="text" name="perijinan.noPBPHH" value={formData.perijinan.noPBPHH} onChange={handleChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-sm font-medium" />
                  </div>
                </div>
              </section>
            </div>

            <div className="space-y-12">
              <section className="space-y-6">
                <h4 className="text-xs font-black text-emerald-700 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-emerald-100 pb-3">
                  <Settings className="w-4 h-4" /> Teknis & Kapasitas
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-widest">Kapasitas Produksi</label>
                    <div className="relative">
                      <input type="number" name="mesin.kapasitas" value={formData.mesin.kapasitas} onChange={handleChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none font-bold" />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">m3/tahun</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-widest">Skala Usaha</label>
                    <select name="mesin.skala" value={formData.mesin.skala} onChange={handleChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-black">
                      <option value="Kecil">Kecil</option>
                      <option value="Menengah">Menengah</option>
                      <option value="Besar">Besar</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 mb-1.5 uppercase tracking-widest">Bahan Baku Dominan</label>
                    <input type="text" name="bahanBaku" value={formData.bahanBaku} onChange={handleChange} className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold" placeholder="Hutan Rakyat / Perhutani" />
                  </div>
                </div>
              </section>

              <section className="space-y-5">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Pengecekan Kepatuhan</h4>
                <div className="grid grid-cols-2 gap-4">
                  {(['tenagaTeknis', 'hakAksesRPBBI', 'rkophh', 'dokumenAngkut'] as Array<keyof IndustryData['compliance']>).map(key => (
                    <button 
                      key={key} 
                      type="button" 
                      onClick={() => handleComplianceToggle(key)} 
                      className={`p-4 rounded-2xl border text-left transition-all ${
                        formData.compliance[key] === 'Sudah' 
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-800 shadow-sm' 
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <p className="text-[9px] font-black uppercase mb-1 opacity-60 tracking-tighter">
                        {key === 'tenagaTeknis' ? 'GANIS (Teknis)' : key.replace(/([A-Z])/g, ' $1')}
                      </p>
                      <p className="text-sm font-black">{formData.compliance[key]}</p>
                    </button>
                  ))}
                </div>
              </section>

              {!isNew && (
                <div className="bg-emerald-50/50 p-6 lg:p-8 rounded-[2rem] border border-emerald-100 space-y-6">
                  <h4 className="text-xs font-black text-emerald-800 uppercase tracking-widest flex items-center gap-2">
                    <MessageSquare className="w-4 h-4" /> Tambah Log Pembinaan
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 mb-1 uppercase tracking-wider">Tanggal Kunjungan</label>
                      <input type="date" name="tanggalPembinaan" value={formData.tanggalPembinaan} onChange={handleChange} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none text-sm font-bold" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-500 mb-1 uppercase tracking-wider">Kondisi Saat Ini</label>
                      <input type="text" name="kondisiSaatIni" value={formData.kondisiSaatIni} onChange={handleChange} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none text-sm font-bold" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black text-amber-700 mb-1 uppercase tracking-wider">Kendala Yang Dihadapi</label>
                      <textarea name="kendala" value={formData.kendala} onChange={handleChange} className="w-full px-4 py-2.5 bg-white border border-amber-200 rounded-xl outline-none text-sm font-bold text-amber-900 shadow-inner" rows={2} placeholder="Sebutkan kendala jika ada..."></textarea>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black text-slate-500 mb-1 uppercase tracking-wider">Catatan / Instruksi CDK</label>
                      <textarea name="pembinaan" value={formData.pembinaan} onChange={handleChange} className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none text-sm font-medium" rows={3} placeholder="Sebutkan arahan yang diberikan petugas..."></textarea>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-end gap-4 pt-10 border-t border-slate-100">
            <button type="button" onClick={onCancel} className="px-8 py-3 text-slate-500 font-black text-xs uppercase tracking-widest hover:bg-slate-100 rounded-2xl transition-all">
              Batal & Kembali
            </button>
            <button type="submit" className={`px-12 py-3 text-white font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl transition-all flex items-center justify-center gap-3 ${
              isNew ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/30' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/30'
            }`}>
              <Save className="w-5 h-5" />
              {isNew ? 'Registrasikan Industri Sekarang' : 'Simpan Perubahan Data'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IndustryForm;
