import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import api from '@/lib/api'
import { motion } from 'framer-motion'
import { LineChart, Sparkles, Target, AlertTriangle, BookOpen, CheckCircle, ArrowRight } from 'lucide-react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'

interface AnalysisResponse {
  id: number;
  targetDomain: string;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  learningPriorities: string[];
}

export const CareerAnalysis = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const prefillDomain = searchParams.get('domain') || '';
  
  const [data, setData] = useState<AnalysisResponse | null>(null);
  const [targetDomain, setTargetDomain] = useState(prefillDomain);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    fetchPastAnalyses();
  }, []);

  const fetchPastAnalyses = async () => {
    try {
      const response = await api.get('/api/career/analyses');
      const analyses = response.data.data; // List of responses
      if (analyses && analyses.length > 0) {
        // Just take the most recent one for the dashboard view
        setData(analyses[0]);
      }
    } catch (error) {
      console.error("Failed to fetch analyses", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!targetDomain) {
      toast.error('Please enter a target domain');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await api.post('/api/career/analyze', { targetDomain });
      setData(response.data.data);
      toast.success('Career analysis generated!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to generate analysis');
    } finally {
      setIsGenerating(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-6 w-1/4" />
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 lg:p-10 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6"
      >
        <div className="bg-cyan-50 p-6 rounded-full">
          <LineChart className="h-16 w-16 text-cyan-600" />
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Run Your First Analysis</h2>
          <p className="text-slate-500">Discover your strengths, weaknesses, and what you need to learn to transition into your dream tech role.</p>
        </div>
        <form onSubmit={handleGenerate} className="flex w-full max-w-sm items-center space-x-2">
          <Input 
            placeholder="e.g. Cloud Architect" 
            value={targetDomain}
            onChange={(e) => setTargetDomain(e.target.value)}
          />
          <Button type="submit" disabled={isGenerating} className="bg-cyan-600 hover:bg-cyan-700 text-white shrink-0">
            {isGenerating ? "Analyzing..." : "Analyze"}
          </Button>
        </form>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <LineChart className="h-8 w-8 text-cyan-600" />
            Career Readiness Analysis
          </h1>
          <p className="text-slate-500 mt-2">
            Deep dive into your gap analysis for <strong className="text-slate-900">{data.targetDomain}</strong>
          </p>
        </div>
        
        <form onSubmit={handleGenerate} className="flex items-center space-x-2 bg-white p-1.5 rounded-lg border border-slate-200 shadow-sm">
          <Input 
            placeholder="New target domain..." 
            value={targetDomain}
            onChange={(e) => setTargetDomain(e.target.value)}
            className="border-0 focus-visible:ring-0 shadow-none h-9 w-[200px]"
          />
          <Button type="submit" disabled={isGenerating} size="sm" className="bg-slate-100 text-slate-900 hover:bg-slate-200 h-9">
            {isGenerating ? "Analyzing..." : <><Sparkles className="h-4 w-4 mr-2 text-cyan-600" /> New Analysis</>}
          </Button>
        </form>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 md:grid-cols-2"
      >
        {/* Strengths */}
        <motion.div variants={itemVariants} whileHover={{ y: -2 }}>
          <Card className="h-full border-green-200 bg-green-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <CheckCircle className="h-5 w-5" /> Your Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {data.strengths.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-700 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Weaknesses */}
        <motion.div variants={itemVariants} whileHover={{ y: -2 }}>
          <Card className="h-full border-red-200 bg-red-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <AlertTriangle className="h-5 w-5" /> Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {data.weaknesses.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-700 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Missing Skills */}
        <motion.div variants={itemVariants} whileHover={{ y: -2 }}>
          <Card className="h-full border-amber-200 bg-amber-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-700">
                <Target className="h-5 w-5" /> Missing Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {data.missingSkills.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-700 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Learning Priorities */}
        <motion.div variants={itemVariants} whileHover={{ y: -2 }}>
          <Card className="h-full border-cyan-200 bg-cyan-50/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-700">
                <BookOpen className="h-5 w-5" /> Learning Priorities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {data.learningPriorities.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-700 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-8 pt-6 border-t border-cyan-200">
                <Button 
                  onClick={() => navigate(`/roadmap?domain=${encodeURIComponent(data.targetDomain)}`)}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg shadow-cyan-600/20"
                >
                  Generate Custom Roadmap <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default CareerAnalysis
