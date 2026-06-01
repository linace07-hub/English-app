import React from 'react';
import { ArrowLeft, Award, Heart, Star, Zap, Target } from 'lucide-react';

interface StatsViewProps {
  stats: {
    xp: number;
    energy: number;
    level: string;
    unlockedModules: string[];
    badges: string[];
    userName?: string;
  };
  onExit: () => void;
}

export function StatsView({ stats, onExit }: StatsViewProps) {
  const progress = Math.min(100, (stats.xp % 1000) / 10);

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8 pb-24">
      <div className="flex items-center gap-4">
        <button onClick={onExit} className="p-2 hover:bg-white rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <h1 className="text-2xl font-black text-slate-900">Tus logros</h1>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-[1.5rem] border border-slate-100 p-6 shadow-sm col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <Target className="w-5 h-5 text-indigo-600" />
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Progreso</span>
          </div>
          <p className="text-4xl font-black text-slate-900 mb-2">{Math.round(progress)}%</p>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-slate-500 mt-2 font-medium">Siguiente hito a los 1000 XP</p>
        </div>

        <div className="bg-white rounded-[1.5rem] border border-slate-100 p-6 shadow-sm">
          <Star className="w-5 h-5 text-amber-500 mb-2" />
          <p className="text-2xl font-black text-slate-900">{stats.xp}</p>
          <p className="text-xs font-bold text-slate-400 uppercase">XP total</p>
        </div>

        <div className="bg-white rounded-[1.5rem] border border-slate-100 p-6 shadow-sm">
          <Heart className="w-5 h-5 text-rose-500 mb-2" />
          <p className="text-2xl font-black text-slate-900">{stats.energy}/5</p>
          <p className="text-xs font-bold text-slate-400 uppercase">Energía</p>
        </div>

        <div className="bg-white rounded-[1.5rem] border border-slate-100 p-6 shadow-sm col-span-2">
          <Zap className="w-5 h-5 text-indigo-500 mb-2" />
          <p className="text-lg font-black text-slate-900">Nivel {stats.level}</p>
          <p className="text-sm text-slate-500 mt-1">
            Módulos: {stats.unlockedModules.join(', ').toUpperCase()}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[1.5rem] border border-slate-100 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-amber-600" />
          <h2 className="font-black text-slate-900">Badges</h2>
        </div>
        {stats.badges.length === 0 ? (
          <p className="text-slate-500 text-sm font-medium">
            Aún no tienes badges. ¡Sigue practicando lecciones para desbloquearlos!
          </p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {stats.badges.map((b) => (
              <li
                key={b}
                className="px-4 py-2 bg-amber-50 text-amber-800 rounded-xl text-sm font-bold border border-amber-100"
              >
                🏆 {b}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
