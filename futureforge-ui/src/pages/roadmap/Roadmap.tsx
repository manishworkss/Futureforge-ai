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
        // Find by role if provided, otherwise just take the latest
        if (prefillRole) {
          const matched = roadmaps.find((r: any) => r.targetRole.toLowerCase() === prefillRole.toLowerCase());
          if (matched) {
            // we need to fetch the specific roadmap by ID to get the milestones
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
      // Optional: Add a subtle toast or sound effect here
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
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-6 w-1/4" />
        <div className="space-y-4 mt-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-200">
          {[1, 2, 3].map(i => (
            <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <Skeleton className="h-32 w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="bg-indigo-50 p-6 rounded-full dark:bg-indigo-900/20">
          <Map className="h-16 w-16 text-indigo-600 dark:text-indigo-500" />
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Chart Your Course</h2>
          <p className="text-slate-500 dark:text-slate-400">Generate a step-by-step learning roadmap tailored to your target role and current skill level.</p>
        </div>
        <form onSubmit={handleGenerate} className="flex w-full max-w-sm items-center space-x-2">
          <Input 
            placeholder="e.g. Full Stack Developer" 
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
          />
          <Button type="submit" disabled={isGenerating} className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0">
            {isGenerating ? "Mapping..." : "Map Journey"}
          </Button>
        </form>
      </motion.div>
    );
  }

  const completedCount = data.milestones.filter(m => m.isCompleted).length;
  const totalCount = data.milestones.length;
  const progressPercentage = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <Map className="h-8 w-8 text-indigo-600" />
            Learning Roadmap
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Your personalized path to becoming a <strong className="text-slate-900 dark:text-white">{data.targetRole}</strong>
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{progressPercentage}% Completed</span>
            <div className="w-32 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
              <div className="h-full bg-indigo-600 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div>
            </div>
          </div>
          
          <form onSubmit={handleGenerate} className="flex items-center space-x-2 bg-white dark:bg-slate-950 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm ml-4">
            <Input 
              placeholder="New target role..." 
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="border-0 focus-visible:ring-0 shadow-none h-9 w-[180px]"
            />
            <Button type="submit" disabled={isGenerating} size="sm" className="bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700 h-9">
              {isGenerating ? "Mapping..." : <><Sparkles className="h-4 w-4 mr-2" /> New Map</>}
            </Button>
          </form>
        </div>
      </div>

      <div className="py-8">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-indigo-300 dark:before:via-indigo-800 before:to-transparent"
        >
          {data.milestones.map((milestone, index) => (
            <motion.div 
              key={milestone.id} 
              variants={itemVariants}
              className={`relative flex items-center justify-between md:justify-normal ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} group`}
            >
              {/* Timeline dot */}
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 -translate-x-1/2 
                ${milestone.isCompleted 
                  ? 'bg-indigo-600 border-indigo-200 dark:border-indigo-900 text-white' 
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400'}`}
              >
                {milestone.isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
              </div>
              
              {/* Card */}
              <Card className={`w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] transition-all duration-300 hover:shadow-md 
                ${milestone.isCompleted ? 'border-indigo-200 bg-indigo-50/10 dark:border-indigo-900/50' : 'border-slate-200 dark:border-slate-800'}`}
              >
                <CardHeader className="pb-3 flex flex-row items-start justify-between">
                  <div>
                    <Badge variant="outline" className={`mb-2 ${milestone.isCompleted ? 'text-indigo-600 border-indigo-200 dark:text-indigo-400 dark:border-indigo-800' : ''}`}>
                      Week {milestone.weekNumber}
                    </Badge>
                    <CardTitle className={`text-xl ${milestone.isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                      {milestone.title}
                    </CardTitle>
                  </div>
                  <div className="flex items-center space-x-2 pt-1">
                    <Checkbox 
                      id={`milestone-${milestone.id}`} 
                      checked={milestone.isCompleted}
                      onCheckedChange={() => toggleMilestone(milestone.id)}
                      className={`w-6 h-6 rounded-full border-2 ${milestone.isCompleted ? 'data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600' : 'border-slate-300'}`}
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className={`text-sm ${milestone.isCompleted ? 'text-slate-600 dark:text-slate-400' : 'text-slate-500 dark:text-slate-500'}`}>
                    {milestone.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
      
      {progressPercentage === 100 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-12 flex justify-center">
          <Card className="max-w-2xl w-full border-indigo-200 bg-indigo-50/50 dark:border-indigo-900/50 dark:bg-indigo-900/20 text-center">
            <CardContent className="py-8 space-y-4">
              <div className="mx-auto w-16 h-16 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Journey Completed!</h3>
              <p className="text-slate-600 dark:text-slate-400">
                You have officially completed all milestones for the <strong className="text-slate-900 dark:text-white">{data.targetRole}</strong> roadmap. 
                You are now ready to tackle the market.
              </p>
              <Button onClick={() => navigate('/chat')} className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white">
                Prepare for Interviews with AI Mentor <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}

export default Roadmap
