import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

export function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<any[]>([
        { role: 'assistant', content: '¡Hola! Soy tu tutor Linguae AI. ¿Tienes alguna duda sobre la lección de hoy?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMsg = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setLoading(true);

        try {
            const res = await fetch('/api/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: userMsg, context: 'Dashboard conversation' })
            });
            const data = await res.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.answer }]);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Toggle Button */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-8 right-8 w-16 h-16 bg-indigo-600 rounded-3xl shadow-2xl shadow-indigo-600/40 flex items-center justify-center group hover:scale-110 transition-all z-40 border-b-4 border-indigo-800 active:border-b-0 active:translate-y-1"
            >
                {isOpen ? <X className="text-white w-8 h-8" /> : <Sparkles className="text-white w-8 h-8 animate-hover" />}
            </button>

            {/* Chat Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-28 right-8 w-96 max-h-[600px] h-[80vh] bg-white rounded-[32px] shadow-2xl border border-slate-100 flex flex-col overflow-hidden z-40"
                    >
                        {/* Header */}
                        <div className="p-6 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                                    <Bot className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold tracking-tight">Linguae AI</h3>
                                    <p className="text-[10px] uppercase font-black tracking-widest text-indigo-200">Tutor Inteligente 24/7</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-5 bg-[#FDFDFD]">
                            {messages.map((m, i) => (
                                <div key={i} className={cn(
                                    "flex gap-3",
                                    m.role === 'user' ? "flex-row-reverse" : ""
                                )}>
                                    <div className={cn(
                                        "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
                                        m.role === 'user' ? "bg-indigo-100" : "bg-slate-100"
                                    )}>
                                        {m.role === 'user' ? <User className="w-4 h-4 text-indigo-600" /> : <Bot className="w-4 h-4 text-slate-600" />}
                                    </div>
                                    <div className={cn(
                                        "p-4 rounded-2xl max-w-[85%] text-sm leading-relaxed shadow-sm transition-all",
                                        m.role === 'user' ? "bg-indigo-600 text-white rounded-tr-none" : "bg-white text-slate-700 rounded-tl-none border border-slate-100"
                                    )}>
                                        {m.content}
                                    </div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
                                        <Bot className="w-4 h-4 text-slate-600" />
                                    </div>
                                    <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 flex gap-1.5 shadow-sm">
                                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
                                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Input */}
                        <div className="p-6 pt-2 border-t border-slate-50">
                            <div className="relative">
                                <input 
                                    type="text" 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="¿En qué puedo ayudarte?"
                                    className="w-full pl-6 pr-14 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/30 focus:bg-white transition-all shadow-inner"
                                />
                                <button 
                                    onClick={handleSend}
                                    disabled={!input.trim() || loading}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-indigo-200"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
