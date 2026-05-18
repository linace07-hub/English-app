import React from 'react';
import { 
  BookOpen, 
  Play, 
  Star, 
  Lock, 
  Trophy, 
  ArrowRight,
  Zap,
  Target,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion } from 'motion/react';

const modules = [
    { id: 'a1', level: 'A1', title: 'Principiante', progress: 100, color: 'emerald' },
    { id: 'a2', level: 'A2', title: 'Elemental', progress: 67, color: 'indigo', active: true },
    { id: 'b1', level: 'B1', title: 'Intermedio', progress: 0, color: 'slate', locked: true },
]

export function Dashboard({ 
  onStartLesson, 
  onRecalibrate,
  xp = 0, 
  unlockedModules = ['a1', 'a2'] 
}: { 
  onStartLesson: (level: string) => void, 
  onRecalibrate: () => void,
  xp?: number, 
  unlockedModules?: string[] 
}) {
  const currentLevelProgress = (xp % 1000) / 10; // Progress to "next level" every 1000 XP
  
  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Progress Card */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                <Target className="w-64 h-64 text-indigo-600 -mr-12 -mt-12" />
            </div>
            
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado Académico</h3>
                <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-lg">
                    <span className="text-[10px] text-green-600 font-bold">+12%</span>
                </div>
            </div>
            
            <div className="flex flex-col items-center justify-center">
                <div className="relative w-32 h-32 flex items-center justify-center shrink-0 mb-6">
                    <svg className="w-full h-full -rotate-90">
                        <circle cx="64" cy="64" r="56" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                        <circle cx="64" cy="64" r="56" fill="none" stroke="#4F46E5" strokeWidth="12" strokeDasharray="351.8" strokeDashoffset={351.8 * (1 - currentLevelProgress/100)} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-black text-slate-900 tracking-tighter">{Math.round(currentLevelProgress)}%</span>
                    </div>
                </div>
                <div className="w-full space-y-4">
                    <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Nivel Actual</span>
                        <div className="w-8 h-8 bg-amber-400 rounded-xl flex items-center justify-center shadow-sm">
                            <span className="text-xs font-black text-indigo-900">{unlockedModules.includes('b1') ? 'B1' : unlockedModules.includes('a2') ? 'A2' : 'A1'}</span>
                        </div>
                    </div>
                    <button 
                        onClick={onRecalibrate}
                        className="w-full py-3 bg-white border border-slate-200 text-slate-500 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 hover:text-indigo-600 transition-all border-b-2 active:border-b-0 active:translate-y-0.5"
                    >
                        Recalibrar Nivel con IA 🎯
                    </button>
                </div>
            </div>
        </div>

        {/* Streak Card */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                    <Zap className="w-6 h-6 fill-current" />
                </div>
                <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Racha de estudio</p>
                    <h4 className="text-2xl font-black text-slate-900 leading-tight">7 Días Seguidos</h4>
                </div>
            </div>
            <p className="text-slate-500 text-sm font-medium leading-relaxed relative z-10">
                Llevas 7 días aprendiendo inglés. Tu constancia está construyendo fluidez. ¡No te detengas ahora! ✨
            </p>
            <div className="absolute -bottom-8 -right-8 p-8 text-amber-50 group-hover:text-amber-100/50 transition-colors pointer-events-none">
                <Zap className="w-32 h-32 rotate-12 fill-current" />
            </div>
        </div>

        {/* Reward Card */}
        <div className="bg-indigo-600 p-8 rounded-[2rem] shadow-xl shadow-indigo-100 relative overflow-hidden group flex flex-col">
            <div className="relative z-10 mb-8">
                <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-[10px] font-black text-indigo-100 uppercase tracking-widest">Siguiente Meta</span>
                </div>
                <h4 className="text-xl font-black text-white mb-2 leading-tight">Módulo "Travel English"</h4>
                <p className="text-indigo-100/80 text-sm">
                    {unlockedModules.includes('b1') 
                      ? '¡Has desbloqueado este nivel! ✈️' 
                      : `Consigue ${500 - xp} XP adicionales para desbloquear.`}
                </p>
            </div>
            
            <div className="mt-auto relative z-10">
              <div className="flex justify-between items-end mb-2">
                  <span className="text-xs font-bold text-indigo-100">{xp} / 500 XP</span>
                  <span className="text-indigo-200 text-[10px] font-black uppercase">
                    {Math.min(100, Math.round((xp / 500) * 100))}%
                  </span>
              </div>
              <div className="w-full bg-indigo-500/50 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-white h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${Math.min(100, (xp / 500) * 100)}%` }}
                  />
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 opacity-10 pointer-events-none">
                <Star className="w-40 h-40 text-white fill-current" />
            </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Ruta de Aprendizaje</h2>
                <p className="text-xs text-slate-400 font-medium mt-1">Sigue progresando para desbloquear nuevas zonas</p>
            </div>
            <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-black hover:bg-slate-50 transition-colors shadow-sm">Ruta Completa</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {modules.map((m) => {
                const isUnlocked = unlockedModules.includes(m.id);
                return (
                    <div 
                        key={m.id} 
                        onClick={() => isUnlocked && onStartLesson(m.level)}
                        className={cn(
                            "bg-white p-8 rounded-[2rem] border transition-all duration-300 relative group overflow-hidden",
                            isUnlocked 
                                ? 'border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 cursor-pointer' 
                                : 'border-slate-100 opacity-60 cursor-not-allowed bg-slate-50/50'
                        )}
                    >
                        {!isUnlocked && (
                            <div className="absolute inset-0 bg-slate-50/40 backdrop-blur-[1px] rounded-[2rem] flex items-center justify-center z-10">
                                <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center gap-2">
                                    <Lock className="w-6 h-6 text-slate-300" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bloqueado</span>
                                </div>
                            </div>
                        )}
                        
                        <div className="flex justify-between items-start mb-6 relative z-10">
                            <div className={cn(
                                "px-4 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm",
                                m.progress === 100 ? "bg-green-500 text-white" : isUnlocked ? "bg-amber-400 text-indigo-900" : "bg-slate-100 text-slate-400"
                            )}>
                                {m.level}
                            </div>
                            {m.progress === 100 && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                        </div>
                        
                        <h4 className="text-xl font-black text-slate-900 mb-2 relative z-10">{m.title}</h4>
                        <p className="text-slate-500 text-sm font-medium mb-8 line-clamp-2">Aprende gramática y vocabulario avanzado.</p>
                        
                        <div className="space-y-3 relative z-10">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Progreso</span>
                                <span className="text-xs font-black text-slate-900">{m.progress}%</span>
                            </div>
                            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${m.progress}%` }}
                                    className={cn(
                                        "h-full rounded-full transition-all duration-1000",
                                        m.progress === 100 ? "bg-green-500" : "bg-indigo-600"
                                    )}
                                />
                            </div>
                        </div>

                        {isUnlocked && (
                          <div className="mt-8 flex items-center justify-between">
                              <button className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:translate-x-1 transition-transform">
                                  Practicar <Play className="w-3 h-3 fill-current" />
                              </button>
                              <Trophy className="w-5 h-5 text-slate-200 group-hover:text-indigo-200 transition-colors" />
                          </div>
                        )}
                    </div>
                );
            })}
        </div>
      </div>
    </div>
  );
}
