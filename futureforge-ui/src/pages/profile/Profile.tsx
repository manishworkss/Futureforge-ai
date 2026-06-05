import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import api from '@/lib/api'
import { motion } from 'framer-motion'
import { User, Save, BookOpen, Target, Sparkles } from 'lucide-react'

interface ProfileData {
  id?: number;
  education: string;
  bio: string;
  semester: number;
  careerGoal: string;
  interests: string[];
  skills: string[];
}

export const Profile = () => {
  const [profile, setProfile] = useState<ProfileData>({
    education: '',
    bio: '',
    semester: 0,
    careerGoal: '',
    interests: [],
    skills: []
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
        skills: data.skills || []
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
    if (profile.bio) score += 20;
    if (profile.education) score += 20;
    if (profile.careerGoal) score += 20;
    if (profile.interests.length > 0) score += 20;
    if (profile.skills.length > 0) score += 20;
    return score;
  };

  const completionScore = calculateCompletion();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-6 w-1/4" />
        <Skeleton className="h-[400px] w-full rounded-xl" />
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
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
          <User className="h-8 w-8 text-blue-600" />
          Your Professional Profile
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Keep your profile updated to receive the most accurate AI career analyses and domain recommendations.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Profile Form */}
        <Card className="lg:col-span-2 border-slate-200 dark:border-slate-800 shadow-sm">
          <form onSubmit={handleSave}>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Update your current status and background.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bio">Short Bio</Label>
                  <Input 
                    id="bio" 
                    placeholder="e.g. Passionate software engineer" 
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="semester">Current Semester</Label>
                  <Input 
                    id="semester" 
                    type="number"
                    min="1"
                    placeholder="e.g. 5" 
                    value={profile.semester}
                    onChange={(e) => setProfile({...profile, semester: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="education">Educational Background</Label>
                <Input 
                  id="education" 
                  placeholder="e.g. B.S. Computer Science, University of Washington" 
                  value={profile.education}
                  onChange={(e) => setProfile({...profile, education: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="skills">Technical Skills (comma separated)</Label>
                <Textarea 
                  id="skills" 
                  placeholder="React, TypeScript, Java, Spring Boot, MySQL" 
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interests">Professional Interests (comma separated)</Label>
                <Textarea 
                  id="interests" 
                  placeholder="Artificial Intelligence, Cloud Computing, Distributed Systems" 
                  value={interestsInput}
                  onChange={(e) => setInterestsInput(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="careerGoal">Primary Career Goal</Label>
                <Input 
                  id="careerGoal" 
                  placeholder="e.g. Become a Principal Engineer in 5 years" 
                  value={profile.careerGoal}
                  onChange={(e) => setProfile({...profile, careerGoal: e.target.value})}
                />
              </div>

            </CardContent>
            <CardFooter className="bg-slate-50 dark:bg-slate-900/50 py-4 border-t border-slate-200 dark:border-slate-800 rounded-b-xl flex justify-end">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={isSaving}>
                {isSaving ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Profile</>}
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Profile Metrics Widget */}
        <div className="space-y-6">
          <Card className="border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            <CardHeader>
              <CardTitle className="text-lg">Profile Completeness</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-end mb-2">
                <span className="text-3xl font-bold text-slate-900 dark:text-white">{completionScore}%</span>
                <span className="text-sm text-slate-500 mb-1">Score</span>
              </div>
              <Progress value={completionScore} className="h-2 bg-slate-100 dark:bg-slate-800" />
              
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <div className={`w-2 h-2 rounded-full ${profile.bio ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                  Bio defined
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <div className={`w-2 h-2 rounded-full ${profile.skills.length > 0 ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                  Skills added
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <div className={`w-2 h-2 rounded-full ${profile.careerGoal ? 'bg-green-500' : 'bg-slate-300 dark:bg-slate-700'}`}></div>
                  Career Goals set
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 border-none">
            <CardContent className="p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white mb-4 shadow-lg shadow-blue-600/20">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white mb-2">Why complete your profile?</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 leading-relaxed">
                Our AI requires deep context about your background to generate accurate domain recommendations and personalized roadmaps.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}

export default Profile
