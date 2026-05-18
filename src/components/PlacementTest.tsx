import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  ArrowRight, 
  CheckCircle2, 
  XCircle,
  Brain,
  Star,
  Zap,
  Layout
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface Question {
  level: 'A1' | 'A2' | 'B1';
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

export function PlacementTest({ onComplete }: { onComplete: (level: string) => void }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [phase, setPhase] = useState<'loading' | 'intro' | 'test' | 'result'>('intro');
  const [isAnswered, setIsAnswered] = useState(false);

  const fetchTest = async () => {
    setPhase('loading');
    try {
      const res = await fetch('/api/generate-placement-test', {
        method: 'POST'
      });
      const data = await res.json();
      setQuestions(data.questions);
      setPhase('test');
    } catch (e) {
      console.error(e);
      setPhase('intro');
    }
  };

  const handleCheck = () => {
    if (!selectedOption) return;
    const isCorrect = selectedOption === questions[currentIndex].correctAnswer;
    setAnswers([...answers, isCorrect]);
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setPhase('result');
    }
  };

  const calculateLevel = () => {
    const correctA1 = questions.filter((q, i) => q.level === 'A1' && answers[i]).length;
    const correctA2 = questions.filter((q, i) => q.level === 'A2' && answers[i]).length;
    const correctB1 = questions.filter((q, i) => q.level === 'B1' && answers[i]).length;

    if (correctB1 >= 2) return 'B1';
    if (correctA2 >= 3) return 'A2';
    return 'A1';
  };

  if (phase === 'loading') {
    return (
      <div className="fixed inset-0 bg-white z-[60] flex flex-col items-center justify-center p-8">
        <div className="w-20 h-20 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin mb-8" />
        <h3 className="text-xl font-black text-slate-800 animate-pulse uppercase tracking-widest text-center">
          Generando tu Test de Nivelación...
        </h3>
        <p className="text-slate-400 font-medium mt-2">Estamos preparando 10 preguntas inteligentes para ti.</p>
      </div>
    );
  }

  if (phase === 'intro') {
    return (
      <div className="fixed inset-0 bg-slate-50 z-[60] flex flex-col items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl w-full bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-indigo-100 border border-slate-100 text-center"
        >
          <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-lg">
            <Brain className="w-12 h-12" />
          </div>
          <h2 className="text-4xl font-black text-slate-900 mb-6 leading-tight">Descubre tu Nivel</h2>
          <p className="text-slate-500 font-medium mb-10 text-lg leading-relaxed">
            Responde 10 preguntas rápidas para que podamos personalizar tu ruta de aprendizaje de forma inteligente.
          </p>
          <button 
            onClick={fetchTest}
            className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black shadow-xl shadow-indigo-200 hover:scale-[1.02] active:scale-95 transition-all text-lg flex items-center justify-center gap-3"
          >
            Empezar Test <ArrowRight className="w-6 h-6" />
          </button>
        </motion.div>
      </div>
    );
  }

  if (phase === 'result') {
    const finalLevel = calculateLevel();
    return (
      <div className="fixed inset-0 bg-white z-[60] flex flex-col items-center justify-center p-8">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-lg w-full text-center"
        >
          <div className="w-32 h-32 bg-amber-100 text-amber-600 rounded-[3rem] flex items-center justify-center mx-auto mb-8 shadow-xl relative">
            <Trophy className="w-16 h-16" />
            <motion.div 
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-4 -right-4 bg-indigo-600 text-white p-3 rounded-2xl shadow-lg"
            >
              <Star className="w-6 h-6 fill-current" />
            </motion.div>
          </div>
          <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tight">¡Test Finalizado!</h2>
          <p className="text-slate-500 font-medium text-xl mb-12">Según tus respuestas, tu nivel actual es:</p>
          
          <div className="bg-slate-50 p-8 rounded-[2.5rem] border-2 border-slate-100 mb-12 flex flex-col items-center gap-4">
            <span className="text-7xl font-black text-indigo-600">{finalLevel}</span>
            <span className="text-lg font-black text-slate-400 uppercase tracking-[0.2em]">
              {finalLevel === 'A1' ? 'Principiante' : finalLevel === 'A2' ? 'Elemental' : 'Intermedio'}
            </span>
          </div>

          <button 
            onClick={() => onComplete(finalLevel)}
            className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black shadow-2xl hover:scale-[1.02] active:scale-95 transition-all text-xl"
          >
            ¡Empezar mi Ruta Personalizada!
          </button>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="fixed inset-0 bg-[#FDFDFD] z-[60] flex flex-col">
      {/* Header */}
      <div className="h-24 bg-white border-b border-slate-100 flex items-center px-8 sm:px-12">
        <div className="flex-1 max-w-4xl mx-auto flex items-center gap-12">
          <div className="flex-1">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Test de Nivelación</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{currentIndex + 1} de {questions.length}</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-indigo-600 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Test Body */}
      <div className="flex-1 overflow-y-auto p-8 sm:p-12">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-12"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest rounded-lg">
                  Pregunta {currentIndex + 1}
                </span>
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Nivel {currentQuestion.level}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-slate-900 leading-tight">
                {currentQuestion.question}
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => setSelectedOption(option)}
                  className={cn(
                    "p-6 rounded-[2rem] text-left border-3 transition-all duration-300 flex items-center justify-between group",
                    selectedOption === option 
                      ? "border-indigo-600 bg-indigo-50 shadow-lg translate-x-2" 
                      : "border-slate-100 hover:border-slate-300 hover:bg-slate-50",
                    isAnswered && option === currentQuestion.correctAnswer && "border-green-500 bg-green-50",
                    isAnswered && selectedOption === option && option !== currentQuestion.correctAnswer && "border-rose-500 bg-rose-50"
                  )}
                >
                  <span className={cn(
                    "text-lg font-bold",
                    selectedOption === option ? "text-indigo-900" : "text-slate-600"
                  )}>
                    {option}
                  </span>

                  {isAnswered && option === currentQuestion.correctAnswer && <CheckCircle2 className="w-6 h-6 text-green-500" />}
                  {isAnswered && selectedOption === option && option !== currentQuestion.correctAnswer && <XCircle className="w-6 h-6 text-rose-500" />}
                </button>
              ))}
            </div>

            <AnimatePresence>
              {isAnswered && currentQuestion.explanation && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100 flex gap-4"
                >
                  <Zap className="w-6 h-6 text-indigo-600 shrink-0" />
                  <p className="text-indigo-900 text-sm font-medium leading-relaxed">
                    {currentQuestion.explanation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-8 sm:p-12 bg-white border-t border-slate-100">
        <div className="max-w-3xl mx-auto">
          {!isAnswered ? (
            <button
              onClick={handleCheck}
              disabled={!selectedOption}
              className="w-full py-6 bg-indigo-600 text-white rounded-[2rem] font-black shadow-xl shadow-indigo-200 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all text-xl"
            >
              Comprobar Respuesta
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black shadow-xl hover:scale-[1.02] active:scale-95 transition-all text-xl flex items-center justify-center gap-3"
            >
              Siguiente Pregunta <ArrowRight className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
