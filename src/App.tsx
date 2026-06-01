import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Dashboard } from './components/Dashboard';
import { LessonView } from './components/LessonView';
import { SimulatorView } from './components/SimulatorView';
import { PlacementTest } from './components/PlacementTest';
import { ProfileView } from './components/ProfileView';
import { AIAssistant } from './components/AIAssistant';
import { ChatTutorView } from './components/ChatTutorView';
import { VocabularyView } from './components/VocabularyView';
import { StatsView } from './components/StatsView';
import { motion, AnimatePresence } from 'motion/react';
import { Award, Zap, Heart, Star } from 'lucide-react';
import { cn } from './lib/utils';
import { normalizeView, type AppView } from './lib/navigation';

interface UserStats {
  xp: number;
  energy: number;
  level: string;
  unlockedModules: string[];
  badges: string[];
  placementCompleted: boolean;
  userName?: string;
  avatarSeed?: string;
}

export default function App() {
  const [view, setView] = useState<AppView>(() => {
    try {
      return normalizeView(localStorage.getItem('user_current_view'));
    } catch (e) {
      console.warn("localStorage is not available:", e);
      return 'dashboard';
    }
  });
  const [selectedLevel, setSelectedLevel] = useState<string>(() => {
    try {
      const savedLevel = localStorage.getItem('user_selected_level');
      return savedLevel || 'A2';
    } catch (e) {
      console.warn("localStorage is not available:", e);
      return 'A2';
    }
  });
  
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem('user_stats');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed) {
          if (parsed.placementCompleted && !parsed.userName) {
            parsed.userName = 'Estudiante';
            parsed.avatarSeed = 'Estudiante';
          }
          return {
            xp: typeof parsed.xp === 'number' ? parsed.xp : 0,
            energy: typeof parsed.energy === 'number' ? parsed.energy : 5,
            level: parsed.level || 'A1',
            unlockedModules: Array.isArray(parsed.unlockedModules) ? parsed.unlockedModules : ['a1'],
            badges: Array.isArray(parsed.badges) ? parsed.badges : [],
            placementCompleted: !!parsed.placementCompleted,
            userName: parsed.userName || '',
            avatarSeed: parsed.avatarSeed || ''
          };
        }
      }
    } catch (e) {
      console.error("Failed to parse user_stats from localStorage:", e);
    }
    return {
      xp: 0,
      energy: 5,
      level: 'A1',
      unlockedModules: ['a1'],
      badges: [],
      placementCompleted: false,
      userName: '',
      avatarSeed: ''
    };
  });

  const [showPlacement, setShowPlacement] = useState(() => {
    return !stats.placementCompleted || !stats.userName;
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [notification, setNotification] = useState<{ title: string, message: string, type: 'badge' | 'unlock' } | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('user_stats', JSON.stringify(stats));
    } catch (e) {
      console.warn("localStorage setItem stats failed:", e);
    }
  }, [stats]);

  useEffect(() => {
    try {
      localStorage.setItem('user_current_view', view);
    } catch (e) {
      console.warn("localStorage setItem view failed:", e);
    }
  }, [view]);

  useEffect(() => {
    try {
      localStorage.setItem('user_selected_level', selectedLevel);
    } catch (e) {
      console.warn("localStorage setItem selectedLevel failed:", e);
    }
  }, [selectedLevel]);

  const showNotification = (title: string, message: string, type: 'badge' | 'unlock') => {
    setNotification({ title, message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const addXP = (amount: number) => {
    setStats(prev => {
      const newXp = prev.xp + amount;
      let newUnlocked = [...prev.unlockedModules];
      
      // Unlock B1 logic
      if (newXp >= 500 && !newUnlocked.includes('b1')) {
        newUnlocked.push('b1');
        showNotification('¡Módulo Desbloqueado! ✈️', 'Has desbloqueado el módulo "Travel English" (B1).', 'unlock');
      }

      // Badge logic
      let newBadges = [...prev.badges];
      if (newXp >= 1000 && !newBadges.includes('XP Master')) {
        newBadges.push('XP Master');
        showNotification('¡Nuevo Badge! 🏆', 'Has obtenido el badge "XP Master" por tus 1000 XP.', 'badge');
      }

      return { ...prev, xp: newXp, unlockedModules: newUnlocked, badges: newBadges };
    });
  };

  const useEnergy = () => {
    setStats(prev => ({ ...prev, energy: Math.max(0, prev.energy - 1) }));
  };

  const handlePlacementComplete = (level: string, userName: string, avatarSeed: string) => {
    setStats(prev => {
      let unlocked = ['a1'];
      if (level === 'A2') unlocked = ['a1', 'a2'];
      if (level === 'B1') unlocked = ['a1', 'a2', 'b1'];
      
      return {
        ...prev,
        level,
        unlockedModules: unlocked,
        placementCompleted: true,
        userName,
        avatarSeed,
        xp: 100 // Reward for completing placement
      };
    });
    setSelectedLevel(level);
    setShowPlacement(false);
    showNotification('¡Perfil Creado! 🎯', `Bienvenido ${userName}. Tu nivel es ${level}.`, 'unlock');
  };

   const handleLogout = () => {
    try {
      localStorage.removeItem('user_stats');
      localStorage.removeItem('user_current_view');
      localStorage.removeItem('user_selected_level');
    } catch (e) {
      console.warn("localStorage removeItem failed:", e);
    }
    setStats({
      xp: 0,
      energy: 5,
      level: 'A1',
      unlockedModules: ['a1'],
      badges: [],
      placementCompleted: false,
      userName: '',
      avatarSeed: ''
    });
    setShowPlacement(true);
    setView('dashboard');
    showNotification('Sesión Cerrada 🔒', 'Se han restablecido los datos de la sesión.', 'unlock');
  };

  const handleStartLesson = (level: string) => {
    if (stats.energy <= 0) {
      showNotification('¡Sin Energía! ❤️', 'Espera a que tu energía se recupere para continuar practicando.', 'unlock');
      return;
    }
    setSelectedLevel(level);
    setView('lesson');
  };

  return (
    <div className="flex h-screen bg-[#F9FAFB] overflow-hidden relative">
      {/* Desktop Sidebar (Permanent) */}
      <div className="hidden lg:flex lg:w-64 shrink-0 h-full">
        <Sidebar onNavigate={(v) => setView(normalizeView(v))} currentView={view} energy={stats.energy} />
      </div>

      {/* Mobile/Tablet Sidebar Drawer with Smooth Backdrop Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Dark Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900"
            />
            {/* Sliding Sidebar panel */}
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-64 bg-indigo-600 flex flex-col h-full shadow-2xl z-10"
            >
              <Sidebar 
                onNavigate={(v) => {
                  setView(normalizeView(v));
                  setSidebarOpen(false);
                }} 
                currentView={view} 
                energy={stats.energy} 
                onClose={() => setSidebarOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        <TopBar 
          userName={stats.userName || 'Estudiante'} 
          xp={stats.xp} 
          energy={stats.energy} 
          onOpenSidebar={() => setSidebarOpen(true)}
        />
        
        {/* Notifications */}
        <AnimatePresence>
          {notification && (
            <motion.div 
              initial={{ opacity: 0, y: -50, x: '-50%' }}
              animate={{ opacity: 1, y: 20, x: '-50%' }}
              exit={{ opacity: 0, y: -50, x: '-50%' }}
              className="fixed top-20 left-1/2 z-50 bg-white border border-slate-100 shadow-2xl p-6 rounded-[2rem] flex items-center gap-4 min-w-[350px]"
            >
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center",
                notification.type === 'badge' ? "bg-amber-100 text-amber-600" : "bg-indigo-100 text-indigo-600"
              )}>
                {notification.type === 'badge' ? <Award className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
              </div>
              <div>
                <h4 className="font-black text-slate-900 leading-tight">{notification.title}</h4>
                <p className="text-slate-500 text-sm font-medium">{notification.message}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="flex-1 overflow-y-auto">
          {showPlacement ? (
            <PlacementTest onComplete={handlePlacementComplete} />
          ) : view === 'dashboard' ? (
            <div className="relative pb-24">
               <Dashboard 
                 onStartLesson={handleStartLesson} 
                 onRecalibrate={() => setShowPlacement(true)}
                 xp={stats.xp} 
                 unlockedModules={stats.unlockedModules} 
               />
               {/* Quick Start Floating Button (Optional for better UX) */}
               <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30">
                  <button 
                    onClick={() => handleStartLesson('A2')}
                    className="bg-indigo-600 text-white px-10 py-5 rounded-[2rem] font-black text-lg shadow-2xl shadow-indigo-600/40 hover:bg-indigo-700 transition-all border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1"
                  >
                    🚀 ¡EMPEZAR LECCIÓN!
                  </button>
               </div>
            </div>
          ) : view === 'lesson' ? (
            <LessonView 
               level={selectedLevel} 
               onExit={() => setView('dashboard')} 
               onComplete={(xp) => addXP(xp)}
               onMistake={() => useEnergy()}
            />
          ) : view === 'simulator' ? (
            <SimulatorView level={selectedLevel} onExit={() => setView('dashboard')} />
          ) : view === 'profile' ? (
            <ProfileView 
              stats={stats} 
              onUpdateStats={(updated) => setStats(updated)} 
              onLogout={handleLogout}
            />
          ) : view === 'review' ? (
            <ChatTutorView
              level={stats.level}
              userName={stats.userName}
              onExit={() => setView('dashboard')}
            />
          ) : view === 'vocabulary' ? (
            <VocabularyView level={stats.level} onExit={() => setView('dashboard')} />
          ) : view === 'stats' ? (
            <StatsView stats={stats} onExit={() => setView('dashboard')} />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
              <p className="text-slate-500 font-medium mb-6">Vista no reconocida.</p>
              <button
                type="button"
                onClick={() => setView('dashboard')}
                className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black"
              >
                Ir al inicio
              </button>
            </div>
          )}
        </main>

        {view !== 'review' && <AIAssistant />}
      </div>
    </div>
  );
}

