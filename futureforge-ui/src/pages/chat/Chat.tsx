import React, { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { toast } from 'sonner'
import api from '@/lib/api'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, User, Sparkles, BrainCircuit, Activity } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface ChatMessage {
  id: number;
  role: 'USER' | 'AI' | 'ASSISTANT' | 'MENTOR';
  content: string;
  createdAt: string;
}

export const Chat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/api/chat/history');
      setMessages(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load neural logs');
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    const tempId = Date.now();
    setMessages(prev => [...prev, {
      id: tempId,
      role: 'USER',
      content: userMessage,
      createdAt: new Date().toISOString()
    }]);

    setIsLoading(true);

    try {
      const response = await api.post('/api/chat/send', { content: userMessage });
      const aiMessage = response.data.data;
      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Transmission failed');
      setMessages(prev => prev.filter(m => m.id !== tempId));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative h-[calc(100vh-8rem)] flex flex-col max-w-5xl mx-auto rounded-[2rem] overflow-hidden bg-white/60 backdrop-blur-xl border border-slate-200 shadow-[0_0_40px_-10px_rgba(6,182,212,0.2)] z-10">
      
      {/* Premium Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 bg-white/80">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-cyan-400 blur-md opacity-30 rounded-full animate-pulse"></div>
            <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center border border-slate-200 shadow-lg overflow-hidden">
              <img src="/logo.jpg" alt="Oracle Logo" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
          </div>
          <div>
            <h2 className="font-extrabold text-slate-900 tracking-tight text-lg">Oracle AI Mentor</h2>
            <p className="text-xs font-semibold uppercase tracking-wider text-cyan-600 flex items-center gap-1.5 mt-0.5">
              <Activity className="w-3 h-3" /> Neural Link Active
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 min-h-0 p-6 overflow-y-auto custom-scrollbar" ref={scrollRef}>
        {messages.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="h-full flex flex-col items-center justify-center text-center space-y-6 my-10">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-200 blur-xl rounded-full"></div>
              <div className="w-20 h-20 bg-white/80 border border-slate-200 backdrop-blur-xl rounded-2xl flex items-center justify-center relative z-10 shadow-xl">
                <Sparkles className="w-10 h-10 text-cyan-500" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">System Initialized</h3>
              <p className="max-w-md text-sm text-slate-600 leading-relaxed mx-auto">
                I am Oracle, your elite IT Career Strategist. Ask me to review your skills, suggest roadmap adjustments, or prep you for technical interviews.
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-8 pb-4">
            <AnimatePresence>
              {messages.map((msg) => {
                const isUser = msg.role === 'USER';
                return (
                  <motion.div 
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-4 ${isUser ? 'flex-row-reverse' : ''}`}
                  >
                    <div className="mt-auto mb-1 flex-shrink-0">
                      {isUser ? (
                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shadow-md">
                          <User className="w-4 h-4 text-slate-500" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center shadow-[0_0_15px_-3px_rgba(6,182,212,0.4)] overflow-hidden">
                          <img src="/logo.jpg" alt="Oracle Logo" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                    
                    <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} max-w-[85%]`}>
                      <div 
                        className={`px-6 py-4 text-[15px] leading-relaxed shadow-sm border backdrop-blur-md ${
                          isUser 
                            ? 'bg-cyan-600/90 text-white rounded-[1.5rem] rounded-br-sm border-cyan-500/50' 
                            : 'bg-white/80 text-slate-800 rounded-[1.5rem] rounded-bl-sm border-slate-200'
                        }`}
                      >
                        {isUser ? (
                          msg.content
                        ) : (
                          <div className="prose prose-sm max-w-none text-slate-800 prose-p:text-slate-800 prose-p:leading-relaxed prose-pre:bg-slate-50 prose-pre:border prose-pre:border-slate-200 prose-pre:shadow-inner prose-code:text-cyan-700 prose-strong:text-cyan-700 prose-strong:font-bold prose-a:text-teal-600">
                            <ReactMarkdown>{msg.content}</ReactMarkdown>
                          </div>
                        )}
                      </div>
                      <span className="text-[10px] font-medium uppercase tracking-wider text-slate-500 mt-2 px-2">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>

            {isLoading && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 items-end">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center shadow-[0_0_15px_-3px_rgba(6,182,212,0.4)] mb-1 flex-shrink-0 overflow-hidden">
                  <img src="/logo.jpg" alt="Oracle Logo" className="w-full h-full object-cover" />
                </div>
                <div className="bg-white/80 backdrop-blur-md border border-slate-200 px-6 py-5 rounded-[1.5rem] rounded-bl-sm flex items-center gap-2 shadow-sm">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
                </div>
              </motion.div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 sm:p-6 bg-white/80 border-t border-slate-200 backdrop-blur-xl">
        <form onSubmit={handleSend} className="relative flex items-center max-w-4xl mx-auto">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Transmit message to Oracle..."
            className="pr-14 py-7 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-cyan-500 focus-visible:border-cyan-500/50 text-base shadow-inner transition-all"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!input.trim() || isLoading}
            className="absolute right-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white w-10 h-10 shadow-[0_0_15px_-5px_rgba(6,182,212,0.5)] transition-all disabled:opacity-50 disabled:shadow-none"
          >
            <Send className="w-4 h-4 ml-0.5" />
          </Button>
        </form>
      </div>

    </div>
  )
}

export default Chat
