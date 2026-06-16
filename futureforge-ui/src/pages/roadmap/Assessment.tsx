import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, BrainCircuit, CheckCircle2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';

interface McqQuestion {
  question: string;
  options: string[];
  correctOptionIndex: number;
  difficulty: string;
}

interface CodingQuestion {
  title: string;
  description: string;
}

interface AssessmentData {
  mcqs: McqQuestion[];
  coding: CodingQuestion[];
}

export const Assessment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const domain = searchParams.get('domain') || '';

  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [assessment, setAssessment] = useState<AssessmentData | null>(null);

  // User Answers
  const [mcqAnswers, setMcqAnswers] = useState<Record<number, number>>({});
  const [codingAnswers, setCodingAnswers] = useState<Record<number, string>>({});
  const [isEvaluating, setIsEvaluating] = useState<Record<number, boolean>>({});
  const [compilerOutputs, setCompilerOutputs] = useState<Record<number, {isCorrect: boolean, output: string, feedback: string}>>({});

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!domain) {
      navigate('/roadmap');
      return;
    }
    fetchAssessment();
  }, [domain]);

  const fetchAssessment = async () => {
    try {
      const response = await api.get(`/api/assessment/generate?domain=${encodeURIComponent(domain)}`);
      setAssessment(response.data.data);
    } catch (error) {
      toast.error('Failed to generate skill assessment.');
      navigate('/roadmap');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMcqChange = (qIndex: number, optionIndex: number) => {
    setMcqAnswers((prev) => ({ ...prev, [qIndex]: optionIndex }));
  };

  const handleCodingChange = (qIndex: number, text: string) => {
    setCodingAnswers((prev) => ({ ...prev, [qIndex]: text }));
  };

  const handleEvaluateCode = async (qIndex: number) => {
    if (!codingAnswers[qIndex]?.trim()) {
      toast.error('Please write some code first!');
      return;
    }
    
    setIsEvaluating(prev => ({ ...prev, [qIndex]: true }));
    try {
      const q = assessment?.coding[qIndex];
      const res = await api.post('/api/assessment/evaluate-code', {
        taskTitle: q?.title,
        taskDescription: q?.description,
        codeSnippet: codingAnswers[qIndex]
      });
      
      const evalData = res.data.data;
      setCompilerOutputs(prev => ({ 
        ...prev, 
        [qIndex]: {
          isCorrect: evalData.correct !== undefined ? evalData.correct : evalData.isCorrect,
          output: evalData.compilerOutput,
          feedback: evalData.feedback
        }
      }));
      toast.success('Code evaluated!');
    } catch (err) {
      toast.error('Failed to run code.');
    } finally {
      setIsEvaluating(prev => ({ ...prev, [qIndex]: false }));
    }
  };

  const handleSubmitTest = async () => {
    if (!assessment) return;

    // Check if all MCQs answered
    if (Object.keys(mcqAnswers).length < assessment.mcqs.length) {
      toast.error('Please answer all multiple-choice questions.');
      return;
    }

    // Check if all coding answered
    if (Object.keys(codingAnswers).length < assessment.coding.length) {
      toast.error('Please attempt all coding questions.');
      return;
    }

    // Evaluate MCQs
    let correct = 0;
    assessment.mcqs.forEach((q, index) => {
      if (mcqAnswers[index] === q.correctOptionIndex) {
        correct++;
      }
    });
    setScore(correct);
    setIsSubmitted(true);

    // Build assessment feedback context
    const assessmentContext = `
      The user just took a skill assessment test for the role: ${domain}.
      They scored ${correct} out of ${assessment.mcqs.length} on the multiple-choice section.
      
      Coding Challenge 1 (${assessment.coding[0].title}) User's solution:
      ${codingAnswers[0]}
      
      Coding Challenge 2 (${assessment.coding[1].title}) User's solution:
      ${codingAnswers[1]}
      
      Please evaluate these coding solutions implicitly and adjust the learning roadmap accordingly.
      If their MCQ score is low or their coding solutions are poor/incorrect, add foundational milestones.
      If they aced it, make the roadmap advanced.
    `;

    // Trigger roadmap generation
    setIsGeneratingRoadmap(true);
    try {
      await api.post('/api/roadmaps/generate', { 
        targetRole: domain,
        assessmentContext: assessmentContext
      });
      toast.success('Roadmap generated based on your assessment!');
      // Navigate back to roadmap with prefilled role to load it
      navigate(`/roadmap?domain=${encodeURIComponent(domain)}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to generate personalized roadmap');
      setIsGeneratingRoadmap(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="relative">
          <div className="absolute inset-0 bg-cyan-400 blur-xl opacity-30 rounded-full animate-pulse"></div>
          <BrainCircuit className="w-16 h-16 text-cyan-600 animate-bounce relative z-10" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800">Generating Assessment...</h2>
          <p className="text-slate-500 mt-2 max-w-md">Oracle is analyzing the {domain} domain to create a targeted 10-question test and 2 technical coding challenges.</p>
        </div>
      </div>
    );
  }

  if (isGeneratingRoadmap) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <Loader2 className="w-16 h-16 text-cyan-600 animate-spin" />
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800">Evaluating & Generating Roadmap</h2>
          <p className="text-slate-500 mt-2 max-w-md">Oracle is scoring your test and building a personalized curriculum based on your exact weaknesses.</p>
        </div>
      </div>
    );
  }

  if (!assessment) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12 relative z-10">
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm backdrop-blur-sm">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
          <BrainCircuit className="h-8 w-8 text-cyan-600" />
          Skill Assessment: {domain}
        </h1>
        <p className="text-slate-500 mt-2">
          Complete this diagnostic test. Your results will directly shape the difficulty and focus areas of your generated roadmap.
        </p>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <span className="bg-slate-100 text-slate-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">A</span>
          Multiple Choice Section (10 Questions)
        </h2>
        
        {assessment.mcqs.map((q, index) => (
          <Card key={index} className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg leading-relaxed">
                  <span className="text-cyan-600 mr-2">{index + 1}.</span> 
                  {q.question}
                </CardTitle>
                <span className={`text-xs px-2 py-1 rounded-full font-semibold uppercase ${q.difficulty === 'hard' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                  {q.difficulty}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <RadioGroup 
                value={mcqAnswers[index]?.toString() || ""} 
                onValueChange={(val) => handleMcqChange(index, parseInt(val))}
                className="space-y-3"
              >
                {q.options.map((option, optIdx) => (
                  <div 
                    key={optIdx} 
                    onClick={() => handleMcqChange(index, optIdx)}
                    className={`flex items-center space-x-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                      mcqAnswers[index] === optIdx 
                        ? 'bg-cyan-50 border-cyan-400 shadow-sm' 
                        : 'bg-slate-50 border-slate-100 hover:border-cyan-200 hover:bg-cyan-50/30'
                    }`}
                  >
                    <RadioGroupItem 
                      value={optIdx.toString()} 
                      id={`q${index}-opt${optIdx}`} 
                      checked={mcqAnswers[index] === optIdx}
                      className={mcqAnswers[index] === optIdx ? "bg-cyan-500 border-cyan-500 text-white data-checked:bg-cyan-500 data-[state=checked]:bg-cyan-500" : ""}
                    />
                    <Label htmlFor={`q${index}-opt${optIdx}`} className={`flex-1 cursor-pointer font-medium ${mcqAnswers[index] === optIdx ? 'text-cyan-900' : 'text-slate-700'}`}>
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        ))}

        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 pt-6 border-t">
          <span className="bg-slate-100 text-slate-600 w-8 h-8 rounded-full flex items-center justify-center text-sm">B</span>
          Technical Challenges (2 Questions)
        </h2>

        {assessment.coding.map((q, index) => (
          <Card key={index} className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg text-slate-800">{q.title}</CardTitle>
              <CardDescription className="text-slate-600">{q.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea 
                placeholder="Write your code or technical explanation here..."
                className="min-h-[200px] font-mono bg-slate-900 text-slate-100 p-4 rounded-xl border-slate-800 focus-visible:ring-cyan-500"
                value={codingAnswers[index] || ''}
                onChange={(e) => handleCodingChange(index, e.target.value)}
              />
              
              <div className="flex justify-between items-center">
                <Button 
                  onClick={() => handleEvaluateCode(index)} 
                  disabled={isEvaluating[index] || !codingAnswers[index]}
                  variant="outline" 
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700"
                >
                  {isEvaluating[index] ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : "Run Code (Virtual Compiler)"}
                </Button>
              </div>

              {compilerOutputs[index] && (
                <div className={`p-4 rounded-xl font-mono text-sm shadow-inner ${compilerOutputs[index].isCorrect ? 'bg-green-950/30 border border-green-900' : 'bg-red-950/30 border border-red-900'}`}>
                  <div className="flex items-center gap-2 mb-2 font-bold">
                    {compilerOutputs[index].isCorrect ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <AlertTriangle className="w-4 h-4 text-red-500" />}
                    <span className={compilerOutputs[index].isCorrect ? "text-green-400" : "text-red-400"}>
                      {compilerOutputs[index].isCorrect ? "Build Successful" : "Build Failed"}
                    </span>
                  </div>
                  <pre className="whitespace-pre-wrap text-slate-300 mt-2 p-3 bg-black/40 rounded-lg text-xs leading-relaxed">
                    {compilerOutputs[index].output}
                  </pre>
                  <div className="mt-3 text-cyan-200 italic">
                    <span className="font-semibold text-cyan-400 mr-2">Oracle Feedback:</span>
                    {compilerOutputs[index].feedback}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}

        <div className="flex justify-end pt-6">
          <Button 
            onClick={handleSubmitTest} 
            className="h-14 px-8 bg-gradient-to-r from-cyan-600 to-teal-500 hover:from-cyan-500 hover:to-teal-400 text-white rounded-xl text-lg font-bold shadow-[0_0_20px_-5px_rgba(6,182,212,0.5)] transition-all"
          >
            Submit & Generate Roadmap
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Assessment;
