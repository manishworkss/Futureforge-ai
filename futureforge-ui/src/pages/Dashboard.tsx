import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Target, Trophy, Clock, CheckCircle2, TrendingUp, Sparkles, Map, ArrowRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
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
      // Fetch Profile
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
      } catch (e) {
        // Ignored
      }

      // Fetch Latest Roadmap
      try {
        const roadmapRes = await api.get('/api/roadmaps');
        if (roadmapRes.data.data && roadmapRes.data.data.length > 0) {
          const latestId = roadmapRes.data.data[0].id;
          const fullRoadmap = await api.get(`/api/roadmaps/${latestId}`);
          setActiveRoadmap(fullRoadmap.data.data);
        }
      } catch (e) {
        // Ignored
      }

      // Fetch Latest Analysis
      try {
        const analysisRes = await api.get('/api/career/analyses');
        if (analysisRes.data.data && analysisRes.data.data.length > 0) {
          setLatestAnalysis(analysisRes.data.data[0]);
        }
      } catch (e) {
        // Ignored
      }

      // Fetch Chat History summary
      try {
        const chatRes = await api.get('/api/chat/history');
        if (chatRes.data.data) {
          // Take last 3 messages
          setRecentChat(chatRes.data.data.slice(-3).reverse());
        }
      } catch (e) {
        // Ignored
      }

    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div>
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-48" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-32 w-full rounded-xl" />
        </div>
        <Skeleton className="h-80 w-full rounded-xl" />
      </div>
    );
  }

  // Calculate Roadmap Progress
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
      toast.error("Failed to download report");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome back</h1>
          <p className="text-slate-500 dark:text-slate-400">Here's an overview of your career progress.</p>
        </div>
        <Button onClick={handleDownloadReport} className="bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900">
          <ArrowRight className="w-4 h-4 mr-2" /> Download Career Report
        </Button>
      </div>

      {/* Top Metrics Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Profile Completion */}
        <Card className="border-slate-200 shadow-sm dark:border-slate-800 transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profile Completion</CardTitle>
            <Trophy className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profileComplete}%</div>
            <Progress value={profileComplete} className="mt-3 h-2 w-full bg-slate-100 dark:bg-slate-800" />
            <Link to="/profile" className="mt-3 inline-block text-xs text-blue-600 hover:underline">
              {profileComplete === 100 ? "Profile up to date" : "Add missing details to reach 100%"}
            </Link>
          </CardContent>
        </Card>

        {/* Readiness Score */}
        <Card className="border-slate-200 shadow-sm dark:border-slate-800 transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Career Readiness</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${latestAnalysis ? 'text-green-600' : 'text-slate-400'}`}>
              {latestAnalysis ? "Analyzed" : "Pending"}
            </div>
            <div className="mt-4 flex items-center space-x-2 text-xs text-slate-500">
              <span className={`flex h-2 w-2 rounded-full ${latestAnalysis ? 'bg-green-500' : 'bg-slate-300'}`}></span>
              <span>
                {latestAnalysis ? `Targeting ${latestAnalysis.targetDomain}` : "Run an analysis first"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* AI Confidence */}
        <Card className="border-slate-200 shadow-sm dark:border-slate-800 transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Roadmap Progress</CardTitle>
            <Map className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${activeRoadmap ? 'text-indigo-600' : 'text-slate-400'}`}>
              {activeRoadmap ? `${roadmapProgress}%` : "No Map"}
            </div>
            <p className="mt-3 text-xs text-slate-500 line-clamp-1">
              {activeRoadmap ? `On track for ${activeRoadmap.targetRole}` : "Generate a roadmap to start"}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Active Roadmap */}
        <Card className="col-span-4 border-slate-200 shadow-sm dark:border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Next Milestone
            </CardTitle>
            <CardDescription>
              {activeRoadmap ? `Your journey to becoming a ${activeRoadmap.targetRole}` : "You don't have an active roadmap yet."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeRoadmap ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {nextMilestone ? `Week ${nextMilestone.weekNumber}: ${nextMilestone.title}` : "All Milestones Completed!"}
                    </p>
                    <p className="text-sm text-slate-500 line-clamp-1">
                      {nextMilestone ? nextMilestone.description : "Great job!"}
                    </p>
                  </div>
                  <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                    {nextMilestone ? "In Progress" : "Done"}
                  </Badge>
                </div>
                <Progress value={roadmapProgress} className="h-2 bg-slate-100 dark:bg-slate-800 [&>div]:bg-blue-600" />
                
                <Button onClick={() => navigate('/roadmap')} className="w-full mt-4 bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900">
                  View Full Roadmap <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Map className="h-10 w-10 text-slate-300 mb-4" />
                <p className="text-sm text-slate-500 mb-4">No active roadmap found.</p>
                <Button onClick={() => navigate('/domains')} variant="outline">Explore Domains</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent AI Activity */}
        <Card className="col-span-3 border-slate-200 shadow-sm dark:border-slate-800 flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-600" />
              Recent Chat Activity
            </CardTitle>
            <CardDescription>
              Latest interactions with your AI Mentor
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
            {recentChat.length > 0 ? (
              <div className="space-y-6 flex-1">
                {recentChat.map((msg, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className={`mt-0.5 rounded-full p-1.5 ${msg.role === 'AI' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'}`}>
                      {msg.role === 'AI' ? <Sparkles className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                    </div>
                    <div className="space-y-1 overflow-hidden">
                      <p className="text-sm font-medium leading-none text-slate-900 dark:text-slate-100 truncate">
                        {msg.role === 'AI' ? 'Mentor' : 'You'}
                      </p>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {msg.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-6 text-center">
                <p className="text-sm text-slate-500 mb-4">You haven't chatted with the AI mentor yet.</p>
              </div>
            )}
            <div className="pt-4 mt-auto border-t border-slate-100 dark:border-slate-800">
              <Button onClick={() => navigate('/chat')} variant="ghost" className="w-full text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                Continue Conversation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
