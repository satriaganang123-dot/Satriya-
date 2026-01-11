
import React, { useState, useRef } from 'react';
import { MenuType, UserProfile } from '../types';
import { LayoutDashboard, Table, FilePlus, ShieldCheck, TreePine, Menu, X, User, Camera, Settings, LogOut } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeMenu: MenuType;
  setActiveMenu: (menu: MenuType) => void;
  userProfile: UserProfile;
  onUpdateProfile: (profile: UserProfile) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeMenu, setActiveMenu, userProfile, onUpdateProfile }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [editingName, setEditingName] = useState(userProfile.name);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'monitoring', label: 'Data Monitoring', icon: Table },
    { id: 'input', label: 'Input Data Baru', icon: FilePlus },
    { id: 'pembinaan', label: 'Rekap Pembinaan', icon: ShieldCheck },
  ];

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateProfile({ ...userProfile, photo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    onUpdateProfile({ ...userProfile, name: editingName });
    setProfileModalOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-emerald-950 text-white transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6">
          <div className="flex items-center gap-4 mb-2">
            <div className="w-12 h-12 bg-emerald-800 rounded-2xl flex items-center justify-center shadow-lg border border-emerald-700/50">
              <TreePine className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-xl font-black leading-none tracking-tight text-white">
                SI-MONBIN
              </h1>
              <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mt-1">
                HASIL HUTAN KAYU
              </p>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-emerald-800 to-transparent my-4 opacity-50" />
        </div>

        <nav className="mt-2 px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveMenu(item.id as MenuType);
                setSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group
                ${activeMenu === item.id 
                  ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-900/40 translate-x-1' 
                  : 'text-emerald-100/60 hover:text-white hover:bg-emerald-900/50'}
              `}
            >
              <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeMenu === item.id ? 'text-white' : 'text-emerald-500'}`} />
              <span className="font-bold text-sm tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="absolute bottom-8 left-0 w-full px-6">
          <div className="p-4 bg-emerald-900/40 rounded-3xl border border-emerald-800/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-[10px] text-emerald-300 font-black uppercase tracking-widest">CDK Wilayah</p>
            </div>
            <p className="text-sm font-bold text-white">Pacitan & Ponorogo</p>
            <p className="text-[10px] text-emerald-500/80 mt-1 font-medium">Monitoring Industri Kayu</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden lg:flex items-center gap-3">
               <div className="w-1 h-6 bg-emerald-500 rounded-full" />
               <h2 className="text-lg font-black text-slate-800 tracking-tight uppercase">
                {menuItems.find(i => i.id === activeMenu)?.label}
              </h2>
            </div>
          </div>
          
          {/* Profile Section in Header */}
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-black text-slate-800 uppercase tracking-tighter leading-none mb-0.5 truncate max-w-[150px]">
                {userProfile.name}
              </p>
              <p className="text-[10px] text-emerald-600 font-bold italic">{userProfile.role}</p>
            </div>
            <button 
              onClick={() => {
                setEditingName(userProfile.name);
                setProfileModalOpen(true);
              }}
              className="relative group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border-2 border-emerald-100 flex items-center justify-center overflow-hidden transition-all group-hover:border-emerald-500 group-hover:shadow-lg group-hover:shadow-emerald-200 cursor-pointer">
                {userProfile.photo ? (
                  <img src={userProfile.photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-emerald-600" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-600 rounded-lg border-2 border-white flex items-center justify-center">
                <Settings className="w-2.5 h-2.5 text-white" />
              </div>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>

      {/* Profile Edit Modal */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Pengaturan Profil</h3>
              <button onClick={() => setProfileModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Photo Upload */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-[2rem] bg-slate-100 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center">
                    {userProfile.photo ? (
                      <img src={userProfile.photo} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-12 h-12 text-slate-300" />
                    )}
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-600 text-white rounded-2xl border-4 border-white shadow-lg flex items-center justify-center hover:bg-emerald-700 transition-colors"
                  >
                    <Camera className="w-5 h-5" />
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handlePhotoUpload}
                  />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Klik ikon kamera untuk ganti foto</p>
              </div>

              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nama Petugas</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                  <input 
                    type="text" 
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none font-bold text-slate-700 transition-all"
                    placeholder="Masukkan nama..."
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                  />
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <button 
                  onClick={handleSaveProfile}
                  className="w-full py-4 bg-emerald-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-emerald-600/30 hover:bg-emerald-700 transition-all active:scale-95"
                >
                  Simpan Perubahan
                </button>
                <button 
                  onClick={() => setProfileModalOpen(false)}
                  className="w-full py-4 bg-slate-100 text-slate-500 font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-200 transition-all"
                >
                  Batal
                </button>
              </div>
            </div>
            
            <div className="px-8 py-6 bg-slate-50/50 border-t border-slate-100 flex items-center justify-center gap-2">
               <LogOut className="w-3 h-3 text-rose-500" />
               <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Keluar Sesi Aplikasi</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Layout;
