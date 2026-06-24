import React, { useState } from 'react';
import { Menu, X, User, Moon, Sun, History, ShieldCheck, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const DashboardLayout = ({ leftPane, rightPane }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false); // Can be tied to a global context later
  const { logout, user } = useAuth();

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900 text-white' : 'bg-background text-slate-900'} font-sans transition-colors duration-300 flex overflow-hidden selection:bg-primary/20 selection:text-primary`}>
      
      {/* Collapsible History Sidebar (Desktop) */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className={`flex-shrink-0 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-r h-screen overflow-y-auto hidden md:block`}
          >
            <div className="p-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
                <History className="w-4 h-4" />
                Assessment History
              </h3>
              
              {/* Placeholder for history items */}
              <div className="space-y-4">
                <div className={`p-4 rounded-xl border ${isDarkMode ? 'border-slate-700 bg-slate-700/50' : 'border-slate-100 bg-slate-50'}`}>
                  <p className="text-sm font-semibold">John Doe</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-slate-500">Score: 720</span>
                    <span className="text-xs font-medium text-success">Low Risk</span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Top Navigation Bar */}
        <header className={`${isDarkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white/80 border-slate-200'} backdrop-blur-md border-b h-16 flex items-center justify-between px-4 lg:px-8 flex-shrink-0 z-10`}>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-600'} transition-colors hidden md:block focus:outline-none focus:ring-2 focus:ring-primary/50`}
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg tracking-tight">FinAssess Pro</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-100 text-slate-600'} transition-colors focus:outline-none`}
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className={`flex items-center gap-2 pl-4 border-l ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
              <div className={`w-9 h-9 rounded-full ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-100 border-slate-200'} flex items-center justify-center border shadow-sm`} title={user?.email}>
                <User className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
              </div>
              <button 
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500/50"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Grid Container */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto min-h-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            <div className="lg:col-span-4 flex flex-col min-h-[600px]">
              {leftPane}
            </div>
            <div className="lg:col-span-8 flex flex-col min-h-[600px]">
              {rightPane}
            </div>
          </div>
        </main>

      </div>
    </div>
  );
};

export default DashboardLayout;
