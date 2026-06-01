import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ArrowLeft, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function ChatTutorView({
  level,
  userName,
  onExit,
}: {
  level: string;
  userName?: string;
  onExit: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `¡Hola${userName ? `, ${userName}` : ''}! Soy tu tutor Linguae. Pregúntame gramática, vocabulario, pronunciación o pide ejemplos para tu nivel ${level}.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: userMsg,
          context: `Chat Tutor — nivel ${level}. Responde en español cuando expliques, pero usa inglés para ejemplos y frases modelo.`,
        }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.details || data.error || `Error de servidor (${res.status})`);
      }
      if (!data.answer) {
        throw new Error('La respuesta de la IA está vacía.');
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: data.answer }]);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Error de conexión';
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ No pude responder (${message}). Verifica que GEMINI_API_KEY esté en tu archivo .env y que el servidor esté en marcha.`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    '¿Cuándo uso present perfect?',
    'Dame 5 frases con "would"',
    'Corrige: "I have went to London"',
    'Practiquemos small talk en inglés',
  ];

  return (
    <div className="flex flex-col h-full bg-[#F9FAFB]">
      <div className="shrink-0 px-6 py-5 bg-white border-b border-slate-100 flex items-center gap-4">
        <button
          onClick={onExit}
          className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          aria-label="Volver"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2.5 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-200">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight">Chat Tutor</h1>
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Nivel {level}</p>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-5">
        {messages.map((m, i) => (
          <div key={i} className={cn('flex gap-3', m.role === 'user' && 'flex-row-reverse')}>
            <div
              className={cn(
                'w-9 h-9 rounded-xl flex items-center justify-center shrink-0',
                m.role === 'user' ? 'bg-indigo-100' : 'bg-white border border-slate-100 shadow-sm',
              )}
            >
              {m.role === 'user' ? (
                <User className="w-4 h-4 text-indigo-600" />
              ) : (
                <Bot className="w-4 h-4 text-slate-600" />
              )}
            </div>
            <div
              className={cn(
                'p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-sm',
                m.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : 'bg-white text-slate-700 rounded-tl-none border border-slate-100',
              )}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center">
              <Bot className="w-4 h-4 text-slate-600" />
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 flex gap-1.5">
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
      </div>

      {messages.length === 1 && (
        <div className="px-6 pb-2 flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setInput(s)}
              className="text-xs font-bold px-4 py-2 bg-white border border-slate-200 rounded-full text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="shrink-0 p-6 pt-2 bg-white border-t border-slate-100">
        <div className="relative max-w-3xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe tu pregunta en español o inglés..."
            className="w-full pl-6 pr-14 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/30"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
