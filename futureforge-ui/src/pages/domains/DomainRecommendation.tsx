import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import api from '@/lib/api'
import { motion } from 'framer-motion'
import { Compass, Sparkles, CheckCircle2, TrendingUp, AlertCircle, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

interface RecommendedDomain {
  domainName: string;
  matchPercentage: number;
  reasoning: string;
  recommendedRoles: string[];
}

interface DomainResponse {
  recommendedDomains: RecommendedDomain[];
}

export const DomainRecommendation = () => {
  const [data, setData] = useState<DomainResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasProfileContext, setHasProfileContext] = useState(true);

  useEffect(() => {
    fetchLatestRecommendation();
  }, []);

  const fetchLatestRecommendation = async () => {
    try {
      const response = await api.get('/api/domains/latest');
      setData(response.data.data); // data wrapped in ApiResponse
    } catch (error: any) {
      if (error.response?.status === 404) {
        // No latest recommendation found
        setData(null);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const response = await api.post('/api/domains/recommend');
      setData(response.data.data);
      toast.success('New domain recommendations generated!');
    } catch (error: any) {
      if (error.response?.status === 400) {
        setHasProfileContext(false);
        toast.error('Incomplete profile. Please add skills and goals first.');
      } else {
        toast.error('Failed to generate recommendations');
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
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

    if (!hasProfileContext) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="bg-amber-50 p-4 rounded-full">
          <AlertCircle className="h-12 w-12 text-amber-500" />
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Profile Incomplete</h2>
          <p className="text-slate-500">We need more information about your background and skills to generate accurate recommendations.</p>
        </div>
        <Link to="/profile">
          <Button className="bg-cyan-600 hover:bg-cyan-700 text-white">
            Complete Profile <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </motion.div>
    );
  }

  if (!data || !data.recommendedDomains || data.recommendedDomains.length === 0) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="bg-cyan-50 p-6 rounded-full">
          <Compass className="h-16 w-16 text-cyan-600" />
        </div>
        <div className="max-w-md space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Discover Your Path</h2>
          <p className="text-slate-500">Let our AI analyze your skills and current market trends to recommend the best tech domains for you.</p>
        </div>
        <Button onClick={handleGenerate} disabled={isGenerating} size="lg" className="bg-cyan-600 hover:bg-cyan-700 text-white shadow-xl shadow-cyan-600/20">
          {isGenerating ? "Analyzing your profile..." : <><Sparkles className="mr-2 h-4 w-4" /> Generate Recommendations</>}
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Compass className="h-8 w-8 text-cyan-600" />
            Domain Recommendations
          </h1>
          <p className="text-slate-500 mt-2">
            AI-curated career paths tailored to your unique skill set and interests.
          </p>
        </div>
        <Button onClick={handleGenerate} disabled={isGenerating} variant="outline" className="shrink-0 bg-white">
          {isGenerating ? "Regenerating..." : <><Sparkles className="mr-2 h-4 w-4 text-cyan-600" /> Regenerate Analysis</>}
        </Button>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid gap-6 lg:grid-cols-2"
      >
        {data.recommendedDomains.map((domain, index) => (
          <motion.div key={index} variants={itemVariants} whileHover={{ y: -4 }}>
            <Card className={`h-full flex flex-col border-slate-200 shadow-sm ${index === 0 ? 'ring-2 ring-cyan-600/50 bg-cyan-50/30' : ''}`}>
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant={index === 0 ? "default" : "secondary"} className={index === 0 ? "bg-cyan-600 text-white" : ""}>
                    {index === 0 ? "Top Match" : `Match #${index + 1}`}
                  </Badge>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-green-600">
                    <TrendingUp className="h-4 w-4" />
                    {domain.matchPercentage}% Match
                  </div>
                </div>
                <CardTitle className="text-2xl">{domain.domainName}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 space-y-6">
                
                <div>
                  <Progress value={domain.matchPercentage} className={`h-2 ${index === 0 ? '[&>div]:bg-cyan-600' : ''} bg-slate-100`} />
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-500" /> 
                    AI Reasoning
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed bg-white p-4 rounded-lg border border-slate-100">
                    {domain.reasoning}
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">
                    Recommended Roles
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {domain.recommendedRoles.map((role, rIndex) => (
                      <Badge key={rIndex} variant="outline" className="bg-white">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-4 border-t border-slate-100">
                <Link to="/analysis" className="w-full">
                  <Button variant="ghost" className="w-full text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50">
                    Run Career Analysis for this Domain <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

export default DomainRecommendation
