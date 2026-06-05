import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import api from '@/lib/api'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, User, Bot, Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface ChatMessage {
  id: number;
  role: 'USER' | 'AI';
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
    // Auto scroll to bottom when messages change
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const fetchHistory = async () => {
    try {
      const response = await api.get('/api/chat/history');
      setMessages(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load chat history');
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Optimistic UI update
    const tempId = Date.now();
    setMessages(prev => [...prev, {
      id: tempId,
      role: 'USER',
      content: userMessage,
      createdAt: new Date().toISOString()
    }]);

    setIsLoading(true);

    try {
      const response = await api.post('/api/chat/send', { message: userMessage });
      // The backend returns the newly created AI message
      const aiMessage = response.data.data;
      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send message');
      // Remove optimistic message if failed
      setMessages(prev => prev.filter(m => m.id !== tempId));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col max-w-5xl mx-auto border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-950 shadow-sm">
      
      {/* Chat Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
            <Bot className="w-6 h-6 text-blue-600 dark:text-blue-500" />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 dark:text-white">AI Career Mentor</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span> Online
            </p>
          </div>
        </div>
      </div>

      {/* Chat Messages Area */}
      <ScrollArea className="flex-1 p-6" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-slate-500 my-20">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-2">
              <Sparkles className="w-8 h-8 text-blue-500" />
            </div>
            <p className="max-w-md text-sm">
              I'm your AI career mentor. Ask me anything about your roadmap, skill gaps, interview prep, or tech domain questions!
            </p>
          </div>
        ) : (
          <div className="space-y-6 pb-4">
            <AnimatePresence>
              {messages.map((msg) => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-4 ${msg.role === 'USER' ? 'flex-row-reverse' : ''}`}
                >
                  <Avatar className="w-8 h-8 mt-1 border border-slate-200 dark:border-slate-800">
                    {msg.role === 'USER' ? (
                      <AvatarFallback className="bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900"><User className="w-4 h-4" /></AvatarFallback>
                    ) : (
                      <AvatarFallback className="bg-blue-600 text-white"><Bot className="w-4 h-4" /></AvatarFallback>
                    )}
                  </Avatar>
                  
                  <div className={`flex flex-col ${msg.role === 'USER' ? 'items-end' : 'items-start'} max-w-[80%]`}>
                    <div 
                      className={`px-5 py-3.5 rounded-2xl text-sm ${
                        msg.role === 'USER' 
                          ? 'bg-blue-600 text-white rounded-tr-sm' 
                          : 'bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-tl-sm'
                      }`}
                    >
                      {msg.role === 'USER' ? (
                        msg.content
                      ) : (
                        <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-slate-800 prose-pre:text-slate-50">
                          <ReactMarkdown>{msg.content}</ReactMarkdown>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                <Avatar className="w-8 h-8 mt-1 border border-slate-200 dark:border-slate-800">
                  <AvatarFallback className="bg-blue-600 text-white"><Bot className="w-4 h-4" /></AvatarFallback>
                </Avatar>
                <div className="bg-slate-100 dark:bg-slate-900 px-5 py-4 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-slate-400 dark:bg-slate-500 rounded-full animate-bounce"></div>
                </div>
              </motion.div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <form onSubmit={handleSend} className="relative flex items-center">
          <Input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask your mentor something..."
            className="pr-12 py-6 rounded-full bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-blue-600"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!input.trim() || isLoading}
            className="absolute right-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white w-9 h-9"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>

    </div>
  )
}

export default Chat
