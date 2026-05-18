import React, { useState, useEffect, useRef } from 'react';
import { 
  Plane, 
  Briefcase, 
  Utensils, 
  Users, 
  MessageCircle, 
  Send, 
  ArrowLeft,
  Sparkles,
  User as UserIcon,
  Bot
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

const scenarios = [
  { id: 'travel', title: 'Viajes', icon: Plane, color: 'sky', description: 'Check-in en el aeropuerto a Londres.' },
  { id: 'interview', title: 'Entrevista', icon: Briefcase, color: 'indigo', description: 'Puesto de desarrollador junior.' },
  { id: 'restaurant', title: 'Restaurante', icon: Utensils, color: 'rose', description: 'Ordenando en un bistro en NY.' },
  { id: 'meeting', title: 'Reunión', icon: Users, color: 'emerald', description: 'Sync semanal de equipo.' },
  { id: 'daily', title: 'Cotidianas', icon: MessageCircle, color: 'amber', description: 'Hablando con un vecino.' },
];

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

export function SimulatorView({ level, onExit }: { level: string, onExit: () => void }) {
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleStart = async (id: string) => {
    setSelectedScenario(id);
    setLoading(true);
    try {
      const res = await fetch('/api/simulator-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          scenario: id, 
          messages: [{ role: 'user', text: 'Hello, let\'s start the simulation.' }], 
          level 
        })
      });
      const data = await res.json();
      setMessages([{ role: 'assistant', text: data.text }]);
    } catch (e) {
      console.error(e);
    } finally {
        setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: 'user', text: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/simulator-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          scenario: selectedScenario, 
          messages: newMessages, 
          level 
        })
      });
      const data = await res.json();
      setMessages([...newMessages, { role: 'assistant', text: data.text }]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedScenario) {
    return (
      <div className="p-8 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-12">
            <div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">Simulador de Vida Real</h2>
                <p className="text-slate-500 font-medium">Practica inglés en situaciones cotidianas con nuestro tutor AI.</p>
            </div>
            <button 
                onClick={onExit}
                className="p-4 rounded-2xl bg-white border border-slate-100 shadow-sm hover:bg-slate-50 transition-all"
            >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scenarios.map((s) => {
            const Icon = s.icon;
            return (
              <motion.button
                key={s.id}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleStart(s.id)}
                className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-left group hover:shadow-xl hover:border-indigo-100 transition-all"
              >
                <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg transform group-hover:rotate-6 transition-transform",
                    s.color === 'sky' && "bg-sky-100 text-sky-600",
                    s.color === 'indigo' && "bg-indigo-100 text-indigo-600",
                    s.color === 'rose' && "bg-rose-100 text-rose-600",
                    s.color === 'emerald' && "bg-emerald-100 text-emerald-600",
                    s.color === 'amber' && "bg-amber-100 text-amber-600"
                )}>
                  <Icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">{s.title}</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">{s.description}</p>
                <div className="mt-8 flex items-center gap-2 text-indigo-600 font-black text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                    Empezar ahora
                    <Sparkles className="w-4 h-4" />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 p-6 flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-black text-slate-900">Simulación: {scenarios.find(s => s.id === selectedScenario)?.title}</h3>
            <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">En línea - Nivel {level}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setSelectedScenario(null)}
          className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all text-sm"
        >
          Finalizar
        </button>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
      >
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                "flex items-start gap-4 max-w-[80%]",
                m.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl shrink-0 flex items-center justify-center border-2",
                m.role === 'user' ? "bg-amber-100 border-amber-200" : "bg-white border-slate-100"
              )}>
                {m.role === 'user' ? <UserIcon className="w-5 h-5 text-amber-600" /> : <Bot className="w-5 h-5 text-indigo-600" />}
              </div>
              <div className={cn(
                "p-5 rounded-2xl shadow-sm text-sm font-medium leading-relaxed relative",
                m.role === 'user' 
                  ? "bg-indigo-600 text-white rounded-tr-none" 
                  : "bg-white text-slate-700 border border-slate-100 rounded-tl-none"
              )}>
                {m.text}
              </div>
            </motion.div>
          ))}
          {loading && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest pl-14"
            >
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" />
              </div>
              <span>AI Escribiendo...</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Input */}
      <div className="p-6 bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
        <div className="max-w-4xl mx-auto relative group">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe tu respuesta en inglés..."
            disabled={loading}
            className="w-full bg-slate-50 border-2 border-slate-100 p-5 pr-16 rounded-2xl focus:outline-none focus:border-indigo-600 focus:bg-white transition-all text-sm font-medium"
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-indigo-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-center mt-3 text-[10px] font-black text-slate-300 uppercase tracking-widest">
            Presiona ENTER para enviar
        </p>
      </div>
    </div>
  );
}
