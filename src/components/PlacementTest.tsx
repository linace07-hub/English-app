import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  ArrowRight, 
  CheckCircle2, 
  XCircle,
  Brain,
  Star,
  Zap,
  User,
  Sparkles,
  RefreshCw,
  Clock,
  ChevronRight
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

interface PlacementTestProps {
  onComplete: (level: string, userName: string, avatarSeed: string) => void;
}

export function PlacementTest({ onComplete }: PlacementTestProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [phase, setPhase] = useState<'profile' | 'loading' | 'test' | 'result'>('profile');
  const [isAnswered, setIsAnswered] = useState(false);

  // Profile data
  const [userName, setUserName] = useState('');
  const [avatarSeed, setAvatarSeed] = useState('');
  const [dailyGoal, setDailyGoal] = useState<'casual' | 'regular' | 'intense'>('regular');
  const [errorMsg, setErrorMsg] = useState('');

  // Pre-seed names for avatars
  const randomSeeds = ['Sam', 'Mia', 'Dan', 'Emma', 'Santi', 'Sofia', 'Lucia', 'Mateo', 'Valen', 'Juaco'];

  useEffect(() => {
    // Generate an initial random avatar seed
    const randomName = randomSeeds[Math.floor(Math.random() * randomSeeds.length)];
    setAvatarSeed(randomName + Math.floor(Math.random() * 90 + 10));
  }, []);

  const handleRandomizeAvatar = () => {
    const randomName = randomSeeds[Math.floor(Math.random() * randomSeeds.length)];
    setAvatarSeed(randomName + Math.floor(Math.random() * 900 + 100));
  };

  const fetchTest = async () => {
    if (!userName.trim()) {
      setErrorMsg('Por favor ingresa tu nombre de usuario para continuar.');
      return;
    }
    setErrorMsg('');
    setPhase('loading');
    try {
      const res = await fetch('/api/generate-placement-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data && data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
        setPhase('test');
      } else {
        throw new Error('No questions returned');
      }
    } catch (e) {
      console.error('Error generating AI test, using fallback questions:', e);
      // Fallback questions to ensure user is NEVER stuck under any network/API quota conditions!
      const fallbackQuestions: Question[] = [
        {
          level: 'A1',
          question: 'Choose the correct greeting: "How ____ you today?"',
          options: ['am', 'is', 'are', 'be'],
          correctAnswer: 'are',
          explanation: 'We use "are" for the subject "you".'
        },
        {
          level: 'A1',
          question: 'What is the opposite of the adjective "old"?',
          options: ['new', 'young', 'soft', 'hot'],
          correctAnswer: 'young',
          explanation: '"Young" is the opposite of "old" for people.'
        },
        {
          level: 'A1',
          question: 'Complete: "She ____ english on Mondays."',
          options: ['studies', 'study', 'studying', 'studied'],
          correctAnswer: 'studies',
          explanation: 'Third person singular present tense gets "-ies" (studies).'
        },
        {
          level: 'A2',
          question: 'Identify the past tense: "He ______ to Paris last week."',
          options: ['go', 'goes', 'went', 'gone'],
          correctAnswer: 'went',
          explanation: '"Went" is the irregular past tense of "go".'
        },
        {
          level: 'A2',
          question: 'Choose: "This laptop is ______ than mine."',
          options: ['more fast', 'faster', 'fastest', 'more faster'],
          correctAnswer: 'faster',
          explanation: 'For short adjectives, we add "-er" for comparisons.'
        },
        {
          level: 'A2',
          question: 'How do you ask about current weather?',
          options: ['What is the weather like?', 'How is weather?', 'What weather have you?', 'Is weather good?'],
          correctAnswer: 'What is the weather like?',
          explanation: '"What is the weather like?" is the standard question structure.'
        },
        {
          level: 'A2',
          question: 'Select the quantity: "There isn\'t _______ milk in the fridge."',
          options: ['many', 'some', 'any', 'no'],
          correctAnswer: 'any',
          explanation: 'We use "any" for negative sentences with uncountable nouns.'
        },
        {
          level: 'B1',
          question: 'Fill in: "If it ______ tomorrow, we will stay at home."',
          options: ['rains', 'rain', 'will rain', 'rained'],
          correctAnswer: 'rains',
          explanation: 'First conditional uses present simple in the "if" clause.'
        },
        {
          level: 'B1',
          question: 'Choose: "I ______ since 2018."',
          options: ['am studying', 'studied', 'have been studying', 'study'],
          correctAnswer: 'have been studying',
          explanation: 'Present perfect continuous expresses an action starting in past continuing to now.'
        },
        {
          level: 'B1',
          question: 'Complete: "The thief ________ by the police last night."',
          options: ['was caught', 'caught', 'is caught', 'has caught'],
          correctAnswer: 'was caught',
          explanation: 'Past passive structure are Form of To Be (was) + Past Participle (caught).'
        }
      ];
      setQuestions(fallbackQuestions);
      setPhase('test');
    }
  };

  const handleSkipTestAndSelectLevel = (selectedLevel: string) => {
    const finalUserName = userName.trim() || 'Estudiante';
    onComplete(selectedLevel, finalUserName, avatarSeed);
  };

  const handleCheck = () => {
    if (!selectedOption) return;
    const isCorrect = selectedOption === questions[currentIndex].correctAnswer;
    setAnswers([...answers, isCorrect]);
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
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
    if (correctA2 >= 2) return 'A2';
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

  // --- PHASE 1: CREATE PROFILE & INITIAL SELECTION ---
  if (phase === 'profile') {
    const finalName = userName.trim() || 'Estudiante';
    return (
      <div className="fixed inset-0 bg-[#F8FAFC] z-[60] overflow-y-auto flex flex-col items-center justify-center p-4 py-12 md:p-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-3xl w-full bg-white rounded-[3rem] border border-slate-100 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12"
        >
          {/* Left Decorative panel */}
          <div className="md:col-span-5 bg-indigo-600 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 to-indigo-500 opacity-90" />
            
            <div className="relative z-10 space-y-8">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-md">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="space-y-4">
                <span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest bg-white/10 px-3 py-1.5 rounded-full inline-block">Planes Inteligentes</span>
                <h3 className="text-3xl font-black leading-tight">Aprende Inglés en 5 Minutos</h3>
                <p className="text-indigo-100 text-sm leading-relaxed">
                  Creamos un ecosistema interactivo a tu medida para optimizar el aprendizaje de vocabulario y gramática del día a día.
                </p>
              </div>
            </div>

            <div className="relative z-10 pt-12 md:pt-0">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-4 rounded-2xl border border-white/10">
                <Clock className="w-5 h-5 text-amber-300 fill-current" />
                <div>
                  <h5 className="text-xs font-black">Soporte Offline Integrado</h5>
                  <p className="text-[10px] text-indigo-200">LocalState activo con persistencia garantizada.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right form panel */}
          <div className="md:col-span-7 p-8 md:p-12 space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Crear tu Perfil</h2>
              <p className="text-xs text-slate-400 font-medium font-semibold">Configura tu identidad académica antes de comenzar.</p>
            </div>

            <div className="space-y-6">
              {/* Avatar Generation */}
              <div className="flex items-center gap-5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="relative">
                  <div className="w-16 h-16 bg-indigo-100 rounded-2xl border-2 border-slate-100 overflow-hidden shadow-sm flex items-center justify-center">
                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`} alt="Avatar preview" />
                  </div>
                  <button 
                    onClick={handleRandomizeAvatar}
                    className="absolute -bottom-1 -right-1 bg-indigo-600 text-white p-1.5 rounded-lg shadow hover:scale-110 active:scale-95 transition-all"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-700">Tu Avatar Inteligente</h4>
                  <p className="text-[10px] text-slate-400 font-medium">Personalizado con tu seed favorita.</p>
                </div>
              </div>

              {/* Name field */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nombre Completo o Nickname</label>
                <input 
                  type="text" 
                  value={userName} 
                  onChange={(e) => { setUserName(e.target.value); setErrorMsg(''); }}
                  placeholder="Ej: Laura Gonzalez"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-[1.2rem] text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                />
              </div>

              {/* Intensity Goals */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Meta diaria de estudio</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'casual', label: 'Casual', time: '5m/Día' },
                    { id: 'regular', label: 'Regular', time: '15m/Día' },
                    { id: 'intense', label: 'Intenso', time: '30m/Día' }
                  ].map((goal) => (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => setDailyGoal(goal.id as any)}
                      className={cn(
                        "p-4 rounded-xl border-2 text-center transition-all flex flex-col items-center justify-center gap-1",
                        dailyGoal === goal.id 
                          ? "border-indigo-600 bg-indigo-50/50 text-indigo-900" 
                          : "border-slate-100 hover:border-slate-300 text-slate-500"
                      )}
                    >
                      <span className="text-xs font-black">{goal.label}</span>
                      <span className="text-[10px] font-bold opacity-75">{goal.time}</span>
                    </button>
                  ))}
                </div>
              </div>

              {errorMsg && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl text-xs font-semibold">
                  {errorMsg}
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3 pt-4">
                <button 
                  onClick={fetchTest}
                  disabled={!userName.trim()}
                  className="w-full py-4.5 bg-indigo-600 disabled:opacity-50 text-white rounded-[1.5rem] font-black shadow-xl shadow-indigo-100 hover:scale-[1.01] active:scale-95 transition-all text-md flex items-center justify-center gap-3 border-b-4 border-indigo-800"
                >
                  <Brain className="w-5 h-5" /> Determinar mi Nivel con IA
                </button>

                <div className="relative flex py-3 items-center">
                  <div className="flex-grow border-t border-slate-100"></div>
                  <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-black uppercase tracking-widest bg-white">O, selecciona manualmente</span>
                  <div className="flex-grow border-t border-slate-100"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'A1', label: 'Principiante A1' },
                    { id: 'A2', label: 'Elemental A2' },
                    { id: 'B1', label: 'Intermedio B1' }
                  ].map((lvl) => (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => {
                        if (!userName.trim()) {
                          setErrorMsg('Por favor ingresa tu nombre de usuario primero.');
                          return;
                        }
                        handleSkipTestAndSelectLevel(lvl.id);
                      }}
                      className="py-3 px-2 bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-slate-100 rounded-xl text-center text-xs font-black text-slate-700 transition-all flex items-center justify-center gap-1.5"
                    >
                      {lvl.label} <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- PHASE 4: RESULT ---
  if (phase === 'result') {
    const finalLevel = calculateLevel();
    const finalUserName = userName.trim() || 'Estudiante';
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
          <p className="text-slate-500 font-medium text-xl mb-12">Según tus respuestas, tu nivel recomendado es:</p>
          
          <div className="bg-slate-50 p-8 rounded-[2.5rem] border-2 border-slate-100 mb-12 flex flex-col items-center gap-4">
            <span className="text-7xl font-black text-indigo-600">{finalLevel}</span>
            <span className="text-lg font-black text-slate-400 uppercase tracking-[0.2em]">
              {finalLevel === 'A1' ? 'Principiante A1' : finalLevel === 'A2' ? 'Elemental A2' : 'Intermedio B1'}
            </span>
          </div>

          <button 
            onClick={() => onComplete(finalLevel, finalUserName, avatarSeed)}
            className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black shadow-2xl hover:scale-[1.02] active:scale-95 transition-all text-xl"
          >
            ¡Empezar mi Ruta Personalizada!
          </button>
        </motion.div>
      </div>
    );
  }

  // --- PHASE 3: ACTIVE PLACEMENT QUESTIONS ---
  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="fixed inset-0 bg-[#FDFDFD] z-[60] flex flex-col">
      {/* Header */}
      <div className="h-24 bg-white border-b border-slate-100 flex items-center px-8 sm:px-12">
        <div className="flex-1 max-w-4xl mx-auto flex items-center gap-12">
          <div className="flex-1">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Test de Nivelación Inteligente</span>
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
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Dificultad {currentQuestion.level}</span>
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
                      ? "border-indigo-600 bg-indigo-50 shadow-lg translate-x-1" 
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
                  className="bg-indigo-50 p-6 rounded-[2rem] border border-indigo-100/60 flex gap-4"
                >
                  <Zap className="w-6 h-6 text-indigo-600 shrink-0 fill-indigo-100" />
                  <p className="text-indigo-900 text-sm font-semibold leading-relaxed">
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
