import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Target, Trophy, Clock, TrendingUp, Sparkles, Map, ArrowRight, Activity, Zap, BrainCircuit } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { motion } from 'framer-motion'
import api from '@/lib/api'

export const Dashboard = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [profileComplete, setProfileComplete] = useState(0);
  const [activeRoadmap, setActiveRoadmap] = useState<any>(null);
  const [latestAnalysis, setLatestAnalysis] = useState<any>(null);
  const [recentChat, setRecentChat] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      try {
        const profileRes = await api.get('/api/profile');
        const p = profileRes.data;
        let score = 0;
        if (p.currentRole) score += 20;
        if (p.educationBackground) score += 20;
        if (p.careerGoals) score += 20;
        if (p.interests) score += 20;
        if (p.skills && p.skills.length > 0) score += 20;
        setProfileComplete(score);
      } catch (e) {}

      try {
        const roadmapRes = await api.get('/api/roadmaps');
        if (roadmapRes.data.data && roadmapRes.data.data.length > 0) {
          const latestId = roadmapRes.data.data[0].id;
          const fullRoadmap = await api.get(`/api/roadmaps/${latestId}`);
          setActiveRoadmap(fullRoadmap.data.data);
        }
      } catch (e) {}

      try {
        const analysisRes = await api.get('/api/career/analyses');
        if (analysisRes.data.data && analysisRes.data.data.length > 0) {
          setLatestAnalysis(analysisRes.data.data[0]);
        }
      } catch (e) {}

      try {
        const chatRes = await api.get('/api/chat/history');
        if (chatRes.data.data) {
          setRecentChat(chatRes.data.data.slice(-3).reverse());
        }
      } catch (e) {}

    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8 p-6 lg:p-10 min-h-screen bg-transparent">
        <div>
          <Skeleton className="h-12 w-72 mb-3 bg-slate-800/50" />
          <Skeleton className="h-6 w-56 bg-slate-800/50" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-40 w-full rounded-2xl bg-slate-800/50" />
          <Skeleton className="h-40 w-full rounded-2xl bg-slate-800/50" />
          <Skeleton className="h-40 w-full rounded-2xl bg-slate-800/50" />
        </div>
        <Skeleton className="h-96 w-full rounded-2xl bg-slate-800/50" />
      </div>
    );
  }

  let roadmapProgress = 0;
  let nextMilestone = null;
  if (activeRoadmap && activeRoadmap.milestones) {
    const completed = activeRoadmap.milestones.filter((m: any) => m.isCompleted).length;
    const total = activeRoadmap.milestones.length;
    roadmapProgress = total > 0 ? Math.round((completed / total) * 100) : 0;
    nextMilestone = activeRoadmap.milestones.find((m: any) => !m.isCompleted);
  }

  const handleDownloadReport = async () => {
    try {
      const response = await api.get('/api/export/career-report', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'FutureForge_Career_Report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      alert("Failed to download report");
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-transparent p-4 lg:p-8 overflow-hidden font-sans text-slate-900">
      
      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-600 text-xs font-medium tracking-wide uppercase">
              <Activity className="w-3 h-3" /> System Status: Online
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-2">Command Center</h1>
            <p className="text-slate-600 text-base">Your personalized AI career trajectory overview.</p>
          </div>
          <Button onClick={handleDownloadReport} className="bg-cyan-600 hover:bg-cyan-500 text-white border-0 shadow-[0_0_20px_-5px_rgba(6,182,212,0.5)] rounded-xl h-12 px-6 transition-all group">
            <ArrowRight className="w-4 h-4 mr-2 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" /> 
            Export AI Report
          </Button>
        </motion.div>

        {/* Top Metrics Row */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <div className="bg-white backdrop-blur-xl border border-slate-200 shadow-xl rounded-2xl overflow-hidden hover:border-cyan-300 transition-colors group h-full">
              <div className="flex flex-row items-center justify-between p-6 pb-4 border-b border-slate-100 bg-slate-50">
                <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Profile Sync</h3>
                <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center">
                  <Trophy className="h-4 w-4 text-cyan-600" />
                </div>
              </div>
              <div className="p-6 pt-4">
                <div className="flex items-end justify-between mb-4">
                  <div className="text-4xl font-bold text-slate-900">{profileComplete}%</div>
                  <span className="text-xs text-cyan-600 font-medium pb-1 flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Active
                  </span>
                </div>
                <Progress value={profileComplete} className="h-2 w-full bg-slate-100 [&>div]:bg-gradient-to-r [&>div]:from-cyan-500 [&>div]:to-teal-400" />
                <Link to="/profile" className="mt-4 inline-flex items-center text-xs text-slate-500 hover:text-cyan-600 transition-colors">
                  {profileComplete === 100 ? "System calibrated" : "Enhance neural profile →"}
                </Link>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <div className="bg-white backdrop-blur-xl border border-slate-200 shadow-xl rounded-2xl overflow-hidden hover:border-teal-300 transition-colors h-full">
              <div className="flex flex-row items-center justify-between p-6 pb-4 border-b border-slate-100 bg-slate-50">
                <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Market Readiness</h3>
                <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-teal-600" />
                </div>
              </div>
              <div className="p-6 pt-4">
                <div className={`text-3xl font-bold ${latestAnalysis ? 'text-slate-900' : 'text-slate-400'}`}>
                  {latestAnalysis ? "Optimized" : "Awaiting Scan"}
                </div>
                <div className="mt-4 flex items-center space-x-3 text-sm text-slate-500">
                  <span className={`relative flex h-3 w-3`}>
                    {latestAnalysis && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>}
                    <span className={`relative inline-flex rounded-full h-3 w-3 ${latestAnalysis ? 'bg-teal-500' : 'bg-slate-300'}`}></span>
                  </span>
                  <span>
                    {latestAnalysis ? <span className="text-teal-600">Target: {latestAnalysis.targetDomain}</span> : "Initiate analysis module"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <div className="bg-white backdrop-blur-xl border border-slate-200 shadow-xl rounded-2xl overflow-hidden hover:border-sky-300 transition-colors h-full">
              <div className="flex flex-row items-center justify-between p-6 pb-4 border-b border-slate-100 bg-slate-50">
                <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">Trajectory</h3>
                <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center">
                  <Map className="h-4 w-4 text-sky-600" />
                </div>
              </div>
              <div className="p-6 pt-4">
                <div className="flex items-end justify-between mb-2">
                  <div className={`text-4xl font-bold ${activeRoadmap ? 'text-slate-900' : 'text-slate-400'}`}>
                    {activeRoadmap ? `${roadmapProgress}%` : "---"}
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-500 line-clamp-1 border-l-2 border-sky-400 pl-3">
                  {activeRoadmap ? `Navigating to ${activeRoadmap.targetRole}` : "No active coordinates set"}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid gap-6 lg:grid-cols-7">
          
          {/* Active Roadmap Panel */}
          <motion.div className="col-span-1 lg:col-span-4" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
            <div className="bg-white backdrop-blur-xl border border-slate-200 shadow-xl rounded-2xl h-full flex flex-col overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50">
                <h3 className="flex items-center gap-3 text-xl font-semibold text-slate-900 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-cyan-100 flex items-center justify-center text-cyan-600">
                    <Target className="h-5 w-5" />
                  </div>
                  Current Objective
                </h3>
                <p className="text-slate-600 text-sm">
                  {activeRoadmap ? `Phase ${nextMilestone?.weekNumber || 'Complete'} of your ${activeRoadmap.targetRole} journey` : "System idling. Awaiting new roadmap generation."}
                </p>
              </div>
              <div className="p-6 flex-1 flex flex-col pt-6">
                {activeRoadmap ? (
                  <div className="space-y-8 flex-1 flex flex-col justify-between">
                    <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-teal-500"></div>
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-slate-900">
                            {nextMilestone ? nextMilestone.title : "Mission Accomplished!"}
                          </h3>
                          <p className="text-sm text-slate-600 leading-relaxed">
                            {nextMilestone ? nextMilestone.description : "You have completed all objectives in this roadmap."}
                          </p>
                        </div>
                        <Badge className={`${nextMilestone ? 'bg-cyan-100 text-cyan-700' : 'bg-teal-100 text-teal-700'} border-0 px-3 py-1 rounded-full whitespace-nowrap hover:bg-opacity-80 transition-colors`}>
                          {nextMilestone ? "IN PROGRESS" : "SECURED"}
                        </Badge>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-xs text-slate-500 font-medium mb-2 uppercase tracking-wider">
                        <span>Initiated</span>
                        <span>{roadmapProgress}% Complete</span>
                      </div>
                      <Progress value={roadmapProgress} className="h-2 bg-slate-200 [&>div]:bg-cyan-500 rounded-full" />
                      
                      <Button onClick={() => navigate('/roadmap')} className="w-full mt-6 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl h-12 transition-all border-0 font-medium">
                        Access Full Matrix <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-6 border border-slate-200">
                      <Map className="h-8 w-8 text-slate-400" />
                    </div>
                    <p className="text-slate-500 mb-6 text-base">No active trajectory plotted.</p>
                    <Button onClick={() => navigate('/domains')} className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl px-8 h-12 shadow-[0_0_15px_-5px_rgba(6,182,212,0.5)] border-0">
                      Explore Domains
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* AI Activity Panel */}
          <motion.div className="col-span-1 lg:col-span-3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.5 }}>
            <div className="bg-white backdrop-blur-xl border border-slate-200 shadow-xl rounded-2xl h-full flex flex-col overflow-hidden">
              <div className="p-6 border-b border-slate-100 bg-slate-50">
                <h3 className="flex items-center gap-3 text-xl font-semibold text-slate-900 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center shadow-[0_0_15px_-3px_rgba(20,184,166,0.4)] overflow-hidden">
                    <img src="/logo.jpg" alt="FutureForge Logo" className="w-full h-full object-cover" />
                  </div>
                  Neural Link
                </h3>
                <p className="text-slate-600 text-sm">
                  Recent transmissions with AI Mentor
                </p>
              </div>
              <div className="p-6 flex-1 flex flex-col pt-6">
                {recentChat.length > 0 ? (
                  <div className="space-y-6 flex-1">
                    {recentChat.map((msg, i) => (
                      <div key={i} className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                        <div className={`mt-1 flex-shrink-0 rounded-full p-2.5 ${msg.role === 'AI' ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                          {msg.role === 'AI' ? <Sparkles className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        </div>
                        <div className="space-y-1.5 overflow-hidden">
                          <p className="text-xs font-bold tracking-wider uppercase text-slate-500">
                            {msg.role === 'AI' ? 'Oracle AI' : 'User'}
                          </p>
                          <p className="text-sm text-slate-700 line-clamp-2 leading-relaxed">
                            {msg.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
                    <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-200">
                      <Sparkles className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="text-sm text-slate-500 mb-4">Communication channel inactive.</p>
                  </div>
                )}
                <div className="pt-6 mt-auto">
                  <Button onClick={() => navigate('/chat')} variant="outline" className="w-full bg-transparent border-cyan-200 text-cyan-600 hover:bg-cyan-50 hover:text-cyan-700 rounded-xl h-12 transition-all">
                    Initialize Chat Sequence
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
