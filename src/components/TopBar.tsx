import React from 'react';
import { Search, Bell, Flame, Zap, Heart, Star, Menu } from 'lucide-react';
import { cn } from '../lib/utils';

export function TopBar({ userName = "Ana", xp = 0, energy = 5, onOpenSidebar }: { userName?: string, xp?: number, energy?: number, onOpenSidebar?: () => void }) {
  return (
    <div className="h-20 border-b border-slate-100 bg-white/80 backdrop-blur-md flex items-center justify-between px-4 sm:px-8 sticky top-0 z-10 shadow-sm">
      <div className="flex items-center gap-2 sm:gap-3">
        {onOpenSidebar && (
          <button 
            type="button" 
            onClick={onOpenSidebar} 
            className="p-2 sm:p-2.5 text-slate-600 hover:text-indigo-600 lg:hidden rounded-2xl bg-slate-50 border border-slate-100 hover:bg-indigo-50 active:scale-95 transition-all"
            id="mobile-sidebar-toggle"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        )}
        <div>
          <h1 className="text-sm sm:text-lg font-black text-slate-900 leading-tight">¡Hola, {userName}! 👋</h1>
          <div className="hidden md:flex items-center gap-2 mt-0.5">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            <p className="text-xs text-slate-400 font-medium font-bold">Sigue así, cada día te acercas más a tu meta.</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-6">
        <div className="flex items-center gap-1.5 sm:gap-3 md:border-r md:border-slate-100 md:pr-6">
          {/* XP */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-indigo-50 px-2 py-1 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl border border-indigo-100/50 shadow-sm group">
            <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-indigo-600 fill-indigo-100" />
            <div className="flex flex-col">
               <span className="text-[8px] sm:text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none hidden xs:inline">XP</span>
               <span className="text-xs sm:text-sm font-black text-indigo-700 leading-tight">{xp.toLocaleString()}</span>
            </div>
          </div>

          {/* Energy */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-rose-50 px-2 py-1 sm:px-4 sm:py-2 rounded-xl sm:rounded-2xl border border-rose-100/50 shadow-sm group">
            <Heart className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500", energy > 0 ? "fill-rose-500 animate-pulse" : "fill-none")} />
            <div className="flex flex-col">
               <span className="text-[8px] sm:text-[10px] font-black text-rose-400 uppercase tracking-widest leading-none hidden xs:inline">Energía</span>
               <span className="text-xs sm:text-sm font-black text-rose-700 leading-tight">{energy}/5</span>
            </div>
          </div>
        </div>

        <div className="hidden xs:flex items-center gap-1.5 sm:gap-2 bg-amber-50 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full border border-amber-100">
            <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 fill-current" />
            <span className="text-[9px] sm:text-[10px] font-black text-amber-700 uppercase tracking-wider">7D</span>
        </div>
        
        <div className="flex items-center gap-2 sm:gap-3 pl-1 sm:pl-2">
            <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900">{userName}</p>
                <p className="text-[10px] font-black text-indigo-500 uppercase tracking-wider">Pro Account</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-100 rounded-xl sm:rounded-2xl border-2 border-white shadow-sm overflow-hidden ring-1 ring-slate-100/50">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} alt="Avatar" referrerPolicy="no-referrer" />
            </div>
        </div>
      </div>
    </div>
  );
}
