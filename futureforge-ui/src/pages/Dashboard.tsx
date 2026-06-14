import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Target, Trophy, Clock, TrendingUp, Sparkles, Map, ArrowRight } from 'lucide-react'
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
        if (p.bio) score += 20;
        if (p.education) score += 20;
        if (p.careerGoal) score += 20;
        if (p.interests && p.interests.length > 0) score += 20;
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
        const sessionRes = await api.get('/api/chat/sessions');
        if (sessionRes.data.data && sessionRes.data.data.length > 0) {
          const recentSessionId = sessionRes.data.data[0].id;
          const msgRes = await api.get(`/api/chat/sessions/${recentSessionId}/messages`);
          if (msgRes.data.data) {
             setRecentChat(msgRes.data.data.slice(-3).reverse());
          }
        }
      } catch (e) {}

    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8 p-6 lg:p-10 min-h-screen">
        <div>
          <Skeleton className="h-10 w-48 mb-3" />
          <Skeleton className="h-5 w-64" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
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
    <div className="min-h-screen w-full bg-slate-50/50 p-4 lg:p-8 font-sans text-slate-900">
      
      <div className="max-w-7xl mx-auto space-y-8">
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">Dashboard</h1>
            <p className="text-slate-500 text-base">Your personalized career overview.</p>
          </div>
          <Button onClick={handleDownloadReport} className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg h-11 px-6 shadow-sm">
            <ArrowRight className="w-4 h-4 mr-2" /> 
            Export AI Report
          </Button>
        </motion.div>

        {/* Top Metrics Row */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <Card className="hover:shadow-md transition-shadow h-full border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                  Profile Completion
                </CardTitle>
                <Trophy className="h-4 w-4 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">{profileComplete}%</div>
                <Progress value={profileComplete} className="h-2 w-full mt-4 mb-3 bg-slate-100 [&>div]:bg-blue-600" />
                <Link to="/profile" className="text-xs font-medium text-blue-600 hover:underline inline-flex items-center">
                  {profileComplete === 100 ? "Profile complete" : "Update profile →"}
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <Card className="hover:shadow-md transition-shadow h-full border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                  Market Readiness
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${latestAnalysis ? 'text-slate-900' : 'text-slate-400'}`}>
                  {latestAnalysis ? "Analyzed" : "Needs Analysis"}
                </div>
                <div className="mt-4 flex items-center space-x-2 text-sm text-slate-500">
                  <span className={`relative flex h-2.5 w-2.5`}>
                    {latestAnalysis && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>}
                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${latestAnalysis ? 'bg-blue-500' : 'bg-slate-300'}`}></span>
                  </span>
                  <span>
                    {latestAnalysis ? <span className="text-blue-600 font-medium">Target: {latestAnalysis.targetDomain}</span> : "Run analysis"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
            <Card className="hover:shadow-md transition-shadow h-full border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                  Progress
                </CardTitle>
                <Map className="h-4 w-4 text-slate-400" />
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${activeRoadmap ? 'text-slate-900' : 'text-slate-400'}`}>
                  {activeRoadmap ? `${roadmapProgress}%` : "---"}
                </div>
                <p className="mt-4 text-sm text-slate-500 truncate font-medium border-l-2 border-blue-400 pl-2">
                  {activeRoadmap ? `Working towards ${activeRoadmap.targetRole}` : "No active goal set"}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <div className="grid gap-6 lg:grid-cols-7">
          
          {/* Active Roadmap Panel */}
          <motion.div className="col-span-1 lg:col-span-4 h-full" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
            <Card className="h-full flex flex-col hover:shadow-md transition-shadow border-slate-200">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-xl">Current Goal</CardTitle>
                </div>
                <CardDescription className="text-sm">
                  {activeRoadmap ? `Phase ${nextMilestone?.weekNumber || 'Complete'} of your ${activeRoadmap.targetRole} journey` : "No active roadmap. Create a new roadmap to get started."}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col pt-0">
                {activeRoadmap ? (
                  <div className="space-y-6 flex-1 flex flex-col justify-between mt-2">
                    <div className="bg-slate-50 rounded-lg p-5 border border-slate-100">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3 className="text-lg font-semibold text-slate-900 leading-tight">
                          {nextMilestone ? nextMilestone.title : "All Goals Completed!"}
                        </h3>
                        <Badge variant={nextMilestone ? "default" : "secondary"} className={`${nextMilestone ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' : ''} whitespace-nowrap shadow-none`}>
                          {nextMilestone ? "IN PROGRESS" : "COMPLETED"}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-600">
                        {nextMilestone ? nextMilestone.description : "You have completed all objectives in this roadmap."}
                      </p>
                    </div>
                    
                    <div className="pt-2">
                      <div className="flex justify-between text-sm text-slate-600 mb-2">
                        <span>Overall Progress</span>
                        <span className="font-medium">{roadmapProgress}%</span>
                      </div>
                      <Progress value={roadmapProgress} className="h-2 bg-slate-100 [&>div]:bg-blue-600" />
                      
                      <Button onClick={() => navigate('/roadmap')} variant="outline" className="w-full mt-6 h-11 text-slate-700 font-medium">
                        View Full Roadmap <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
                    <Map className="h-12 w-12 text-slate-200 mb-4" />
                    <p className="text-slate-500 mb-6">No active roadmap.</p>
                    <Button onClick={() => navigate('/roadmap')} className="bg-blue-600 hover:bg-blue-700 h-11 px-8">
                      Explore Careers
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* AI Activity Panel */}
          <motion.div className="col-span-1 lg:col-span-3 h-full" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.5 }}>
            <Card className="h-full flex flex-col hover:shadow-md transition-shadow border-slate-200">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-xl">AI Mentor</CardTitle>
                </div>
                <CardDescription className="text-sm">
                  Recent messages with your AI Mentor
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col pt-0">
                {recentChat.length > 0 ? (
                  <div className="space-y-4 flex-1 mt-2">
                    {recentChat.map((msg, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                        <div className={`mt-0.5 flex-shrink-0 rounded-full p-1.5 ${msg.role === 'AI' ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-600'}`}>
                          {msg.role === 'AI' ? <Sparkles className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-semibold text-slate-500">
                            {msg.role === 'AI' ? 'AI' : 'You'}
                          </p>
                          <p className="text-sm text-slate-700 line-clamp-2 leading-snug">
                            {msg.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center py-8 text-center mt-2">
                    <Sparkles className="h-10 w-10 text-slate-200 mb-4" />
                    <p className="text-slate-500 mb-4">No messages yet.</p>
                  </div>
                )}
                <div className="pt-6 mt-auto">
                  <Button onClick={() => navigate('/chat')} className="w-full bg-blue-600 hover:bg-blue-700 h-11 font-medium">
                    Start Chatting
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
