
import React, { useState } from 'react';
import { TreePine, Lock, User, LogIn, Sparkles, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLogin: (user: string, pass: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'pacitan') {
      onLogin(username, password);
    } else {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden font-['Inter']">
      {/* Background Image with Deep Overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat scale-105"
        style={{ 
          backgroundImage: 'url("https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2071&auto=format&fit=crop")',
        }}
      />
      <div className="absolute inset-0 z-0 bg-emerald-950/80 backdrop-blur-[3px]" />

      {/* Decorative Elements */}
      <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-emerald-500/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-5%] w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white/95 backdrop-blur-2xl rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/20 overflow-hidden transform transition-all duration-500 hover:scale-[1.01]">
          {/* Header */}
          <div className="p-10 pb-6 text-center">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-emerald-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-emerald-500/40 rotate-3 hover:rotate-0 transition-transform duration-500">
                <TreePine className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase mb-1">
              SI-MONBIN <span className="text-emerald-600">INDUSTRI</span>
            </h1>
            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] opacity-80">
              CDK Wilayah Pacitan & Ponorogo
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-10 pb-12 space-y-5">
            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                <input 
                  type="text" 
                  placeholder="Username" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-100 border border-transparent rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none font-bold text-slate-700 transition-all"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                <input 
                  type="password" 
                  placeholder="Password" 
                  className="w-full pl-12 pr-4 py-4 bg-slate-100 border border-transparent rounded-2xl focus:ring-2 focus:ring-emerald-500 focus:bg-white outline-none font-bold text-slate-700 transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <div className="bg-rose-500 rounded-full p-1">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <p className="text-[10px] font-black text-rose-600 uppercase tracking-wider">Username atau Password Salah!</p>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full py-4 bg-emerald-600 text-white font-black text-xs uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-emerald-600/30 hover:bg-emerald-700 hover:shadow-emerald-600/50 hover:-translate-y-0.5 transition-all active:scale-95 flex items-center justify-center gap-3 mt-4"
            >
              Masuk Aplikasi <LogIn className="w-4 h-4" />
            </button>

            <div className="pt-6 text-center border-t border-slate-100 mt-6">
              <div className="flex items-center justify-center gap-2 mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Akses Terbatas Petugas CDK</p>
              </div>
              <p className="text-[8px] text-slate-400 font-medium">© 2024 Cabang Dinas Kehutanan Wilayah Pacitan</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
