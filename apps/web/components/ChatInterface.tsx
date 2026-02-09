"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Cpu, Sparkles, Zap, Globe, Github } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export default function ChatInterface() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [provider, setProvider] = useState(process.env.NEXT_PUBLIC_API_URL ? 'openai' : 'ollama');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        try {
            const response = await fetch(`${apiUrl}/api/v1/chat/message`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [...messages, userMessage],
                    model: provider === 'openai' ? 'gpt-4o' : 'llama3',
                    provider: provider
                }),
            });

            if (!response.body) throw new Error('No response body');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let assistantMessage = '';

            setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const text = decoder.decode(value);
                assistantMessage += text;

                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1].content = assistantMessage;
                    return newMessages;
                });
            }
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: '🔴 Error: No se pudo conectar con el Núcleo AION.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
            {/* Glass Header */}
            <div className="glass-panel rounded-2xl p-4 mb-6 flex justify-between items-center sticky top-4 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <Sparkles className="text-white" size={20} />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-emerald-400 to-teal-200 tracking-tight">
                            AION OS
                        </h1>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-xs text-blue-200/60 font-medium tracking-wide">SISTEMA EN LÍNEA</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-950/50 border border-white/5 mx-2">
                        <Globe size={14} className="text-blue-400" />
                        <span className="text-xs text-slate-400">
                            {process.env.NEXT_PUBLIC_API_URL ? `Cloud: ${process.env.NEXT_PUBLIC_API_URL.replace('https://', '')}` : 'Localhost:8000'}
                        </span>
                    </div>

                    <div className="relative group">
                        <select
                            value={provider}
                            onChange={(e) => setProvider(e.target.value)}
                            className="appearance-none bg-slate-900/80 border border-white/10 rounded-xl text-sm text-slate-300 pl-4 pr-10 py-2.5 outline-none focus:border-blue-500/50 cursor-pointer hover:bg-slate-800 transition-colors shadow-lg"
                        >
                            <option value="ollama">🦙 Llama 3 (Local)</option>
                            <option value="openai">🧠 GPT-4o (Nube)</option>
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                            <Zap size={14} className="text-blue-400/70" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-4 mb-4 custom-scrollbar relative">
                {messages.length === 0 && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <div className="relative">
                            <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full w-64 h-64" />
                            <div className="glass-panel w-32 h-32 rounded-3xl flex items-center justify-center mb-8 relative z-10 border-white/10">
                                <Cpu size={64} className="text-blue-400 animate-pulse" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">Bienvenido, Usuario.</h2>
                        <p className="text-slate-400 text-center max-w-sm leading-relaxed">
                            Soy AION, tu asistente cognitivo avanzado. ¿En qué puedo ayudarte hoy?
                        </p>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} group animate-in slide-in-from-bottom-2 duration-300`}>
                        {msg.role === 'assistant' && (
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center border border-white/10 shadow-lg shrink-0 mt-1">
                                <Bot size={20} className="text-emerald-400" />
                            </div>
                        )}

                        <div className={`max-w-[85%] lg:max-w-[75%] rounded-2xl px-6 py-4 shadow-xl backdrop-blur-sm ${msg.role === 'user'
                            ? 'bg-blue-600 text-white shadow-blue-900/20 rounded-tr-none'
                            : 'glass-panel text-slate-200 rounded-tl-none border-white/5'
                            }`}>
                            {msg.role === 'user' ? (
                                <p className="leading-relaxed font-light text-[15px]">{msg.content}</p>
                            ) : (
                                <div className="prose prose-invert prose-p:leading-relaxed prose-base max-w-none">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            code({ node, inline, className, children, ...props }: any) {
                                                const match = /language-(\w+)/.exec(className || '')
                                                return !inline && match ? (
                                                    <div className="relative group/code my-4">
                                                        <div className="absolute -inset-2 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 rounded-xl blur-lg transition-all opacity-0 group-hover/code:opacity-100" />
                                                        <div className="relative rounded-xl bg-slate-950 border border-white/10 p-4 shadow-xl overflow-hidden">
                                                            <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/5">
                                                                <span className="text-xs text-slate-500 font-mono uppercase">{match[1]}</span>
                                                                <div className="flex gap-1.5">
                                                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
                                                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
                                                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/20" />
                                                                </div>
                                                            </div>
                                                            <code className={`${className} font-mono text-sm leading-relaxed`} {...props}>
                                                                {children}
                                                            </code>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <code className="bg-slate-800/50 rounded px-1.5 py-0.5 text-sm font-mono text-emerald-300 border border-emerald-500/20" {...props}>
                                                        {children}
                                                    </code>
                                                )
                                            }
                                        }}
                                    >{msg.content}</ReactMarkdown>
                                </div>
                            )}
                        </div>

                        {msg.role === 'user' && (
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shrink-0 mt-1">
                                <User size={20} className="text-white" />
                            </div>
                        )}
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-4 items-center animate-pulse">
                        <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center">
                            <Bot size={20} className="text-emerald-400/50" />
                        </div>
                        <div className="flex gap-1">
                            <div className="w-2 h-2 bg-emerald-500/50 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <div className="w-2 h-2 bg-emerald-500/50 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <div className="w-2 h-2 bg-emerald-500/50 rounded-full animate-bounce" />
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} className="h-4" />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="mt-2">
                <div className="relative p-1 rounded-2xl bg-gradient-to-r from-white/10 to-white/5">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Transmite instrucciones a AION..."
                        className="w-full bg-slate-950/90 text-slate-200 rounded-xl pl-5 pr-14 py-4 focus:outline-none transition-all placeholder:text-slate-500"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !input.trim()}
                        className="absolute right-3 top-3 bottom-3 aspect-square rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Send size={20} />
                        )}
                    </button>
                </div>
                <div className="text-center mt-3">
                    <p className="text-[10px] text-slate-600 font-medium tracking-widest uppercase">
                        Sistema Operativo Cognitivo AION • v0.1.0-alpha
                    </p>
                </div>
            </form>
        </div>
    );
}
