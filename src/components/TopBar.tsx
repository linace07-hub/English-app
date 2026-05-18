import React from 'react';
import { Search, Bell, Flame, Zap, Heart, Star } from 'lucide-react';
import { cn } from '@/src/lib/utils';

export function TopBar({ userName = "Ana", xp = 0, energy = 5 }) {
  return (
    <div className="h-20 border-b border-slate-100 bg-white/80 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
      <div>
        <h1 className="text-lg font-bold text-slate-900 leading-tight">¡Hola, {userName}! 👋</h1>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <p className="text-xs text-slate-400 font-medium">Sigue así, cada día te acercas más a tu meta.</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3 border-r border-slate-100 pr-6">
          {/* XP */}
          <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2 rounded-2xl border border-indigo-100/50 shadow-sm group">
            <Star className="w-4 h-4 text-indigo-600 fill-indigo-100" />
            <div className="flex flex-col">
               <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest leading-none">XP Totales</span>
               <span className="text-sm font-black text-indigo-700 leading-tight">{xp.toLocaleString()}</span>
            </div>
          </div>

          {/* Energy */}
          <div className="flex items-center gap-2 bg-rose-50 px-4 py-2 rounded-2xl border border-rose-100/50 shadow-sm group">
            <Heart className={cn("w-4 h-4 text-rose-500", energy > 0 ? "fill-rose-500 animate-pulse" : "fill-none")} />
            <div className="flex flex-col">
               <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest leading-none">Energía</span>
               <span className="text-sm font-black text-rose-700 leading-tight">{energy}/5</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
            <Flame className="w-4 h-4 text-amber-500 fill-current" />
            <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider">7 días</span>
        </div>
        
        <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-900">{userName} Garcia</p>
                <p className="text-[10px] font-bold text-indigo-500 uppercase">Pro Account</p>
            </div>
            <div className="w-10 h-10 bg-indigo-100 rounded-2xl border-2 border-white shadow-sm overflow-hidden ring-1 ring-slate-100">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userName}`} alt="Avatar" />
            </div>
        </div>
      </div>
    </div>
  );
}
