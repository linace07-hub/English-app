import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Volume2, 
  Info,
  ChevronLeft,
  Zap,
  HelpCircle,
  Sparkles,
  Bot,
  BookOpen,
  Trophy
} from 'lucide-react';
import { cn } from '../lib/utils';

export function LessonView({ level, onExit, onComplete, onMistake }: { level: string, onExit: () => void, onComplete: (xp: number) => void, onMistake: () => void }) {
    const [lessonData, setLessonData] = useState<any>(null);
    const [phase, setPhase] = useState<'intro' | 'vocabulary' | 'explanation' | 'practice' | 'complete'>('intro');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [fillValue, setFillValue] = useState('');
    const [orderedWords, setOrderedWords] = useState<string[]>([]);
    const [isAnswered, setIsAnswered] = useState(false);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ correct: 0, total: 0 });
    const [feedback, setFeedback] = useState<{ successMessage?: string, elegantFeedback?: string, whyIncorrect: string, grammarErrors?: string, recommendation: string } | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    useEffect(() => {
        fetchLesson();
    }, [level]);

    const fetchLesson = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/generate-lesson', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    level: level, 
                    topic: level === 'A1' ? 'Greetings & Introductions' : level === 'A2' ? 'Daily Routine' : 'Professional Emails' 
                })
            });
            const data = await res.json();
            setLessonData(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const fetchFeedback = async (userAnswer: string, isCorrect: boolean) => {
        setIsAnalyzing(true);
        try {
            const res = await fetch('/api/analyze-mistake', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: lessonData.exercises[currentIndex].question,
                    userAnswer,
                    correctAnswer: lessonData.exercises[currentIndex].correctAnswer,
                    type: lessonData.exercises[currentIndex].type,
                    level,
                    isCorrect
                })
            });
            const data = await res.json();
            setFeedback(data);
        } catch (e) {
            console.error(e);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const currentExercise = lessonData?.exercises?.[currentIndex];

    const handleSpeech = () => {
        if (!currentExercise.audioText) return;
        const utterance = new SpeechSynthesisUtterance(currentExercise.audioText);
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    };

    const handleCheck = () => {
        let isCorrect = false;
        let userAnswer = '';
        const type = currentExercise.type;

        if (type === 'multiple-choice' || type === 'vocabulary' || type === 'listening') {
            if (!selectedOption) return;
            userAnswer = selectedOption;
            isCorrect = selectedOption === currentExercise.correctAnswer;
        } else if (type === 'fill-blank') {
            if (!fillValue.trim()) return;
            userAnswer = fillValue.trim();
            isCorrect = userAnswer.toLowerCase() === currentExercise.correctAnswer.toLowerCase();
        } else if (type === 'order-phrase') {
            if (orderedWords.length === 0) return;
            userAnswer = orderedWords.join(' ');
            isCorrect = userAnswer === currentExercise.correctAnswer;
        }

        setIsAnswered(true);
        if (isCorrect) {
            setStats(s => ({ ...s, correct: s.correct + 1 }));
        } else {
            onMistake();
        }
        fetchFeedback(userAnswer, isCorrect);
    };

    const handleNext = () => {
        if (currentIndex < lessonData.exercises.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
            setFillValue('');
            setOrderedWords([]);
            setIsAnswered(false);
            setFeedback(null);
        } else {
            const earnedXP = stats.correct * 50;
            onComplete(earnedXP);
            setPhase('complete');
        }
    };

    if (loading) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center bg-white p-20">
                <div className="w-20 h-20 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin mb-8" />
                <h3 className="text-xl font-black text-slate-800 animate-pulse uppercase tracking-widest text-center">
                    Diseñando tu Microlección...
                </h3>
                <p className="text-slate-400 font-medium mt-2">Nuestro tutor AI está preparando el contenido perfecto para ti.</p>
            </div>
        );
    }

    if (phase === 'intro') {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-2xl w-full bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-indigo-100 border border-slate-100 text-center"
                >
                    <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-lg">
                        <Sparkles className="w-10 h-10" />
                    </div>
                    <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-4">Nivel {level} • Nueva Lección</h3>
                    <h2 className="text-4xl font-black text-slate-900 mb-6 leading-tight">{lessonData.objective}</h2>
                    <button 
                        onClick={() => setPhase('vocabulary')}
                        className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black shadow-xl shadow-indigo-200 hover:scale-[1.02] active:scale-95 transition-all text-lg flex items-center justify-center gap-3"
                    >
                        Comenzar Aprendizaje <ArrowRight className="w-5 h-5" />
                    </button>
                </motion.div>
            </div>
        );
    }

    if (phase === 'vocabulary') {
        return (
            <div className="flex-1 flex flex-col p-8 bg-slate-50 overflow-y-auto">
                <div className="max-w-3xl mx-auto w-full space-y-8 py-12">
                    <div className="text-center mb-12">
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50 px-4 py-2 rounded-full">Fase 1: Vocabulario Clave</span>
                        <h2 className="text-4xl font-black text-slate-900 mt-6 tracking-tight">Palabras para hoy</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                        {lessonData.vocabulary.map((v: any, i: number) => (
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                key={i} 
                                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-6 group hover:border-indigo-200 transition-all"
                            >
                                <div>
                                    <h4 className="text-xl font-black text-indigo-600 mb-1">{v.word}</h4>
                                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{v.meaning}</p>
                                </div>
                                <div className="text-left sm:text-right max-w-full sm:max-w-[50%]">
                                    <p className="text-slate-600 text-sm italic font-medium">"{v.example}"</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                    <button 
                        onClick={() => setPhase('explanation')}
                        className="w-full mt-12 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black shadow-xl hover:scale-[1.02] transition-all text-lg"
                    >
                        Entendido, vamos a la teoría
                    </button>
                </div>
            </div>
        );
    }

    if (phase === 'explanation') {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-2xl w-full bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-indigo-100 border border-indigo-100 border-2"
                >
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900">Grammar Spotlight</h3>
                    </div>
                    <p className="text-slate-600 text-lg font-medium leading-relaxed mb-10">
                        {lessonData.explanation}
                    </p>
                    <button 
                        onClick={() => setPhase('practice')}
                        className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-black shadow-xl shadow-indigo-200 hover:scale-[1.02] transition-all text-lg"
                    >
                        ¡Listo para la práctica!
                    </button>
                </motion.div>
            </div>
        );
    }

    if (phase === 'complete') {
        return (
            <div className="flex-1 flex flex-col items-center justify-center p-8 bg-white">
                <div className="w-32 h-32 bg-green-100 text-green-600 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-xl">
                    <Trophy className="w-16 h-16" />
                </div>
                <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">¡Lección Completada!</h2>
                <p className="text-slate-500 font-medium text-lg mb-10">Has ganado {stats.correct * 50} XP y dominado un nuevo tema.</p>
                <div className="flex gap-4">
                    <button 
                        onClick={onExit}
                        className="px-12 py-5 bg-slate-900 text-white rounded-[1.5rem] font-black shadow-xl hover:scale-105 transition-all"
                    >
                        Volver al Panel
                    </button>
                </div>
            </div>
        );
    }

    const progress = ((currentIndex + 1) / lessonData.exercises.length) * 100;

    return (
        <div className="fixed inset-0 bg-[#FDFDFD] z-50 flex flex-col font-sans">
            {/* Header */}
            <div className="px-8 h-20 flex items-center justify-between border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                <button 
                    onClick={onExit}
                    className="p-3 hover:bg-slate-100 rounded-2xl transition-all group flex items-center gap-2"
                >
                    <ChevronLeft className="w-6 h-6 text-slate-400 group-hover:text-indigo-600" />
                    <span className="text-xs font-black text-slate-400 uppercase group-hover:text-indigo-600 tracking-widest hidden sm:block">Salir</span>
                </button>
                
                <div className="flex-1 max-w-2xl mx-3 sm:mx-12">
                    <div className="flex justify-between items-end mb-2 px-1">
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Tu Progreso</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{currentIndex + 1} de {lessonData.exercises.length}</span>
                    </div>
                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200/50">
                        <motion.div 
                            className="bg-indigo-600 h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-200/50 shadow-sm">
                        <Zap className="w-4 h-4 text-amber-500 fill-current" />
                        <span className="text-sm font-black text-amber-700">4</span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <main className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto bg-gradient-to-b from-white to-slate-50/50">
                <div className="max-w-2xl w-full space-y-12 mb-20 animate-fade-in">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center text-lg font-black shadow-lg shadow-indigo-200">
                                {currentIndex + 1}
                            </div>
                            <div>
                                <h3 className="uppercase text-[10px] font-black tracking-[0.2em] text-slate-400">Nivel {level}</h3>
                                <p className="text-sm font-bold text-indigo-600">
                                    {level === 'A1' ? 'Conceptos Básicos' : level === 'A2' ? 'Rutina Diaria' : 'Viajes y Cultura'}
                                </p>
                            </div>
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 leading-tight tracking-tight">
                            {currentExercise.type === 'listening' ? "Escucha y responde:" : currentExercise.question}
                        </h2>
                    </div>

                    {currentExercise.type === 'listening' && (
                        <div className="flex flex-col items-center gap-6 py-8">
                            <button 
                                onClick={handleSpeech}
                                className="w-32 h-32 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-indigo-200 hover:scale-110 active:scale-95 transition-all text-white group"
                            >
                                <Volume2 className="w-12 h-12 group-hover:animate-pulse" />
                            </button>
                            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Haz clic para escuchar</p>
                        </div>
                    )}

                    {(currentExercise.type === 'multiple-choice' || currentExercise.type === 'vocabulary' || currentExercise.type === 'listening') && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {currentExercise.options?.map((option: string) => {
                                const isSelected = selectedOption === option;
                                const isCorrect = isAnswered && option === currentExercise.correctAnswer;
                                const isWrong = isAnswered && isSelected && option !== currentExercise.correctAnswer;

                                return (
                                    <button
                                        key={option}
                                        disabled={isAnswered}
                                        onClick={() => setSelectedOption(option)}
                                        className={cn(
                                            "p-8 rounded-[2rem] border-2 transition-all duration-300 text-left relative group min-h-[120px] flex flex-col justify-center",
                                            isSelected && !isAnswered && "border-indigo-600 bg-indigo-50 shadow-xl shadow-indigo-100/50 transform -translate-y-1",
                                            !isSelected && !isAnswered && "border-slate-100 bg-white hover:border-slate-300 hover:shadow-lg",
                                            isCorrect && "border-green-500 bg-green-50 shadow-lg shadow-green-100",
                                            isWrong && "border-rose-500 bg-rose-50 shadow-lg shadow-rose-100"
                                        )}
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <span className={cn(
                                                "text-lg font-black leading-snug",
                                                isSelected || isCorrect ? "text-slate-900" : "text-slate-600"
                                            )}>
                                                {option}
                                            </span>
                                            <div className={cn(
                                                "w-8 h-8 rounded-xl shrink-0 flex items-center justify-center border-2 transition-colors",
                                                isCorrect ? "bg-green-500 border-green-500" : 
                                                isWrong ? "bg-rose-500 border-rose-500" : 
                                                isSelected ? "bg-indigo-600 border-indigo-600" : "bg-white border-slate-100"
                                            )}>
                                                {isCorrect && <CheckCircle2 className="w-5 h-5 text-white" />}
                                                {isWrong && <XCircle className="w-5 h-5 text-white" />}
                                                {!isCorrect && !isWrong && isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}

                    {currentExercise.type === 'fill-blank' && (
                        <div className="space-y-6">
                            <input 
                                type="text"
                                value={fillValue}
                                disabled={isAnswered}
                                onChange={(e) => setFillValue(e.target.value)}
                                placeholder="Escribe aquí..."
                                className={cn(
                                    "w-full p-8 bg-white border-2 rounded-[2rem] text-2xl font-black focus:outline-none transition-all shadow-sm",
                                    isAnswered && fillValue.toLowerCase() === currentExercise.correctAnswer.toLowerCase() ? "border-green-500 bg-green-50" :
                                    isAnswered ? "border-rose-500 bg-rose-50" : "border-slate-100 focus:border-indigo-600 focus:shadow-xl"
                                )}
                            />
                        </div>
                    )}

                    {currentExercise.type === 'order-phrase' && (
                        <div className="space-y-12">
                            {/* Area to drop words */}
                            <div className="min-h-[100px] p-6 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-wrap gap-2 bg-slate-50/50">
                                {orderedWords.map((word, idx) => (
                                    <button 
                                        key={idx}
                                        disabled={isAnswered}
                                        onClick={() => setOrderedWords(prev => prev.filter((_, i) => i !== idx))}
                                        className="px-6 py-3 bg-white border-2 border-slate-100 rounded-xl font-bold shadow-sm hover:border-indigo-600 transition-all animate-fade-in"
                                    >
                                        {word}
                                    </button>
                                ))}
                            </div>

                            {/* Options */}
                            <div className="flex flex-wrap justify-center gap-3">
                                {currentExercise.scrambledWords?.map((word: string, idx: number) => {
                                    const isUsed = orderedWords.includes(word);
                                    return (
                                        <button
                                            key={idx}
                                            disabled={isAnswered || isUsed}
                                            onClick={() => setOrderedWords(prev => [...prev, word])}
                                            className={cn(
                                                "px-8 py-4 bg-white border-2 rounded-2xl font-black transition-all shadow-md",
                                                isUsed ? "opacity-20 translate-y-1" : "hover:border-indigo-600 hover:-translate-y-1 active:translate-y-0"
                                            )}
                                        >
                                            {word}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </main>

            {/* AI Feedback / Explanation */}
            <AnimatePresence>
                {isAnswered && (
                    <motion.div 
                        initial={{ y: 200 }}
                        animate={{ y: 0 }}
                        exit={{ y: 200 }}
                        className={cn(
                            "fixed bottom-0 left-0 right-0 p-5 sm:p-10 border-t-4 shadow-2xl max-h-[85vh] overflow-y-auto z-40",
                            selectedOption === currentExercise.correctAnswer 
                                ? "bg-white border-green-500" 
                                : "bg-white border-rose-500"
                        )}
                    >
                        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="flex gap-6 items-start">
                                <div className={cn(
                                    "p-4 rounded-2xl h-fit shadow-lg",
                                    (isAnswered && (
                                        (currentExercise.type === 'multiple-choice' && selectedOption === currentExercise.correctAnswer) ||
                                        (currentExercise.type === 'vocabulary' && selectedOption === currentExercise.correctAnswer) ||
                                        (currentExercise.type === 'listening' && selectedOption === currentExercise.correctAnswer) ||
                                        (currentExercise.type === 'fill-blank' && fillValue.toLowerCase() === currentExercise.correctAnswer.toLowerCase()) ||
                                        (currentExercise.type === 'order-phrase' && orderedWords.join(' ') === currentExercise.correctAnswer)
                                    )) ? "bg-green-500 text-white" : "bg-rose-500 text-white"
                                )}>
                                    <Sparkles className="w-8 h-8" />
                                </div>
                                <div>
                                    <h4 className={cn(
                                        "text-2xl font-black mb-2 tracking-tight",
                                        (isAnswered && (
                                            (currentExercise.type === 'multiple-choice' && selectedOption === currentExercise.correctAnswer) ||
                                            (currentExercise.type === 'vocabulary' && selectedOption === currentExercise.correctAnswer) ||
                                            (currentExercise.type === 'listening' && selectedOption === currentExercise.correctAnswer) ||
                                            (currentExercise.type === 'fill-blank' && fillValue.toLowerCase() === currentExercise.correctAnswer.toLowerCase()) ||
                                            (currentExercise.type === 'order-phrase' && orderedWords.join(' ') === currentExercise.correctAnswer)
                                        )) ? "text-green-900" : "text-rose-900"
                                    )}>
                                        {(isAnswered && (
                                            (currentExercise.type === 'multiple-choice' && selectedOption === currentExercise.correctAnswer) ||
                                            (currentExercise.type === 'vocabulary' && selectedOption === currentExercise.correctAnswer) ||
                                            (currentExercise.type === 'listening' && selectedOption === currentExercise.correctAnswer) ||
                                            (currentExercise.type === 'fill-blank' && fillValue.toLowerCase() === currentExercise.correctAnswer.toLowerCase()) ||
                                            (currentExercise.type === 'order-phrase' && orderedWords.join(' ') === currentExercise.correctAnswer)
                                        )) ? "¡Excelente trabajo!" : "Casi lo logras, observa:"}
                                    </h4>
                                    
                                    {isAnalyzing ? (
                                        <div className="flex items-center gap-3 text-slate-400 font-medium">
                                            <div className="w-4 h-4 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin" />
                                            <span>El tutor está analizando tu respuesta...</span>
                                        </div>
                                    ) : feedback ? (
                                        <div className="space-y-4 max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
                                            {feedback.successMessage ? (
                                                <div className="bg-green-50 p-6 rounded-[2rem] border border-green-100 flex flex-col gap-2">
                                                    <span className="text-[10px] font-black uppercase text-green-500 tracking-widest">Feedback AI</span>
                                                    <p className="text-green-900 text-lg font-black leading-tight">
                                                        {feedback.successMessage}
                                                    </p>
                                                </div>
                                            ) : (
                                                <>
                                                    {feedback.elegantFeedback && (
                                                        <div className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100 flex flex-col gap-2">
                                                            <span className="text-[10px] font-black uppercase text-indigo-500 tracking-widest">Feedback AI</span>
                                                            <p className="text-indigo-900 text-lg font-black leading-tight italic">
                                                                {feedback.elegantFeedback}
                                                            </p>
                                                        </div>
                                                    )}
                                                    <div className="bg-white/50 p-4 rounded-2xl border border-rose-100 flex flex-col gap-1">
                                                        <span className="text-[10px] font-black uppercase text-rose-400 tracking-widest">¿Por qué es incorrecto?</span>
                                                        <p className="text-slate-600 text-sm font-medium">{feedback.whyIncorrect}</p>
                                                    </div>
                                                    <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100 flex flex-col gap-1">
                                                        <span className="text-[10px] font-black uppercase text-amber-500 tracking-widest">Mejora recomendada</span>
                                                        <p className="text-slate-600 text-sm font-medium">{feedback.recommendation}</p>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-slate-600 text-sm font-medium leading-relaxed max-w-lg">
                                            {currentExercise.explanation}
                                        </p>
                                    )}
                                </div>
                            </div>
                            
                            <div className="flex flex-col gap-4 min-w-[220px] w-full md:w-auto">
                                <button className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors p-2">
                                    <Bot className="w-4 h-4" />
                                    Explicación Detallada
                                </button>
                                <button
                                    onClick={handleNext}
                                    className={cn(
                                        "w-full py-5 px-10 rounded-[1.5rem] font-black text-lg flex items-center justify-center gap-3 shadow-xl transition-all active:scale-95",
                                        (isAnswered && (
                                            (currentExercise.type === 'multiple-choice' && selectedOption === currentExercise.correctAnswer) ||
                                            (currentExercise.type === 'vocabulary' && selectedOption === currentExercise.correctAnswer) ||
                                            (currentExercise.type === 'listening' && selectedOption === currentExercise.correctAnswer) ||
                                            (currentExercise.type === 'fill-blank' && fillValue.toLowerCase() === currentExercise.correctAnswer.toLowerCase()) ||
                                            (currentExercise.type === 'order-phrase' && orderedWords.join(' ') === currentExercise.correctAnswer)
                                        )) 
                                            ? "bg-green-500 text-white shadow-green-100 hover:bg-green-600" 
                                            : "bg-rose-500 text-white shadow-rose-100 hover:bg-rose-600"
                                    )}
                                >
                                    Siguiente
                                    <ArrowRight className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bottom Bar (initial state) */}
            {!isAnswered && (
                <div className="p-10 border-t border-slate-100 bg-white">
                    <div className="max-w-4xl mx-auto flex items-center justify-between">
                        <button 
                            onClick={handleNext}
                            className="text-slate-400 font-black uppercase text-[10px] tracking-[0.2em] hover:text-slate-600 px-4 py-2"
                        >
                            Saltar
                        </button>
                        <button
                            disabled={!selectedOption && !fillValue.trim() && orderedWords.length === 0}
                            onClick={handleCheck}
                            className={cn(
                                "py-5 px-16 rounded-[2rem] font-black text-sm uppercase tracking-[0.15em] transition-all",
                                (selectedOption || fillValue.trim() || orderedWords.length > 0) 
                                    ? "bg-indigo-600 text-white shadow-indigo-200 shadow-2xl hover:bg-indigo-700 transform hover:scale-105 active:scale-95" 
                                    : "bg-slate-100 text-slate-300 cursor-not-allowed"
                            )}
                        >
                            Comprobar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
