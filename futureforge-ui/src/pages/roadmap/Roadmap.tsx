import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import api from '@/lib/api'
import { motion } from 'framer-motion'
import { Map, Sparkles, MapPin, CheckCircle2, Circle, ArrowRight } from 'lucide-react'
import { useSearchParams, useNavigate } from 'react-router-dom'

interface Milestone {
  id: number;
  weekNumber: number;
  title: string;
  description: string;
  isCompleted: boolean;
}

interface RoadmapResponse {
  id: number;
  targetRole: string;
  milestones: Milestone[];
}

export const Roadmap = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const prefillRole = searchParams.get('domain') || '';
  
  const [data, setData] = useState<RoadmapResponse | null>(null);
  const [targetRole, setTargetRole] = useState(prefillRole);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchPastRoadmaps();
  }, []);

  const fetchPastRoadmaps = async () => {
    try {
      const response = await api.get('/api/roadmaps');
      const roadmaps = response.data.data;
      if (roadmaps && roadmaps.length > 0) {
        if (prefillRole) {
          const matched = roadmaps.find((r: any) => r.targetRole.toLowerCase() === prefillRole.toLowerCase());
          if (matched) {
            await fetchRoadmapById(matched.id);
            return;
          }
        }
        await fetchRoadmapById(roadmaps[0].id);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
    }
  };

  const fetchRoadmapById = async (id: number) => {
    try {
      const response = await api.get(`/api/roadmaps/${id}`);
      setData(response.data.data);
    } catch (error) {
      toast.error('Failed to load roadmap details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!targetRole) {
      toast.error('Please enter a target role');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await api.post('/api/roadmaps/generate', { targetRole });
      setData(response.data.data);
      toast.success('Roadmap generated!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to generate roadmap');
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleMilestone = async (milestoneId: number) => {
    if (!data) return;
    try {
      const response = await api.patch(`/api/roadmaps/${data.id}/milestones/${milestoneId}`);
      setData(response.data.data);
    } catch (error) {
      toast.error('Failed to update milestone status');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto p-4">
        <Skeleton className="h-10 w-1/3 bg-slate-800/50" />
        <Skeleton className="h-6 w-1/4 bg-slate-800/50" />
        <div className="space-y-4 mt-8">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl bg-slate-800/50" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 relative z-10">
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500/20 blur-2xl rounded-full"></div>
          <div className="relative bg-slate-900/80 p-8 rounded-[2rem] border border-white/10 shadow-2xl backdrop-blur-xl">
            <Map className="h-16 w-16 text-indigo-400 mx-auto mb-6" />
            <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Chart Your Course</h2>
            <p className="text-slate-400 max-w-md mx-auto mb-8 text-sm leading-relaxed">
              Generate a step-by-step neural learning roadmap tailored to your target role and current skill level.
            </p>
            <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row w-full max-w-md items-center gap-3 mx-auto">
              <Input 
                placeholder="e.g. Full Stack Developer" 
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="bg-slate-950/50 border-white/10 text-white placeholder:text-slate-500 h-12 rounded-xl focus-visible:ring-indigo-500"
              />
              <Button type="submit" disabled={isGenerating} className="w-full sm:w-auto h-12 px-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold shadow-[0_0_15px_-5px_rgba(79,70,229,0.5)] transition-all shrink-0">
                {isGenerating ? "Mapping..." : "Map Journey"}
              </Button>
            </form>
          </div>
        </div>
      </motion.div>
    );
  }

  const completedCount = data.milestones.filter(m => m.isCompleted).length;
  const totalCount = data.milestones.length;
  const progressPercentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-8 max-w-5xl mx-auto relative z-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-900/40 p-6 rounded-2xl border border-white/5 backdrop-blur-sm">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <Map className="h-6 w-6 text-indigo-400" />
            </div>
            Learning Roadmap
          </h1>
          <p className="text-slate-400 mt-2">
            Your personalized path to becoming a <strong className="text-white bg-slate-800 px-2 py-0.5 rounded-md ml-1">{data.targetRole}</strong>
          </p>
        </div>
        
        <div className="flex flex-col items-end gap-4 w-full md:w-auto">
          <div className="flex flex-col items-end w-full">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">{progressPercentage}% Secured</span>
            <div className="w-full md:w-48 h-2.5 bg-slate-950 rounded-full overflow-hidden border border-white/5">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(79,70,229,0.5)]" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>
          
          <form onSubmit={handleGenerate} className="flex w-full md:w-auto items-center gap-2">
            <Input 
              placeholder="New target role..." 
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="bg-slate-950 border-white/10 text-white focus-visible:ring-indigo-500 h-10 rounded-xl"
            />
            <Button type="submit" disabled={isGenerating} size="sm" className="bg-slate-800 hover:bg-slate-700 text-white h-10 rounded-xl border border-white/5">
              {isGenerating ? "..." : <><Sparkles className="h-4 w-4 mr-2 text-indigo-400" /> Plot</>}
            </Button>
          </form>
        </div>
      </div>

      <div className="py-8">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-indigo-500/50 before:via-purple-500/50 before:to-transparent"
        >
          {data.milestones.map((milestone, index) => (
            <motion.div 
              key={milestone.id} 
              variants={itemVariants}
              className={`relative flex items-center justify-between md:justify-normal ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} group`}
            >
              {/* Timeline dot */}
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 shadow-xl shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 -translate-x-1/2 transition-colors duration-500
                ${milestone.isCompleted 
                  ? 'bg-indigo-500 border-slate-950 text-white shadow-[0_0_15px_rgba(79,70,229,0.5)]' 
                  : 'bg-slate-900 border-slate-950 text-slate-500'}`}
              >
                {milestone.isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
              </div>
              
              {/* Card */}
              <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] transition-all duration-300 rounded-2xl p-6 backdrop-blur-xl border
                ${milestone.isCompleted ? 'bg-indigo-500/10 border-indigo-500/30 shadow-[0_0_20px_-5px_rgba(79,70,229,0.2)]' : 'bg-slate-900/50 border-white/5 hover:border-white/10 hover:bg-slate-900/80'}`}
              >
                <div className="flex flex-row items-start justify-between mb-4">
                  <div>
                    <Badge variant="outline" className={`mb-3 border-white/10 bg-slate-950/50 ${milestone.isCompleted ? 'text-indigo-300 border-indigo-500/30' : 'text-slate-400'}`}>
                      Phase {milestone.weekNumber}
                    </Badge>
                    <h3 className={`text-xl font-bold ${milestone.isCompleted ? 'text-white' : 'text-slate-200'}`}>
                      {milestone.title}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2 pt-1">
                    <Checkbox 
                      id={`milestone-${milestone.id}`} 
                      checked={milestone.isCompleted}
                      onCheckedChange={() => toggleMilestone(milestone.id)}
                      className={`w-7 h-7 rounded-lg border-2 transition-all ${milestone.isCompleted ? 'data-[state=checked]:bg-indigo-500 data-[state=checked]:border-indigo-500' : 'border-slate-700 data-[state=checked]:bg-slate-800'}`}
                    />
                  </div>
                </div>
                <p className={`text-sm leading-relaxed ${milestone.isCompleted ? 'text-indigo-200/70' : 'text-slate-400'}`}>
                  {milestone.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {progressPercentage === 100 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-16 flex justify-center">
          <div className="max-w-2xl w-full border border-indigo-500/30 bg-indigo-500/10 backdrop-blur-xl rounded-3xl p-10 text-center shadow-[0_0_40px_-10px_rgba(79,70,229,0.3)]">
            <div className="mx-auto w-20 h-20 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/30">
              <MapPin className="w-10 h-10 text-indigo-400" />
            </div>
            <h3 className="text-3xl font-extrabold text-white mb-4">Journey Completed!</h3>
            <p className="text-indigo-200/80 text-lg mb-8 leading-relaxed max-w-lg mx-auto">
              You have officially completed all milestones for the <strong className="text-white font-bold">{data.targetRole}</strong> roadmap. 
              You are now ready to tackle the market.
            </p>
            <Button onClick={() => navigate('/chat')} className="h-14 px-8 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-lg shadow-[0_0_20px_-5px_rgba(79,70,229,0.5)]">
              Initialize AI Interview Prep <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Roadmap
