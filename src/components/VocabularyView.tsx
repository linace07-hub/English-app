import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, RefreshCw, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

interface Exercise {
  id: string;
  type: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
}

export function VocabularyView({
  level,
  onExit,
}: {
  level: string;
  onExit: () => void;
}) {
  const [items, setItems] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});

  const loadVocabulary = async () => {
    setLoading(true);
    setError(null);
    setRevealed({});
    try {
      const res = await fetch('/api/generate-exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ level, topic: 'essential vocabulary and phrasal verbs' }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.error || `Error (${res.status})`);
      }
      const list = Array.isArray(data) ? data : [];
      const vocab = list.filter((e: Exercise) => e.type === 'vocabulary');
      setItems(vocab.length > 0 ? vocab : list.slice(0, 5));
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'No se pudo generar vocabulario');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVocabulary();
  }, [level]);

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8 pb-24">
      <div className="flex items-center gap-4">
        <button onClick={onExit} className="p-2 hover:bg-white rounded-xl transition-colors">
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-100 rounded-2xl">
            <BookOpen className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Vocabulario AI</h1>
            <p className="text-sm text-slate-500 font-medium">Lista generada para nivel {level}</p>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Sparkles className="w-10 h-10 text-indigo-500 animate-pulse" />
          <p className="font-bold text-slate-500">Generando palabras con IA...</p>
        </div>
      )}

      {error && !loading && (
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 text-rose-700 text-sm font-medium">
          {error}
        </div>
      )}

      {!loading && items.length > 0 && (
        <ul className="space-y-4">
          {items.map((item) => (
            <li
              key={item.id}
              className="bg-white rounded-[1.5rem] border border-slate-100 p-6 shadow-sm"
            >
              <p className="font-bold text-slate-900 mb-3">{item.question}</p>
              {item.options && item.options.length > 0 && (
                <ul className="text-sm text-slate-500 space-y-1 mb-3">
                  {item.options.map((opt) => (
                    <li key={opt}>• {opt}</li>
                  ))}
                </ul>
              )}
              <button
                type="button"
                onClick={() => setRevealed((r) => ({ ...r, [item.id]: !r[item.id] }))}
                className={cn(
                  'text-xs font-black uppercase tracking-widest px-4 py-2 rounded-xl transition-colors',
                  revealed[item.id]
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100',
                )}
              >
                {revealed[item.id] ? 'Ocultar respuesta' : 'Ver respuesta'}
              </button>
              {revealed[item.id] && (
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                  <p className="text-indigo-600 font-black">{item.correctAnswer}</p>
                  <p className="text-sm text-slate-500">{item.explanation}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {!loading && (
        <button
          onClick={loadVocabulary}
          className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white rounded-2xl font-black hover:bg-indigo-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Generar nueva lista
        </button>
      )}
    </div>
  );
}
