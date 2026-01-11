
import React, { useState, useEffect } from 'react';
import { IndustryData, MenuType, UserProfile } from './types';
import { INITIAL_DATA } from './data';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import MonitoringTable from './components/MonitoringTable';
import IndustryForm from './components/IndustryForm';
import CoachingSection from './components/CoachingSection';
import Login from './components/Login';
import { CheckCircle2, X } from 'lucide-react';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeMenu, setActiveMenu] = useState<MenuType>('dashboard');
  const [data, setData] = useState<IndustryData[]>(INITIAL_DATA);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  
  // State Profil Petugas
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: 'Petugas Monitoring',
    role: 'Admin CDK Pacitan',
    photo: null
  });

  const handleLogin = (user: string, pass: string) => {
    setIsAuthenticated(true);
    setNotification('Selamat Datang, Petugas CDK');
  };

  const handleAddData = (newItem: IndustryData) => {
    setData(prev => {
      const exists = prev.find(d => d.id === newItem.id);
      if (exists) {
        return prev.map(d => d.id === newItem.id ? newItem : d);
      }
      return [newItem, ...prev];
    });
    setEditingId(null);
    setActiveMenu('monitoring');
    setNotification(editingId ? 'Data berhasil diperbarui' : 'Industri baru berhasil diregistrasi');
  };

  const handleDeleteIndustry = (id: string) => {
    const industryName = data.find(d => d.id === id)?.namaPerusahaan;
    setData(prev => prev.filter(d => d.id !== id));
    setNotification(`Data "${industryName}" telah dihapus permanen`);
  };

  const handleBulkDeleteRevoked = () => {
    const revokedCount = data.filter(d => d.kondisiSaatIni !== 'Aktif').length;
    setData(prev => prev.filter(d => d.kondisiSaatIni === 'Aktif'));
    setNotification(`${revokedCount} Data industri non-aktif berhasil dibersihkan`);
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleEdit = (id: string) => {
    setEditingId(id);
    setActiveMenu('input');
  };

  const handleMenuChange = (menu: MenuType) => {
    if (menu === 'input') {
      setEditingId(null);
    }
    setActiveMenu(menu);
  };

  const handleDeleteCoachingRecord = (industryId: string, recordId: string) => {
    setData(prev => prev.map(ind => {
      if (ind.id === industryId) {
        return {
          ...ind,
          riwayatPembinaan: ind.riwayatPembinaan.filter(rec => rec.id !== recordId)
        };
      }
      return ind;
    }));
    setNotification('Log pembinaan berhasil dihapus');
  };

  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return <Dashboard data={data} />;
      case 'monitoring':
        return (
          <MonitoringTable 
            data={data} 
            onSelect={handleEdit} 
            onDelete={handleDeleteIndustry} 
            onBulkDeleteRevoked={handleBulkDeleteRevoked}
          />
        );
      case 'input':
        return (
          <IndustryForm 
            initialData={editingId ? data.find(d => d.id === editingId) : undefined}
            onSubmit={handleAddData}
            onCancel={() => {
              setEditingId(null);
              setActiveMenu('monitoring');
            }}
          />
        );
      case 'pembinaan':
        return (
          <CoachingSection 
            industries={data} 
            onDeleteRecord={handleDeleteCoachingRecord} 
          />
        );
      default:
        return <Dashboard data={data} />;
    }
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout 
      activeMenu={activeMenu} 
      setActiveMenu={handleMenuChange}
      userProfile={userProfile}
      onUpdateProfile={setUserProfile}
    >
      {notification && (
        <div className="fixed bottom-8 right-8 z-[100] animate-in fade-in slide-in-from-right-10 duration-300">
          <div className="bg-emerald-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 border border-emerald-500/30 backdrop-blur-md">
            <div className="bg-emerald-500 rounded-full p-1">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <p className="font-bold text-sm tracking-wide">{notification}</p>
            <button 
              onClick={() => setNotification(null)}
              className="ml-2 p-1 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-emerald-300" />
            </button>
          </div>
        </div>
      )}
      
      {renderContent()}
    </Layout>
  );
};

export default App;
