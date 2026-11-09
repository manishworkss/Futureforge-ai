import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import api from '@/lib/api'
import { motion } from 'framer-motion'
import { LineChart, Sparkles, Target, AlertTriangle, BookOpen, CheckCircle, ArrowRight, BrainCircuit, Trophy } from 'lucide-react'
import { useSearchParams, useNavigate } from 'react-router-dom'

interface AnalysisResponse {
  id: number;
  targetDomain: string;
  careerFitScore?: string;
  analysisResult?: string;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  learningPriorities: string[];
}

const parseAnalysisResponse = (raw: any, fallbackDomain: string = ''): AnalysisResponse => {
  const parseJsonArray = (str: string | undefined): string[] => {
    if (!str) return [];
    try {
      const parsed = JSON.parse(str);
      if (Array.isArray(parsed)) return parsed;
    } catch(e) {}
    // Fallback: split by newline and remove bullet points
    return typeof str === 'string' 
      ? str.split('\n').map(s => s.replace(/^[-\*\d\.\s]+/, '').trim()).filter(Boolean) 
      : [];
  };

  const recs = parseJsonArray(raw.recommendations);
  const mid = Math.ceil(recs.length / 2) || 1;

  return {
    id: raw.id,
    targetDomain: raw.analysisInput || fallbackDomain,
    careerFitScore: raw.careerFitScore || '',
    analysisResult: raw.analysisResult || '',
    strengths: parseJsonArray(raw.strengths),
    weaknesses: parseJsonArray(raw.weaknesses),
    missingSkills: recs.slice(0, mid),
    learningPriorities: recs.slice(mid)
  };
};

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
      const analyses = response.data.data;
      if (analyses && analyses.length > 0) {
        if (prefillDomain) {
          const matched = analyses.find((a: any) => a.analysisInput?.toLowerCase() === prefillDomain.toLowerCase());
          if (matched) {
            setData(parseAnalysisResponse(matched, prefillDomain));
            return;
          }
        }
        setData(parseAnalysisResponse(analyses[0]));
      }
    } catch (error) {
      console.error("Failed to fetch analyses", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!targetDomain.trim()) {
      toast.error('Please enter a target domain');
      return;
    }

    setIsGenerating(true);
    try {
      const response = await api.post('/api/career/analyze', { careerGoal: targetDomain.trim() });
      setData(parseAnalysisResponse(response.data.data, targetDomain.trim()));
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
      <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
        <div>
          <Skeleton className="h-10 w-64 mb-3" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 lg:p-10 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6 w-full"
      >
        <div className="bg-blue-50 p-6 rounded-full">
          <LineChart className="h-16 w-16 text-blue-600" />
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
          <Button type="submit" disabled={isGenerating} className="bg-blue-600 hover:bg-blue-700 text-white shrink-0">
            {isGenerating ? "Analyzing..." : "Analyze"}
          </Button>
        </form>
      </motion.div>
    );
  }

  return (
    <div className="w-full bg-slate-50/50 min-h-full">
      <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <LineChart className="h-6 w-6" />
              </div>
              Career Readiness Analysis
            </h1>
            <p className="text-slate-500 text-base">
              Deep dive into your gap analysis for <strong className="text-slate-900 font-semibold">{data.targetDomain}</strong>
            </p>
          </div>
          
          <form onSubmit={handleGenerate} className="flex items-center space-x-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm w-full lg:w-auto">
            <Input 
              placeholder="New target domain..." 
              value={targetDomain}
              onChange={(e) => setTargetDomain(e.target.value)}
              className="border-0 focus-visible:ring-0 shadow-none h-10 w-full lg:w-[250px]"
            />
            <Button type="submit" disabled={isGenerating} className="bg-blue-600 hover:bg-blue-700 text-white h-10 px-5 shrink-0 rounded-lg">
              {isGenerating ? "Analyzing..." : <><Sparkles className="h-4 w-4 mr-2" /> New Analysis</>}
            </Button>
          </form>
        </div>

        {/* Executive Overview Banner with Fit Score */}
        {(data.careerFitScore || data.analysisResult) && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-slate-500">
                <Sparkles className="w-4 h-4 text-cyan-600" />
                Executive Market Evaluation
              </div>
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line">
                {data.analysisResult || "Complete gap analysis evaluated by Oracle AI."}
              </p>
            </div>
            {data.careerFitScore && (
              <div className="flex flex-col items-center justify-center p-4 bg-blue-50 border border-blue-100 rounded-2xl shrink-0 min-w-[140px]">
                <Trophy className="w-6 h-6 text-blue-600 mb-1" />
                <span className="text-2xl font-black text-blue-700">{data.careerFitScore}</span>
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-tight">Market Fit</span>
              </div>
            )}
          </motion.div>
        )}

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {/* Strengths */}
          <motion.div variants={itemVariants} className="h-full">
            <Card className="h-full border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-1.5 rounded-md bg-emerald-100 text-emerald-600">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {data.strengths.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 shrink-0" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Weaknesses */}
          <motion.div variants={itemVariants} className="h-full">
            <Card className="h-full border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-1.5 rounded-md bg-rose-100 text-rose-600">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  Critical Gaps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {data.weaknesses.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 shrink-0" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Missing Skills */}
          <motion.div variants={itemVariants} className="h-full">
            <Card className="h-full border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-1.5 rounded-md bg-amber-100 text-amber-600">
                    <Target className="h-5 w-5" />
                  </div>
                  Skills to Acquire
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {data.missingSkills.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Learning Priorities & Action Launcher */}
          <motion.div variants={itemVariants} className="h-full flex flex-col">
            <Card className="h-full border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="p-1.5 rounded-md bg-blue-100 text-blue-600">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  Recommended Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ul className="space-y-4 flex-1 mb-6">
                  {data.learningPriorities.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="pt-4 border-t border-slate-100 mt-auto space-y-2">
                  <Button 
                    onClick={() => navigate(`/roadmap/assessment?domain=${encodeURIComponent(data.targetDomain)}`)}
                    className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white h-11 rounded-lg font-semibold shadow-sm"
                  >
                    <BrainCircuit className="mr-2 h-4 w-4" /> Take Skill Assessment
                  </Button>
                  <Button 
                    onClick={() => navigate(`/roadmap?domain=${encodeURIComponent(data.targetDomain)}`)}
                    variant="outline"
                    className="w-full border-slate-200 text-slate-700 hover:bg-slate-50 h-10 rounded-lg text-xs"
                  >
                    View Roadmap Directly <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default CareerAnalysis
