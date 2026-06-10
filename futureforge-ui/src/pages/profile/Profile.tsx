import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import api from '@/lib/api'
import { motion } from 'framer-motion'
import { User, Save, Target, Sparkles, GitBranch, Link as LinkIcon, Code, Globe } from 'lucide-react'

interface ProfileData {
  id?: number;
  education: string;
  bio: string;
  semester: number;
  careerGoal: string;
  interests: string[];
  skills: string[];
  linkedinUrl?: string;
  githubUrl?: string;
  leetcodeUrl?: string;
  portfolioUrl?: string;
}

export const Profile = () => {
  const [profile, setProfile] = useState<ProfileData>({
    education: '',
    bio: '',
    semester: 0,
    careerGoal: '',
    interests: [],
    skills: [],
    linkedinUrl: '',
    githubUrl: '',
    leetcodeUrl: '',
    portfolioUrl: ''
  });
  
  const [skillsInput, setSkillsInput] = useState('');
  const [interestsInput, setInterestsInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/api/profile');
      const data = response.data;
      setProfile({
        id: data.id,
        education: data.education || '',
        bio: data.bio || '',
        semester: data.semester || 0,
        careerGoal: data.careerGoal || '',
        interests: data.interests || [],
        skills: data.skills || [],
        linkedinUrl: data.linkedinUrl || '',
        githubUrl: data.githubUrl || '',
        leetcodeUrl: data.leetcodeUrl || '',
        portfolioUrl: data.portfolioUrl || ''
      });
      setSkillsInput(data.skills ? data.skills.join(', ') : '');
      setInterestsInput(data.interests ? data.interests.join(', ') : '');
    } catch (error: any) {
      if (error.response?.status !== 404) {
        toast.error('Failed to load profile');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        ...profile,
        skills: skillsInput.split(',').map(s => s.trim()).filter(s => s !== ''),
        interests: interestsInput.split(',').map(s => s.trim()).filter(s => s !== '')
      };
      
      await api.put('/api/profile', payload);
      toast.success('Profile updated successfully!');
      
      setProfile(prev => ({
        ...prev,
        skills: payload.skills,
        interests: payload.interests
      }));
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to save profile');
    } finally {
      setIsSaving(false);
    }
  };

  // Calculate a basic completion score based on filled fields
  const calculateCompletion = () => {
    let score = 0;
    if (profile.bio) score += 10;
    if (profile.education) score += 10;
    if (profile.careerGoal) score += 10;
    if (profile.semester > 0) score += 10;
    if (profile.interests.length > 0) score += 15;
    if (profile.skills.length > 0) score += 15;
    if (profile.linkedinUrl) score += 10;
    if (profile.githubUrl) score += 10;
    if (profile.leetcodeUrl || profile.portfolioUrl) score += 10;
    return Math.min(100, score);
  };

  const completionScore = calculateCompletion();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3 bg-slate-800" />
        <Skeleton className="h-6 w-1/4 bg-slate-800" />
        <Skeleton className="h-[400px] w-full rounded-xl bg-slate-800" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-3">
          <div className="p-2 bg-cyan-100 rounded-lg">
            <User className="h-8 w-8 text-cyan-600" />
          </div>
          Neural Profile
        </h1>
        <p className="text-slate-600 mt-2 text-lg">
          Maintain your matrix data. This context heavily influences Oracle's recommendations.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Profile Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSave} className="bg-white backdrop-blur-xl border border-slate-200 shadow-[0_0_40px_-10px_rgba(6,182,212,0.2)] rounded-[2rem] overflow-hidden">
            <div className="p-6 sm:p-8 border-b border-slate-100 bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                Core Parameters
              </h2>
              <p className="text-slate-600 text-sm mt-1">Foundational attributes for your career trajectory.</p>
            </div>
            
            <div className="p-6 sm:p-8 space-y-8">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="bio" className="text-slate-700 font-medium">System Directive (Bio)</Label>
                  <Input 
                    id="bio" 
                    placeholder="e.g. Passionate software engineer" 
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-cyan-500 rounded-xl"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="semester" className="text-slate-700 font-medium">Current Semester / Phase</Label>
                  <Input 
                    id="semester" 
                    type="number"
                    min="1"
                    placeholder="e.g. 5" 
                    value={profile.semester || ''}
                    onChange={(e) => setProfile({...profile, semester: parseInt(e.target.value) || 0})}
                    className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-cyan-500 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="education" className="text-slate-700 font-medium">Academic Node (Education)</Label>
                <Input 
                  id="education" 
                  placeholder="e.g. B.S. Computer Science, University of Washington" 
                  value={profile.education}
                  onChange={(e) => setProfile({...profile, education: e.target.value})}
                  className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-cyan-500 rounded-xl"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="skills" className="text-slate-700 font-medium">Acquired Tech Stack (comma separated)</Label>
                <Textarea 
                  id="skills" 
                  placeholder="React, TypeScript, Java, Spring Boot, MySQL" 
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  className="min-h-[100px] bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-cyan-500 rounded-xl resize-none"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="interests" className="text-slate-700 font-medium">Exploration Vectors (Interests)</Label>
                <Textarea 
                  id="interests" 
                  placeholder="Artificial Intelligence, Cloud Computing, Distributed Systems" 
                  value={interestsInput}
                  onChange={(e) => setInterestsInput(e.target.value)}
                  className="min-h-[100px] bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-cyan-500 rounded-xl resize-none"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="careerGoal" className="text-slate-700 font-medium">Primary Objective</Label>
                <Input 
                  id="careerGoal" 
                  placeholder="e.g. Become a Principal Engineer in 5 years" 
                  value={profile.careerGoal}
                  onChange={(e) => setProfile({...profile, careerGoal: e.target.value})}
                  className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-cyan-500 rounded-xl"
                />
              </div>

            </div>

            {/* Professional Links Section */}
            <div className="p-6 sm:p-8 border-t border-slate-100 bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 mb-6">
                External Integrations
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="linkedinUrl" className="text-slate-700 font-medium flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-[#0A66C2]" /> LinkedIn URL
                  </Label>
                  <Input 
                    id="linkedinUrl" 
                    placeholder="https://linkedin.com/in/username" 
                    value={profile.linkedinUrl}
                    onChange={(e) => setProfile({...profile, linkedinUrl: e.target.value})}
                    className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-cyan-500 rounded-xl"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="githubUrl" className="text-slate-700 font-medium flex items-center gap-2">
                    <GitBranch className="w-4 h-4 text-slate-900" /> GitHub URL
                  </Label>
                  <Input 
                    id="githubUrl" 
                    placeholder="https://github.com/username" 
                    value={profile.githubUrl}
                    onChange={(e) => setProfile({...profile, githubUrl: e.target.value})}
                    className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-cyan-500 rounded-xl"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="leetcodeUrl" className="text-slate-700 font-medium flex items-center gap-2">
                    <Code className="w-4 h-4 text-orange-500" /> LeetCode URL
                  </Label>
                  <Input 
                    id="leetcodeUrl" 
                    placeholder="https://leetcode.com/u/username" 
                    value={profile.leetcodeUrl}
                    onChange={(e) => setProfile({...profile, leetcodeUrl: e.target.value})}
                    className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-cyan-500 rounded-xl"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="portfolioUrl" className="text-slate-700 font-medium flex items-center gap-2">
                    <Globe className="w-4 h-4 text-teal-500" /> Personal Portfolio
                  </Label>
                  <Input 
                    id="portfolioUrl" 
                    placeholder="https://mywebsite.com" 
                    value={profile.portfolioUrl}
                    onChange={(e) => setProfile({...profile, portfolioUrl: e.target.value})}
                    className="bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus-visible:ring-cyan-500 rounded-xl"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
              <Button 
                type="submit" 
                className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl px-8 shadow-[0_0_20px_-5px_rgba(6,182,212,0.5)] transition-all hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.7)]" 
                disabled={isSaving}
              >
                {isSaving ? "Syncing..." : <><Save className="w-4 h-4 mr-2" /> Sync Data</>}
              </Button>
            </div>
          </form>
        </div>

        {/* Profile Metrics Widget */}
        <div className="space-y-6">
          <div className="bg-white backdrop-blur-xl border border-slate-200 shadow-[0_0_30px_-10px_rgba(6,182,212,0.15)] rounded-[2rem] overflow-hidden relative p-6">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-400"></div>
            
            <h3 className="text-lg font-bold text-slate-900 mb-6">Synchronization Status</h3>
            
            <div className="flex justify-between items-end mb-3">
              <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-teal-500">
                {completionScore}%
              </span>
              <span className="text-sm font-medium text-slate-500 mb-2">Complete</span>
            </div>
            
            <Progress value={completionScore} className="h-2.5 bg-slate-100 [&>div]:bg-gradient-to-r [&>div]:from-cyan-400 [&>div]:to-teal-500 rounded-full" />
            
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className={`w-2.5 h-2.5 rounded-full shadow-[0_0_10px] ${profile.bio ? 'bg-cyan-500 shadow-cyan-400/50' : 'bg-slate-300 shadow-transparent'}`}></div>
                Core Parameters Defined
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className={`w-2.5 h-2.5 rounded-full shadow-[0_0_10px] ${profile.skills.length > 0 ? 'bg-cyan-500 shadow-cyan-400/50' : 'bg-slate-300 shadow-transparent'}`}></div>
                Tech Stack Loaded
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className={`w-2.5 h-2.5 rounded-full shadow-[0_0_10px] ${profile.careerGoal ? 'bg-cyan-500 shadow-cyan-400/50' : 'bg-slate-300 shadow-transparent'}`}></div>
                Primary Objective Set
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <div className={`w-2.5 h-2.5 rounded-full shadow-[0_0_10px] ${(profile.linkedinUrl || profile.githubUrl || profile.leetcodeUrl) ? 'bg-cyan-500 shadow-cyan-400/50' : 'bg-slate-300 shadow-transparent'}`}></div>
                External Integrations Linked
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-100 backdrop-blur-xl rounded-[2rem] p-6 shadow-lg">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-600 text-white mb-5 shadow-[0_0_20px_-5px_rgba(6,182,212,0.4)]">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Why feed the Neural Profile?</h3>
            <p className="text-slate-700 text-sm leading-relaxed">
              Oracle relies on this data matrix to generate highly accurate domain recommendations, hyper-personalized learning roadmaps, and contextual chat responses. Your GitHub and LeetCode links allow for deeper strategic analysis.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Profile
