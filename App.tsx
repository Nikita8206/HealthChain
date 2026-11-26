import React, { useState, useEffect } from 'react';
import { User, UserRole } from './types';
import { storageService, subscribeToStorage } from './services/storageService';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { ToastContainer } from './components/common/ToastContainer';

// Feature Views
import { PatientDashboard } from './components/dashboard/PatientDashboard';
import { DoctorDashboard } from './components/dashboard/DoctorDashboard';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { DIDManagement } from './components/did/DIDManagement';
import { EHRRecords } from './components/ehr/EHRRecords';
import { AccessControl } from './components/access/AccessControl';
import { EmergencyAccess } from './components/emergency/EmergencyAccess';
import { IoMTMonitoring } from './components/iomt/IoMTMonitoring';
import { MultiInstitution } from './components/institutions/MultiInstitution';
import { BlockchainLedger } from './components/blockchain/BlockchainLedger';
import { SecurityDashboard } from './components/security/SecurityDashboard';
import { DemoGuide } from './components/demo/DemoGuide';
import { AboutProject } from './components/about/AboutProject';
import { SettingsView } from './components/settings/SettingsView';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(storageService.getCurrentUser());
  const [currentTab, setCurrentTab] = useState<string>('dashboard');

  useEffect(() => {
    const update = () => {
      setCurrentUser(storageService.getCurrentUser());
    };
    return subscribeToStorage(update);
  }, []);

  const handleSwitchUser = (user: User) => {
    storageService.setCurrentUser(user);
    setCurrentUser(user);
  };

  const handleSwitchRole = (role: UserRole) => {
    const user = storageService.switchRole(role);
    setCurrentUser(user);
  };

  const handleResetDemo = () => {
    storageService.resetDemoData();
    const updated = storageService.getCurrentUser();
    setCurrentUser(updated);
    setCurrentTab('dashboard');
  };

  const renderCurrentView = () => {
    switch (currentTab) {
      case 'dashboard':
        if (currentUser.role === 'patient') {
          return <PatientDashboard currentUser={currentUser} onNavigateTab={setCurrentTab} />;
        }
        if (currentUser.role === 'doctor') {
          return <DoctorDashboard currentUser={currentUser} onNavigateTab={setCurrentTab} />;
        }
        return <AdminDashboard currentUser={currentUser} onNavigateTab={setCurrentTab} />;
      case 'patient-dashboard':
        return <PatientDashboard currentUser={currentUser} onNavigateTab={setCurrentTab} />;
      case 'doctor-dashboard':
        return <DoctorDashboard currentUser={currentUser} onNavigateTab={setCurrentTab} />;
      case 'admin-dashboard':
        return <AdminDashboard currentUser={currentUser} onNavigateTab={setCurrentTab} />;
      case 'did':
        return <DIDManagement />;
      case 'ehr':
        return <EHRRecords currentUser={currentUser} onNavigateTab={setCurrentTab} />;
      case 'access':
        return <AccessControl currentUser={currentUser} />;
      case 'emergency':
        return <EmergencyAccess currentUser={currentUser} onNavigateTab={setCurrentTab} />;
      case 'iomt':
        return <IoMTMonitoring />;
      case 'institutions':
        return <MultiInstitution currentUser={currentUser} onNavigateTab={setCurrentTab} />;
      case 'blockchain':
        return <BlockchainLedger />;
      case 'security':
        return <SecurityDashboard />;
      case 'demo-guide':
        return <DemoGuide onNavigateTab={setCurrentTab} onSwitchRole={handleSwitchRole} />;
      case 'about':
        return <AboutProject />;
      case 'settings':
        return <SettingsView currentUser={currentUser} onResetDemo={handleResetDemo} />;
      default:
        return <PatientDashboard currentUser={currentUser} onNavigateTab={setCurrentTab} />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 antialiased overflow-hidden font-sans select-none">
      {/* Sidebar Navigation */}
      <Sidebar
        currentUser={currentUser}
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onLogout={() => handleSwitchRole('patient')}
        onOpenDemoGuide={() => setCurrentTab('demo-guide')}
      />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0 h-full overflow-hidden">
        {/* Top Header */}
        <Header
          currentUser={currentUser}
          onSwitchUser={handleSwitchUser}
          onOpenDemoGuide={() => setCurrentTab('demo-guide')}
          onOpenResetModal={handleResetDemo}
        />

        {/* Scrollable View Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-slate-950">
          <div className="max-w-7xl mx-auto pb-12">
            {renderCurrentView()}
          </div>
        </main>
      </div>

      {/* Floating System Toasts */}
      <ToastContainer />
    </div>
  );
}
