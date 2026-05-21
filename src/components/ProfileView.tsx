import React, { useState } from 'react';
import { 
  User, 
  Trash2, 
  LogOut, 
  Edit3, 
  Check, 
  Award, 
  Zap, 
  ShieldAlert, 
  Target,
  Sparkles,
  Heart,
  Star,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface ProfileViewProps {
  stats: {
    xp: number;
    energy: number;
    level: string;
    unlockedModules: string[];
    badges: string[];
    userName?: string;
    avatarSeed?: string;
  };
  onUpdateStats: (updated: any) => void;
  onLogout: () => void;
}

export function ProfileView({ stats, onUpdateStats, onLogout }: ProfileViewProps) {
  const currentName = stats.userName || 'Estudiante Lingo';
  const currentSeed = stats.avatarSeed || currentName;

  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(currentName);
  const [tempSeed, setTempSeed] = useState(currentSeed);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);

  // Suggested seeds for fun avatars
  const avatarSeeds = ['Leo', 'Luna', 'Max', 'Chloe', 'Zoe', 'Felix', 'Sasha', 'Alex', 'Oliver', 'Milo'];

  const handleSave = () => {
    if (tempName.trim()) {
      onUpdateStats({
        ...stats,
        userName: tempName.trim(),
        avatarSeed: tempSeed
      });
      setIsEditing(false);
    }
  };

  const handleRandomSeed = () => {
    const randomSeed = avatarSeeds[Math.floor(Math.random() * avatarSeeds.length)] + Math.round(Math.random() * 100);
    setTempSeed(randomSeed);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-10 relative">
      {/* Profile Header Card */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-[0.02] pointer-events-none">
          <User className="w-96 h-96 text-indigo-600 -mr-16 -mt-16" />
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="relative group/avatar">
            <div className="w-32 h-32 bg-indigo-50 rounded-[2.5rem] border-4 border-slate-50 shadow-md overflow-hidden ring-4 ring-indigo-500/20">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${isEditing ? tempSeed : currentSeed}`} 
                alt="Personalized Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            {isEditing && (
              <button 
                onClick={handleRandomSeed}
                className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2.5 rounded-2xl shadow-lg hover:bg-indigo-700 hover:scale-110 active:scale-95 transition-all"
                title="Generar avatar aleatorio"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex-1 text-center md:text-left space-y-3">
            {isEditing ? (
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Nombre de Usuario</label>
                  <input 
                    type="text" 
                    value={tempName} 
                    onChange={(e) => setTempName(e.target.value)}
                    placeholder="Escribe tu nombre..."
                    maxLength={20}
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
                  />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={handleSave}
                    className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-md hover:bg-indigo-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" /> Guardar Perfil
                  </button>
                  <button 
                    onClick={() => {
                      setTempName(currentName);
                      setTempSeed(currentSeed);
                      setIsEditing(false);
                    }}
                    className="px-5 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-xs hover:bg-slate-200 transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">{currentName}</h2>
                  <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-black rounded-lg uppercase tracking-wider">
                    Nivel {stats.level}
                  </span>
                </div>
                <p className="text-slate-400 font-medium text-sm mt-1">Estudiante pro activo de inglés inteligente</p>
                <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                  <button 
                    onClick={() => {
                      setTempName(currentName);
                      setTempSeed(currentSeed);
                      setIsEditing(true);
                    }}
                    className="px-4 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Editar Perfil
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="shrink-0 flex gap-4">
            <button 
              onClick={() => setShowConfirmLogout(true)}
              className="px-6 py-4 bg-rose-50 hover:bg-rose-100/80 text-rose-600 border border-rose-100 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Main Stats Column & Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Stat 1: Total XP */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
            <Star className="w-6 h-6 fill-current" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Experiencia</p>
            <h4 className="text-2xl font-black text-slate-800 mt-1">{stats.xp} XP</h4>
          </div>
        </div>

        {/* Stat 2: Energy */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center">
            <Heart className="w-6 h-6 fill-current" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Energía Restante</p>
            <h4 className="text-2xl font-black text-slate-800 mt-1">{stats.energy} / 5</h4>
          </div>
        </div>

        {/* Stat 3: Achievements */}
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Logros Obtenidos</p>
            <h4 className="text-2xl font-black text-slate-800 mt-1">{stats.badges.length}</h4>
          </div>
        </div>
      </div>

      {/* Badges and milestones */}
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
        <div>
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Tus Insignias y Logros</h3>
          <p className="text-xs text-slate-400 mt-1">Completa lecciones para ganar más medallas de honor académico.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Badge 1: Primer paso */}
          <div className={cn(
            "p-5 rounded-[2rem] border flex items-center gap-4 transition-all",
            "border-indigo-100 bg-indigo-50/50"
          )}>
            <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-indigo-900">Primer Paso Completado</h4>
              <p className="text-xs text-indigo-700/70 font-medium">Registraste tu perfil e iniciaste tu camino de estudio.</p>
            </div>
          </div>

          {/* Badge 2: XP Master */}
          <div className={cn(
            "p-5 rounded-[2rem] border flex items-center gap-4 transition-all",
            stats.xp >= 1000 ? "border-amber-100 bg-amber-50/50" : "border-slate-100 bg-slate-50 bg-opacity-50 opacity-60"
          )}>
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center",
              stats.xp >= 1000 ? "bg-amber-100 text-amber-600" : "bg-slate-200 text-slate-400"
            )}>
              <Star className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-800">XP Master</h4>
              <p className="text-xs text-slate-500 font-medium">Llega a 1,000 puntos de experiencia acumulados.</p>
            </div>
          </div>

          {/* Badge 3: Travel badge */}
          <div className={cn(
            "p-5 rounded-[2rem] border flex items-center gap-4 transition-all",
            stats.unlockedModules.includes('b1') ? "border-emerald-100 bg-emerald-50/50" : "border-slate-100 bg-slate-50 bg-opacity-50 opacity-60"
          )}>
            <div className={cn(
              "w-12 h-12 rounded-2xl flex items-center justify-center",
              stats.unlockedModules.includes('b1') ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-400"
            )}>
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-800">Viajero del Idioma (B1)</h4>
              <p className="text-xs text-slate-500 font-medium">Desbloquea el módulo intermedio Travel English.</p>
            </div>
          </div>

          {/* Badge 4: Perseverancia */}
          <div className={cn(
            "p-5 rounded-[2rem] border flex items-center gap-4 transition-all border-orange-100 bg-orange-50/50"
          )}>
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <h4 className="text-sm font-black text-orange-900 font-bold">Racha Imparable</h4>
              <p className="text-xs text-orange-700/70 font-medium">Estudiaste hoy para consolidar tu constancia de 7 días.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <AnimatePresence>
        {showConfirmLogout && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-2xl max-w-md w-full text-center space-y-6"
            >
              <div className="w-16 h-16 bg-rose-50 border border-rose-100 text-rose-500 rounded-2xl flex items-center justify-center mx-auto">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 leading-tight">¿Cerrar Sesión?</h3>
                <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                  Esto borrará los datos actuales guardados en tu dispositivo local para que puedas reiniciar o crear un perfil desde cero.
                </p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={onLogout}
                  className="flex-1 py-4 bg-rose-600 hover:bg-rose-700 text-white rounded-[1.2rem] text-xs font-black uppercase tracking-widest shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> Sí, Borrar y Salir
                </button>
                <button 
                  onClick={() => setShowConfirmLogout(false)}
                  className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-[1.2rem] text-xs font-black uppercase tracking-widest transition-all"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
