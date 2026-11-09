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
import { Map, Sparkles, MapPin, CheckCircle2, Circle, ArrowRight, BrainCircuit, ExternalLink } from 'lucide-react'
import { useSearchParams, useNavigate } from 'react-router-dom'

interface Milestone {
  id: number;
  weekNumber: number;
  title: string;
  description: string;
  resources?: string;
  isCompleted: boolean;
}

interface RoadmapResponse {
  id: number;
  targetRole: string;
  title?: string;
  description?: string;
  estimatedWeeks?: number;
  difficultyLevel?: string;
  milestones: Milestone[];
}

const renderClickableResources = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      // Clean any trailing punctuation from URL
      const cleanUrl = part.replace(/[.,;)]+$/, '');
      return (
        <a
          key={index}
          href={cleanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-600 underline font-semibold hover:text-cyan-800 break-all inline-flex items-center gap-1"
        >
          {cleanUrl}
          <ExternalLink className="w-3 h-3 inline shrink-0" />
        </a>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

export const Roadmap = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const prefillRole = searchParams.get('domain') || '';
  
  const [data, setData] = useState<RoadmapResponse | null>(null);
  const [targetRole, setTargetRole] = useState(prefillRole);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedResources, setExpandedResources] = useState<number[]>([]);

  const toggleResources = (id: number) => {
    setExpandedResources(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    fetchPastRoadmaps();
  }, [prefillRole]);

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
          } else {
            setData(null);
            setTargetRole(prefillRole);
            setIsLoading(false);
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
    if (!targetRole.trim()) {
      toast.error('Please enter a target role');
      return;
    }

    // Route to diagnostic assessment for calibrated roadmap generation
    navigate(`/roadmap/assessment?domain=${encodeURIComponent(targetRole.trim())}`);
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
        <Skeleton className="h-10 w-1/3 bg-slate-200" />
        <Skeleton className="h-6 w-1/4 bg-slate-200" />
        <div className="space-y-4 mt-8">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-32 w-full rounded-2xl bg-slate-100" />
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 relative z-10 px-4">
        <div className="relative">
          <div className="absolute inset-0 bg-cyan-400/20 blur-2xl rounded-full"></div>
          <div className="relative bg-white/80 p-8 sm:p-12 rounded-[2rem] border border-slate-200 shadow-xl backdrop-blur-xl max-w-lg w-full">
            <Map className="h-16 w-16 text-cyan-600 mx-auto mb-6" />
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Chart Your Course</h2>
            <p className="text-slate-500 max-w-md mx-auto mb-8 text-sm leading-relaxed">
              {prefillRole 
                ? `Ready to master ${prefillRole}? Take the diagnostic assessment to generate your personalized weekly milestones.`
                : 'Generate a step-by-step neural learning roadmap tailored to your target role and verified skills.'
              }
            </p>
            <form onSubmit={handleGenerate} className="flex flex-col sm:flex-row w-full items-center gap-3 mx-auto">
              <Input 
                placeholder="e.g. Full Stack Developer, Cloud Architect" 
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 h-12 rounded-xl focus-visible:ring-cyan-500"
              />
              <Button type="submit" disabled={isGenerating} className="w-full sm:w-auto h-12 px-8 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-semibold shadow-[0_0_15px_-5px_rgba(6,182,212,0.5)] transition-all shrink-0">
                {isGenerating ? "Mapping..." : "Map Journey"}
              </Button>
            </form>
          </div>
        </div>
      </motion.div>
    );
  }

  const completedMilestones = data.milestones.filter(m => m.isCompleted).length;
  const totalMilestones = data.milestones.length;
  const progressPercentage = totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0;

  return (
    <div className="space-y-8 max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
      
      {/* Top Banner / Roadmap Control Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 bg-cyan-50 px-2.5 py-1 rounded-full border border-cyan-100">
              Active Curriculum
            </span>
            {data.difficultyLevel && (
              <Badge variant="outline" className="text-xs">
                {data.difficultyLevel}
              </Badge>
            )}
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            {data.title || `Roadmap to ${data.targetRole}`}
          </h1>
          <p className="text-slate-500 text-sm mt-1 max-w-2xl leading-relaxed">
            {data.description || `A structured weekly curriculum tailored to transition you into a production-ready ${data.targetRole}.`}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
          <Button 
            onClick={() => navigate(`/roadmap/assessment?domain=${encodeURIComponent(data.targetRole)}`)}
            variant="outline"
            className="border-slate-200 text-slate-700 hover:bg-slate-50 gap-2 h-11"
          >
            <BrainCircuit className="w-4 h-4 text-cyan-600" />
            Retake Assessment
          </Button>
          <Button 
            onClick={() => navigate('/chat')}
            className="bg-cyan-600 hover:bg-cyan-500 text-white gap-2 h-11 shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            Ask Oracle Mentor
          </Button>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-cyan-600" />
            <span className="font-bold text-slate-900 text-base">Trajectory Completion</span>
          </div>
          <span className="font-extrabold text-cyan-700 text-lg">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-cyan-500 to-teal-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-xs text-slate-500 mt-2 font-medium">
          <span>{completedMilestones} of {totalMilestones} phases completed</span>
          <span>{totalMilestones - completedMilestones} phases remaining</span>
        </div>
      </div>

      {/* Timeline Milestones */}
      <div className="py-4">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-cyan-400/50 before:via-teal-500/50 before:to-transparent"
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
                  ? 'bg-cyan-500 border-white text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]' 
                  : 'bg-white border-white text-slate-300'}`}
              >
                {milestone.isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
              </div>
              
              {/* Milestone Card */}
              <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] transition-all duration-300 rounded-2xl p-6 backdrop-blur-xl border
                ${milestone.isCompleted ? 'bg-cyan-50/60 border-cyan-200 shadow-[0_0_20px_-5px_rgba(6,182,212,0.15)]' : 'bg-white border-slate-200 shadow-sm hover:border-cyan-200 hover:shadow-md'}`}
              >
                <div className="flex flex-row items-start justify-between mb-3">
                  <div>
                    <Badge variant="outline" className={`mb-2 bg-white ${milestone.isCompleted ? 'text-cyan-700 border-cyan-200' : 'text-slate-500 border-slate-200'}`}>
                      Phase {milestone.weekNumber}
                    </Badge>
                    <h3 className={`text-xl font-bold ${milestone.isCompleted ? 'text-slate-900' : 'text-slate-800'}`}>
                      {milestone.title}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2 pt-1 shrink-0">
                    <Checkbox 
                      id={`milestone-${milestone.id}`} 
                      checked={milestone.isCompleted}
                      onCheckedChange={() => toggleMilestone(milestone.id)}
                      className={`w-7 h-7 rounded-lg border-2 transition-all ${milestone.isCompleted ? 'data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500' : 'border-slate-300 data-[state=checked]:bg-slate-100'}`}
                    />
                  </div>
                </div>

                <p className={`text-sm leading-relaxed ${milestone.isCompleted ? 'text-slate-600' : 'text-slate-600'}`}>
                  {milestone.description}
                </p>

                {milestone.resources && (
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <button 
                      onClick={() => toggleResources(milestone.id)}
                      className="text-xs font-bold text-cyan-600 hover:text-cyan-700 flex items-center transition-colors uppercase tracking-wider"
                    >
                      {expandedResources.includes(milestone.id) ? '▾ Hide Resources' : '▸ View Curated Resources & Links'}
                    </button>
                    
                    {expandedResources.includes(milestone.id) && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: 'auto' }} 
                        className="mt-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-sm text-slate-700 whitespace-pre-line leading-relaxed space-y-1.5"
                      >
                        {renderClickableResources(milestone.resources)}
                      </motion.div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {progressPercentage === 100 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-16 flex justify-center">
          <div className="max-w-2xl w-full border border-cyan-200 bg-cyan-50 backdrop-blur-xl rounded-3xl p-10 text-center shadow-[0_0_40px_-10px_rgba(6,182,212,0.15)]">
            <div className="mx-auto w-20 h-20 bg-white rounded-2xl flex items-center justify-center mb-6 border border-cyan-100 shadow-sm">
              <MapPin className="w-10 h-10 text-cyan-500" />
            </div>
            <h3 className="text-3xl font-extrabold text-slate-900 mb-4">Journey Completed!</h3>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed max-w-lg mx-auto">
              You have officially completed all milestones for the <strong className="text-slate-900 font-bold">{data.targetRole}</strong> roadmap. 
              You are now ready to tackle the technical market.
            </p>
            <Button onClick={() => navigate('/chat')} className="h-14 px-8 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-lg shadow-[0_0_20px_-5px_rgba(6,182,212,0.5)]">
              Initialize AI Interview Prep <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Roadmap
