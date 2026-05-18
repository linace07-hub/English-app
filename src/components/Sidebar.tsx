import React from 'react';
import { 
  Home, 
  BookOpen, 
  History, 
  MessageSquare, 
  BarChart2, 
  User, 
  Zap,
  Sparkles,
  Settings
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

const navItems = [
  { icon: Home, label: 'Inicio', id: 'home' },
  { icon: BookOpen, label: 'Lecciones', id: 'lessons' },
  { icon: Sparkles, label: 'Simulador', id: 'simulator' },
  { icon: MessageSquare, label: 'Chat Tutor', id: 'review' },
  { icon: History, label: 'Vocabulario', id: 'vocabulary' },
  { icon: BarChart2, label: 'Estadísticas', id: 'stats' },
  { icon: User, label: 'Perfil', id: 'profile' },
];

export function Sidebar({ onNavigate, currentView }: { onNavigate: (view: string) => void, currentView: string }) {
  return (
    <div className="w-64 bg-indigo-600 flex flex-col h-full shadow-2xl relative z-20">
      <div className="p-6 flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-amber-400 rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
            <Zap className="text-indigo-900 w-6 h-6 fill-current" />
        </div>
        <span className="font-bold text-2xl text-white tracking-tight">Linguae</span>
      </div>

      <div className="px-6 mb-4">
        <div className="text-indigo-200 text-[10px] font-black uppercase tracking-widest mb-4 opacity-60">Menú Principal</div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              if (item.id === 'home') onNavigate('dashboard');
              else if (item.id === 'lessons') onNavigate('lesson');
              else onNavigate(item.id);
            }}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group text-sm font-semibold",
              ((item.id === 'home' && currentView === 'dashboard') || 
               (item.id === 'lessons' && currentView === 'lesson') ||
               (item.id === currentView))
                ? "bg-indigo-500 text-white shadow-sm" 
                : "text-indigo-100 hover:bg-indigo-500/50 hover:text-white"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 transition-colors",
              ((item.id === 'home' && currentView === 'dashboard') || 
               (item.id === 'lessons' && currentView === 'lesson') ||
               (item.id === currentView)) ? "text-white" : "text-indigo-300 group-hover:text-white"
            )} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 mx-4 mb-6 bg-indigo-700/50 rounded-2xl border border-indigo-500/50 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-indigo-100 uppercase tracking-wider">Energía</span>
            </div>
            <span className="text-xs font-bold text-white">4 / 5</span>
        </div>
        <div className="w-full bg-indigo-900/50 h-1.5 rounded-full overflow-hidden">
            <div className="bg-amber-400 h-full w-4/5 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.4)]" />
        </div>
        <p className="mt-2 text-[10px] text-indigo-200 font-medium opacity-80">Próxima carga en 12:45</p>
      </div>
      
      <div className="p-4 border-t border-indigo-500/30">
         <button className="w-full flex items-center gap-3 px-4 py-3 text-indigo-100 hover:bg-indigo-500 rounded-xl transition-all text-sm font-semibold group">
            <Settings className="w-5 h-5 text-indigo-300 group-hover:text-white" />
            Configuración
         </button>
      </div>
    </div>
  );
}
